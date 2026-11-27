/* تطبيق إليغانزا — عربي / English */
{
const API=/netlify\.app$|^localhost|^127\./.test(location.hostname)?"/api/elg/":"https://eleganza-tailor.netlify.app/api/elg/";
const $=id=>document.getElementById(id);
const esc=t=>String(t??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const LS={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
let LANG=LS.get("elg_lang")==="en"?"en":"ar";
const L=(ar,en)=>LANG==="en"?en:ar;
const num=n=>LANG==="en"?String(n):String(n).replace(/\d/g,d=>"٠١٢٣٤٥٦٧٨٩"[d]);
const LOC=()=>LANG==="en"?"en-GB":"ar-SA-u-ca-gregory";

/* ===== هل فُتح من أيقونة الجوال؟ ===== */
const STANDALONE=(window.matchMedia&&(matchMedia("(display-mode: standalone)").matches||matchMedia("(display-mode: fullscreen)").matches))||window.navigator.standalone===true||/[?&]src=pwa/.test(location.search);
if(STANDALONE)document.body.classList.add("pwa");

/* ===== روابط التواصل ===== */
const SOC={whatsapp:"966575300170",maps:"https://maps.app.goo.gl/Sui759a3WStGrewH7",instagram:"https://www.instagram.com/eleganza_tailor",tiktok:"",snapchat:""};
const wa=m=>"https://wa.me/"+SOC.whatsapp+(m?"?text="+encodeURIComponent(m):"");
const httpsOk=u=>/^https:\/\//.test(u||"");

/* ===== البيانات ===== */
const lines=t=>String(t||"").split("\n").map(l=>l.split("|").map(x=>x.trim())).filter(r=>r[0]);
const FAB_AR="صيفي | قطن ناعم | أبيض ثلجي | ناعم ومطفي | خفيف ويتنفس، مناسب لحر جدة | غسيل بارد وكي متوسط | #f5f2ea\nصيفي | ياباني فاخر | أبيض عاجي | ناعم بلمعة هادئة | انسدال جميل ومظهر رسمي | غسيل لطيف وكي على حرارة منخفضة | #f1ede3\nصيفي | رمادي فاتح | رمادي فضي | خفيف ومتماسك | لون عملي وأنيق للدوام | غسيل بارد مع الألوان الفاتحة | #cfd0cf\nشتوي | صوف ناعم | رمادي دخاني | دافئ ومخملي | دفا بدون ثقل | تنظيف جاف يفضّل | #8e8a83\nشتوي | كحلي شتوي | كحلي عميق | سميك وناعم | حضور رسمي للمناسبات | غسيل بارد مقلوب | #28314a\nشتوي | بني داكن | بني شوكولا | دافئ بملمس واضح | لون دافي وراقي | غسيل بارد وكي متوسط | #5b4636";
const FAB_EN="Summer | Soft cotton | Snow white | Soft and matte | Light and breathable, made for Jeddah's heat | Cold wash, medium iron | #f5f2ea\nSummer | Premium Japanese | Ivory white | Smooth with a subtle sheen | Beautiful drape and a formal look | Gentle wash, low-heat iron | #f1ede3\nSummer | Light grey | Silver grey | Light and structured | A practical, elegant colour for work | Cold wash with light colours | #cfd0cf\nWinter | Soft wool | Smoky grey | Warm and velvety | Warmth without weight | Dry cleaning preferred | #8e8a83\nWinter | Winter navy | Deep navy | Thick and soft | A formal presence for occasions | Cold wash, inside out | #28314a\nWinter | Dark brown | Chocolate brown | Warm with a visible texture | A warm, refined colour | Cold wash, medium iron | #5b4636";
let FAB_AR_T=FAB_AR;
const STG_AR=["تم استلام طلبك","تجهيز القماش","مرحلة الخياطة","الفحص والجودة","الكي والتغليف","جاهز للاستلام"];
const STG_EN=["Order received","Fabric preparation","Tailoring","Quality check","Pressing and packaging","Ready for pickup"];
let STG_AR_T=STG_AR;
const STAGES=()=>LANG==="en"?STG_EN:STG_AR_T;
const FAB=()=>lines(LANG==="en"?FAB_EN:FAB_AR_T).map((r,i)=>({i,sea:r[0],n:r[1],shade:r[2],feel:r[3],feat:r[4],care:r[5],c:/^#[0-9a-f]{6}$/i.test(r[6]||"")?r[6]:"#eeeeee"}));
const CLIP=["s0","s1","s2","s3","s3","s4"];
const vid=(n,extra="")=>`<video src="../media/${n}.mp4" poster="../media/${n}.jpg" autoplay muted loop playsinline ${extra}></video>`;

/* ===== خيارات التصميم (نفس الموقع) ===== */
const COLORS=[["#f8f7f3","أبيض","White"],["#efe6d2","عاجي","Ivory"],["#d6c5a3","بيج","Beige"],["#c9cacb","رمادي فاتح","Light grey"],["#6c6d70","رمادي غامق","Dark grey"],["#27324a","كحلي","Navy"],["#5b4636","بني","Brown"],["#1e1e1e","أسود","Black"]];
const GROUPS=[
 {k:"closure",t:["الصدر","Front"],o:[["buttons","أزرار","Buttons"],["zipper","سحاب","Zipper"]]},
 {k:"placket",t:[S=>S.closure==="zipper"?"إخفاء السحاب":"إخفاء الأزرار",S=>S.closure==="zipper"?"Hide the zipper":"Hide the buttons"],o:[["shown","ظاهر","Visible"],["hidden","مخفي بنفس القماش","Hidden under the fabric"]]},
 {k:"collar",t:["حشوة الرقبة","Collar interlining"],o:[["light","خفيفة","Light"],["medium","وسط","Medium"],["stand","واقفة","Standing"]]},
 {k:"sleeve",t:["الكم","Sleeve"],o:[["plain","سادة","Plain"],["cuff","كبك","Cufflinks"]]},
 {k:"chest",t:["جيب الصدر","Chest pocket"],o:[["yes","مع جيب","With pocket"],["no","بدون","None"]]},
 {k:"acc",t:["إكسسوارات الجيب","Pocket accessories"],o:[["yes","مع إكسسوارات","With accessories"],["no","بدون","None"]],show:S=>S.chest==="yes"},
 {k:"side",t:["جيب الثوب","Side pockets"],o:[["shown","ظاهر","Visible"],["hidden","مخفي","Hidden"]]},
 {k:"emb",t:["التطريز","Embroidery"],o:[["no","بدون","None"],["yes","تطريز خفيف","Light embroidery"]]}];
const SDEF={color:"#f8f7f3",closure:"buttons",placket:"shown",collar:"medium",sleeve:"plain",chest:"yes",acc:"no",side:"shown",emb:"no"};
const LI=()=>LANG==="en"?2:1;
const gt=(g,st)=>{const v=g.t[LANG==="en"?1:0];return typeof v==="function"?v(st):v};
const lab=(k,v)=>k==="color"?((COLORS.find(c=>c[0]===v)||[])[LI()]||"—"):(((GROUPS.find(g=>g.k===k)||{o:[]}).o.find(o=>o[0]===v)||[])[LI()]||"—");
const shown=(g,st)=>!g.show||g.show(st);

/* ===== الحالة ===== */
const S={tab:"home",tok:LS.get("elg_tok"),me:null,seats:null,D:{...SDEF}};
try{const d=JSON.parse(LS.get("elg_design2")||"null");if(d)S.D={...SDEF,...d}}catch(e){}
async function api(a,body){let r;try{r=await fetch(API+a,{method:body?"POST":"GET",headers:{"content-type":"application/json"},body:body?JSON.stringify(body):undefined})}catch(e){throw new Error(L("تعذّر الاتصال، تأكد من الإنترنت","Connection failed, check your internet"))}
  const j=await r.json().catch(()=>({}));if(!r.ok){const er=new Error(j.error||L("صار خطأ، جرّب مرة ثانية","Something went wrong, please try again"));er.status=r.status;throw er}return j}

/* ===== أدوات ===== */
function toast(t){const e=$("toast");e.textContent=t;e.classList.add("show");clearTimeout(toast.h);toast.h=setTimeout(()=>e.classList.remove("show"),2800)}
function burst(el){if(!el)return;const r=el.getBoundingClientRect();for(let i=0;i<14;i++){const s=document.createElement("i");s.className="spark";const a=i/14*Math.PI*2,d=30+Math.random()*30;
 s.style.cssText=`left:${r.left+r.width/2}px;top:${r.top+r.height/2}px;--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d}px;background:${i%2?"#B69A66":"#E3CB93"}`;document.body.appendChild(s);setTimeout(()=>s.remove(),900)}}
function sheet(html){$("sheetIn").innerHTML='<div class="grab"></div><div class="row"><span class="grow"></span><button class="x" data-act="close" aria-label="'+L("إغلاق","Close")+'">×</button></div>'+html;$("sheet").classList.add("open")}
function closeSheet(){$("sheet").classList.remove("open");$("sheetIn").innerHTML=""}
const I={
 home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 11 12 4l9 7v9H3z"/><path d="M9 20v-6h6v6"/></svg>',
 studio:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M9 3h6l5 4-2 4-2-1v11H8V10l-2 1-2-4z"/></svg>',
 scan:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16"/></svg>',
 ward:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M12 3v18M10 12h.01M14 12h.01"/></svg>',
 me:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
 hang:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 4a2 2 0 1 1 2 2c-1 0-2 1-2 2l9 6H3l9-6"/><path d="M5 14v6h14v-6"/></svg>',
 bolt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
 gift:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18M12 8S10 3 7.5 4.5 9 8 12 8zm0 0s2-5 4.5-3.5S15 8 12 8z"/></svg>',
 heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z"/></svg>',
 card:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="9" cy="12" r="2"/><circle cx="15" cy="12" r="2"/></svg>',
 star:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="m12 3 2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/></svg>',
 wa:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9c0 3 3 6 6 6l1-1.5-2-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-2z"/></svg>',
 pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 22s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="10" r="2.6"/></svg>',
 ig:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
 tt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.5 2.6 2.4 4.5 5 4.8"/></svg>',
 sc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3c3.3 0 5.5 2.5 5.5 5.6v2.2l1.8.6c.5.2.4.9-.1 1.1l-1.9.7c.6 1.5 1.8 2.6 3.2 3.1-.3.8-1.6 1.1-2.9 1.2-.2.7-.3 1.4-.9 1.4-.8 0-1.6-.5-3 0-1 .4-1.6 1.1-2.7 1.1s-1.7-.7-2.7-1.1c-1.4-.5-2.2 0-3 0-.6 0-.7-.7-.9-1.4-1.3-.1-2.6-.4-2.9-1.2 1.4-.5 2.6-1.6 3.2-3.1l-1.9-.7c-.5-.2-.6-.9-.1-1.1l1.8-.6V8.6C6.5 5.5 8.7 3 12 3z"/></svg>',
 chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>',
 key:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M16 7l3 3"/></svg>',
 team:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 11l2 2 4-4"/></svg>',
 out:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11"/></svg>'};
const SALEH=()=>'<img src="../media/saleh-face.webp" alt="'+L("العم صالح","Uncle Saleh")+'">';

/* ===== اللغة ===== */
function applyLang(){document.documentElement.lang=LANG;document.documentElement.dir=LANG==="en"?"ltr":"rtl";document.title=L("تطبيق إليغانزا","Eleganza app");
 $("langBtn").textContent=LANG==="en"?"ع":"EN";$("langBtn").setAttribute("aria-label",L("English","العربية"));
 $("contactBtn").innerHTML=I.chat+"<span>"+L("تواصل معنا","Contact us")+"</span>";
 $("gKick").textContent=L("تطبيق إليغانزا","Eleganza app");$("gH").textContent=L("ثبّت التطبيق على جوالك","Install the app on your phone");
 $("gLead").textContent=L("تابع ثوبك من القص إلى الاستلام، وصمّمه، واعرف قصة قماشه، وبطاقة ولائك معك دائماً.","Follow your thobe from cutting to pickup, design it, discover its fabric's story, and keep your loyalty card with you.");
 $("gSite").textContent=L("الموقع ←","← Website");$("gOr").textContent=L("أو جرّب التطبيق هنا الآن","Or try the app right here");
 guide();render()}
$("langBtn").onclick=()=>{LANG=LANG==="en"?"ar":"en";LS.set("elg_lang",LANG);applyLang()};

/* ===== تواصل معنا ===== */
$("contactBtn").onclick=()=>{const items=[
  [wa(L("السلام عليكم","Hello")),I.wa,"#25D366",L("واتساب","WhatsApp"),L("راسلنا مباشرة","Message us directly")],
  [SOC.maps,I.pin,"#EA4335",L("موقعنا على الخرائط","Find us on Maps"),L("صاري فرعي، بجوار دوار الفلك، جدة","Sari branch rd, by Falak roundabout, Jeddah")],
  [SOC.instagram,I.ig,"linear-gradient(45deg,#f58529,#dd2a7b,#8134af)",L("إنستغرام","Instagram"),"@eleganza_tailor"],
  [SOC.tiktok,I.tt,"#111",L("تيك توك","TikTok"),""],
  [SOC.snapchat,I.sc,"#FFFC00",L("سناب شات","Snapchat"),""]];
 sheet('<div class="kick">'+L("تواصل معنا","Contact us")+'</div><h2 class="h2">'+L("اختر الطريقة اللي تناسبك","Choose how to reach us")+'</h2><div class="soc">'+items.map(([u,ic,bg,t,sub])=>{
  const inner='<span class="ic" style="background:'+bg+(bg==="#FFFC00"?";color:#111":"")+'">'+ic+'</span><span class="grow"><b>'+esc(t)+'</b>'+(sub||!httpsOk(u)?'<small>'+esc(httpsOk(u)?sub:L("قريباً","Coming soon"))+'</small>':"")+'</span>';
  return httpsOk(u)?'<a href="'+esc(u)+'" target="_blank" rel="noopener">'+inner+'</a>':'<span class="off">'+inner+'</span>'}).join("")+'</div>')};

/* ===== شرح التثبيت (المتصفح فقط) ===== */
const UA=navigator.userAgent||"";
const IOS=/iPhone|iPad|iPod/.test(UA)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
const ANDROID=/Android/.test(UA);
const INAPP=/Instagram|FBAN|FBAV|Snapchat|TikTok|musical_ly|Line\/|Twitter/i.test(UA);
const SHARE_IC='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>';
const PLUS_IC='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8M8 12h8"/></svg>';
const DOTS_IC='<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>';
let deferred=null,pointerShown=false;
function guide(){if(STANDALONE)return;$("guide").classList.remove("hide");const b=$("gBody");const url=location.origin+location.pathname;
  if(INAPP){b.innerHTML=`<ol class="gsteps"><li><span><b>${L("افتح الرابط في المتصفح","Open the link in your browser")}</b>${L(`اضغط ${DOTS_IC} أو ⋯ أعلى الشاشة، واختر «فتح في المتصفح».`,`Tap ${DOTS_IC} or ⋯ at the top and choose “Open in browser”.`)}</span></li><li><span><b>${L("وبعدها أضفه للشاشة الرئيسية","Then add it to your home screen")}</b>${L("بتطلع لك الخطوات هناك.","You'll see the steps there.")}</span></li></ol><button class="btn ghost" style="margin-top:14px" id="copyLink">${L("انسخ رابط التطبيق","Copy the app link")}</button>`;
    $("copyLink").onclick=async()=>{try{await navigator.clipboard.writeText(url);toast(L("انتسخ الرابط، الصقه في المتصفح","Link copied — paste it in your browser"))}catch(e){toast(url)}};return}
  if(IOS){b.innerHTML=`<ol class="gsteps"><li><span><b>${L("اضغط زر المشاركة","Tap the Share button")}</b>${L(`الزر ${SHARE_IC} أسفل الشاشة في Safari.`,`The ${SHARE_IC} button at the bottom of Safari.`)}</span></li><li><span><b>${L("اختر «إضافة إلى الشاشة الرئيسية»","Choose “Add to Home Screen”")}</b>${L("انزل في القائمة شوي لين تلقاها","Scroll down the list to find it")} ${PLUS_IC}</span></li><li><span><b>${L("اضغط «إضافة»","Tap “Add”")}</b>${L("بتطلع أيقونة التاج في جوالك. افتح التطبيق منها دائماً.","The crown icon appears on your phone. Always open the app from it.")}</span></li></ol>`;
    if(!/Safari/.test(UA)||/CriOS|FxiOS|EdgiOS/.test(UA))b.innerHTML+='<p class="note" style="margin:12px 0 0">'+L("إذا ما لقيت الخيار، افتح الرابط في Safari.","If you can't find it, open the link in Safari.")+'</p>';
    if(!pointerShown){pointerShown=true;const p=document.createElement("div");p.className="pointer";p.textContent=L("زر المشاركة هنا ↓","Share button here ↓");document.body.appendChild(p);setTimeout(()=>p.remove(),9000)}return}
  if(ANDROID){b.innerHTML=`<button class="btn${deferred?"":" hide"}" style="margin-top:16px" id="instBtn">${L("ثبّت التطبيق الآن","Install the app now")}</button><ol class="gsteps"><li><span><b>${L("اضغط القائمة","Tap the menu")} ${DOTS_IC}</b>${L("أعلى الشاشة في Chrome.","At the top of Chrome.")}</span></li><li><span><b>${L("اختر «تثبيت التطبيق»","Choose “Install app”")}</b>${L("أو «إضافة إلى الشاشة الرئيسية».","or “Add to Home screen”.")}</span></li><li><span><b>${L("اضغط «تثبيت»","Tap “Install”")}</b>${L("ويصير التطبيق مع تطبيقات جوالك.","The app joins your phone's apps.")}</span></li></ol>`;
    $("instBtn").onclick=async()=>{if(!deferred)return;deferred.prompt();const r=await deferred.userChoice.catch(()=>null);deferred=null;$("instBtn").classList.add("hide");if(r&&r.outcome==="accepted")toast(L("تم التثبيت، افتح التطبيق من أيقونة التاج","Installed — open it from the crown icon"))};return}
  b.innerHTML=`<p style="margin:16px 0 0">${L("افتح هذا الرابط من جوالك، أو امسح الرمز بالكاميرا:","Open this link on your phone, or scan the code with your camera:")}</p><div class="qrbox" id="qr"></div><p class="mute" style="text-align:center;margin:8px 0 0" dir="ltr">${esc(url)}</p>`;
  const draw=()=>{if(!window.qrcode||!$("qr"))return;const q=qrcode(0,"M");q.addData(url);q.make();$("qr").innerHTML=q.createSvgTag({cellSize:5,margin:0,scalable:true})};if(window.qrcode)draw();else window.addEventListener("qrready",draw,{once:true})}
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferred=e;const ib=$("instBtn");if(ib)ib.classList.remove("hide")});
window.addEventListener("appinstalled",()=>{deferred=null;toast(L("تم التثبيت 👑","Installed 👑"))});

/* ===== الدخول ===== */
function vLogin(){return `<div class="saleh"><div class="av">${SALEH()}</div><div class="bubble"><div class="ttl">${L("العم صالح","Uncle Saleh")}</div>${L("حيّاك الله في إليغانزا! ادخل برقم ملفك عشان تشوف ثوبك وين وصل.","Welcome to Eleganza! Sign in with your file number to see where your thobe is.")}</div></div>
 <form class="card" id="loginF" style="display:grid;gap:14px">
  <label class="field">${L("رقم الملف","File number")}<input class="in" id="lFile" inputmode="numeric" autocomplete="username" dir="ltr" placeholder="10001" required></label>
  <label class="field">${L("كلمة المرور (آخر ٤ أرقام من جوالك)","Password (last 4 digits of your mobile)")}<input class="in" id="lPass" type="password" inputmode="numeric" autocomplete="current-password" dir="ltr" maxlength="6" placeholder="••••" required></label>
  <button class="btn" type="submit">${L("دخول","Sign in")}</button><div class="msg" id="lMsg" role="alert"></div>
 </form>
 <p class="mute" style="text-align:center;margin:0">${L("رقم ملفك يوصلك في رسالة الواتساب بعد أول طلب.","Your file number arrives by WhatsApp after your first order.")}<br>${L("ما عندك ملف للحين؟","No file yet?")} <a href="${wa(L("السلام عليكم، أبغى أفصّل ثوب وأفتح ملف في إليغانزا","Hello, I'd like to tailor a thobe and open a file at Eleganza"))}" target="_blank" rel="noopener" style="color:var(--gold2)">${L("احجز موعد مقاس","Book a fitting")}</a></p>
 <div class="list">${[["studio",L("صمّم ثوبك قبل لا تجي","Design your thobe before you visit"),I.studio],["fabric",L("تعرّف على أقمشتنا","Discover our fabrics"),I.scan]].map(([t,l,ic])=>`<button class="item" data-go="${t}"><span class="ic">${ic}</span><span class="grow"><b>${l}</b></span></button>`).join("")}</div>`}
async function login(f,p){const r=await api("app-login",{file:f,pass:p});S.tok=r.token;LS.set("elg_tok",r.token);await loadMe();render()}
async function loadMe(){if(!S.tok){S.me=null;return}try{S.me=await api("app-me",{token:S.tok});LS.set("elg_me",JSON.stringify(S.me))}catch(e){if(e.status===401){logout(true);return}const c=LS.get("elg_me");if(c){try{S.me=JSON.parse(c)}catch(x){}}toast(e.message)}}
function logout(silent){S.tok=null;S.me=null;LS.del("elg_tok");LS.del("elg_me");if(!silent)toast(L("تم تسجيل الخروج","Signed out"));render()}

/* ===== طلباتي ===== */
const first=()=>((S.me&&S.me.name)||"").split(" ")[0];
const SALEH_LINES=n=>LANG==="en"?[`We've received your order, ${n}, and recorded your design and measurements.`,`We're preparing your fabric to your exact measurements.`,`Your tailor is working on your thobe right now. No worries!`,`We're checking every stitch before it leaves.`,`Your thobe is being pressed and wrapped — almost there!`,`Your thobe is ready for you, ${n}. Welcome!`]:[`وصلنا قماشك يا ${n}، وجالسين نسجّل تصميمك ومقاساتك.`,`نجهّز قماشك الحين على مقاسك بالضبط.`,`الخيّاط شغّال على ثوبك الحين. لا تحاتي!`,`نراجع كل غرزة في ثوبك قبل ما يطلع.`,`ثوبك يتكوى ويتغلّف، قربنا مرة!`,`ثوبك جاهز ينتظرك يا ${n}، حيّاك الله.`];
function timeline(o){const st=STAGES();return '<ol class="steps">'+st.map((s,i)=>{const done=i<o.stage||(o.stage===5&&i===5),c=done?"done":i===o.stage?"now":"";
 return `<li class="${c}"><span class="dot">${done?"✓":num(i+1)}</span><span>${esc(s)}${i===o.stage&&o.stage<5?'<br><span class="mute">'+L("المرحلة الحالية","Current stage")+(o.tailor?" · "+esc(o.tailor):"")+'</span>':""}</span>${i<=o.stage?`<button class="clip" data-act="clip" data-i="${i}">▶ ${L("المقطع","Clip")}</button>`:""}</li>`}).join("")+"</ol>"}
const dueTxt=d=>{if(!d)return"";const t=Date.parse(d+"T12:00:00+03:00");if(isNaN(t))return"";return new Date(t).toLocaleDateString(LOC(),{weekday:"long",day:"numeric",month:"long"})};
function vHome(){if(!S.me)return vLogin();const m=S.me,n=first();
 const active=m.orders.filter(o=>o.stage<5),ready=m.orders.filter(o=>o.stage===5&&o.done&&Date.now()-o.done<14*864e5);
 const lead=active[0]||ready[0];
 const line=lead?SALEH_LINES(n)[lead.stage]:L(`هلا ${n}! ما عندك طلب مفتوح الحين. متى نشوفك؟`,`Hi ${n}! You have no open orders right now. When will we see you?`);
 let h=`<div class="saleh"><div class="av">${SALEH()}</div><div class="bubble"><div class="ttl">${L("العم صالح","Uncle Saleh")}</div><span id="salehTxt" class="typing" data-t="${esc(line)}"><span></span><span></span><span></span></span></div></div>`;
 if(lead)h+=`<section class="vbox hero">${vid(CLIP[lead.stage])}<div class="ov"></div><div class="tx"><div class="kick" style="color:#E3CB93">${L("طلب","Order")} ${num(lead.id)} · ${esc(STAGES()[lead.stage])}</div><h2 class="h2" style="margin-top:4px">${lead.stage===5?L("ثوبك جاهز للاستلام 🎉","Your thobe is ready for pickup 🎉"):L("ثوبك في الطريق إليك","Your thobe is on its way")}</h2></div></section>`;
 h+=[...active,...ready].map(o=>`<section class="card"><div class="kick">${L("طلب","Order")} ${num(o.id)}</div><h2 class="h2" style="margin-top:4px">${esc(o.item)}</h2><div class="mute">${o.fabric?esc(o.fabric)+" · ":""}${o.due&&o.stage<5?L("التسليم المتوقع ","Expected ")+dueTxt(o.due):""}</div>${timeline(o)}${o.cert?`<a class="btn ghost" style="margin-top:12px" href="../thobe/?c=${encodeURIComponent(o.cert)}" target="_blank" rel="noopener">${L("شهادة ميلاد ثوبك","Your thobe's birth certificate")}</a>`:""}</section>`).join("");
 if(!active.length&&!ready.length)h+=`<section class="card"><div class="empty">${L("ما عندك طلبات مفتوحة.","You have no open orders.")}<br><a class="btn" style="margin-top:14px" href="${wa(L("السلام عليكم، أبغى أحجز موعد مقاس — ملف رقم ","Hello, I'd like to book a fitting — file no. ")+m.file)}" target="_blank" rel="noopener">${L("احجز موعد مقاس","Book a fitting")}</a></div></section>`;
 const s=S.seats;if(s&&s.open&&s.total){const c=2*Math.PI*48,off=c*(1-s.left/s.total);
  h+=`<section class="card gold"><div class="row"><div style="width:110px;height:110px;flex:none;position:relative"><svg viewBox="0 0 110 110" style="width:100%;height:100%;transform:rotate(-90deg)"><circle cx="55" cy="55" r="48" fill="none" stroke="#ffffff40" stroke-width="9"/><circle cx="55" cy="55" r="48" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c}" data-off="${off}" style="transition:stroke-dashoffset 1.4s"/></svg><b style="position:absolute;inset:0;display:grid;place-content:center;text-align:center;font:700 32px/1 'Reem Kufi'">${num(s.left)}<small style="font:500 12px 'IBM Plex Sans Arabic'">${L("ثوب باقي","thobes left")}</small></b></div><div class="grow"><div class="mute">${esc(s.title||L("مقاعد الموسم","Season seats"))}</div><h2 class="h2" style="margin:4px 0 10px">${L("احجز قبل الزحمة","Book before the rush")}</h2><button class="btn dark" data-act="book" ${s.left<=0?"disabled":""}>${s.left<=0?L("خلصت المقاعد","Fully booked"):L("احجز مقعدي","Book my seat")}</button></div></div></section>`}
 h+=loyaltyCard();
 h+=`<button class="item" data-act="rush"><span class="ic" style="background:#F6DDD3;color:var(--red)">${I.bolt}</span><span class="grow"><b>${L("تعديل مستعجل","Urgent alteration")}</b><br><span class="mute">${L("مناسبة قريبة والثوب يبي تعديل؟ نلحقك.","An occasion soon and your thobe needs a fix? We'll make it.")}</span></span></button>`;
 return h}
function loyaltyCard(){const Ly=S.me&&S.me.loyalty;
 if(!Ly)return `<a class="item" href="../card/" target="_blank" rel="noopener"><span class="ic">${I.card}</span><span class="grow"><b>${L("بطاقة الولاء","Loyalty card")}</b><br><span class="mute">${L("سجّل برقم جوالك واجمع الأختام: خصم على السادس، والحادي عشر مجاناً.","Register with your mobile and collect stamps: a discount on the 6th, the 11th free.")}</span></span></a>`;
 const left=Ly.discountAt-Ly.stamps;
 return `<a class="card gold" href="../card/" target="_blank" rel="noopener" style="text-decoration:none;display:block"><div class="row"><b class="grow ttl">${L("بطاقة الولاء","Loyalty card")}</b><span style="font-size:13px">${num(Ly.stamps)} ${L("من","of")} ${num(Ly.total)}</span></div>
 <div class="stamps">${Array.from({length:Ly.total},(_,i)=>`<span class="${i<Ly.stamps?"on":""} ${i===Ly.discountAt-1||i===Ly.total-1?"gift":""}">${i<Ly.stamps?"":i===Ly.discountAt-1?L("خصم","Off"):i===Ly.total-1?L("مجاناً","Free"):num(i+1)}</span>`).join("")}</div>
 <p style="margin:12px 0 0;font-size:14px">${Ly.freePending?L("عندك ثوب مجاني ينتظرك 🎉","A free thobe is waiting for you 🎉"):Ly.discountPending?L("عندك خصم على ثوبك القادم 🎉","You have a discount on your next thobe 🎉"):left>0?L("باقي "+num(left)+" على خصم الثوب السادس.",left+" more to your 6th-thobe discount."):L("باقي "+num(Ly.total-Ly.stamps)+" على الثوب المجاني.",(Ly.total-Ly.stamps)+" more to your free thobe.")}</p></a>`}

/* ===== معاينة الثوب الواقعية ===== */
function lum(h){const n=parseInt(h.slice(1),16);return(.299*(n>>16)+.587*(n>>8&255)+.114*(n&255))/255}
const mir=pts=>pts.map(([x,y])=>[400-x,y]);
const poly=(pts,f,s)=>'<polygon points="'+pts.map(p=>p.join(",")).join(" ")+'" fill="'+f+'" stroke="'+s+'" stroke-width="1.4" stroke-linejoin="round"/>';
function thobeReal(D){
  const c=D.color,dark=lum(c)<.45,ln=dark?"rgba(255,255,255,.28)":"rgba(60,45,20,.24)",gold="#d9b14a",embc=dark?"#c9a54a":"#b89a5a",btn=dark?"#e8e3d8":"#fff";
  let s='<defs>'+
   '<pattern id="wv" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><path d="M0 0H3" stroke="'+(dark?"#fff":"#000")+'" stroke-opacity=".05" stroke-width="1"/></pattern>'+
   '<linearGradient id="sh" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".38" stop-color="#fff" stop-opacity="0"/><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".32"/></linearGradient>'+
   '<linearGradient id="vt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient>'+
   '<linearGradient id="fold" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".5" stop-color="#000" stop-opacity=".16"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>'+
   '<linearGradient id="hg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#e9cf8f"/><stop offset="1" stop-color="#9a7b43"/></linearGradient>'+
   '<filter id="ds" x="-20%" y="-10%" width="140%" height="130%"><feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#5a4320" flood-opacity=".28"/></filter></defs>';
  s+='<ellipse cx="200" cy="600" rx="130" ry="10" fill="#5a4320" opacity=".18"/>';
  s+='<g class="sway">';
  /* العلّاقة */
  s+='<path d="M200 8 q0 -6 6 -6 q7 0 7 7 q0 6 -9 10 L200 26" fill="none" stroke="#9a7b43" stroke-width="3" stroke-linecap="round"/><path d="M200 26 L118 82 q-6 5 2 6 L280 88 q8 -1 2 -6 Z" fill="url(#hg)" stroke="#8a6c36" stroke-width="1"/>';
  s+='<g transform="translate(0,30)" filter="url(#ds)">';
  const B="M170 70 Q200 86 230 70 L286 92 L346 290 L306 303 L274 172 L284 548 Q200 556 116 548 L126 172 L94 303 L54 290 L114 92 Z";
  s+='<path d="'+B+'" fill="'+c+'" stroke="'+ln+'" stroke-width="1.4" stroke-linejoin="round"/>';
  s+='<path d="'+B+'" fill="url(#wv)"/><path d="'+B+'" fill="url(#sh)"/><path d="'+B+'" fill="url(#vt)"/>';
  /* طيّات القماش */
  [[150,330,142,546,18],[200,260,198,548,14],[250,340,258,546,16],[132,180,130,300,10],[268,180,270,300,10]].forEach(([x1,y1,x2,y2,w])=>{s+='<path d="M'+(x1-w/2)+' '+y1+' Q'+((x1+x2)/2-w/2+4)+' '+((y1+y2)/2)+' '+(x2-w/2)+' '+y2+' L'+(x2+w/2)+' '+y2+' Q'+((x1+x2)/2+w/2+4)+' '+((y1+y2)/2)+' '+(x1+w/2)+' '+y1+' Z" fill="url(#fold)"/>'});
  s+='<path d="M116 548 Q200 556 284 548" fill="none" stroke="'+ln+'" stroke-width="1.2"/>';
  s+='<path d="M176 68 Q200 82 224 68 Q200 60 176 68Z" fill="rgba(0,0,0,.35)"/>';
  if(D.sleeve==="cuff"){const Lp=[[61,265],[101,278],[94,303],[54,290]];s+=poly(Lp,c,ln)+poly(mir(Lp),c,ln)+'<circle cx="78" cy="286" r="4.2" fill="'+gold+'" stroke="#8a6c36" stroke-width=".8"/><circle cx="322" cy="286" r="4.2" fill="'+gold+'" stroke="#8a6c36" stroke-width=".8"/>'}
  else s+='<path d="M57 281 L97 294 M343 281 L303 294" stroke="'+ln+'" stroke-width="1.2" stroke-dasharray="3 3"/>';
  if(D.side==="shown")s+='<path d="M262 300 L268 354 M138 300 L132 354" stroke="'+ln+'" stroke-width="2.6" stroke-linecap="round"/>';
  else s+='<path d="M272 296 L273 358 M128 296 L127 358" stroke="'+ln+'" stroke-width="1" stroke-dasharray="2 3" opacity=".55"/>';
  if(D.chest==="yes"){const pen=D.acc==="yes";
    if(pen)s+='<rect x="249" y="104" width="7" height="30" rx="3.5" fill="#1d1d1d"/><circle cx="252.5" cy="106" r="3" fill="'+gold+'"/>';
    s+='<path d="M226 128 h34 v34 q-17 6 -34 0 z" fill="'+c+'" stroke="'+ln+'" stroke-width="1.4"/><path d="M226 133 h34" stroke="'+ln+'" stroke-dasharray="2 2"/><path d="M226 128 h34 v34 q-17 6 -34 0 z" fill="url(#sh)" opacity=".6"/>';
    if(pen)s+='<rect x="251.4" y="108" width="2.4" height="30" rx="1.2" fill="'+gold+'"/><path d="M232 128 q4 -8 9 -3 q3 -6 7 0" fill="'+btn+'" stroke="'+ln+'" stroke-width="1"/>'}
  s+='<rect x="193" y="84" width="14" height="124" rx="2" fill="'+c+'" stroke="'+ln+'" stroke-width="1.4"/><rect x="193" y="84" width="14" height="124" rx="2" fill="url(#sh)" opacity=".5"/>';
  if(D.placket==="hidden")s+='<rect x="191" y="84" width="18" height="124" rx="2" fill="'+c+'" stroke="'+ln+'" stroke-width="1.4"/><rect x="191" y="84" width="18" height="124" rx="2" fill="url(#sh)" opacity=".4"/><path d="M205 90 V204" stroke="'+ln+'" stroke-width="1" stroke-dasharray="2 2.5"/>';
  else if(D.closure==="buttons")s+=[102,128,154,180].map(y=>'<circle cx="200" cy="'+y+'" r="4" fill="'+btn+'" stroke="'+ln+'"/><circle cx="199" cy="'+(y-1)+'" r="1.2" fill="#fff" opacity=".9"/>').join("");
  else{const zc=dark?"#d8d3c8":"#9a9a9a";s+='<path d="M200 90 V204" stroke="'+zc+'" stroke-width="2"/>';for(let y=92;y<204;y+=5)s+='<path d="M197 '+y+' h6" stroke="'+zc+'" stroke-width="1"/>';s+='<rect x="196" y="186" width="8" height="15" rx="2" fill="'+gold+'"/>'}
  if(D.collar==="light")s+='<path d="M168 68 Q200 89 232 68" fill="none" stroke="'+ln+'" stroke-width="3.5" stroke-linecap="round"/>';
  else if(D.collar==="medium")s+='<path d="M166 62 Q200 84 234 62 L237 73 Q200 97 163 73 Z" fill="'+c+'" stroke="'+ln+'" stroke-width="1.4"/><path d="M166 62 Q200 84 234 62 L237 73 Q200 97 163 73 Z" fill="url(#vt)"/>';
  else s+='<path d="M170 42 Q200 54 230 42 L237 73 Q200 96 163 73 Z" fill="'+c+'" stroke="'+ln+'" stroke-width="1.4"/><path d="M170 42 Q200 54 230 42 L237 73 Q200 96 163 73 Z" fill="url(#sh)" opacity=".6"/><path d="M196 52 L196 84 M204 52 L204 84" stroke="'+ln+'"/>';
  if(D.emb==="yes"){s+='<g fill="none" stroke="'+embc+'" stroke-width="1.6" stroke-dasharray="1.5 3" stroke-linecap="round"><path d="M187 88 V212 M213 88 V212"/><path d="M162 80 Q200 104 238 80"/></g>';for(let y=96;y<210;y+=14)s+='<path d="M'+(D.placket==="hidden"?213:200)+' '+(y-3)+' l3 3 l-3 3 l-3 -3z" fill="'+embc+'" opacity=".7"/>'}
  s+='</g></g>';
  return '<svg viewBox="0 0 400 615" role="img" aria-label="'+L("معاينة الثوب","Thobe preview")+'">'+s+'</svg>'}

/* ===== صمّم ===== */
function rows(st){return [[L("اللون","Colour"),"color"]].concat(GROUPS.filter(g=>shown(g,st)).map(g=>[gt(g,st),g.k]))}
function designMsg(){return L("السلام عليكم، هذي اختياراتي لثوب من إليغانزا","Hello, here are my choices for an Eleganza thobe")+(S.me?L(" (ملف "," (file ")+S.me.file+")":"")+":\n"+rows(S.D).map(([t,k])=>"• "+t+": "+lab(k,S.D[k])).join("\n")}
function vStudio(){const D=S.D;
 let opts='<h3>'+L("اللون","Colour")+'</h3><div class="chips">'+COLORS.map(c=>`<button class="sw ${D.color===c[0]?"on":""}" style="background:${c[0]}" data-act="opt" data-k="color" data-v="${c[0]}" aria-label="${c[LI()]}" title="${c[LI()]}"></button>`).join("")+'</div>';
 opts+=GROUPS.filter(g=>shown(g,D)).map(g=>'<h3>'+esc(gt(g,D))+'</h3><div class="chips">'+g.o.map(o=>`<button class="chip ${D[g.k]===o[0]?"on":""}" data-act="opt" data-k="${g.k}" data-v="${o[0]}">${o[LI()]}</button>`).join("")+'</div>').join("");
 return `<div><div class="kick">${L("استوديو إليغانزا","Eleganza studio")}</div><h1 class="h1" style="margin-top:4px">${L("صمّم ثوبك قبل لا تجي","Design your thobe before you visit")}</h1></div>
 <div class="stw"><section class="stage3d">${thobeReal(D)}<span class="ctag">${esc(lab("color",D.color))}</span></section>
 <section class="card cfgs">${opts}</section></div>
 <section class="card"><b class="ttl h3">${L("بطاقة طلبك","Your order card")}</b><ul class="sumbox" style="margin-top:8px">${rows(D).map(([t,k])=>`<li><span>${esc(t)}:</span> ${esc(lab(k,D[k]))}</li>`).join("")}</ul></section>
 <button class="btn" data-act="runway">${L("شاهد ثوبك على منصة العرض","See your thobe on the runway")}</button>
 <a class="btn ghost" href="${wa(designMsg())}" target="_blank" rel="noopener">${L("أرسل اختياراتي واتساب","Send my choices on WhatsApp")}</a>
 <p class="mute" style="text-align:center;margin:0">${L("التطريز والقماش النهائي نثبّتها معك في المحل، والتصاميم الخاصة تشوفها عندنا.","We confirm embroidery and the final fabric with you in store; private designs are shown there.")}</p>`}

/* ===== القماش ===== */
function vFabric(){return `<div><div class="kick">${L("قصة القماش","Fabric story")}</div><h1 class="h1" style="margin-top:4px">${L("امسح رول القماش في المحل","Scan a fabric roll in the shop")}</h1><p class="mute" style="margin:4px 0 0">${L("كل رول في المحل عليه رمز. افتح كاميرا جوالك ووجّهها عليه، وتنفتح قصته هنا.","Every roll in the shop has a code. Point your phone camera at it and its story opens here.")}</p></div>
 <div class="scan"><span class="corner" style="top:14px;right:14px;border-width:3px 3px 0 0"></span><span class="corner" style="top:14px;left:14px;border-width:3px 0 0 3px"></span><span class="corner" style="bottom:14px;right:14px;border-width:0 3px 3px 0"></span><span class="corner" style="bottom:14px;left:14px;border-width:0 0 3px 3px"></span><span class="beam"></span></div>
 <section class="card"><b class="ttl h3">${L("أقمشتنا","Our fabrics")}</b><div class="list" style="margin-top:10px">${FAB().map(f=>`<button class="item" data-act="fab" data-f="${f.i}"><span class="ic" style="background:${f.c};border:1px solid var(--line)"></span><span class="grow"><b>${esc(f.n)}</b><br><span class="mute">${esc(f.sea)} · ${esc(f.feel)}</span></span></button>`).join("")}</div></section>`}
function fabStory(f){return `<div class="kick">${L("قصة القماش","Fabric story")}</div><h2 class="h2">${esc(f.n)}</h2><div class="swbig" style="background-color:${f.c}"></div>
 <p style="margin:0">${esc(f.feat)}.</p><dl class="kv"><dt>${L("الموسم","Season")}</dt><dd>${esc(f.sea)}</dd><dt>${L("اللون","Colour")}</dt><dd>${esc(f.shade)}</dd><dt>${L("الملمس","Feel")}</dt><dd>${esc(f.feel)}</dd><dt>${L("العناية","Care")}</dt><dd>${esc(f.care)}</dd></dl>
 <button class="btn" data-act="useFab" data-f="${f.i}">${L("صمّم ثوبك بهذا اللون","Design your thobe in this colour")}</button>
 <a class="btn ghost" href="${wa(L("السلام عليكم، أبغى أفصّل من قماش ","Hello, I'd like a thobe in ")+f.n)}" target="_blank" rel="noopener">${L("اطلبه على واتساب","Order it on WhatsApp")}</a>`}
function nearestColor(hex){let best=COLORS[0][0],bd=1e9;const p=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16));const a=p(hex);for(const c of COLORS){const b=p(c[0]);const d=(a[0]-b[0])**2+(a[1]-b[1])**2+(a[2]-b[2])**2;if(d<bd){bd=d;best=c[0]}}return best}

/* ===== خزانتي ===== */
function vWard(){const head=`<div><div class="kick">${L("ذاكرة الخيّاط","The tailor's memory")}</div><h1 class="h1" style="margin-top:4px">${L("خزانتي","My wardrobe")}</h1></div>`;
 if(!S.me)return head+`<section class="card"><div class="empty">${L("ادخل برقم ملفك عشان تشوف ثيابك وشهاداتها.","Sign in with your file number to see your thobes and their certificates.")}<button class="btn" style="margin-top:14px" data-go="home">${L("تسجيل الدخول","Sign in")}</button></div></section>`;
 const done=S.me.orders.filter(o=>o.stage===5).sort((a,b)=>(b.done||0)-(a.done||0));const last=done[0];let h=head;
 if(last&&last.done&&Date.now()-last.done>300*864e5)h+=`<section class="card gold media">${vid("tape")}<div><div class="row" style="margin-bottom:6px"><span class="av" style="width:44px;height:44px">${SALEH()}</span><div class="mute">${L("تذكير من العم صالح","A reminder from Uncle Saleh")}</div></div><h2 class="h2" style="margin:4px 0 10px">${L("مر وقت على آخر ثوب فصّلته عندنا… نجدده؟","It's been a while since your last thobe… shall we renew it?")}</h2><a class="btn dark" href="${wa(L("السلام عليكم، أبغى أجدد ثوبي بنفس المقاس — ملف ","Hello, I'd like to renew my thobe with the same measurements — file ")+S.me.file)}" target="_blank" rel="noopener">${L("جدّده بنفس المقاس","Renew with the same measurements")}</a></div></section>`;
 h+=done.length?`<div class="list">${done.map(o=>`<a class="item" href="${o.cert?"../thobe/?c="+encodeURIComponent(o.cert):"#"}" target="_blank" rel="noopener"><span class="ic">${I.hang}</span><span class="grow"><b>${esc(o.item)}</b><br><span class="mute">${esc(o.fabric||"")} ${o.done?"· "+new Date(o.done).toLocaleDateString(LANG==="en"?"en-GB":"ar-SA-u-ca-islamic",{month:"long",year:"numeric"}):""}</span></span><span class="tag">${L("الشهادة","Certificate")}</span></a>`).join("")}</div>`:`<section class="card"><div class="empty">${L("أول ما تستلم ثوبك، ينحفظ هنا مع شهادة ميلاده.","Once you pick up your thobe, it's saved here with its birth certificate.")}</div></section>`;
 h+=`<button class="item" data-act="memory"><span class="ic" style="background:#F5E7CC">${I.heart}</span><span class="grow"><b>${L("ثوب الذكرى","Memory thobe")}</b><br><span class="mute">${L("عندك شماغ أبوك أو قماش له قصة؟ نخيطه في ثوبك.","Your father's shemagh or a fabric with a story? We'll stitch it into your thobe.")}</span></span></button>`;
 return h}

/* ===== حسابي ===== */
function vMe(){const m=S.me;let h="";
 if(m)h+=`<section class="card gold"><div class="mute">${L("ملف رقم","File no.")}</div><div style="font:700 40px/1.1 'Reem Kufi';letter-spacing:2px">${num(m.file)}</div><div style="margin-top:4px">${esc(m.name)}</div></section>`;
 else h+=`<section class="card"><div class="empty">${L("ما سجّلت دخولك.","You're not signed in.")}<button class="btn" style="margin-top:14px" data-go="home">${L("تسجيل الدخول","Sign in")}</button></div></section>`;
 const it=(href,ic,t,s)=>`<a class="item" href="${href}" target="_blank" rel="noopener"><span class="ic">${ic}</span><span class="grow"><b>${t}</b>${s?`<br><span class="mute">${s}</span>`:""}</span></a>`;
 h+=`<div class="list">`;
 if(m)h+=`<button class="item" data-act="pin"><span class="ic">${I.key}</span><span class="grow"><b>${m.hasPin?L("تغيير الرقم السري","Change your PIN"):L("اختر رقماً سرياً خاصاً","Choose a private PIN")}</b><br><span class="mute">${L("بدل آخر ٤ أرقام من جوالك","Instead of the last 4 digits of your mobile")}</span></span></button>`;
 h+=it("../card/",I.card,L("بطاقة الولاء","Loyalty card"),"")+it("../#gift",I.gift,L("أهدِ ثوباً","Gift a thobe"),L("والمقاس علينا","We handle the fitting"))+it("../#prefs",I.star,L("علّمنا وش تحب","Tell us what you like"),L("وتوصلك الأخبار اللي تناسبك","And get news that suits you"))+it("../#stories",I.studio,L("قصص إليغانزا","Eleganza stories"),L("حلقات قصيرة من عالمنا","Short episodes from our world"))+it("../staff/",I.team,L("دخول الفريق","Team sign-in"),L("للموظفين فقط","Staff only"));
 if(m)h+=`<button class="item" data-act="logout"><span class="ic">${I.out}</span><span class="grow"><b>${L("تسجيل الخروج","Sign out")}</b></span></button>`;
 h+=`</div><section class="card" style="text-align:center"><div class="kick" style="justify-content:center">${L("قريباً","Coming soon")}</div><b class="ttl h3">${L("تحدي الشهر: أفضل طلّة بثوب إليغانزا","Monthly challenge: best look in an Eleganza thobe")}</b><p class="mute" style="margin:4px 0 0">${L("الفائز ياخذ ثوبه القادم مجاناً.","The winner gets their next thobe free.")}</p></section>`;
 return h}

/* ===== الرسم ===== */
const TABS=()=>[["home",L("طلباتي","Orders"),I.home],["studio",L("صمّم","Design"),I.studio],["fabric",L("القماش","Fabrics"),I.scan],["ward",L("خزانتي","Wardrobe"),I.ward],["me",L("حسابي","Account"),I.me]];
function render(){const t=S.tab;const V={home:vHome,studio:vStudio,fabric:vFabric,ward:vWard,me:vMe};
 $("view").innerHTML=V[t]();
 $("nav").innerHTML=TABS().map(([k,l,ic])=>`<button class="${k===t?"on":""}" data-tab="${k}" aria-current="${k===t?"page":"false"}">${ic}${l}</button>`).join("");
 $("nav").setAttribute("aria-label",L("أقسام التطبيق","App sections"));
 $("hello").innerHTML=S.me?L("مرحباً","Hi")+"<b>"+esc(first())+"</b>":"";
 const st=$("salehTxt");if(st)setTimeout(()=>{st.classList.remove("typing");st.textContent=st.dataset.t},800);
 document.querySelectorAll("[data-off]").forEach(c=>requestAnimationFrame(()=>requestAnimationFrame(()=>c.style.strokeDashoffset=c.dataset.off)));
 if(t==="home"&&!S.me){const f=$("loginF");if(f)f.onsubmit=async e=>{e.preventDefault();const m=$("lMsg");m.classList.remove("bad");m.textContent=L("لحظة…","One moment…");
  try{await login($("lFile").value.replace(/\D/g,""),$("lPass").value.replace(/\D/g,""));burst($("hello"));toast(L("أهلاً وسهلاً 👑","Welcome 👑"))}catch(er){m.textContent=er.message;m.classList.add("bad")}}}}
function go(t){S.tab=t;closeSheet();render();const app=document.querySelector(".app");scrollTo({top:STANDALONE||!app?0:app.offsetTop-8,behavior:"smooth"})}

document.addEventListener("click",e=>{
 const tb=e.target.closest("[data-tab]");if(tb){go(tb.dataset.tab);return}
 const g=e.target.closest("[data-go]");if(g){go(g.dataset.go);return}
 if(e.target.id==="sheet"){closeSheet();return}
 const a=e.target.closest("[data-act]");if(!a)return;const act=a.dataset.act;
 if(act==="close")closeSheet();
 if(act==="opt"){S.D[a.dataset.k]=a.dataset.v;LS.set("elg_design2",JSON.stringify(S.D));const y=scrollY;render();scrollTo(0,y)}
 if(act==="runway"){sheet(`<div class="runv"><video id="runV" src="../media/runway.mp4" poster="../media/runway.jpg" autoplay muted loop playsinline></video><button class="snd" id="runS" type="button">🔇 ${L("الصوت","Sound")}</button></div><a class="btn" href="${wa(designMsg())}" target="_blank" rel="noopener">${L("أرسل اختياراتي واتساب","Send my choices on WhatsApp")}</a>`);
  const v=$("runV"),b=$("runS");b.onclick=()=>{v.muted=!v.muted;b.textContent=(v.muted?"🔇 ":"🔊 ")+L("الصوت","Sound");if(!v.muted)v.play().catch(()=>{})}}
 if(act==="clip"){const i=+a.dataset.i;sheet(`<div class="vbox" style="aspect-ratio:9/16;height:min(62vh,560px);margin:0 auto">${vid(CLIP[i])}<div class="ov"></div><div class="tx"><div class="kick" style="color:#E3CB93">${L("مرحلة","Stage")} ${num(i+1)}</div><b class="ttl h2">${esc(STAGES()[i])}</b></div></div>`)}
 if(act==="fab")sheet(fabStory(FAB()[+a.dataset.f]||FAB()[0]));
 if(act==="useFab"){const f=FAB()[+a.dataset.f]||FAB()[0];S.D.color=nearestColor(f.c);LS.set("elg_design2",JSON.stringify(S.D));go("studio");toast(L("لبّسنا ثوبك لون ","Your thobe is now ")+lab("color",S.D.color))}
 if(act==="rush")sheet(`<div class="kick">${L("تعديل مستعجل","Urgent alteration")}</div><h2 class="h2">${L("وش يحتاج ثوبك؟","What does your thobe need?")}</h2><div class="chips" id="rushC">${[L("تقصير","Shorten"),L("توسيع","Let out"),L("تضييق","Take in"),L("زر أو سحاب","Button or zipper"),L("شي ثاني","Something else")].map((t,i)=>`<button class="chip ${i===0?"on":""}" data-act="pick">${t}</button>`).join("")}</div><p class="mute" style="margin:0">${L("بعد ما يفتح الواتساب، أرسل صورة الثوب ونرد عليك بالوقت والسعر.","Once WhatsApp opens, send a photo of the thobe and we'll reply with timing and price.")}</p><button class="btn" data-act="rushGo">${L("أرسل على واتساب","Send on WhatsApp")}</button>`);
 if(act==="pick")a.parentElement.querySelectorAll(".chip").forEach(c=>c.classList.toggle("on",c===a));
 if(act==="rushGo"){const t=(document.querySelector("#rushC .chip.on")||{}).textContent||"";window.open(wa(L("السلام عليكم، عندي تعديل مستعجل: ","Hello, I have an urgent alteration: ")+t+(S.me?L(" — ملف "," — file ")+S.me.file:"")),"_blank");closeSheet()}
 if(act==="memory")sheet(`<div class="vbox" style="height:200px">${vid("book")}<div class="ov"></div></div><div class="kick">${L("ثوب الذكرى","Memory thobe")}</div><h2 class="h2">${L("قماش له قصة، يرجع يعيش معك","A fabric with a story, living on with you")}</h2><p style="margin:0">${L("جيب قطعة قماش غالية عليك، مثل شماغ أبوك أو بشت جدك، ونخيطها في ثوبك الجديد: بطانة الياقة أو داخل الكبك أو الجيب.","Bring a piece of fabric dear to you — your father's shemagh or your grandfather's bisht — and we'll stitch it into your new thobe: the collar lining, inside the cuffs or the pocket.")}</p><div class="list"><div class="note">${L("١. اكتب لنا قصة القماش بسطرين","1. Tell us its story in two lines")}</div><div class="note">${L("٢. جيبه للمحل مع موعد المقاس","2. Bring it to your fitting")}</div><div class="note">${L("٣. تنحفظ القصة في شهادة ميلاد ثوبك","3. The story is saved in your thobe's birth certificate")}</div></div><a class="btn" href="${wa(L("السلام عليكم، أبغى ثوب ذكرى","Hello, I'd like a memory thobe")+(S.me?L(" — ملف "," — file ")+S.me.file:""))}" target="_blank" rel="noopener">${L("أبغى ثوب ذكرى","I want a memory thobe")}</a>`);
 if(act==="book")sheet(`<div class="kick">${esc(S.seats.title||L("مقاعد الموسم","Season seats"))}</div><h2 class="h2">${L("كم ثوب تبغى؟","How many thobes?")}</h2><input class="in" id="bPcs" type="number" min="1" max="20" value="1" dir="ltr"><button class="btn" data-act="bookGo">${L("احجز","Book")}</button><div class="msg" id="bMsg"></div>`);
 if(act==="bookGo"){(async()=>{const m=$("bMsg");m.textContent=L("لحظة…","One moment…");m.classList.remove("bad");
  try{const r=await api("book",{token:S.tok,pieces:$("bPcs").value});S.seats.left=r.left;closeSheet();render();toast(L("حجزنا لك المقعد رقم "+num(r.n)+"، بنتواصل معك لموعد المقاس 🎉","Seat no. "+r.n+" is yours — we'll contact you for your fitting 🎉"))}catch(er){m.classList.add("bad");m.textContent=er.message}})()}
 if(act==="pin")sheet(`<div class="kick">${L("الرقم السري","PIN")}</div><h2 class="h2">${L("اختر رقماً سرياً من ٤ إلى ٦ أرقام","Choose a 4–6 digit PIN")}</h2><input class="in" id="pin1" type="password" inputmode="numeric" maxlength="6" dir="ltr" placeholder="••••"><input class="in" id="pin2" type="password" inputmode="numeric" maxlength="6" dir="ltr" placeholder="${L("أعد كتابته","Repeat it")}"><button class="btn" data-act="pinGo">${L("احفظ","Save")}</button><div class="msg" id="pMsg"></div>`);
 if(act==="pinGo"){(async()=>{const m=$("pMsg"),p1=$("pin1").value,p2=$("pin2").value;m.classList.add("bad");
  if(!/^\d{4,6}$/.test(p1)){m.textContent=L("من ٤ إلى ٦ أرقام","4 to 6 digits");return}if(p1!==p2){m.textContent=L("الرقمين مو متطابقين","The two don't match");return}
  m.classList.remove("bad");m.textContent=L("لحظة…","One moment…");try{await api("app-pin",{token:S.tok,pin:p1});S.me.hasPin=true;closeSheet();render();toast(L("انحفظ رقمك السري، ادخل فيه من الحين","PIN saved — use it to sign in from now on"))}catch(er){m.classList.add("bad");m.textContent=er.message}})()}
 if(act==="logout")logout();
});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeSheet()});

/* ===== رمز القماش: /app/#fab-2 ===== */
function hashRoute(){const m=location.hash.match(/^#fab-(\d+)$/);if(m){S.tab="fabric";render();const f=FAB()[+m[1]];if(f)setTimeout(()=>sheet(fabStory(f)),300)}}
window.addEventListener("hashchange",hashRoute);

/* ===== التشغيل ===== */
(async()=>{
 const cached=LS.get("elg_me");if(S.tok&&cached){try{S.me=JSON.parse(cached)}catch(e){}}
 applyLang();
 fetch("../content.json",{cache:"no-store"}).then(r=>r.json()).then(j=>{if(!j)return;
   if(j.whatsapp)SOC.whatsapp=String(j.whatsapp).replace(/\D/g,"")||SOC.whatsapp;
   ["instagram","tiktok","snapchat"].forEach(k=>{if(httpsOk(j[k]))SOC[k]=j[k]});
   if(j.fabrics)FAB_AR_T=j.fabrics;if(j.journey){const s=lines(j.journey).map(r=>r[0]);if(s.length>=6)STG_AR_T=s.slice(0,6)}
   render();hashRoute()}).catch(()=>hashRoute());
 api("seats").then(s=>{S.seats=s;if(S.tab==="home")render()}).catch(()=>{});
 await loadMe();render();
 if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
})();
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&S.tok)loadMe().then(render)});
}
