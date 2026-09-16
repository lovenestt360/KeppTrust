'use strict';
const menuToggle=document.querySelector('.menu-toggle'),menu=document.querySelector('#menu'),backdrop=document.querySelector('#menu-backdrop');
let menuGeneration=0;
const prefersReducedMotion=()=>window.keppMotionReduced?window.keppMotionReduced():(document.documentElement.dataset.motion==='reduced'||(document.documentElement.dataset.motion!=='full'&&matchMedia('(prefers-reduced-motion: reduce)').matches));
function setMenu(open,restore=false){
  if(!menu||!menuToggle)return;
  const token=++menuGeneration,wasHidden=menu.hidden;
  // Read the in-flight position before cancelling: rapid taps reverse without a jump.
  const from=wasHidden?'translate3d(105%,0,0)':getComputedStyle(menu).transform;
  const shade=backdrop&&!backdrop.hidden?getComputedStyle(backdrop).opacity:'0';
  menu.getAnimations?.().forEach(a=>a.cancel());
  backdrop?.getAnimations?.().forEach(a=>a.cancel());
  menuToggle.setAttribute('aria-expanded',String(open));
  menuToggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
  const main=document.querySelector('main'),nav=document.querySelector('header nav');
  if(open){
    menu.hidden=false;
    if(backdrop)backdrop.hidden=false;
    document.body.classList.add('menu-open');
    if(main)main.inert=true;
    if(nav)nav.inert=true;
  }
  if(!open&&restore)menuToggle.focus({preventScroll:true});
  const to=open?'translate3d(0,0,0)':'translate3d(105%,0,0)';
  menu.style.transform=to;
  if(backdrop)backdrop.style.opacity=open?'1':'0';
  const finish=()=>{
    if(token!==menuGeneration)return;
    menu.getAnimations?.().forEach(a=>a.cancel());
    backdrop?.getAnimations?.().forEach(a=>a.cancel());
    menu.style.willChange='auto';
    if(!open){
      menu.hidden=true;
      if(backdrop)backdrop.hidden=true;
      document.body.classList.remove('menu-open');
      if(main)main.inert=false;
      if(nav)nav.inert=false;
    }else menu.querySelector('a')?.focus({preventScroll:true});
  };
  if(prefersReducedMotion()||!menu.animate||(!open&&wasHidden)){finish();return;}
  menu.style.willChange='transform';
  const options={duration:open?480:380,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'};
  backdrop?.animate?.([{opacity:shade},{opacity:open?1:0}],options);
  menu.animate([{transform:from},{transform:to}],options).finished.then(finish,()=>{});
}

menuToggle?.addEventListener('click',()=>setMenu(menuToggle.getAttribute('aria-expanded')!=='true',true));backdrop?.addEventListener('click',()=>setMenu(false,true));menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',e=>{if(!menu||menu.hidden)return;if(e.key==='Escape')setMenu(false,true);if(e.key==='Tab'){const focusable=[menuToggle,...menu.querySelectorAll('a[href]')],first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
let wasScrolled=false;function syncScroll(){const active=scrollY>300;document.body.classList.toggle('scrolled',active);if(active&&!wasScrolled&&!prefersReducedMotion())menuToggle?.animate?.([{transform:'scale(0)'},{transform:'scale(1)'}],{duration:400,easing:'cubic-bezier(.2,.8,.3,1.25)'});wasScrolled=active}syncScroll();addEventListener('scroll',syncScroll,{passive:true});
const path=location.pathname.replace(/index\.html$/,'').replace(/\/$/,'')||'/';document.querySelectorAll('header nav a,#menu a').forEach(a=>{const link=new URL(a.href).pathname.replace(/\/$/,'')||'/';if(path===link||(link==='/projetos'&&path.startsWith('/projetos/'))){a.classList.add('nav-current');a.setAttribute('aria-current','page')}});
function clock(){const el=document.querySelector('#time');if(el)el.textContent=new Intl.DateTimeFormat('pt-PT',{timeZone:'Africa/Maputo',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date())+' CAT'}clock();setInterval(clock,60000);
const motion=matchMedia('(prefers-reduced-motion: reduce)'),pointer=matchMedia('(hover: hover) and (pointer: fine)');document.querySelectorAll('.magnetic').forEach(el=>{el.addEventListener('pointermove',e=>{if(prefersReducedMotion()||!pointer.matches)return;const r=el.getBoundingClientRect();el.style.setProperty('--mx',((e.clientX-r.left-r.width/2)*.2)+'px');el.style.setProperty('--my',((e.clientY-r.top-r.height/2)*.2)+'px')});el.addEventListener('pointerleave',()=>{el.style.removeProperty('--mx');el.style.removeProperty('--my')})});
document.querySelectorAll('.project').forEach(el=>{el.addEventListener('pointermove',e=>{if(prefersReducedMotion()||!pointer.matches)return;const r=el.getBoundingClientRect(),x=e.clientX-r.left-r.width/2;el.style.setProperty('--px',(x*.28)+'px');el.style.setProperty('--py',((e.clientY-r.top-r.height/2)*.2)+'px');el.style.setProperty('--pr',(x/r.width*9-4.5)+'deg')});el.addEventListener('pointerleave',()=>{el.style.removeProperty('--px');el.style.removeProperty('--py');el.style.removeProperty('--pr')})});
const reveal=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{if(!isIntersecting)return;if(!prefersReducedMotion()){const siblings=[...target.parentElement.children],delay=Math.min(Math.max(0,siblings.indexOf(target))*65,260);target.animate([{opacity:0,transform:'translateY(64px)',clipPath:'inset(0 0 22% 0)'},{opacity:1,transform:'translateY(0)',clipPath:'inset(0 0 0 0)'}],{duration:900,delay,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'})}reveal.unobserve(target)}),{threshold:.1,rootMargin:'0px 0px -6%'});document.querySelectorAll('.section-meta,.about-grid,.work h2,.project,.services h2,.service-grid article,.process h2,.steps details,.case-story,.identity-system,.application-section,.next-project,.footer-heading').forEach(el=>reveal.observe(el));
const form=document.querySelector('#brief-form');form?.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);const services=data.getAll('service').join(', ')||'A definir';const text=`Olá, KeppTrust!\n\nO meu nome é ${String(data.get('name')).trim()}.\nEmail: ${String(data.get('email')).trim()}\nEmpresa: ${String(data.get('company')).trim()||'Não indicada'}\nInteresse: ${services}\n\n${String(data.get('message')).trim()}`;document.querySelector('#brief-text').value=text;document.querySelector('#brief-result').hidden=false;document.querySelector('#brief-text').focus();document.querySelector('#copy-status').textContent='Mensagem preparada. Ainda não foi enviada.'});
document.querySelector('#copy-brief')?.addEventListener('click',async()=>{const field=document.querySelector('#brief-text'),status=document.querySelector('#copy-status');try{await navigator.clipboard.writeText(field.value);status.textContent='Mensagem copiada. Ainda não foi enviada.'}catch{field.focus();field.select();status.textContent='Selecionámos a mensagem. Usa Copiar no teu dispositivo.'}});
addEventListener('pageshow',()=>setMenu(false));

// Filter changes share the reference's short fade and upward return.
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{const selected=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));let shown=0;document.querySelectorAll('[data-category]').forEach(card=>{const visible=selected==='all'||card.dataset.category.split(' ').includes(selected);card.hidden=!visible;if(visible){if(!prefersReducedMotion())card.animate([{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'translateY(0)'}],{duration:400,delay:shown*55,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});shown++}});document.querySelector('#filter-status').textContent=shown+' conceitos apresentados.'}));
// Gentle scroll-linked curvature, using native scrolling on all devices.
let scrollFrame=0;function updateCurves(){scrollFrame=0;const reduce=prefersReducedMotion(),footer=document.querySelector('footer');if(footer){const top=footer.getBoundingClientRect().top,amount=Math.max(0,Math.min(1,top/innerHeight));footer.style.setProperty('--footer-curve-scale',reduce?'0':String(amount));footer.style.setProperty('--footer-reveal', (reduce?0:Math.min(72,innerHeight*.08)*amount)+'px')}const hero=document.querySelector('.hero:not(.hero-story) .hero-art');if(hero)hero.style.translate='0 '+(reduce?0:Math.min(scrollY*.09,72))+'px';document.querySelectorAll('.case-cover').forEach(el=>{const r=el.getBoundingClientRect(),shift=Math.max(-48,Math.min(48,(r.top-innerHeight*.5)*-.055));el.style.setProperty('--case-shift',(reduce?0:shift)+'px')})}addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateCurves)},{passive:true});document.addEventListener('kepp-motion-change',updateCurves);addEventListener('resize',updateCurves);motion.addEventListener('change',updateCurves);updateCurves();

// Native scrolling controls one continuous, eased timeline.
(()=>{
 const section=document.querySelector('.studio-intro');if(!section)return;
 const lines=[...section.querySelectorAll('.studio-statement span')];let frame=0;
 function paint(){frame=0;const reduced=prefersReducedMotion(),top=section.getBoundingClientRect().top;
 section.style.setProperty('--intro-width',String(reduced?1:1+Math.max(0,Math.min(1,top/innerHeight))*.12));
 lines.forEach(line=>line.classList.toggle('is-lit',reduced||line.getBoundingClientRect().top<innerHeight*.78));
 }
 function update(){if(!frame)frame=requestAnimationFrame(paint)}
 addEventListener('scroll',update,{passive:true});addEventListener('resize',update);document.addEventListener('kepp-motion-change',update);motion.addEventListener('change',update);paint();
})();

(()=>{
 const hero=document.querySelector('.hero-film');if(!hero||hero.hasAttribute('data-keeper-hero'))return;
 const pin=hero.querySelector('.film-pin'),heading=hero.querySelector('.film-heading'),identity=hero.querySelector('.film-identity'),browser=hero.querySelector('.film-browser'),campaign=hero.querySelector('.film-campaign'),composition=hero.querySelector('.film-composition'),track=hero.querySelector('.film-track>span'),chapters=[...hero.querySelectorAll('.film-chapters span')];
 const clamp=n=>Math.max(0,Math.min(1,n)),ease=n=>{n=clamp(n);return n*n*(3-2*n)};
 let frame=0,last=0,current=0,target=0,visible=true;
 function paint(){
  const a=ease((current-.1)/.42),b=ease((current-.56)/.34),mobile=innerWidth<=800;
  identity.style.opacity=String(1-a);identity.style.transform=`translate3d(${-a*90}px,${-a*45}px,0) rotate(${-7-a*8}deg) scale(${1-a*.12})`;
  browser.style.opacity=String(a);browser.style.transform=`translate3d(${-b*35}px,${(1-a)*60}px,0) rotate(${(1-a)*7-b*3}deg) scale(${.85+a*.15-b*.09})`;
  campaign.style.opacity=String(b);campaign.style.transform=`translate3d(0,${(1-b)*110}px,0) rotate(${12-b*6}deg)`;
  composition.style.transform=`translate3d(${mobile?-a*innerWidth*.04:-a*innerWidth*.045}px,0,0) scale(${1+a*.08})`;
  heading.style.transform=`translate3d(0,${-a*(mobile?12:24)}px,0)`;
  track.style.transform=`scaleX(${current})`;
  hero.querySelector('.studio-type').style.transform=`translate3d(${a*55}px,${a*35}px,0) rotate(${-12+a*12}deg)`;
  hero.querySelector('.studio-type').style.opacity=String(1-a*.85);
  hero.querySelector('.studio-palette').style.transform=`translate3d(${a*40}px,${-a*30}px,0) rotate(${8-a*8}deg)`;
  hero.querySelector('.studio-palette').style.opacity=String(1-a*.85);
  const phone=hero.querySelector('.studio-mobile');
  phone.style.opacity=String(b);
  phone.style.transform=`translate3d(${-b*35}px,${(1-b)*90}px,0) rotate(${-9+b*3}deg)`;
  const active=current<.32?0:current<.7?1:2;chapters.forEach((el,i)=>el.classList.toggle('is-active',i===active));
 }
 function tick(now){frame=0;const dt=last?Math.min(now-last,50):16;last=now;current+=(target-current)*(1-Math.exp(-dt/95));if(Math.abs(target-current)<.0001)current=target;paint();if(current!==target)frame=requestAnimationFrame(tick);else last=0;}
 function update(){const reduced=prefersReducedMotion();target=reduced?.72:clamp(-hero.getBoundingClientRect().top/Math.max(1,hero.offsetHeight-pin.offsetHeight));if(reduced){cancelAnimationFrame(frame);frame=0;current=target;paint();return}if(visible&&!frame)frame=requestAnimationFrame(tick);}
 addEventListener('scroll',update,{passive:true});addEventListener('resize',update);addEventListener('pageshow',update);document.addEventListener('kepp-motion-change',update);motion.addEventListener('change',update);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)update();else{cancelAnimationFrame(frame);frame=0;last=0}}).observe(hero);update();
})();

// Hero type follows scroll direction and speed, with a seamless, gentle idle drift.
(()=>{
  const hero=document.querySelector('.hero'),track=hero?.querySelector('.marquee');
  if(!track||!track.firstElementChild)return;
  let width=0,visible=true,frame=0,lastTime=0,previousY=scrollY;
  let target=0,position=0,direction=-1;
  const wrap=(x,w)=>((x%w)+w)%w-w;
  function paint(){if(width)track.style.transform=`translate3d(${wrap(position,width)}px,0,0)`;}
  function tick(now){
    frame=0;
    if(!visible||document.hidden||document.body.classList.contains('menu-open')||prefersReducedMotion()){
      lastTime=0;return;
    }
    const dt=lastTime?Math.min((now-lastTime)/1000,.05):1/60;
    lastTime=now;
    target+=direction*24*dt;
    position+=(target-position)*(1-Math.exp(-14*dt));
    paint();frame=requestAnimationFrame(tick);
  }
  function wake(){if(!frame){lastTime=0;frame=requestAnimationFrame(tick);}}
  function measure(){
    width=track.firstElementChild.getBoundingClientRect().width;
    track.classList.add('scroll-marquee');
    paint();wake();
  }
  addEventListener('scroll',()=>{
    const delta=scrollY-previousY;previousY=scrollY;
    if(!visible||prefersReducedMotion()||document.body.classList.contains('menu-open'))return;
    if(Math.abs(delta)>.2){direction=delta>0?-1:1;target-=delta*.85;}
    wake();
  },{passive:true});
  new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting;previousY=scrollY;
    if(visible)wake();
  }).observe(hero);
  new ResizeObserver(measure).observe(track.firstElementChild);
  new MutationObserver(wake).observe(document.body,{attributes:true,attributeFilter:['class']});
  function preference(){
    if(prefersReducedMotion()){
      if(frame)cancelAnimationFrame(frame);frame=0;
      track.style.removeProperty('transform');
    }else {paint();wake();}
  }
  document.addEventListener('kepp-motion-change',preference);
  motion.addEventListener?.('change',preference);
  document.addEventListener('visibilitychange',wake);
  addEventListener('pageshow',()=>{previousY=scrollY;wake();});
  document.fonts?.ready.then(measure);
  measure();
})();
