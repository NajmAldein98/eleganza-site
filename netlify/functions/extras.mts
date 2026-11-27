// خادم إضافات إليجانزا — Netlify Functions + Netlify Blobs
// المسارات: /api/elg/<action>
// يستخدم نفس OWNER_CODE ونفس مفتاح التوقيع حق بطاقة الولاء، فدخول المالك واحد للاثنين.
import type { Config, Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { createHmac, randomBytes, timingSafeEqual, scryptSync } from "node:crypto";

const ALLOWED_ORIGINS = ["https://eleganza-tailor.com", "https://www.eleganza-tailor.com", "https://eleganza-tailor.netlify.app"];
const STAGES = 6; // تم الاستلام، تجهيز القماش، الخياطة، الفحص، الكي والتغليف، جاهز
const MAX_FAILS = 6, LOCK_MS = 15 * 60 * 1000;

const db = () => getStore({ name: "eleganza-extras", consistency: "strong" });
const loyaltyStore = () => getStore({ name: "eleganza-loyalty", consistency: "strong" });
let SECRET = "";
async function loadSecret() {
  if (SECRET) return;
  const env = Netlify.env.get("TOKEN_SECRET");
  if (env) { SECRET = env; return; }
  const s = loyaltyStore();
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
const err = (req: Request, msg: string, status = 400) => json(req, { error: msg }, status);

function sign(payload: object) {
  const p = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return p + "." + createHmac("sha256", SECRET).update(p).digest("base64url");
}
function verify(token: unknown): any {
  if (typeof token !== "string" || !token.includes(".")) return null;
  const [p, s] = token.split(".");
  const good = createHmac("sha256", SECRET).update(p).digest("base64url");
  if (!s || s.length !== good.length || !timingSafeEqual(Buffer.from(s), Buffer.from(good))) return null;
  try { const d = JSON.parse(Buffer.from(p, "base64url").toString()); return d.exp && Date.now() > d.exp ? null : d; } catch { return null; }
}
const ownerOk = (t: unknown) => { const d = verify(t); return d && d.role === "owner"; };
const normPhone = (p: unknown) => {
  let d = String(p || "").replace(/[^\d]/g, "");
  if (d.startsWith("00966")) d = "0" + d.slice(5); else if (d.startsWith("966")) d = "0" + d.slice(3);
  if (d.startsWith("5")) d = "0" + d;
  return /^05\d{8}$/.test(d) ? d : null;
};
const hkey = (p: string) => createHmac("sha256", SECRET).update(p).digest("hex").slice(0, 32);
const str = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);
const rid = (n: number) => { const A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; const b = randomBytes(n); let s = ""; for (const x of b) s += A[x % A.length]; return s; };

type Order = { id: string; cert: string; file?: string; name: string; phone: string; item: string; fabric: string; tailor: string; stage: number;
  due: string; note: string; created: number; updated: number; done?: number; history: { t: number; stage: number }[]; fails?: number; lockUntil?: number };

type CFile = { file: string; name: string; phone: string; salt?: string; pin?: string; fails?: number; lockUntil?: number; created: number };
const pinHash = (pin: string, salt: string) => scryptSync(pin, salt, 32).toString("hex");
// ملف العميل: رقم ثابت لكل جوال، يتولّد أول مرة يتسجّل له طلب
async function ensureFile(phone: string, name: string): Promise<string> {
  const s = db(); const ik = "filephone/" + hkey(phone);
  const have = await s.get(ik); if (have) return have as string;
  let n = 10001 + (await s.list({ prefix: "file/" })).blobs.length;
  for (let i = 0; i < 30; i++, n++) {
    const rec: CFile = { file: String(n), name, phone, created: Date.now() };
    if ((await s.setJSON("file/" + n, rec, { onlyIfNew: true })).modified) {
      if ((await s.set(ik, String(n), { onlyIfNew: true })).modified) return String(n);
      await s.delete("file/" + n); return (await s.get(ik)) as string;
    }
  }
  throw new Error("file");
}
async function listJSON<T>(prefix: string): Promise<T[]> {
  const s = db(); const { blobs } = await s.list({ prefix });
  const all = await Promise.all(blobs.map((b) => s.get(b.key, { type: "json" })));
  return all.filter(Boolean) as T[];
}
async function update<T>(key: string, fn: (x: T) => string | void): Promise<T | string> {
  const s = db();
  for (let i = 0; i < 5; i++) {
    const r = await s.getWithMetadata(key, { type: "json" });
    if (!r) return "غير موجود";
    const x = r.data as T; const e = fn(x); if (typeof e === "string") return e;
    if ((await s.setJSON(key, x, { onlyIfMatch: r.etag })).modified) return x;
  }
  return "حاول مرة ثانية";
}
const certView = (o: Order) => ({ item: o.item, fabric: o.fabric, tailor: o.tailor, date: o.done || o.updated, ready: o.stage >= STAGES - 1, id: o.id });
async function seatsInfo() {
  const s = db();
  const cfg: any = (await s.get("config/seats", { type: "json" })) || { open: false, title: "", total: 0, deadline: "", season: "s0" };
  const { blobs } = await s.list({ prefix: "slot/" + cfg.season + "/" });
  return { cfg, booked: blobs.length, left: Math.max(0, (cfg.total || 0) - blobs.length) };
}

export default async (req: Request, context: Context) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(req) });
  if (!/^(\d{4}|\d{7})$/.test(Netlify.env.get("OWNER_CODE") || "")) return err(req, "الخادم غير مُعد بعد", 500);
  await loadSecret();
  const action = context.params.action;
  const body: any = req.method === "POST" ? await req.json().catch(() => ({})) : {};
  const s = db();

  /* ===== للعموم ===== */
  if (action === "seats") {
    const { cfg, left, booked } = await seatsInfo();
    return json(req, { open: !!cfg.open && (!cfg.deadline || Date.parse(cfg.deadline + "T23:59:59+03:00") > Date.now()), title: cfg.title, total: cfg.total, left, booked, deadline: cfg.deadline });
  }
  if (action === "book") {
    let phone = normPhone(body.phone); let name = str(body.name, 40);
    const cd = verify(body.token);
    if (cd && cd.role === "cust") { const f = (await s.get("file/" + cd.file, { type: "json" })) as CFile | null; if (f) { phone = f.phone; name = f.name; } }
    if (name.length < 2) return err(req, "اكتب اسمك");
    if (!phone) return err(req, "رقم الجوال غير صحيح (مثال: 05xxxxxxxx)");
    const { cfg, booked } = await seatsInfo();
    if (!cfg.open) return err(req, "الحجز مقفل حالياً");
    const dupe = await s.get("bookphone/" + cfg.season + "/" + hkey(phone));
    if (dupe) return err(req, "هذا الرقم حاجز مقعد من قبل");
    let n = booked + 1;
    while (n <= cfg.total) {
      if ((await s.set("slot/" + cfg.season + "/" + String(n).padStart(5, "0"), "1", { onlyIfNew: true })).modified) break;
      n++;
    }
    if (n > cfg.total) return err(req, "خلصت المقاعد، تواصل معنا واتساب");
    await s.set("bookphone/" + cfg.season + "/" + hkey(phone), String(n));
    await s.setJSON("booking/" + cfg.season + "/" + String(n).padStart(5, "0"), { n, name, phone, pieces: Math.max(1, Math.min(20, parseInt(body.pieces) || 1)), t: Date.now() });
    return json(req, { ok: true, n, left: cfg.total - n });
  }
  if (action === "prefs") {
    const phone = normPhone(body.phone);
    if (!phone) return err(req, "رقم الجوال غير صحيح (مثال: 05xxxxxxxx)");
    const a = body.answers || {};
    const clean: Record<string, string[]> = {};
    for (const k of ["weight", "style", "colors", "occasions", "news", "fit"]) {
      const v = Array.isArray(a[k]) ? a[k] : a[k] ? [a[k]] : [];
      clean[k] = v.slice(0, 6).map((x: unknown) => str(x, 40)).filter(Boolean);
    }
    const rec = { name: str(body.name, 40), phone, answers: clean, t: Date.now() };
    await s.setJSON("pref/" + hkey(phone), rec);
    return json(req, { ok: true });
  }
  if (action === "track") {
    const id = str(body.id, 10).replace(/\D/g, ""); const last4 = str(body.last4, 4);
    if (!id || !/^\d{4}$/.test(last4)) return err(req, "اكتب رقم الطلب وآخر ٤ أرقام من جوالك");
    const o = (await s.get("order/" + id, { type: "json" })) as Order | null;
    if (!o) return err(req, "ما لقينا طلب بهذا الرقم", 404);
    if ((o.lockUntil || 0) > Date.now()) return err(req, "محاولات كثيرة، جرّب بعد ربع ساعة", 429);
    if (o.phone.slice(-4) !== last4) {
      await update<Order>("order/" + id, (x) => { x.fails = (x.fails || 0) + 1; if (x.fails >= MAX_FAILS) { x.fails = 0; x.lockUntil = Date.now() + LOCK_MS; } });
      return err(req, "الرقم ما يطابق الطلب", 401);
    }
    return json(req, { id: o.id, item: o.item, stage: o.stage, due: o.due, tailor: o.tailor, history: o.history.slice(-10), cert: o.stage >= STAGES - 1 ? o.cert : null });
  }
  if (action === "cert") {
    const c = str(body.c, 16).toUpperCase();
    if (!/^[A-Z0-9]{6,16}$/.test(c)) return err(req, "رمز غير صحيح");
    const id = await s.get("cert/" + c);
    const o = id ? ((await s.get("order/" + id, { type: "json" })) as Order | null) : null;
    return o ? json(req, certView(o)) : err(req, "ما لقينا هذا الثوب", 404);
  }
  if (action === "gift") {
    const from = str(body.from, 40), to = str(body.to, 40), phone = normPhone(body.phone);
    if (from.length < 2 || to.length < 2) return err(req, "اكتب اسمك واسم المُهدى إليه");
    if (!phone) return err(req, "رقم جوالك غير صحيح (مثال: 05xxxxxxxx)");
    const code = rid(8);
    const g = { code, from, to, phone, occasion: str(body.occasion, 30), msg: str(body.msg, 240), count: Math.max(1, Math.min(10, parseInt(body.count) || 1)), status: "new", t: Date.now() };
    await s.setJSON("gift/" + code, g);
    return json(req, { code });
  }
  if (action === "gift-view") {
    const c = str(body.code, 12).toUpperCase();
    const g: any = /^[A-Z0-9]{8}$/.test(c) ? await s.get("gift/" + c, { type: "json" }) : null;
    return g ? json(req, { code: g.code, from: g.from, to: g.to, occasion: g.occasion, msg: g.msg, count: g.count, status: g.status }) : err(req, "ما لقينا هذي الهدية", 404);
  }
  /* ===== تطبيق العميل: الدخول برقم الملف وآخر ٤ أرقام من الجوال ===== */
  if (action === "app-login") {
    const file = str(body.file, 8).replace(/\D/g, ""); const pass = str(body.pass, 8).replace(/\D/g, "");
    if (!file || !pass) return err(req, "اكتب رقم الملف وكلمة المرور");
    const f = (await s.get("file/" + file, { type: "json" })) as CFile | null;
    if (!f) return err(req, "رقم الملف غير صحيح أو كلمة المرور غلط", 401);
    if ((f.lockUntil || 0) > Date.now()) return err(req, "محاولات كثيرة، جرّب بعد ربع ساعة", 429);
    const ok = f.pin && f.salt ? pinHash(pass, f.salt) === f.pin : pass === f.phone.slice(-4);
    if (!ok) {
      await update<CFile>("file/" + file, (x) => { x.fails = (x.fails || 0) + 1; if (x.fails >= MAX_FAILS) { x.fails = 0; x.lockUntil = Date.now() + LOCK_MS; } });
      return err(req, "رقم الملف غير صحيح أو كلمة المرور غلط", 401);
    }
    if (f.fails) await update<CFile>("file/" + file, (x) => { x.fails = 0; });
    return json(req, { token: sign({ role: "cust", file, exp: Date.now() + 180 * 24 * 3600 * 1000 }), name: f.name });
  }
  if (action === "app-me" || action === "app-pin") {
    const d = verify(body.token);
    if (!d || d.role !== "cust") return err(req, "سجّل دخولك من جديد", 401);
    const f = (await s.get("file/" + d.file, { type: "json" })) as CFile | null;
    if (!f) return err(req, "سجّل دخولك من جديد", 401);
    if (action === "app-pin") {
      const pin = str(body.pin, 8);
      if (!/^\d{4,6}$/.test(pin)) return err(req, "الرقم السري من ٤ إلى ٦ أرقام");
      const salt = randomBytes(12).toString("hex");
      await update<CFile>("file/" + d.file, (x) => { x.salt = salt; x.pin = pinHash(pin, salt); });
      return json(req, { ok: true });
    }
    const all = await listJSON<Order>("order/");
    const orders = all.filter((o) => o.phone === f.phone).sort((a, b) => b.created - a.created).map((o) => ({
      id: o.id, item: o.item, fabric: o.fabric, tailor: o.tailor, stage: o.stage, due: o.due, created: o.created, done: o.done || null,
      history: o.history.slice(-10), cert: o.stage >= STAGES - 1 ? o.cert : null }));
    let loyalty = null;
    try {
      const ls = loyaltyStore();
      const cid = await ls.get("phone/" + createHmac("sha256", SECRET).update(f.phone).digest("hex"));
      const c: any = cid ? await ls.get("card/" + cid, { type: "json" }) : null;
      if (c) loyalty = { stamps: (c.stamps || []).length, total: 10, discountAt: 5, discountPending: !!c.discountPending, freePending: c.freePending || 0 };
    } catch {}
    return json(req, { file: f.file, name: f.name, phone4: f.phone.slice(-4), hasPin: !!f.pin, orders, loyalty });
  }

  if (action === "owner-login") {
    const want = Netlify.env.get("OWNER_CODE") as string;
    const lock: any = (await s.get("owner-lock", { type: "json" })) || { fails: 0, until: 0 };
    if (lock.until > Date.now()) return err(req, "محاولات كثيرة، جرّب بعد ربع ساعة", 429);
    const code = String(body.code || "");
    if (code.length === want.length && timingSafeEqual(Buffer.from(code), Buffer.from(want))) {
      await s.setJSON("owner-lock", { fails: 0, until: 0 });
      return json(req, { role: "owner", token: sign({ role: "owner", exp: Date.now() + 30 * 24 * 3600 * 1000 }) });
    }
    // رمز الموظفين: يحدده المدير من صفحة الفريق، وينحفظ مشفّراً
    const sc: any = await s.get("config/staff-code", { type: "json" });
    if (sc && /^\d{4}$/.test(code) && pinHash(code, sc.salt) === sc.hash) {
      await s.setJSON("owner-lock", { fails: 0, until: 0 });
      return json(req, { role: "staff", token: sign({ role: "staff", exp: Date.now() + 30 * 24 * 3600 * 1000 }) });
    }
    lock.fails += 1; if (lock.fails >= MAX_FAILS) { lock.fails = 0; lock.until = Date.now() + LOCK_MS; }
    await s.setJSON("owner-lock", lock);
    return err(req, "الرمز غير صحيح", 401);
  }

  /* ===== للموظفين: عرض الطلبات وتغيير المرحلة فقط ===== */
  const td = verify(body.token);
  if (td && td.role === "staff") {
    if (action === "orders") {
      const list = await listJSON<Order>("order/");
      return json(req, { role: "staff", orders: list.sort((a, b) => b.created - a.created).map((o) => ({
        id: o.id, file: o.file, name: o.name, item: o.item, fabric: o.fabric, tailor: o.tailor, stage: o.stage, due: o.due, note: o.note, created: o.created })) });
    }
    if (action === "order-stage") {
      const stage = Math.max(0, Math.min(STAGES - 1, parseInt(body.stage)));
      if (isNaN(stage)) return err(req, "مرحلة غير صحيحة");
      const r = await update<Order>("order/" + str(body.id, 10), (x) => {
        if (x.stage !== stage) { x.stage = stage; x.history.push({ t: Date.now(), stage }); if (stage === STAGES - 1 && !x.done) x.done = Date.now(); x.updated = Date.now(); }
      });
      if (typeof r === "string") return err(req, r);
      return json(req, { order: { id: r.id, file: r.file, name: r.name, item: r.item, fabric: r.fabric, tailor: r.tailor, stage: r.stage, due: r.due, note: r.note, created: r.created } });
    }
    return err(req, "هذي الصلاحية للمدير فقط", 403);
  }

  /* ===== للمالك فقط ===== */
  if (!ownerOk(body.token)) return err(req, "للمالك فقط", 401);

  if (action === "staff-code-set") {
    const c = str(body.code, 8);
    if (!/^\d{4}$/.test(c)) return err(req, "رمز الموظفين لازم يكون ٤ أرقام");
    if (c === Netlify.env.get("OWNER_CODE")) return err(req, "اختر رمزاً غير رمز المدير");
    const salt = randomBytes(12).toString("hex");
    await s.setJSON("config/staff-code", { salt, hash: pinHash(c, salt), t: Date.now() });
    return json(req, { ok: true });
  }

  if (action === "orders") {
    const list = await listJSON<Order>("order/");
    for (const o of list) if (!o.file) { o.file = await ensureFile(o.phone, o.name); await update<Order>("order/" + o.id, (x) => { x.file = o.file; }); }
    return json(req, { orders: list.sort((a, b) => b.created - a.created).map(({ fails, lockUntil, ...o }) => o) });
  }
  if (action === "order-save") {
    const o = body.order || {};
    const phone = normPhone(o.phone);
    if (!phone) return err(req, "رقم جوال العميل غير صحيح");
    const fields = { name: str(o.name, 40), phone, item: str(o.item, 80), fabric: str(o.fabric, 60), tailor: str(o.tailor, 30), due: str(o.due, 10), note: str(o.note, 200) };
    if (!fields.name || !fields.item) return err(req, "اكتب اسم العميل ووصف الطلب");
    const stage = Math.max(0, Math.min(STAGES - 1, parseInt(o.stage) || 0));
    const file = await ensureFile(phone, fields.name);
    if (o.id) {
      const r = await update<Order>("order/" + str(o.id, 10), (x) => {
        Object.assign(x, fields); x.file = file;
        if (x.stage !== stage) { x.stage = stage; x.history.push({ t: Date.now(), stage }); if (stage === STAGES - 1 && !x.done) x.done = Date.now(); }
        x.updated = Date.now();
      });
      return typeof r === "string" ? err(req, r) : json(req, { order: r });
    }
    let n = 1001 + (await s.list({ prefix: "order/" })).blobs.length;
    let order: Order | null = null;
    for (let i = 0; i < 20 && !order; i++, n++) {
      const cand: Order = { id: String(n), cert: rid(10), file, ...fields, stage, created: Date.now(), updated: Date.now(), history: [{ t: Date.now(), stage }], ...(stage === STAGES - 1 ? { done: Date.now() } : {}) };
      if ((await s.setJSON("order/" + cand.id, cand, { onlyIfNew: true })).modified) order = cand;
    }
    if (!order) return err(req, "حاول مرة ثانية");
    await s.set("cert/" + order.cert, order.id);
    return json(req, { order });
  }
  if (action === "order-delete") {
    const id = str(body.id, 10);
    const o = (await s.get("order/" + id, { type: "json" })) as Order | null;
    if (!o) return err(req, "غير موجود", 404);
    await s.delete("cert/" + o.cert); await s.delete("order/" + id);
    return json(req, { ok: true });
  }
  if (action === "prefs-list") {
    const list = await listJSON<any>("pref/");
    return json(req, { prefs: list.sort((a, b) => b.t - a.t) });
  }
  if (action === "pref-delete") {
    const p = normPhone(body.phone); if (!p) return err(req, "رقم غير صحيح");
    await s.delete("pref/" + hkey(p)); return json(req, { ok: true });
  }
  if (action === "seats-set") {
    const { cfg } = await seatsInfo();
    const next = { open: !!body.open, title: str(body.title, 60), total: Math.max(0, Math.min(5000, parseInt(body.total) || 0)), deadline: str(body.deadline, 10),
      season: body.reset ? "s" + Date.now() : cfg.season };
    await s.setJSON("config/seats", next);
    return json(req, { ok: true, ...(await seatsInfo()) });
  }
  if (action === "bookings") {
    const { cfg, left, booked } = await seatsInfo();
    const list = await listJSON<any>("booking/" + cfg.season + "/");
    return json(req, { cfg, left, booked, bookings: list.sort((a, b) => a.n - b.n) });
  }
  if (action === "gifts") {
    const list = await listJSON<any>("gift/");
    return json(req, { gifts: list.sort((a, b) => b.t - a.t) });
  }
  if (action === "gift-status") {
    const st = ["new", "paid", "used", "cancelled"].includes(body.status) ? body.status : null;
    if (!st) return err(req, "حالة غير معروفة");
    const r = await update<any>("gift/" + str(body.code, 12), (g) => { g.status = st; });
    return typeof r === "string" ? err(req, r) : json(req, { gift: r });
  }
  return err(req, "طلب غير معروف", 404);
};

export const config: Config = { path: "/api/elg/:action", method: ["GET", "POST", "OPTIONS"] };
