// مشترك بين صفحة العميل وصفحة المالك
const API = /netlify\.app$|^localhost|^127\./.test(location.hostname)
  ? '/api/loyalty/'
  : 'https://eleganza-tailor.netlify.app/api/loyalty/';

// ===== اللغة (نفس مفتاح الموقع الرئيسي) =====
let LANG = 'ar';
try { LANG = localStorage.getItem('elg_lang') === 'en' ? 'en' : 'ar'; } catch (e) {}

const I18N = {
  ar: {
    title: 'بطاقة ولاء إليجانزا', ownerTitle: 'إليجانزا — لوحة المالك', sub: 'بطاقة الولاء · للخياطة', ownerSub: 'لوحة المالك · الأختام', langBtn: 'English',
    newCard: 'سوّ بطاقتك الجديدة',
    rules: 'كل ثوب تفصّله = ختم. <b>الختم الخامس</b>: خصم ٥٠٪ على ثوبك السادس. <b>الختم العاشر</b>: ثوبك الحادي عشر مجاناً، والبطاقة تتجدد من نفسها.',
    cards: 'البطايق', search: 'ابحث عن اسمك', loading: 'جاري التحميل…', noCards: 'ما فيه بطايق بعد',
    newH: 'بطاقة جديدة', visQ: 'كيف يظهر اسمك في قائمة البطايق؟', visName: 'باسمي', visAnon: 'مجهول',
    name: 'الاسم', phone: 'رقم الجوال (ما يشوفه أحد غيرك)', code: 'اختر رمز سري من ٧ أرقام', code2: 'أعد كتابة الرمز',
    create: 'إنشاء بطاقتي', back: 'رجوع', cardCode: 'رمز البطاقة (٧ أرقام)', open: 'فتح البطاقة',
    holder: 'صاحب البطاقة', stamps: 'الأختام', qrHint: 'اعرض هذا الرمز للموظف عند استلام ثوبك عشان ينختم', qrAria: 'رمز البطاقة للموظف',
    refresh: 'تحديث', history: 'سجل البطاقة',
    install: 'احفظ البطاقة في جوالك:<br>آيفون: زر المشاركة ثم «إضافة إلى الشاشة الرئيسية»<br>أندرويد: القائمة ⋮ ثم «إضافة إلى الشاشة الرئيسية»',
    lock: 'قفل البطاقة في هذا الجوال',
    errCode7: 'الرمز لازم يكون ٧ أرقام', errMatch: 'الرمزين غير متطابقين',
    free1: 'مبروك! لك ثوب مجاني هدية من إليجانزا', freeN: n => 'مبروك! لك ' + n + ' أثواب مجانية هدية من إليجانزا',
    disc: 'مبروك! لك خصم ٥٠٪ على ثوبك القادم', cycle: n => 'هذي بطاقتك رقم ' + n,
    slotDisc: '٥٠٪', slotFree: 'مجاناً', slot: (n, done) => 'خانة ' + n + (done ? ' مختومة' : ''),
    // المالك
    ownerCode: 'رمز المالك', login: 'دخول', scan: 'صوّر بطاقة العميل وأضف ختم', stopCam: 'إيقاف الكاميرا',
    card: 'البطاقة', addStamp: 'إضافة ختم', undo: 'تراجع عن آخر ختم', useDisc: 'استخدم خصم ٥٠٪', giveFree: 'سلّم الثوب المجاني',
    forgot: 'نسي العميل رمزه؟', newCode: 'رمز جديد ٧ أرقام', save: 'حفظ', allCards: 'كل البطايق', searchOwner: 'ابحث بالاسم أو الجوال',
    noCardsOwner: 'ما فيه بطايق', logout: 'خروج', tagFree: ' · مجاني', tagDisc: ' · خصم',
    msgStamp: (n, t) => 'تمت إضافة ختم ✓  (' + n + ' من ' + t + ')', msgFull: 'اكتملت البطاقة! العميل يستحق ثوب مجاني، وتجددت بطاقته',
    msgUndo: 'تم التراجع عن آخر ختم', msgDisc: 'تم تسجيل استخدام الخصم', msgFree: 'تم تسليم الثوب المجاني', msgReset: 'تم تغيير رمز البطاقة، بلّغ العميل فيه',
    confirmDouble: 'هذي البطاقة انختمت قبل لحظات. تبي تضيف ختم ثاني؟',
    noCam: 'المتصفح ما يدعم الكاميرا، افتح الصفحة في Safari أو Chrome', camDenied: 'ما قدرت أفتح الكاميرا، اسمح للموقع باستخدامها من إعدادات المتصفح',
    notOurs: 'هذا الرمز مو بطاقة إليجانزا', ownerView: 'فتحت البطاقة برمز المالك', delCard: 'حذف البطاقة', confirmDel: l => 'متأكد تبي تحذف بطاقة «' + l + '» نهائياً؟ ما تقدر ترجعها.', msgDeleted: 'تم حذف البطاقة', ownerPanel: 'لوحة المالك', editSite: 'تعديل محتوى الموقع', netErr: 'تعذر الاتصال، تأكد من الإنترنت', genErr: 'صار خطأ، حاول مرة ثانية'
  },
  en: {
    title: 'Eleganza Loyalty Card', ownerTitle: 'Eleganza — Owner panel', sub: 'Loyalty card · Tailoring', ownerSub: 'Owner panel · Stamps', langBtn: 'العربية',
    newCard: 'Create your new card',
    rules: 'Every thobe you tailor = one stamp. <b>5th stamp</b>: 50% off your sixth thobe. <b>10th stamp</b>: your eleventh thobe is free, and the card renews itself.',
    cards: 'Cards', search: 'Search for your name', loading: 'Loading…', noCards: 'No cards yet',
    newH: 'New card', visQ: 'How should your name appear in the cards list?', visName: 'My name', visAnon: 'Anonymous',
    name: 'Name', phone: 'Mobile number (only you can see it)', code: 'Choose a 7-digit secret code', code2: 'Repeat the code',
    create: 'Create my card', back: 'Back', cardCode: 'Card code (7 digits)', open: 'Open card',
    holder: 'Card holder', stamps: 'Stamps', qrHint: 'Show this code to staff when you collect your thobe to get a stamp', qrAria: 'Card code for staff',
    refresh: 'Refresh', history: 'Card history',
    install: 'Save the card on your phone:<br>iPhone: Share button, then “Add to Home Screen”<br>Android: menu ⋮, then “Add to Home screen”',
    lock: 'Lock the card on this phone',
    errCode7: 'The code must be 7 digits', errMatch: 'The two codes don’t match',
    free1: 'Congratulations! You have a free thobe from Eleganza', freeN: n => 'Congratulations! You have ' + n + ' free thobes from Eleganza',
    disc: 'Congratulations! You get 50% off your next thobe', cycle: n => 'This is your card number ' + n,
    slotDisc: '50%', slotFree: 'FREE', slot: (n, done) => 'Slot ' + n + (done ? ' stamped' : ''),
    ownerCode: 'Owner code', login: 'Log in', scan: 'Scan the customer’s card and add a stamp', stopCam: 'Stop camera',
    card: 'Card', addStamp: 'Add stamp', undo: 'Undo last stamp', useDisc: 'Use 50% discount', giveFree: 'Hand over free thobe',
    forgot: 'Customer forgot their code?', newCode: 'New 7-digit code', save: 'Save', allCards: 'All cards', searchOwner: 'Search by name or mobile',
    noCardsOwner: 'No cards', logout: 'Log out', tagFree: ' · free', tagDisc: ' · discount',
    msgStamp: (n, t) => 'Stamp added ✓  (' + n + ' of ' + t + ')', msgFull: 'Card complete! The customer earned a free thobe, and the card has renewed',
    msgUndo: 'Last stamp undone', msgDisc: 'Discount marked as used', msgFree: 'Free thobe handed over', msgReset: 'Card code changed, let the customer know',
    confirmDouble: 'This card was stamped a moment ago. Add another stamp?',
    noCam: 'This browser doesn’t support the camera, open the page in Safari or Chrome', camDenied: 'Couldn’t open the camera, allow camera access in your browser settings',
    notOurs: 'This code isn’t an Eleganza card', ownerView: 'Opened with the owner code', delCard: 'Delete card', confirmDel: l => 'Delete the card “' + l + '” permanently? This can’t be undone.', msgDeleted: 'Card deleted', ownerPanel: 'Owner panel', editSite: 'Edit website content', netErr: 'Couldn’t connect, check your internet', genErr: 'Something went wrong, please try again'
  }
};
const tr = (k, ...a) => { const v = I18N[LANG][k] ?? I18N.ar[k] ?? ''; return typeof v === 'function' ? v(...a) : v; };

// ترجمة رسائل الخادم وسجل البطاقة للإنجليزي
const SERVER_EN = {
  'الخادم غير مُعد بعد': 'The server isn’t set up yet',
  'رقم الجوال غير صحيح (مثال: 05xxxxxxxx)': 'Invalid mobile number (e.g. 05xxxxxxxx)',
  'الرمز لازم يكون ٧ أرقام': 'The code must be 7 digits',
  'اكتب اسمك أو اختر «مجهول»': 'Enter your name or choose “Anonymous”',
  'هذا الرقم مسجّل من قبل، افتح بطاقتك من القائمة برمزك': 'This number is already registered, open your card from the list with your code',
  'البطاقة غير موجودة': 'Card not found',
  'محاولات كثيرة، جرّب بعد ربع ساعة': 'Too many attempts, try again in 15 minutes',
  'الرمز غير صحيح': 'Incorrect code',
  'انتهت الجلسة': 'Session expired',
  'للمالك فقط': 'Owner only',
  'انختمت هذي البطاقة قبل لحظات': 'This card was stamped a moment ago',
  'ما فيه ختم في البطاقة الحالية للتراجع عنه': 'No stamp on the current card to undo',
  'ما عنده خصم مستحق': 'No discount due',
  'ما عنده ثوب مجاني مستحق': 'No free thobe due',
  'نوع غير معروف': 'Unknown type', 'حاول مرة ثانية': 'Please try again', 'طلب غير معروف': 'Unknown request',
  'إنشاء البطاقة': 'Card created', 'استحق خصم ٥٠٪ على الثوب القادم': 'Earned 50% off the next thobe',
  'تراجع عن آخر ختم': 'Last stamp undone', 'استخدم خصم ٥٠٪': 'Used 50% discount', 'استلم الثوب المجاني': 'Received free thobe',
  'تغيير رمز البطاقة': 'Card code changed'
};
const toWest = s => String(s).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
function srv(msg) {
  if (LANG !== 'en' || !msg) return msg;
  if (SERVER_EN[msg]) return SERVER_EN[msg];
  let m;
  if ((m = /^ختم رقم (\d+)$/.exec(msg))) return 'Stamp no. ' + m[1];
  if ((m = /^اكتملت البطاقة — ثوب مجاني، وبدأت البطاقة رقم (\d+)$/.exec(msg))) return 'Card complete — free thobe, card no. ' + m[1] + ' started';
  return msg;
}
function label(l) { if (LANG !== 'en') return l; const m = /^مجهول (.+)$/.exec(l); return m ? 'Anonymous ' + toWest(m[1]) : l; }

const AR = n => LANG === 'en' ? String(n) : String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const digits = s => String(s || '').replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[^\d]/g, '');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtDate = t => new Date(t).toLocaleDateString(LANG === 'en' ? 'en-GB' : 'ar-SA-u-ca-gregory', { year: 'numeric', month: 'short', day: 'numeric' });
const CROWN = i => '<span class="gw"><img src="/img/crown-gem.png" alt=""><i class="gem" style="left:51.4%;top:14.4%;--gs:40%;--d:' + (i * .37 % 3.4).toFixed(2) + 's"></i></span>';

// تطبيق الترجمة على العناصر: data-i (نص)، data-ih (HTML)، data-ip (placeholder)، data-ia (aria-label)
function applyLang(titleKey) {
  const h = document.documentElement; h.lang = LANG; h.dir = LANG === 'ar' ? 'rtl' : 'ltr';
  document.title = tr(titleKey);
  document.querySelectorAll('[data-i]').forEach(e => e.textContent = tr(e.dataset.i));
  document.querySelectorAll('[data-ih]').forEach(e => e.innerHTML = tr(e.dataset.ih));
  document.querySelectorAll('[data-ip]').forEach(e => e.placeholder = tr(e.dataset.ip));
  document.querySelectorAll('[data-ia]').forEach(e => e.setAttribute('aria-label', tr(e.dataset.ia)));
  const b = document.getElementById('langBtn');
  if (b) { b.textContent = tr('langBtn'); b.setAttribute('aria-label', LANG === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'); b.lang = LANG === 'ar' ? 'en' : 'ar'; }
}
function initLang(titleKey, onChange) {
  applyLang(titleKey);
  const b = document.getElementById('langBtn');
  if (b) b.onclick = () => { LANG = LANG === 'ar' ? 'en' : 'ar'; try { localStorage.setItem('elg_lang', LANG); } catch (e) {} applyLang(titleKey); onChange && onChange(); };
}

async function api(action, body) {
  const opt = body ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : {};
  let r;
  try { r = await fetch(API + action, opt); } catch (e) { throw new Error(tr('netErr')); }
  const data = await r.json().catch(() => ({}));
  if (!r.ok) { const e = new Error(srv(data.error) || tr('genErr')); e.data = data; e.status = r.status; throw e; }
  return data;
}
function busy(id, on) { const b = document.getElementById(id); if (b) { b.disabled = on; b.style.opacity = on ? .6 : 1; } }

function renderStamps(grid, c, popLast) {
  grid.innerHTML = '';
  for (let i = 0; i < c.total; i++) {
    const d = document.createElement('div');
    const done = i < c.stamps, special = i === c.discountAt - 1 || i === c.total - 1;
    d.className = 'slot' + (done ? ' done' : special ? ' special' : '') + (popLast && i === c.stamps - 1 ? ' pop' : '');
    d.innerHTML = done ? CROWN(i) : (i === c.discountAt - 1 ? tr('slotDisc') : i === c.total - 1 ? tr('slotFree') : AR(i + 1));
    d.setAttribute('aria-label', tr('slot', AR(i + 1), done));
    grid.appendChild(d);
  }
}
function renderBanners(box, c) {
  let h = '';
  if (c.freePending > 0) h += '<div class="banner b-free">' + (c.freePending > 1 ? tr('freeN', AR(c.freePending)) : tr('free1')) + '</div>';
  if (c.discountPending) h += '<div class="banner b-disc">' + tr('disc') + '</div>';
  if (c.cycle > 0) h += '<div class="hint">' + tr('cycle', AR(c.cycle + 1)) + '</div>';
  box.innerHTML = h;
}
const histHTML = c => c.history.map(h => '• ' + fmtDate(h.t) + ' — ' + esc(srv(h.what))).join('<br>');
