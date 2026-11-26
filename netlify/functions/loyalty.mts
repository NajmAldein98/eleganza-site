// خادم بطاقة ولاء إليجانزا — Netlify Functions + Netlify Blobs
// المسارات: /api/loyalty/<action>
// المتغير المطلوب في Netlify: OWNER_CODE (رمز المالك ٧ أرقام)
import type { Config, Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const TOTAL = 10;          // عدد الأختام في البطاقة
const DISCOUNT_AT = 5;     // الختم الخامس = خصم على السادس
const MAX_FAILS = 5;       // محاولات خاطئة قبل القفل
const LOCK_MS = 15 * 60 * 1000;
const DOUBLE_SCAN_MS = 30 * 1000;
const ALLOWED_ORIGINS = ["https://eleganza-tailor.com", "https://www.eleganza-tailor.com", "https://eleganza-tailor.netlify.app"];

type Card = {
  id: string; label: string; anonymous: boolean; anonNum?: number; phone: string;
  salt: string; hash: string; fails: number; lockUntil: number;
  stamps: number[]; lastStamp?: number; cycle: number; discountPending: boolean; freePending: number;
  history: { t: number; what: string }[]; created: number;
};

const store = () => getStore({ name: "eleganza-loyalty", consistency: "strong" });
let SECRET = "";
const secret = () => SECRET;
// مفتاح التوقيع: يتولّد مرة وحدة ويُحفظ في التخزين الخاص (أو من متغير TOKEN_SECRET إن وُجد)
async function loadSecret() {
  if (SECRET) return;
  const env = Netlify.env.get("TOKEN_SECRET");
  if (env) { SECRET = env; return; }
  const s = store();
  await s.set("config/token-secret", randomBytes(48).toString("base64url"), { onlyIfNew: true });
  SECRET = (await s.get("config/token-secret")) as string;
}

function cors(req: Request) {
  const o = req.headers.get("origin") || "";
  const h: Record<string, string> = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "vary": "Origin" };
  if (ALLOWED_ORIGINS.includes(o)) { h["access-control-allow-origin"] = o; h["access-control-allow-headers"] = "content-type"; h["access-control-allow-methods"] = "GET,POST,OPTIONS"; }
  return h;
}
const json = (req: Request, body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: cors(req) });
const err = (req: Request, msg: string, status = 400, extra: object = {}) => json(req, { error: msg, ...extra }, status);

function sign(payload: object) {
  const p = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return p + "." + createHmac("sha256", secret()).update(p).digest("base64url");
}
function verify(token: unknown): any {
  if (typeof token !== "string" || !token.includes(".")) return null;
  const [p, s] = token.split(".");
  const good = createHmac("sha256", secret()).update(p).digest("base64url");
  if (s.length !== good.length || !timingSafeEqual(Buffer.from(s), Buffer.from(good))) return null;
  const data = JSON.parse(Buffer.from(p, "base64url").toString());
  if (data.exp && Date.now() > data.exp) return null;
  return data;
}
const hashCode = (code: string, salt: string) => scryptSync(code, salt, 32).toString("hex");
const validCode = (c: unknown) => typeof c === "string" && /^\d{7}$/.test(c);
const normPhone = (p: unknown) => {
  let d = String(p || "").replace(/[^\d]/g, "");
  if (d.startsWith("00966")) d = "0" + d.slice(5); else if (d.startsWith("966")) d = "0" + d.slice(3);
  if (d.startsWith("5")) d = "0" + d;
  return /^05\d{8}$/.test(d) ? d : null;
};
const phoneKey = (p: string) => "phone/" + createHmac("sha256", secret()).update(p).digest("hex");

// ما يراه صاحب البطاقة أو المالك
function full(c: Card) {
  return { id: c.id, label: c.label, phone: c.phone, stamps: c.stamps.length, total: TOTAL, discountAt: DISCOUNT_AT,
    cycle: c.cycle, discountPending: c.discountPending, freePending: c.freePending, history: c.history.slice(-30).reverse(), created: c.created };
}

async function getCard(id: unknown): Promise<{ card: Card; etag: string } | null> {
  if (typeof id !== "string" || !/^[A-Z0-9]{6,12}$/.test(id)) return null;
  const r = await store().getWithMetadata("card/" + id, { type: "json" });
  return r === null ? null : { card: r.data as Card, etag: r.etag as string };
}
async function putCard(c: Card, etag?: string) {
  const r = await store().setJSON("card/" + c.id, c, etag ? { onlyIfMatch: etag } : { onlyIfNew: true });
  return r.modified;
}
function ownerOk(token: unknown) { const d = verify(token); return d && d.role === "owner"; }

async function updateCard(id: string, fn: (c: Card) => string | void): Promise<Card | string> {
  for (let i = 0; i < 5; i++) {
    const got = await getCard(id);
    if (!got) return "البطاقة غير موجودة";
    const e = fn(got.card);
    if (typeof e === "string") return e;
    if (await putCard(got.card, got.etag)) return got.card;
  }
  return "حاول مرة ثانية";
}

function applyStamp(c: Card, force: boolean): string | void {
  const last = c.lastStamp || 0;
  if (!force && Date.now() - last < DOUBLE_SCAN_MS) return "DOUBLE";
  c.stamps.push(Date.now()); c.lastStamp = Date.now();
  const n = c.stamps.length;
  c.history.push({ t: Date.now(), what: `ختم رقم ${n}` });
  if (n === DISCOUNT_AT) { c.discountPending = true; c.history.push({ t: Date.now(), what: "استحق خصم ٥٠٪ على الثوب القادم" }); }
  if (n >= TOTAL) { // البطاقة امتلأت → تتجدد تلقائياً
    c.freePending += 1; c.cycle += 1; c.stamps = []; c.discountPending = false;
    c.history.push({ t: Date.now(), what: `اكتملت البطاقة — ثوب مجاني، وبدأت البطاقة رقم ${c.cycle + 1}` });
  }
}

export default async (req: Request, context: Context) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(req) });
  if (!/^\d{7}$/.test(Netlify.env.get("OWNER_CODE") || "")) return err(req, "الخادم غير مُعد بعد", 500);
  await loadSecret();
  const action = context.params.action;
  const body: any = req.method === "POST" ? await req.json().catch(() => ({})) : {};
  const s = store();

  // قائمة كل البطايق: الاسم الظاهر فقط
  if (action === "list") {
    const { blobs } = await s.list({ prefix: "card/" });
    const cards = await Promise.all(blobs.map((b) => s.get(b.key, { type: "json" })));
    const list = (cards.filter(Boolean) as Card[]).sort((a, b) => a.created - b.created).map((c) => ({ id: c.id, label: c.label }));
    return json(req, { cards: list });
  }

  if (action === "register") {
    const phone = normPhone(body.phone);
    if (!phone) return err(req, "رقم الجوال غير صحيح (مثال: 05xxxxxxxx)");
    if (!validCode(body.code)) return err(req, "الرمز لازم يكون ٧ أرقام");
    const anonymous = !!body.anonymous;
    const name = String(body.name || "").trim().slice(0, 40);
    if (!anonymous && name.length < 2) return err(req, "اكتب اسمك أو اختر «مجهول»");
    const id = randomBytes(6).toString("hex").toUpperCase().slice(0, 8);
    const claimed = await s.set(phoneKey(phone), id, { onlyIfNew: true });
    if (!claimed.modified) return err(req, "هذا الرقم مسجّل من قبل، افتح بطاقتك من القائمة برمزك");
    let label = name, anonNum: number | undefined;
    if (anonymous) { // رقم مجهول يزيد مع كل عميل مجهول جديد
      const { blobs } = await s.list({ prefix: "anon/" });
      let n = blobs.length + 1;
      while (!(await s.set("anon/" + String(n).padStart(6, "0"), id, { onlyIfNew: true })).modified) n++;
      anonNum = n; label = "مجهول " + n.toLocaleString("ar-SA");
    }
    const salt = randomBytes(16).toString("hex");
    const c: Card = { id, label, anonymous, anonNum, phone, salt, hash: hashCode(body.code, salt), fails: 0, lockUntil: 0,
      stamps: [], cycle: 0, discountPending: false, freePending: 0, history: [{ t: Date.now(), what: "إنشاء البطاقة" }], created: Date.now() };
    await putCard(c);
    return json(req, { token: sign({ role: "card", id }), card: full(c) });
  }

  if (action === "open") {
    const got = await getCard(body.id);
    if (!got) return err(req, "البطاقة غير موجودة", 404);
    const c = got.card;
    // رمز المالك يفتح أي بطاقة (بدون ربطها بجوال المالك كصاحب بطاقة)
    const want = Netlify.env.get("OWNER_CODE") as string;
    const code = String(body.code || "");
    if (code.length === want.length && timingSafeEqual(Buffer.from(code), Buffer.from(want))) {
      return json(req, { owner: true, ownerToken: sign({ role: "owner", exp: Date.now() + 30 * 24 * 3600 * 1000 }), card: full(c) });
    }
    if (c.lockUntil > Date.now()) return err(req, "محاولات كثيرة، جرّب بعد ربع ساعة", 429);
    if (validCode(body.code) && timingSafeEqual(Buffer.from(hashCode(body.code, c.salt)), Buffer.from(c.hash))) {
      if (c.fails) await updateCard(c.id, (x) => { x.fails = 0; });
      return json(req, { token: sign({ role: "card", id: c.id }), card: full(c) });
    }
    await updateCard(c.id, (x) => { x.fails += 1; if (x.fails >= MAX_FAILS) { x.fails = 0; x.lockUntil = Date.now() + LOCK_MS; } });
    return err(req, "الرمز غير صحيح", 401);
  }

  if (action === "me") {
    const d = verify(body.token);
    if (!d || d.role !== "card") return err(req, "انتهت الجلسة", 401);
    const got = await getCard(d.id);
    return got ? json(req, { card: full(got.card) }) : err(req, "البطاقة غير موجودة", 404);
  }

  if (action === "owner-login") {
    const want = Netlify.env.get("OWNER_CODE") as string;
    const lockKey = "owner-lock";
    const lock: any = (await s.get(lockKey, { type: "json" })) || { fails: 0, until: 0 };
    if (lock.until > Date.now()) return err(req, "محاولات كثيرة، جرّب بعد ربع ساعة", 429);
    const code = String(body.code || "");
    if (code.length === want.length && timingSafeEqual(Buffer.from(code), Buffer.from(want))) {
      await s.setJSON(lockKey, { fails: 0, until: 0 });
      return json(req, { token: sign({ role: "owner", exp: Date.now() + 30 * 24 * 3600 * 1000 }) });
    }
    lock.fails += 1; if (lock.fails >= MAX_FAILS) { lock.fails = 0; lock.until = Date.now() + LOCK_MS; }
    await s.setJSON(lockKey, lock);
    return err(req, "الرمز غير صحيح", 401);
  }

  // كل ما تحت للمالك فقط
  if (!ownerOk(body.token)) return err(req, "للمالك فقط", 401);

  if (action === "owner-cards") {
    const { blobs } = await s.list({ prefix: "card/" });
    const cards = await Promise.all(blobs.map((b) => s.get(b.key, { type: "json" })));
    return json(req, { cards: (cards.filter(Boolean) as Card[]).sort((a, b) => b.created - a.created).map(full) });
  }
  if (action === "owner-card") {
    const got = await getCard(body.id);
    return got ? json(req, { card: full(got.card) }) : err(req, "البطاقة غير موجودة", 404);
  }
  if (action === "stamp") {
    const r = await updateCard(String(body.id), (c) => applyStamp(c, !!body.force));
    if (r === "DOUBLE") return err(req, "انختمت هذي البطاقة قبل لحظات", 409, { double: true });
    return typeof r === "string" ? err(req, r) : json(req, { card: full(r) });
  }
  if (action === "undo") {
    const r = await updateCard(String(body.id), (c) => {
      if (!c.stamps.length) return "ما فيه ختم في البطاقة الحالية للتراجع عنه";
      c.stamps.pop(); c.lastStamp = 0; if (c.stamps.length < DISCOUNT_AT) c.discountPending = false;
      c.history.push({ t: Date.now(), what: "تراجع عن آخر ختم" });
    });
    return typeof r === "string" ? err(req, r) : json(req, { card: full(r) });
  }
  if (action === "redeem") {
    const r = await updateCard(String(body.id), (c) => {
      if (body.kind === "discount") { if (!c.discountPending) return "ما عنده خصم مستحق"; c.discountPending = false; c.history.push({ t: Date.now(), what: "استخدم خصم ٥٠٪" }); }
      else if (body.kind === "free") { if (c.freePending < 1) return "ما عنده ثوب مجاني مستحق"; c.freePending -= 1; c.history.push({ t: Date.now(), what: "استلم الثوب المجاني" }); }
      else return "نوع غير معروف";
    });
    return typeof r === "string" ? err(req, r) : json(req, { card: full(r) });
  }
  if (action === "delete") { // حذف البطاقة نهائياً (رقم المجهول ما يتكرر لأحد بعده)
    const got = await getCard(body.id);
    if (!got) return err(req, "البطاقة غير موجودة", 404);
    await s.delete(phoneKey(got.card.phone));
    await s.delete("card/" + got.card.id);
    return json(req, { ok: true });
  }
  if (action === "reset-code") { // العميل نسي رمزه: المالك يحدد له رمز جديد
    if (!validCode(body.code)) return err(req, "الرمز لازم يكون ٧ أرقام");
    const r = await updateCard(String(body.id), (c) => { c.salt = randomBytes(16).toString("hex"); c.hash = hashCode(body.code, c.salt); c.fails = 0; c.lockUntil = 0; c.history.push({ t: Date.now(), what: "تغيير رمز البطاقة" }); });
    return typeof r === "string" ? err(req, r) : json(req, { ok: true });
  }
  return err(req, "طلب غير معروف", 404);
};

export const config: Config = { path: "/api/loyalty/:action", method: ["GET", "POST", "OPTIONS"] };
