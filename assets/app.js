'use strict';
document.documentElement.classList.add('js');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const header=document.querySelector('.site-header'),back=document.querySelector('.back-top');
let ticking=false;
function scrollState(){header.classList.toggle('compact',scrollY>45);back.classList.toggle('shown',scrollY>650);ticking=false;}
addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(scrollState);ticking=true;}},{passive:true});scrollState();
back.addEventListener('click',()=>window.scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'}));
const menuButton=document.querySelector('.menu-toggle'),menu=document.querySelector('.mobile-nav');
function closeMenu(){menu.classList.remove('open');document.body.classList.remove('menu-open');menuButton.setAttribute('aria-expanded','false');menuButton.textContent='Menu ☰';}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menu.classList.toggle('open',open);document.body.classList.toggle('menu-open',open);menuButton.textContent=open?'Close ×':'Menu ☰';});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();menuButton.focus();}if(e.key==='Tab'&&menu.classList.contains('open')){const last=menu.querySelector('a:last-child');if(e.shiftKey&&document.activeElement===menuButton){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();menuButton.focus();}}});
window.matchMedia('(min-width:761px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}});},{threshold:.08});document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=`${(i%3)*70}ms`;observer.observe(el);});}else{document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));}
const heroVideo=document.querySelector('#hero-video');
const heroPause=document.querySelector('#pause-video'),motionButtons=[...document.querySelectorAll('.motion-setting')];
let paused=reduced.matches;
function updateMotionUI(){
 document.body.classList.toggle('motion-paused',paused);
 if(heroPause){heroPause.textContent=paused?'▷':'Ⅱ';heroPause.setAttribute('aria-label',paused?'Play hero video':'Pause hero video');heroPause.setAttribute('aria-pressed',String(paused));}
 motionButtons.forEach(b=>{b.textContent=paused?'Resume motion':'Pause motion';b.setAttribute('aria-pressed',String(paused));});
}
function syncVideo(){
 if(!heroVideo)return;
 if(paused||document.hidden){heroVideo.pause();return;}
 if(!heroVideo.getAttribute('src')){heroVideo.src=heroVideo.dataset.src;heroVideo.muted=true;heroVideo.load();}
 const playing=heroVideo.play();
 if(playing)playing.catch(error=>{if(error.name==='AbortError'||document.hidden||paused)return;paused=true;updateMotionUI();});
}
function motionState(value){paused=value;updateMotionUI();syncVideo();}
if(heroVideo){
 heroVideo.addEventListener('playing',()=>heroVideo.classList.add('ready'));
 heroVideo.addEventListener('error',()=>{heroVideo.classList.remove('ready');paused=true;updateMotionUI();if(heroPause){heroPause.disabled=true;heroPause.setAttribute('aria-label','Video unavailable');heroPause.textContent='—';}});
 heroPause.addEventListener('click',()=>motionState(!paused));
}
motionButtons.forEach(b=>b.addEventListener('click',()=>motionState(!paused)));
reduced.addEventListener('change',e=>motionState(e.matches));
document.addEventListener('visibilitychange',syncVideo);
motionState(paused);
const search=document.querySelector('#truck-search'),type=document.querySelector('#truck-type'),filterButtons=[...document.querySelectorAll('[data-filter]')];
if(search){const cards=[...document.querySelectorAll('.inventory-cards .truck-card')];function applyFilters(){const query=search.value.trim().toLowerCase();let count=0;cards.forEach(card=>{const match=(type.value==='all'||card.dataset.type===type.value)&&card.textContent.toLowerCase().includes(query);card.hidden=!match;if(match){count++;card.classList.add('visible');}});document.querySelector('#result-count').textContent=`${count} showcase vehicle${count===1?'':'s'}`;document.querySelector('#empty-state').hidden=count>0;filterButtons.forEach(b=>{const active=b.dataset.filter===type.value;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});}search.addEventListener('input',applyFilters);type.addEventListener('change',applyFilters);filterButtons.forEach(b=>b.addEventListener('click',()=>{type.value=b.dataset.filter;applyFilters();}));document.querySelector('#inventory-form').addEventListener('submit',e=>{e.preventDefault();applyFilters();});document.querySelector('#reset-filters').addEventListener('click',()=>{search.value='';type.value='all';applyFilters();search.focus();});}
const config=window.TRUCK_HUB_CONTACT||{};
document.querySelectorAll('[data-contact]').forEach(el=>{const key=el.dataset.contact,value=config[key];if(!value)return;if(key==='phone'||key==='email'){const a=document.createElement('a');a.textContent=value;a.href=key==='phone'?'tel:'+value.replace(/[^+\d]/g,''):'mailto:'+value;el.replaceChildren(a);}else el.textContent=value;});
const interest=new URLSearchParams(location.search).get('interest');const labels={sleeper:'Highway sleeper',tractor:'Heavy-duty tractor'};const interestNote=document.querySelector('#interest-note');if(interestNote&&labels[interest]){interestNote.hidden=false;interestNote.textContent=`Your interest: ${labels[interest]}. Contact details are coming soon; no enquiry has been sent.`;}
