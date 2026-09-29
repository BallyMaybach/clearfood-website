const waitlist = document.querySelector('#waitlist');
document.querySelectorAll('[data-waitlist]').forEach(button=>button.addEventListener('click',openWaitlist));
document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
for(const dialog of [waitlist])dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();});
// Android waitlist — real sign-ups in Supabase (public.android_waitlist).
// The table is closed to the public; the only way in is the
// join_android_waitlist RPC, which validates, dedupes and rate-limits.
// The anon key is public by design (the iOS app ships the same one).
const SB_URL='https://zuvthbyvsjyhklpfoibq.supabase.co';
const SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1dnRoYnl2c2p5aGtscGZvaWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNjU4MTMsImV4cCI6MjA5Njc0MTgxM30._wyh9tBM162dKznibckeq1R6HjbglCM2op62sxLG5h0';
const WL_STORE='cf_waitlist';
const WL_CONSENT='Email me when Clear Food launches on Android.';
const isAndroid=/Android/i.test(navigator.userAgent);
const wlBody=document.querySelector('#waitlist-body');
const originalWaitlist=wlBody.innerHTML;
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
function store(key,value){try{value===undefined?localStorage.getItem(key):value===null?localStorage.removeItem(key):localStorage.setItem(key,value);return localStorage.getItem(key);}catch{return null;}}
function session(key,value){try{if(value)sessionStorage.setItem(key,value);return sessionStorage.getItem(key);}catch{return null;}}
async function rpc(name,body){
  const res=await fetch(`${SB_URL}/rest/v1/rpc/${name}`,{method:'POST',headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
  const data=await res.json().catch(()=>null);
  if(!res.ok)throw new Error((data&&data.message)||'failed');
  return data;
}
// Invite links look like clearfood.app/?w=CODE — remember who sent this visitor.
const invitedBy=new URLSearchParams(location.search).get('w');
if(invitedBy&&/^[A-Za-z0-9]{4,16}$/.test(invitedBy))session('cf_wl_by',invitedBy);

function readSaved(){try{return JSON.parse(store(WL_STORE))||null;}catch{return null;}}
function showJoined(info){
  const link=`${location.origin}/?w=${encodeURIComponent(info.code)}`;
  const place=Number(info.position).toLocaleString('en-US');
  wlBody.innerHTML=`<p class="wl-kicker">YOUR SPOT</p><h2 id="waitlist-title" tabindex="-1">${info.already?'You’re already in.':'You’re on the list.'}</h2><div class="wl-place"><span>#</span>${place}</div><p id="waitlist-description">${info.email?`We’ll email <strong>${esc(info.email)}</strong>`:'We’ll email you'} the day Clear Food lands on Google Play. Your perk: <strong>1 month free.</strong></p><div class="wl-share"><strong>Bring a friend</strong><p>They get 1 month free too.${info.invited>0?` <span class="wl-invited">${info.invited} joined through you.</span>`:''}</p><div class="wl-link"><input readonly value="${esc(link)}" aria-label="Your invite link"><button type="button" id="wl-copy">Copy</button></div>${navigator.share?'<button type="button" class="wl-native" id="wl-share">Share invite link ↗</button>':''}</div><button class="waitlist-submit" id="waitlist-done">Done <span aria-hidden="true">✓</span></button><button type="button" class="wl-reset" id="wl-reset">Not you? Use another email</button>`;
  const copy=document.querySelector('#wl-copy');
  copy.addEventListener('click',async()=>{const input=wlBody.querySelector('.wl-link input');try{await navigator.clipboard.writeText(link);}catch{input.select();document.execCommand('copy');}copy.textContent='Copied ✓';setTimeout(()=>{copy.textContent='Copy';},1800);});
  document.querySelector('#wl-share')?.addEventListener('click',()=>navigator.share({title:'Clear Food for Android',text:'Clear Food is coming to Android. Join the waitlist and we both get 1 month free:',url:link}).catch(()=>{}));
  document.querySelector('#waitlist-done').addEventListener('click',()=>waitlist.close());
  document.querySelector('#wl-reset').addEventListener('click',()=>{store(WL_STORE,null);showForm();document.querySelector('#email').focus();});
}
function showForm(){
  wlBody.innerHTML=originalWaitlist;
  const form=document.querySelector('#waitlist-form');
  const status=document.querySelector('#waitlist-status');
  const submit=form.querySelector('.waitlist-submit');
  rpc('android_waitlist_size',{}).then(n=>{if(n>=50)document.querySelector('#waitlist-description').insertAdjacentHTML('beforeend',` Join ${Number(n).toLocaleString('en-US')} others.`);}).catch(()=>{});
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    if(!form.reportValidity()||submit.disabled)return;
    const email=form.email.value.trim().toLowerCase();
    if(form.company.value){showJoined({position:1,code:'',email,invited:0});return;} // honeypot: bots see success, nothing is saved
    submit.disabled=true;submit.innerHTML='Saving your spot…';status.textContent='';
    try{
      const info=await rpc('join_android_waitlist',{p_email:email,p_consent:form.consent.checked,p_consent_text:WL_CONSENT,p_referred_by:session('cf_wl_by'),p_landing_ref:window.__CF_REF||null,p_goals:[],p_locale:navigator.language||null,p_user_agent:navigator.userAgent});
      store(WL_STORE,JSON.stringify({code:info.code,email}));
      showJoined({...info,email});
      document.querySelector('#waitlist-title').focus({preventScroll:true});
    }catch(error){
      status.textContent={invalid_email:'That email doesn’t look right. Check it and try again.',consent_required:'Tick the box so we’re allowed to email you at launch.',rate_limited:'Too many sign-ups from this network. Try again in an hour.'}[error.message]||'Something went wrong. Check your connection and try again.';
      submit.disabled=false;submit.innerHTML='Save my spot <span aria-hidden="true">→</span>';
    }
  });
}
function openWaitlist(){
  const saved=readSaved();
  if(saved&&saved.code){
    showJoined({position:'…',code:saved.code,email:saved.email,invited:0});
    rpc('android_waitlist_status',{p_code:saved.code}).then(info=>{if(info)showJoined({...info,email:saved.email,already:true});else{store(WL_STORE,null);showForm();}}).catch(()=>{});
  }else showForm();
  if(!waitlist.open)waitlist.showModal();
}

// Android visitors can't use the App Store — every "Get the app" opens the waitlist instead.
if(isAndroid){
  document.documentElement.classList.add('is-android');
  document.querySelector('.nav-cta').textContent='Join the waitlist';
  const heroAndroid=document.querySelector('.store-actions .android');
  heroAndroid.classList.add('ios');heroAndroid.querySelector('span').innerHTML='<small>COMING SOON</small>Join the Android waitlist';
  document.addEventListener('click',event=>{const link=event.target.closest&&event.target.closest('a[href*="apps.apple.com"]');if(!link)return;event.preventDefault();event.stopImmediatePropagation();openWaitlist();},true);
  if(invitedBy)addEventListener('load',()=>setTimeout(openWaitlist,600));
}

// Scroll drives the scan: the frame fades in, the ring and the goal bars fill.
const stage=document.querySelector('.food-showcase');
let scrollFrame=false;
function updateScroll(){
  const position=stage.getBoundingClientRect().top;
  // Desktop: the stage is sticky, so count from where it pins. Phones: it
  // scrolls normally, so fill while it moves from 50 % to 0 % of the screen.
  const phone=innerWidth<=760;
  const amount=Math.max(0,Math.min(1,phone?(innerHeight*.5-position)/(innerHeight*.5):(280-position)/330));
  stage.style.setProperty('--reveal',amount.toFixed(3));
  stage.style.setProperty('--shrink',(1-amount*.14).toFixed(3));
  stage.style.setProperty('--scan-progress',amount.toFixed(3));
  scrollFrame=false;
}
function queueScroll(){if(!scrollFrame){scrollFrame=true;requestAnimationFrame(updateScroll);}}
addEventListener('scroll',queueScroll,{passive:true});addEventListener('resize',queueScroll);updateScroll();
const menuButton=document.querySelector('.menu-toggle');
const mobileMenu=document.querySelector('#mobile-menu');
function closeMenu(){mobileMenu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open menu');}
menuButton.addEventListener('click',()=>{const opening=mobileMenu.hidden;mobileMenu.hidden=!opening;menuButton.setAttribute('aria-expanded',String(opening));menuButton.setAttribute('aria-label',opening?'Close menu':'Open menu');});
mobileMenu.querySelectorAll('a,button').forEach(element=>element.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!mobileMenu.hidden){closeMenu();menuButton.focus();}});
document.addEventListener('click',event=>{if(!event.target.closest('.nav-wrap'))closeMenu();});
matchMedia('(min-width: 761px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
const faqItems=document.querySelectorAll('.faq-list details');
faqItems.forEach(item=>item.addEventListener('toggle',()=>{if(item.open)faqItems.forEach(other=>{if(other!==item)other.open=false;});}));
document.querySelectorAll('a.brand[href="#"]').forEach(link=>{link.addEventListener('click',event=>{event.preventDefault();window.scrollTo({top:0,behavior:'smooth'});history.replaceState(null,'',location.pathname+location.search);});});

