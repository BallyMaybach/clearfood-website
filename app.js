const onboarding = document.querySelector('#onboarding');
const waitlist = document.querySelector('#waitlist');
const content = document.querySelector('#onboarding-content');
const next = document.querySelector('#onboarding-next');
const back = document.querySelector('#onboarding-back');
const progress = document.querySelector('.progress-track');
const answers = {goals:[],focus:'',habit:''};
let step = 0;
const goals = [
  ['skin','Clearer skin','Explore your food choices with your skin in mind.'],
  ['bloat','Less bloating','Get curious about what you eat and how you feel.'],
  ['muscle','Muscle growth','Take a closer look at protein and macros.'],
  ['body','Body composition','Build awareness of calories and nutrition.'],
];
const questions = [
  {title:'What brings you here?',description:'Choose the goals that matter to you. Pick one or more.',key:'goals',type:'checkbox',options:goals},
  {title:'What would help most?',description:'Let’s start with the thing you’re most curious about.',key:'focus',type:'radio',options:[['insights','Understand my food','See more than a list of ingredients.'],['alternatives','Discover alternatives','Find ideas for my next food choice.'],['macros','Explore calories & macros','Get a clearer picture of my meals.']]},
  {title:'Where are you starting?',description:'No perfect routine needed. Just your everyday reality.',key:'habit',type:'radio',options:[['curious','Just getting curious','A simple first step sounds good.'],['sometimes','I pay attention sometimes','A bit more consistency would help.'],['regular','Already part of my routine','I want more personal insights.']]},
];
function validStep(){return step >= 3 || (step===0 ? answers.goals.length>0 : Boolean(answers[questions[step].key]));}
function renderStep(focusHeading=false){
  const result=step===3;
  progress.setAttribute('aria-valuenow',String(Math.min(step+1,3)));
  document.querySelector('#progress-fill').style.width=`${Math.min(step+1,3)/3*100}%`;
  next.hidden=result;back.hidden=step===0;
  next.textContent=step===2?'See my starting point →':'Continue →';
  next.disabled=!validStep();
  if(result){
    const selected=goals.filter(([id])=>answers.goals.includes(id));
    const suggestions={insights:['Start with a food you know.','Scan a familiar meal and explore its personal food score and goal insights.'],alternatives:['Make room for a new favourite.','Scan a snack you often reach for and explore the suggested alternatives.'],macros:['Get to know your next meal.','Scan a meal and take a closer look at its estimated calories, protein, carbs and fat.']};
    const [heading,text]=suggestions[answers.focus];
    const habitText={curious:'Keep it simple: start with one scan.',sometimes:'Choose one familiar moment in your day to explore a meal.',regular:'Bring your curiosity to the meals already in your routine.'}[answers.habit];
    content.innerHTML=`<div class="result-mark" aria-hidden="true">✓</div><h2 id="onboarding-title" tabindex="-1">Your profile is ready.</h2><p>Your starting point is all about ${selected.map(([,label])=>label.toLowerCase()).join(' and ')}.</p><div class="result-tags">${selected.map(([,label])=>`<span>${label}</span>`).join('')}</div><div class="result-info"><strong>${heading}</strong><p>${text}</p><p style="margin-top:10px">${habitText}</p></div><div class="result-offer"><span class="offer-badge">EARLY BIRD OFFER</span><strong>Save 5% every month</strong><p>Register now and lock in your personal rate.</p></div><div class="result-actions"><a class="store-button ios" href="https://apps.apple.com/de/app/clear-food-glowup-your-skin/id6779364653" target="_blank" rel="noopener">Register now ↗</a><button class="store-button" id="result-android">Android? Join the waitlist →</button></div>`;
    document.querySelector('#result-android').addEventListener('click',()=>{onboarding.close();openWaitlist();});
  }else{
    const q=questions[step];
    content.innerHTML=`<div class="step-label">STEP ${step+1} OF 3 · YOUR FOOD FIT</div><h2 id="onboarding-title" tabindex="-1">${q.title}</h2><p>${q.description}</p><div class="choices" role="group" aria-labelledby="onboarding-title">${q.options.map(([id,label,detail])=>`<label class="choice"><input type="${q.type}" name="${q.key}" value="${id}" ${(q.type==='checkbox'?answers.goals.includes(id):answers[q.key]===id)?'checked':''}><span><strong>${label}</strong><small>${detail}</small></span></label>`).join('')}</div>`;
    content.querySelectorAll('input').forEach(input=>input.addEventListener('change',()=>{answers[q.key]=q.type==='checkbox'?Array.from(content.querySelectorAll('input:checked'),input=>input.value):input.value;next.disabled=!validStep();}));
  }
  if(focusHeading)document.querySelector('#onboarding-title').focus({preventScroll:true});
  onboarding.scrollTop=0;
}
next.addEventListener('click',()=>{if(validStep()&&step<3){step++;renderStep(true);}});
back.addEventListener('click',()=>{if(step>0){step--;renderStep(true);}});
document.querySelectorAll('[data-onboard]').forEach(button=>button.addEventListener('click',()=>{step=0;renderStep();onboarding.showModal();}));
document.querySelectorAll('[data-waitlist]').forEach(button=>button.addEventListener('click',openWaitlist));
document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
for(const dialog of [onboarding,waitlist])dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();});
const originalWaitlist=document.querySelector('#waitlist-body').innerHTML;
function openWaitlist(){
  document.querySelector('#waitlist-body').innerHTML=originalWaitlist;
  const form=document.querySelector('#waitlist-form');
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    document.querySelector('#waitlist-body').innerHTML='<h2 id="waitlist-title" tabindex="-1">You’re on the list.</h2><p id="waitlist-description">Your early-bird perk: <strong>1 month free.</strong></p><button class="waitlist-submit" id="waitlist-done">Done <span aria-hidden="true">✓</span></button><p class="waitlist-demo">Demo confirmation · No registration was made.</p>';
    document.querySelector('#waitlist-done').addEventListener('click',()=>waitlist.close());
    document.querySelector('#waitlist-title').focus({preventScroll:true});
  });
  waitlist.showModal();
}
waitlist.addEventListener('close',()=>{document.querySelector('#waitlist-body').innerHTML=originalWaitlist;});

// UI-only product explorer: no network requests, tracking or persistence.
const foods=[
  {name:'The everyday<br> green bowl.',label:'Avocado & quinoa bowl',score:'92',image:'assets/bowl-cutout.png',alt:'A glass bowl filled with avocado, quinoa, tomatoes and leafy greens',description:'<strong>Food is personal.</strong> Go beyond the ingredients and see how your everyday choices fit your goals.',insight:'YOUR FOOD, DECODED',value:'ONE PHOTO. MORE CLARITY.',copy:'A personal score, goal insights and macros. All in one place.'},
  {name:'Small food.<br> Big picture.',label:'Hard-boiled egg',score:'86',image:'assets/egg-cutout.png',alt:'Two halves of a hard-boiled egg with golden yolks',description:'<strong>Meet the bigger picture.</strong> Explore a familiar food through your personal goals, from muscle growth to everyday nutrition.',insight:'MORE THAN CALORIES',value:'YOUR GOALS COME FIRST.',copy:'Discover food scores, estimated macros and personal goal insights.'}
];
const stage=document.querySelector('.food-showcase');
const foodImage=document.querySelector('#hero-food');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let foodIndex=0;
let foodTimer;
function showFood(index){
  foodIndex=(index+foods.length)%foods.length;
  const food=foods[foodIndex];
  clearTimeout(foodTimer);
  const update=()=>{
    foodImage.src=food.image;foodImage.alt=food.alt;
    document.querySelector('#food-name').innerHTML=food.name;
    document.querySelector('#food-label').textContent=food.label;
    document.querySelector('#food-score').innerHTML=`${food.score}<small>/100</small>`;
    document.querySelector('#food-description').innerHTML=food.description;
    document.querySelector('#insight-title').textContent=food.insight;
    document.querySelector('#insight-value').textContent=food.value;
    document.querySelector('#insight-copy').textContent=food.copy;
    document.querySelector('#food-announcement').textContent=`${food.label}. Illustrative personal score ${food.score} out of 100.`;
    foodImage.classList.remove('changing');
  };
  document.querySelectorAll('[data-food]').forEach(button=>{const active=Number(button.dataset.food)===foodIndex;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
  if(reducedMotion.matches){update();}else{foodImage.classList.add('changing');foodTimer=setTimeout(update,160);}
}
document.querySelector('.previous').addEventListener('click',()=>showFood(foodIndex-1));
document.querySelector('.following').addEventListener('click',()=>showFood(foodIndex+1));
document.querySelectorAll('[data-food]').forEach(button=>button.addEventListener('click',()=>showFood(Number(button.dataset.food))));
stage.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();showFood(foodIndex+(event.key==='ArrowLeft'?-1:1));}});
let touchStart;
stage.addEventListener('pointerdown',event=>{if(event.pointerType==='touch')touchStart={x:event.clientX,y:event.clientY};});
stage.addEventListener('pointerup',event=>{if(!touchStart)return;const dx=event.clientX-touchStart.x,dy=event.clientY-touchStart.y;touchStart=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)showFood(foodIndex+(dx<0?1:-1));});
stage.addEventListener('pointercancel',()=>{touchStart=null;});
document.querySelector('.scan-bars').innerHTML='<i></i>'.repeat(28);
let scrollFrame=false;
function updateScroll(){
  const position=stage.getBoundingClientRect().top;
  const amount=Math.max(0,Math.min(1,(280-position)/330));
  stage.style.setProperty('--reveal',amount.toFixed(3));
  stage.style.setProperty('--shrink',(1-amount*.14).toFixed(3));
  stage.style.setProperty('--scan-progress',amount.toFixed(3));
  scrollFrame=false;
}
function queueScroll(){if(!scrollFrame){scrollFrame=true;requestAnimationFrame(updateScroll);}}
addEventListener('scroll',queueScroll,{passive:true});addEventListener('resize',queueScroll);updateScroll();
// Load the second cutout without delaying the first view.
const secondFood=new Image();secondFood.src=foods[1].image;
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

