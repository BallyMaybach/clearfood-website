// Android waitlist — real sign-ups in Supabase (public.android_waitlist).
// The table is closed to the public; the only way in is the
// join_android_waitlist RPC, which validates, dedupes and rate-limits.
// The anon key is public by design (the iOS app ships the same one).
//
// Two modes, picked by the element: <dialog id="waitlist"> is the popup on
// normal pages, <div id="waitlist"> is the full-screen page at /android.
// The language follows <html lang>; /android sets data-autolang and follows
// the visitor's browser instead, so one link works for everyone.
(function(){
const SB_URL='https://zuvthbyvsjyhklpfoibq.supabase.co';
const SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1dnRoYnl2c2p5aGtscGZvaWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNjU4MTMsImV4cCI6MjA5Njc0MTgxM30._wyh9tBM162dKznibckeq1R6HjbglCM2op62sxLG5h0';
const STORE='cf_waitlist';

const root=document.documentElement;
const lang=root.dataset.autolang!==undefined
  ?((navigator.language||'').toLowerCase().startsWith('de')?'de':'en')
  :(root.lang==='de'?'de':'en');
if(root.dataset.autolang!==undefined){
  root.lang=lang;
  // Static text on /android carries its German version in data-de.
  if(lang==='de'){
    document.querySelectorAll('[data-de]').forEach(el=>{el.textContent=el.dataset.de;});
    if(root.dataset.titleDe)document.title=root.dataset.titleDe;
  }
}

const T={
  en:{
    eyebrow:'ANDROID · COMING SOON',close:'Close',
    title:'Join the waitlist.',lead:'Get <strong>1 month free</strong> when Clear Food launches on Android.',others:n=>` Join ${n} others.`,
    email:'Your email address',consent:'Email me when Clear Food launches on Android.',privacy:'Privacy policy',
    submit:'Save my spot',saving:'Saving your spot…',fine:'One email at launch. No spam. Unsubscribe anytime.',
    kicker:'YOUR SPOT',joined:'You’re on the list.',already:'You’re already in.',
    mailYou:e=>`We’ll email <strong>${e}</strong>`,mailAnon:'We’ll email you',
    rest:' the day Clear Food lands on Google Play. Your perk: <strong>1 month free.</strong>',
    friend:'Bring a friend',friendLead:'They get 1 month free too.',invited:n=>` <span class="wl-invited">${n} joined through you.</span>`,
    linkLabel:'Your invite link',copy:'Copy',copied:'Copied ✓',share:'Share invite link ↗',
    shareTitle:'Clear Food for Android',shareText:'Clear Food is coming to Android. Join the waitlist and we both get 1 month free:',
    done:'Done',reset:'Not you? Use another email',
    err:{invalid_email:'That email doesn’t look right. Check it and try again.',consent_required:'Tick the box so we’re allowed to email you at launch.',rate_limited:'Too many sign-ups from this network. Try again in an hour.'},
    errDefault:'Something went wrong. Check your connection and try again.',
  },
  de:{
    eyebrow:'ANDROID · BALD VERFÜGBAR',close:'Schließen',
    title:'Trag dich ein.',lead:'Du bekommst <strong>1 Monat gratis</strong>, sobald Clear Food für Android erscheint.',others:n=>` ${n} sind schon dabei.`,
    email:'Deine E-Mail-Adresse',consent:'Schreibt mir, wenn Clear Food für Android erscheint.',privacy:'Datenschutz',
    submit:'Platz sichern',saving:'Wird gespeichert…',fine:'Eine E-Mail zum Start. Kein Spam. Jederzeit abmeldbar.',
    kicker:'DEIN PLATZ',joined:'Du bist dabei.',already:'Du bist schon eingetragen.',
    mailYou:e=>`Wir schreiben an <strong>${e}</strong>`,mailAnon:'Wir schreiben dir',
    rest:', sobald Clear Food bei Google Play ist. Dein Bonus: <strong>1 Monat gratis.</strong>',
    friend:'Lade Freunde ein',friendLead:'Sie bekommen auch 1 Monat gratis.',invited:n=>` <span class="wl-invited">${n} über dich dabei.</span>`,
    linkLabel:'Dein Einladungslink',copy:'Kopieren',copied:'Kopiert ✓',share:'Link teilen ↗',
    shareTitle:'Clear Food für Android',shareText:'Clear Food kommt für Android. Trag dich ein, dann bekommen wir beide 1 Monat gratis:',
    done:'Fertig',reset:'Nicht du? Andere E-Mail verwenden',
    err:{invalid_email:'Diese E-Mail-Adresse stimmt nicht. Prüf sie und versuch es nochmal.',consent_required:'Setz den Haken, damit wir dir zum Start schreiben dürfen.',rate_limited:'Zu viele Anmeldungen aus diesem Netz. Versuch es in einer Stunde nochmal.'},
    errDefault:'Das hat nicht geklappt. Prüf deine Verbindung und versuch es nochmal.',
  },
}[lang];
const CONSENT_TEXT=T.consent;
const nf=n=>Number(n).toLocaleString(lang==='de'?'de-DE':'en-US');

const box=document.querySelector('#waitlist');
if(!box)return;
const isPage=box.tagName!=='DIALOG';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
function store(key,value){try{if(value===null)localStorage.removeItem(key);else if(value!==undefined)localStorage.setItem(key,value);return localStorage.getItem(key);}catch{return null;}}
function session(key,value){try{if(value)sessionStorage.setItem(key,value);return sessionStorage.getItem(key);}catch{return null;}}
async function rpc(name,body){
  const res=await fetch(`${SB_URL}/rest/v1/rpc/${name}`,{method:'POST',headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
  const data=await res.json().catch(()=>null);
  if(!res.ok)throw new Error((data&&data.message)||'failed');
  return data;
}
// Invite links look like clearfood.app/android?w=CODE — remember who sent this visitor.
const invitedBy=new URLSearchParams(location.search).get('w');
if(invitedBy&&/^[A-Za-z0-9]{4,16}$/.test(invitedBy))session('cf_wl_by',invitedBy);
const privacyHref='/privacy-policy#waitlist';

box.innerHTML=`<div class="dialog-top"><span class="waitlist-eyebrow">${T.eyebrow}</span>${isPage?'':`<button class="icon-button" data-close aria-label="${T.close}">×</button>`}</div><div id="waitlist-body"></div>`;
box.setAttribute('aria-labelledby','waitlist-title');
const body=box.querySelector('#waitlist-body');
box.querySelector('[data-close]')?.addEventListener('click',()=>box.close());
if(!isPage)box.addEventListener('click',event=>{if(event.target!==box)return;const r=box.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)box.close();});

function readSaved(){try{return JSON.parse(store(STORE))||null;}catch{return null;}}
function showJoined(info){
  const link=`${location.origin}/android?w=${encodeURIComponent(info.code)}`;
  body.innerHTML=`<p class="wl-kicker">${T.kicker}</p><h2 id="waitlist-title" tabindex="-1">${info.already?T.already:T.joined}</h2><div class="wl-place"><span>#</span>${info.position==='…'?'…':nf(info.position)}</div><p id="waitlist-description">${info.email?T.mailYou(esc(info.email)):T.mailAnon}${T.rest}</p><div class="wl-share"><strong>${T.friend}</strong><p>${T.friendLead}${info.invited>0?T.invited(info.invited):''}</p><div class="wl-link"><input readonly value="${esc(link)}" aria-label="${T.linkLabel}"><button type="button" id="wl-copy">${T.copy}</button></div>${navigator.share?`<button type="button" class="wl-native" id="wl-share">${T.share}</button>`:''}</div>${isPage?'':`<button class="waitlist-submit" id="waitlist-done">${T.done} <span aria-hidden="true">✓</span></button>`}<button type="button" class="wl-reset" id="wl-reset">${T.reset}</button>`;
  const copy=body.querySelector('#wl-copy');
  copy.addEventListener('click',async()=>{const input=body.querySelector('.wl-link input');try{await navigator.clipboard.writeText(link);}catch{input.select();document.execCommand('copy');}copy.textContent=T.copied;setTimeout(()=>{copy.textContent=T.copy;},1800);});
  body.querySelector('#wl-share')?.addEventListener('click',()=>navigator.share({title:T.shareTitle,text:T.shareText,url:link}).catch(()=>{}));
  body.querySelector('#waitlist-done')?.addEventListener('click',()=>box.close());
  body.querySelector('#wl-reset').addEventListener('click',()=>{store(STORE,null);showForm();body.querySelector('#email').focus();});
}
function showForm(){
  body.innerHTML=`<h2 id="waitlist-title" tabindex="-1">${T.title}</h2><p id="waitlist-description">${T.lead}</p><form id="waitlist-form" novalidate><label class="sr-only" for="email">${T.email}</label><input id="email" name="email" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" placeholder="${T.email}" required maxlength="254"><input class="honeypot" name="company" tabindex="-1" autocomplete="off" aria-hidden="true"><label class="consent"><input name="consent" type="checkbox" required><span>${T.consent} <a href="${privacyHref}">${T.privacy}</a></span></label><button type="submit" class="waitlist-submit">${T.submit} <span aria-hidden="true">→</span></button><p id="waitlist-status" role="alert" aria-live="assertive"></p></form><p class="waitlist-demo">${T.fine}</p>`;
  const form=body.querySelector('#waitlist-form');
  const status=body.querySelector('#waitlist-status');
  const submit=form.querySelector('.waitlist-submit');
  rpc('android_waitlist_size',{}).then(n=>{if(n>=50)body.querySelector('#waitlist-description')?.insertAdjacentHTML('beforeend',T.others(nf(n)));}).catch(()=>{});
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    if(!form.reportValidity()||submit.disabled)return;
    const email=form.email.value.trim().toLowerCase();
    if(form.company.value){showJoined({position:1,code:'',email,invited:0});return;} // honeypot: bots see success, nothing is saved
    submit.disabled=true;submit.textContent=T.saving;status.textContent='';
    try{
      const info=await rpc('join_android_waitlist',{p_email:email,p_consent:form.consent.checked,p_consent_text:CONSENT_TEXT,p_referred_by:session('cf_wl_by'),p_landing_ref:window.__CF_REF||(isPage?'android':null),p_goals:[],p_locale:navigator.language||null,p_user_agent:navigator.userAgent});
      store(STORE,JSON.stringify({code:info.code,email}));
      showJoined({...info,email});
      body.querySelector('#waitlist-title').focus({preventScroll:true});
    }catch(error){
      status.textContent=T.err[error.message]||T.errDefault;
      submit.disabled=false;submit.innerHTML=`${T.submit} <span aria-hidden="true">→</span>`;
    }
  });
}
function openWaitlist(){
  const saved=readSaved();
  if(saved&&saved.code){
    showJoined({position:'…',code:saved.code,email:saved.email,invited:0});
    rpc('android_waitlist_status',{p_code:saved.code}).then(info=>{if(info)showJoined({...info,email:saved.email,already:true});else{store(STORE,null);showForm();}}).catch(()=>{});
  }else showForm();
  if(!isPage&&!box.open)box.showModal();
}
window.openWaitlist=openWaitlist;
document.querySelectorAll('[data-waitlist]').forEach(button=>button.addEventListener('click',openWaitlist));
if(isPage)openWaitlist();

// Android visitors can't use the App Store — every "Get the app" opens the waitlist instead.
if(!isPage&&/Android/i.test(navigator.userAgent)){
  root.classList.add('is-android');
  const cta=document.querySelector('.nav-cta');if(cta)cta.textContent=lang==='de'?'Warteliste':'Join the waitlist';
  const heroAndroid=document.querySelector('.store-actions .android');
  if(heroAndroid){heroAndroid.classList.add('ios');heroAndroid.querySelector('span').innerHTML=lang==='de'?'<small>BALD VERFÜGBAR</small>Android-Warteliste':'<small>COMING SOON</small>Join the Android waitlist';}
  document.addEventListener('click',event=>{const link=event.target.closest&&event.target.closest('a[href*="apps.apple.com"]');if(!link)return;event.preventDefault();event.stopImmediatePropagation();openWaitlist();},true);
  if(invitedBy)addEventListener('load',()=>setTimeout(openWaitlist,600));
}
})();
