/* إضافات إليغانزا: قصص إليغانزا، مستشار القماش، تتبّع الثوب، مقاعد العيد، ثوب هدية، علّمنا وش تحب */
(()=>{
const API=/netlify\.app$|^localhost|^127\./.test(location.hostname)?"/api/elg/":"https://eleganza-tailor.netlify.app/api/elg/";
const $=id=>document.getElementById(id);
const E=()=>window.ELG;
const L=()=>(E()&&E().lang)||"ar";
const CLIP=["s0","s1","s2","s3","s3","s4"];
const vtag=(n,lazy)=>'<video src="media/'+n+'.mp4" poster="media/'+n+'.jpg" muted loop playsinline '+(lazy?'preload="none" data-lazy="1"':'autoplay')+'></video>';
const X={
 ar:{eiK:"مقاعد الموسم",eiSeats:"ثوب باقي",fName:"اسمك",fPhone:"رقم جوالك",eiPcs:"كم ثوب تبغى؟",eiBtn:"احجز مقعدي",
  eiLead:"عدد الثياب اللي نقدر نسلّمها قبل الموسم محدود. احجز مقعدك الحين ونتواصل معك لموعد المقاس.",eiDefTitle:"مقاعد ثياب العيد",eiDone:"تم حجز مقعدك رقم {n}. بنتواصل معك على واتساب لموعد المقاس.",eiFull:"خلصت المقاعد",eiUntil:"الحجز متاح حتى {d}",
  soK:"قصص إليغانزا",soH:"قصص قصيرة… وكل حلقة لها نهاية ما تتوقعها",soL:"سلسلة حكايات مصوّرة من عالم إليغانزا. تابع الحلقات بالترتيب، والجديد ينزل أول بأول.",ep:"الحلقة",soon:"قريبًا",watch:"شاهد الحلقة",
  qzK:"مستشار القماش",qzH:"وش القماش اللي يناسبك؟",qzL:"أربعة أسئلة سريعة، ونرشّح لك القماش الأنسب من مكتبتنا.",
  q1:"متى بتلبسه أكثر؟",q2:"وين بتلبسه؟",q3:"وش تحب في ملمسه؟",q4:"أي لون يشدّك؟",
  a1:["الصيف","الشتاء"],a2:["الدوام والاستخدام اليومي","المناسبات والزواجات"],a3:["مطفي وهادئ","لمعة خفيفة"],a4:["الأبيض","ألوان فاتحة","ألوان غامقة"],
  qzEmpty:"جاوب على الأسئلة وتطلع لك التوصية هنا.",qzPick:"ترشيحنا لك",qzAlt:"خيار ثاني يناسبك: ",qzOrder:"اطلب هذا القماش",qzSee:"شوفه في المكتبة",qzMsg:"السلام عليكم، مستشار القماش رشّح لي: ",qzLeft:"باقي {n} من ٤",
  tkK:"تتبّع ثوبك",tkH:"وين وصل ثوبك؟",tkL:"اكتب رقم طلبك وآخر ٤ أرقام من جوالك، وشوف المرحلة اللي وصلها ثوبك الحين.",tkId:"رقم الطلب",tk4:"آخر ٤ أرقام من جوالك",tkBtn:"تتبّع",tkPh:"رقم الطلب تلقاه في رسالة الواتساب اللي توصلك بعد المقاس.",
  tkOrder:"طلب رقم {id}",tkDue:"موعد التسليم المتوقع: {d}",tkCert:"شهادة ميلاد ثوبك",tkClip:"لقطة من مرحلة ثوبك الحالية",jcK:"شاهد ثوبك يتصنع",tkBy:"الخيّاط: {t}",
  gfK:"ثوب هدية",gfH:"أهدِ ثوبًا… والمقاس علينا",gfL:"لأبوك، لأخوك، أو لعريس. أنت تختار الهدية، وصاحبها يجينا بس للمقاس واختيار القماش.",gfFrom:"اسمك",gfTo:"اسم المُهدى إليه",gfOcc:"المناسبة",gfCount:"عدد الثياب",gfMsg:"رسالتك على البطاقة",gfBtn:"جهّز بطاقة الهدية",gcFor:"هدية إلى",
  gfNote:"قيمة الهدية تُدفع في المحل أو بالتحويل، ونتواصل معك لتأكيدها.",occ:["رمضان والعيد","زواج","تخرّج","مولود","بدون مناسبة"],gcFrom:"من {n}",gcCount:"{n} ثوب",
  gfReady:"بطاقة الهدية جاهزة",gfCode:"رمز الهدية",gfSend:"أرسل البطاقة للمُهدى إليه",gfShop:"أكّد الهدية مع المحل",gfOpen:"افتح البطاقة",
  gfShareMsg:"{to}، عندك هدية من {from}: ثوب مفصّل على مقاسك من إليغانزا. افتح بطاقتك: {u}",gfShopMsg:"السلام عليكم، جهّزت هدية ثوب من الموقع. رمز الهدية: {c}",
  pfK:"علّمنا وش تحب",pfH:"قل لنا ذوقك… ونرسل لك اللي يناسبك بس",pfL:"ست أسئلة خفيفة، وبعدها توصلك أخبار الأقمشة والتشكيلات والعروض اللي على ذوقك، بدون إزعاج.",pfName:"اسمك (اختياري)",pfOk:"أوافق توصلني أخبار إليغانزا على واتساب، وأقدر أوقفها متى ما بغيت.",pfBtn:"احفظ ذوقي",
  p1:"القماش اللي تحبه",p2:"الطابع اللي يشبهك",p3:"الألوان اللي تميل لها",p4:"تحب الثوب يكون",p5:"وش أكثر مناسبة تفصّل لها؟",p6:"وش يهمك من أخبارنا؟",
  o1:["خفيف","ثقيل","الاثنين"],o2:["رسمي","شبابي","الاثنين"],o3:["الأبيض","ألوان فاتحة","ألوان غامقة"],o4:["واسع ومريح","ضابط على الجسم"],o5:["الدوام اليومي","رمضان والعيد","الزواجات والمناسبات"],o6:["التشكيلات الجديدة","العروض والخصومات","حلقات القصص الجديدة"],
  multi:"تقدر تختار أكثر من واحد",pfCount:"جاوبت {n} من ٦",pfNeed:"جاوب على سؤال واحد على الأقل",pfDone:"انحفظ ذوقك، شكرًا لك. بنرسل لك اللي يناسبك بس.",
  badPhone:"رقم الجوال غير صحيح (مثال: 05xxxxxxxx)",net:"تعذّر الاتصال، جرّب مرة ثانية",wait:"لحظة…"},
 en:{eiK:"Season seats",eiSeats:"thobes left",fName:"Your name",fPhone:"Your mobile",eiPcs:"How many thobes?",eiBtn:"Book my seat",
  eiLead:"We can only deliver a limited number of thobes before the season. Book your seat now and we'll contact you for your measurement appointment.",eiDefTitle:"Eid thobe seats",eiDone:"Seat no. {n} is yours. We'll message you on WhatsApp to set your measurement appointment.",eiFull:"All seats are taken",eiUntil:"Booking open until {d}",
  soK:"Eleganza stories",soH:"Short stories… each with an ending you won't expect",soL:"A series of filmed tales from the world of Eleganza. Watch them in order — new episodes keep coming.",ep:"Episode",soon:"Coming soon",watch:"Watch episode",
  qzK:"Fabric advisor",qzH:"Which fabric suits you?",qzL:"Four quick questions and we'll recommend the best fabric from our library.",
  q1:"When will you wear it most?",q2:"Where will you wear it?",q3:"What do you like in its feel?",q4:"Which colour draws you?",
  a1:["Summer","Winter"],a2:["Work and everyday","Occasions and weddings"],a3:["Matte and calm","A subtle sheen"],a4:["White","Light colours","Dark colours"],
  qzEmpty:"Answer the questions and your recommendation appears here.",qzPick:"Our pick for you",qzAlt:"Another good match: ",qzOrder:"Order this fabric",qzSee:"See it in the library",qzMsg:"Hello, the fabric advisor recommended: ",qzLeft:"{n} of 4 left",
  tkK:"Track your thobe",tkH:"Where is your thobe?",tkL:"Enter your order number and the last 4 digits of your mobile to see which stage your thobe has reached.",tkId:"Order number",tk4:"Last 4 digits of your mobile",tkBtn:"Track",tkPh:"Your order number is in the WhatsApp message you receive after your measurements.",
  tkOrder:"Order no. {id}",tkDue:"Expected delivery: {d}",tkCert:"Your thobe's birth certificate",tkClip:"A glimpse of your thobe's current stage",jcK:"Watch your thobe being made",tkBy:"Tailor: {t}",
  gfK:"Gift a thobe",gfH:"Gift a thobe… we'll handle the fitting",gfL:"For your father, your brother or a groom. You choose the gift; they just visit us for measurements and fabric.",gfFrom:"Your name",gfTo:"Recipient's name",gfOcc:"Occasion",gfCount:"Number of thobes",gfMsg:"Your message on the card",gfBtn:"Prepare the gift card",gcFor:"A gift for",
  gfNote:"The gift is paid in store or by transfer; we'll contact you to confirm it.",occ:["Ramadan & Eid","Wedding","Graduation","Newborn","Just because"],gcFrom:"From {n}",gcCount:"{n} thobe(s)",
  gfReady:"Your gift card is ready",gfCode:"Gift code",gfSend:"Send the card to the recipient",gfShop:"Confirm the gift with the shop",gfOpen:"Open the card",
  gfShareMsg:"{to}, you have a gift from {from}: a thobe tailored to your measurements at Eleganza. Open your card: {u}",gfShopMsg:"Hello, I prepared a thobe gift on the website. Gift code: {c}",
  pfK:"Tell us what you like",pfH:"Tell us your taste… and we'll only send what suits you",pfL:"Six light questions, then you'll get news on fabrics, collections and offers that match your taste — no spam.",pfName:"Your name (optional)",pfOk:"I agree to receive Eleganza news on WhatsApp and can stop it anytime.",pfBtn:"Save my taste",
  p1:"Fabric you like",p2:"Your style",p3:"Colours you lean to",p4:"You like your thobe",p5:"Your most common occasion",p6:"What news interests you?",
  o1:["Light","Heavy","Both"],o2:["Formal","Youthful","Both"],o3:["White","Light colours","Dark colours"],o4:["Loose and comfortable","Fitted"],o5:["Daily work","Ramadan & Eid","Weddings & occasions"],o6:["New collections","Offers & discounts","New story episodes"],
  multi:"You can pick more than one",pfCount:"{n} of 6 answered",pfNeed:"Answer at least one question",pfDone:"Your taste is saved — thank you. We'll only send what suits you.",
  badPhone:"Invalid mobile number (e.g. 05xxxxxxxx)",net:"Connection failed, please try again",wait:"One moment…"}};
const x=(k,v)=>{let s=(X[L()]||X.ar)[k];if(s==null)s=X.ar[k];if(typeof s==="string"&&v)for(const n in v)s=s.split("{"+n+"}").join(v[n]);return s};
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const num=n=>L()==="ar"?String(n).replace(/\d/g,d=>"٠١٢٣٤٥٦٧٨٩"[d]):String(n);
const okPhone=p=>{let d=String(p||"").replace(/\D/g,"");if(d.startsWith("966"))d="0"+d.slice(3);if(d.startsWith("5"))d="0"+d;return /^05\d{8}$/.test(d)?d:null};
const wa=m=>E()?E().wa(m):"#";
const fmtDate=d=>{try{return new Date(d.length===10?d+"T12:00:00+03:00":d).toLocaleDateString(L()==="ar"?"ar-SA-u-ca-gregory":"en-GB",{day:"numeric",month:"long"})}catch(e){return d}};
async function api(a,body){let r;try{r=await fetch(API+a,{method:body?"POST":"GET",headers:{"content-type":"application/json"},body:body?JSON.stringify(body):undefined})}catch(e){throw new Error(x("net"))}
  const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||x("net"));return j}
const msg=(id,t,bad)=>{const e=$(id);e.textContent=t||"";e.classList.toggle("bad",!!bad)};
function chips(name,opts,multi,sel){return '<div class="xchips" role="group">'+opts.map((o,i)=>'<button type="button" class="xchip" data-q="'+name+'" data-i="'+i+'" data-m="'+(multi?1:0)+'" aria-pressed="'+((sel||[]).includes(i))+'">'+esc(o)+'</button>').join("")+'</div>'}
function pick(store,b){const q=b.dataset.q,i=+b.dataset.i,m=b.dataset.m==="1";let cur=store[q]||[];
  if(m)cur=cur.includes(i)?cur.filter(v=>v!==i):[...cur,i];else cur=cur.includes(i)?[]:[i];store[q]=cur;
  b.parentElement.querySelectorAll(".xchip").forEach(c=>c.setAttribute("aria-pressed",String(cur.includes(+c.dataset.i))))}

/* ===== قصص إليغانزا ===== */
function stories(){const C=E().C;const box=$("eps");if(!box)return;
  const eps=E().lines(C.stories||"");$("stories").hidden=!eps.length;
  const ig=/^https:\/\//.test(C.instagram||"")?C.instagram:"";
  box.innerHTML=eps.map(([t,d,u],i)=>{const link=/^https:\/\//.test(u||"")?u:"";const href=link||ig;
    const inner='<span class="no">'+x("ep")+' '+num(i+1)+'</span><span class="big" aria-hidden="true">'+num(i+1)+'</span>'+
    '<svg class="thr" viewBox="0 0 100 178" preserveAspectRatio="none" aria-hidden="true"><path d="M'+(20+i*17%60)+' -5 C 90 40, 0 70, '+(60+i*11%30)+' 110 S 30 170, 80 190" fill="none" stroke="#b69a66" stroke-width=".6" stroke-dasharray="2 2"/></svg>'+
    '<span class="play"><svg viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z"/></svg></span><h3>'+esc(t)+'</h3><p>'+esc(d||"")+'</p>'+(link?"":'<span class="soon">'+x("soon")+'</span>');
    return href?'<a class="ep" href="'+esc(href)+'" target="_blank" rel="noopener" aria-label="'+esc(x("watch")+": "+t)+'">'+inner+'</a>':'<div class="ep">'+inner+'</div>'}).join("");
}
const step=d=>{const b=$("eps");const w=(b.querySelector(".ep")||{}).offsetWidth||240;b.scrollBy({left:d*(w+18)*(document.documentElement.dir==="rtl"?-1:1),behavior:"smooth"})};
$("epNext").addEventListener("click",()=>step(1));$("epPrev").addEventListener("click",()=>step(-1));
$("eps").addEventListener("keydown",e=>{if(e.key==="ArrowLeft"){e.preventDefault();step(document.documentElement.dir==="rtl"?1:-1)}if(e.key==="ArrowRight"){e.preventDefault();step(document.documentElement.dir==="rtl"?-1:1)}});

/* ===== مستشار القماش ===== */
const QZ={};
function quizQs(){$("qzQs").innerHTML=[1,2,3,4].map(n=>'<div class="xq"><h3>'+x("q"+n)+'</h3>'+chips("z"+n,x("a"+n),false,QZ["z"+n])+'</div>').join("");quizRes()}
$("qzQs").addEventListener("click",e=>{const b=e.target.closest(".xchip");if(b){pick(QZ,b);quizRes()}});
function quizRes(){const box=$("qzRes");const done=[1,2,3,4].filter(n=>(QZ["z"+n]||[]).length).length;
  if(done<4){box.innerHTML='<div class="qbar"><i style="width:'+done*25+'%"></i></div><div class="empty">'+x("qzEmpty")+'<br><small>'+x("qzLeft",{n:num(4-done)})+'</small></div>';return}
  const FL=E().lines(E().C.fabrics);const a=n=>QZ["z"+n][0];
  const score=f=>{const txt=(f.slice(2,6).join(" ")).toLowerCase();let s=0;
    const summer=/صيف|summer/i.test(f[0]);if((a(1)===0)===summer)s+=6;
    if(a(2)===0&&/دوام|عملي|يومي|work|practical|everyday|daily/i.test(txt))s+=3;
    if(a(2)===1&&/رسمي|مناسب|حضور|formal|occasion|presence/i.test(txt))s+=3;
    if(a(3)===0&&/مطفي|matte/i.test(txt))s+=2;
    if(a(3)===1&&/لمعة|sheen|shine/i.test(txt))s+=2;
    const col=/^#[0-9a-f]{6}$/i.test(f[6]||"")?f[6]:"#cccccc",l=E().lum(col);
    if(a(4)===0&&(l>.9||/أبيض|white/i.test(f[2]||"")))s+=3;else if(a(4)===1&&l>.6&&l<=.9)s+=3;else if(a(4)===2&&l<=.6)s+=3;
    return s};
  const R=FL.map(f=>[f,score(f)]).sort((p,q)=>q[1]-p[1]);if(!R.length){box.innerHTML="";return}
  const [f]=R[0],alt=R[1]&&R[1][0];const col=/^#[0-9a-f]{6}$/i.test(f[6]||"")?f[6]:"#ccc";
  box.innerHTML='<div class="qbar"><i style="width:100%"></i></div><div class="kick" style="margin:0">'+x("qzPick")+'</div><div class="qsw" style="background:'+col+';background-image:repeating-linear-gradient(0deg,#0000000d 0 1px,transparent 1px 3px),repeating-linear-gradient(90deg,#0000000d 0 1px,transparent 1px 3px)"></div><h3>'+esc(f[1])+'</h3><p class="why">'+esc([f[2],f[3],f[4]].filter(Boolean).join(" · "))+'</p>'+
   (alt?'<div class="alt">'+x("qzAlt")+esc(alt[1])+'</div>':'')+'<div class="btns"><a class="btn p" target="_blank" rel="noopener" href="'+esc(wa(x("qzMsg")+f[1]))+'">'+x("qzOrder")+'</a><a class="btn s" href="#fabrics">'+x("qzSee")+'</a></div>'}

/* ===== تتبّع الثوب ===== */
let lastTrack=null;
function drawTrack(o){const st=E().lines(E().C.journey).map(r=>r[0]);const stages=st.length>=6?st.slice(0,6):st;
  $("tkOut").innerHTML='<div class="tbox"><div class="thead"><b>'+esc(x("tkOrder",{id:num(o.id)}))+'</b><small>'+esc(o.item)+(o.due?' · '+esc(x("tkDue",{d:fmtDate(o.due)})):'')+'</small></div><ol class="tline">'+
   stages.map((s,i)=>{const c=i<o.stage||(o.stage===stages.length-1&&i===o.stage)?"ok":i===o.stage?"now":"";return '<li class="'+c+'"><span class="d">'+(c==="ok"?"✓":num(i+1))+'</span><span><b>'+esc(s)+'</b>'+(i===o.stage&&o.tailor?'<small>'+esc(x("tkBy",{t:o.tailor}))+'</small>':'')+'</span></li>'}).join("")+'</ol></div>'+
   '<div class="tvid">'+vtag(CLIP[Math.min(o.stage,5)],false)+'<span>'+x("tkClip")+'</span></div>'+
   (o.cert?'<div class="btns" style="margin-top:16px"><a class="btn p" href="thobe/?c='+encodeURIComponent(o.cert)+'">'+x("tkCert")+'</a></div>':'')}
$("tkForm").addEventListener("submit",async e=>{e.preventDefault();msg("tkMsg",x("wait"));
  try{const o=await api("track",{id:$("tkId").value.replace(/\D/g,""),last4:$("tk4").value.replace(/\D/g,"")});lastTrack=o;msg("tkMsg","");drawTrack(o)}catch(er){msg("tkMsg",er.message,true)}});

/* ===== مقاعد العيد ===== */
let seats=null;
function drawSeats(){const s=seats;const sec=$("eid");if(!s||!s.open||!s.total){sec.hidden=true;return}sec.hidden=false;
  $("eiTitle").textContent=s.title||x("eiDefTitle");$("eiLeft").textContent=num(s.left);
  $("eiLead").textContent=x("eiLead")+(s.deadline?" "+x("eiUntil",{d:fmtDate(s.deadline)}):"");
  requestAnimationFrame(()=>{$("eiArc").style.strokeDashoffset=String(326.7*(1-s.left/s.total))});
  $("eiForm").querySelector("button").disabled=s.left<=0;if(s.left<=0)msg("eiMsg",x("eiFull"),true);E().watch()}
api("seats").then(s=>{seats=s;drawSeats()}).catch(()=>{});
$("eiForm").addEventListener("submit",async e=>{e.preventDefault();const p=okPhone($("eiPhone").value);if(!p){msg("eiMsg",x("badPhone"),true);return}
  msg("eiMsg",x("wait"));try{const r=await api("book",{name:$("eiName").value,phone:p,pieces:$("eiPcs").value});seats.left=r.left;drawSeats();msg("eiMsg",x("eiDone",{n:num(r.n)}));$("eiForm").reset()}catch(er){msg("eiMsg",er.message,true)}});

/* ===== ثوب هدية ===== */
const GF={occ:[0]};
function giftForm(){$("gfOcc").innerHTML=chips("occ",x("occ"),false,GF.occ).replace(/^<div class="xchips" role="group">|<\/div>$/g,"");giftCard()}
$("gfOcc").addEventListener("click",e=>{const b=e.target.closest(".xchip");if(b){pick(GF,b);giftCard()}});
function giftCard(){const occ=x("occ")[(GF.occ||[])[0]];$("gcOcc").textContent=(GF.occ||[]).length?occ:"";
  $("gcTo").textContent=$("gfTo").value.trim()||"…";$("gcMsg").textContent=$("gfMsgT").value.trim();
  const f=$("gfFrom").value.trim(),c=Math.max(1,parseInt($("gfCount").value)||1);$("gcFrom").textContent=(f?x("gcFrom",{n:f})+" · ":"")+x("gcCount",{n:num(c)})}
["gfTo","gfMsgT","gfFrom","gfCount"].forEach(id=>$(id).addEventListener("input",giftCard));
$("gfForm").addEventListener("submit",async e=>{e.preventDefault();const p=okPhone($("gfPhone").value);if(!p){msg("gfMsg",x("badPhone"),true);return}
  msg("gfMsg",x("wait"));const from=$("gfFrom").value.trim(),to=$("gfTo").value.trim();
  try{const r=await api("gift",{from,to,phone:p,occasion:x("occ")[(GF.occ||[])[0]]||"",msg:$("gfMsgT").value,count:$("gfCount").value});msg("gfMsg","");
    const u=location.origin+"/gift/?c="+r.code;
    $("gfDone").innerHTML='<div class="gdone"><b>'+x("gfReady")+'</b><div>'+x("gfCode")+': <code>'+esc(r.code)+'</code></div><div class="btns"><a class="btn p" target="_blank" rel="noopener" href="https://wa.me/?text='+encodeURIComponent(x("gfShareMsg",{to,from,u}))+'">'+x("gfSend")+'</a><a class="btn s" target="_blank" rel="noopener" href="'+esc(wa(x("gfShopMsg",{c:r.code})))+'">'+x("gfShop")+'</a><a class="btn s" href="gift/?c='+r.code+'">'+x("gfOpen")+'</a></div></div>'}
  catch(er){msg("gfMsg",er.message,true)}});

/* ===== علّمنا وش تحب ===== */
let PF={};try{PF=JSON.parse(localStorage.getItem("elg_prefs")||"{}")}catch(e){PF={}}
const MULTI={p3:1,p5:1,p6:1};
function prefQs(){$("pfQs").innerHTML=[1,2,3,4,5,6].map(n=>'<div class="xq rv in"><h3>'+x("p"+n)+'</h3>'+(MULTI["p"+n]?'<small style="color:var(--mut)">'+x("multi")+'</small>':'')+chips("p"+n,x("o"+n),!!MULTI["p"+n],PF["p"+n])+'</div>').join("");prefCount()}
function prefCount(){$("pfCount").textContent=x("pfCount",{n:num([1,2,3,4,5,6].filter(n=>(PF["p"+n]||[]).length).length)})}
$("pfQs").addEventListener("click",e=>{const b=e.target.closest(".xchip");if(b){pick(PF,b);prefCount();try{localStorage.setItem("elg_prefs",JSON.stringify(PF))}catch(er){}}});
$("pfForm").addEventListener("submit",async e=>{e.preventDefault();const p=okPhone($("pfPhone").value);if(!p){msg("pfMsg",x("badPhone"),true);return}
  if(![1,2,3,4,5,6].some(n=>(PF["p"+n]||[]).length)){msg("pfMsg",x("pfNeed"),true);return}
  const keys=["weight","style","colors","fit","occasions","news"],answers={};
  keys.forEach((k,i)=>{answers[k]=(PF["p"+(i+1)]||[]).map(j=>X.ar["o"+(i+1)][j])});
  msg("pfMsg",x("wait"));try{await api("prefs",{name:$("pfName").value,phone:p,answers});msg("pfMsg",x("pfDone"))}catch(er){msg("pfMsg",er.message,true)}});

/* ===== مقاطع رحلة الثوب ===== */
let jio=null;
function jclips(){const jr=document.querySelector("#journey .jr");if(!jr)return;let box=$("jclips");
  if(!box){box=document.createElement("div");box.id="jclips";box.className="jclips";jr.after(box)}
  const st=E().lines(E().C.journey).map(r=>r[0]).slice(0,6);
  box.innerHTML=st.map((t,i)=>'<div class="jclip">'+vtag(CLIP[i]||"s4",true)+'<span><b>'+num(i+1)+'</b>'+esc(t)+'</span></div>').join("");
  if(!("IntersectionObserver" in window)){box.querySelectorAll("video").forEach(v=>{v.preload="auto";v.play().catch(()=>{})});return}
  if(jio)jio.disconnect();jio=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;if(e.isIntersecting){v.play().catch(()=>{})}else v.pause()}),{threshold:.35});
  box.querySelectorAll("video").forEach(v=>jio.observe(v))}

/* ===== اللغة والرسم ===== */
function texts(){document.querySelectorAll("[data-x]").forEach(el=>{const v=x(el.dataset.x);if(typeof v==="string")el.textContent=v})}
let curLang=null;
function all(){if(!E())return;const lg=L();if(lg!==curLang){curLang=lg;texts();quizQs();prefQs();giftForm();drawSeats();if(lastTrack)drawTrack(lastTrack)}stories();quizRes();jclips();E().watch()}
window.addEventListener("elg:render",all);
all();
if(location.hash&&["#track","#gift","#prefs","#quiz","#stories","#eid"].includes(location.hash))setTimeout(()=>{const t=document.querySelector(location.hash);if(t&&!t.hidden)t.scrollIntoView()},600);
})();
