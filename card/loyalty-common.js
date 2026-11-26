// مشترك بين صفحة العميل وصفحة المالك
const API = /netlify\.app$|^localhost|^127\./.test(location.hostname)
  ? '/api/loyalty/'
  : 'https://eleganza-tailor.netlify.app/api/loyalty/';

const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const digits = s => String(s || '').replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[^\d]/g, '');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtDate = t => new Date(t).toLocaleDateString('ar-SA-u-ca-gregory', { year: 'numeric', month: 'short', day: 'numeric' });
const CROWN = '<svg width="28" height="20" viewBox="0 0 34 24" aria-hidden="true"><path d="M3 20 L1 6 L10 13 L17 2 L24 13 L33 6 L31 20 Z" fill="#F2C200"/></svg>';

async function api(action, body) {
  const opt = body ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : {};
  let r;
  try { r = await fetch(API + action, opt); } catch (e) { throw new Error('تعذر الاتصال، تأكد من الإنترنت'); }
  const data = await r.json().catch(() => ({}));
  if (!r.ok) { const e = new Error(data.error || 'صار خطأ، حاول مرة ثانية'); e.data = data; e.status = r.status; throw e; }
  return data;
}
function busy(id, on) { const b = document.getElementById(id); if (b) { b.disabled = on; b.style.opacity = on ? .6 : 1; } }

function renderStamps(grid, c, popLast) {
  grid.innerHTML = '';
  for (let i = 0; i < c.total; i++) {
    const d = document.createElement('div');
    const done = i < c.stamps, special = i === c.discountAt - 1 || i === c.total - 1;
    d.className = 'slot' + (done ? ' done' : special ? ' special' : '') + (popLast && i === c.stamps - 1 ? ' pop' : '');
    d.innerHTML = done ? CROWN : (i === c.discountAt - 1 ? '٥٠٪' : i === c.total - 1 ? 'مجاناً' : AR(i + 1));
    d.setAttribute('aria-label', 'خانة ' + AR(i + 1) + (done ? ' مختومة' : ''));
    grid.appendChild(d);
  }
}
function renderBanners(box, c) {
  let h = '';
  if (c.freePending > 0) h += '<div class="banner b-free">مبروك! لك ' + (c.freePending > 1 ? AR(c.freePending) + ' أثواب مجانية' : 'ثوب مجاني') + ' هدية من إليجانزا</div>';
  if (c.discountPending) h += '<div class="banner b-disc">مبروك! لك خصم ٥٠٪ على ثوبك القادم</div>';
  if (c.cycle > 0) h += '<div class="hint">هذي بطاقتك رقم ' + AR(c.cycle + 1) + '</div>';
  box.innerHTML = h;
}
