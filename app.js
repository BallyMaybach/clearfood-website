// Site behaviour shared by every page: menu, FAQ, the scroll-driven scan.
// The Android waitlist lives in waitlist.js.

// Scroll drives the scan: the frame fades in, the ring and the goal bars fill.
const stage=document.querySelector('.food-showcase');
if(stage){
  let scrollFrame=false;
  const updateScroll=()=>{
    const position=stage.getBoundingClientRect().top;
    // Desktop: the stage is sticky, so count from where it pins. Phones: it
    // scrolls normally, so fill while it moves from 50 % to 0 % of the screen.
    const phone=innerWidth<=760;
    const amount=Math.max(0,Math.min(1,phone?(innerHeight*.5-position)/(innerHeight*.5):(280-position)/330));
    stage.style.setProperty('--reveal',amount.toFixed(3));
    stage.style.setProperty('--shrink',(1-amount*.14).toFixed(3));
    stage.style.setProperty('--scan-progress',amount.toFixed(3));
    scrollFrame=false;
  };
  const queueScroll=()=>{if(!scrollFrame){scrollFrame=true;requestAnimationFrame(updateScroll);}};
  addEventListener('scroll',queueScroll,{passive:true});addEventListener('resize',queueScroll);updateScroll();
}

const menuButton=document.querySelector('.menu-toggle');
const mobileMenu=document.querySelector('#mobile-menu');
if(menuButton&&mobileMenu){
  const closeMenu=()=>{mobileMenu.hidden=true;menuButton.setAttribute('aria-expanded','false');};
  menuButton.addEventListener('click',()=>{const opening=mobileMenu.hidden;mobileMenu.hidden=!opening;menuButton.setAttribute('aria-expanded',String(opening));});
  mobileMenu.querySelectorAll('a,button').forEach(element=>element.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!mobileMenu.hidden){closeMenu();menuButton.focus();}});
  document.addEventListener('click',event=>{if(!event.target.closest('.nav-wrap'))closeMenu();});
  matchMedia('(min-width: 761px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
}

const faqItems=document.querySelectorAll('.faq-list details');
faqItems.forEach(item=>item.addEventListener('toggle',()=>{if(item.open)faqItems.forEach(other=>{if(other!==item)other.open=false;});}));
