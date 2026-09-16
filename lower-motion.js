'use strict';
(()=>{
 const offer=document.querySelector('.offer-film'),method=document.querySelector('.method-film');if(!offer||!method)return;
 const scenes=[...offer.querySelectorAll('.offer-scene')],buttons=[...offer.querySelectorAll('.offer-nav button')],steps=[...method.querySelectorAll('details')],cursor=offer.querySelector('.offer-cursor'),methodWords=[...method.querySelectorAll('.method-atmosphere span')];
 const outputs=['O teu ponto de partida.','Uma direção aprovada.','A ideia ganha forma.','Pronto para entrar em ação.'];
 const clamp=v=>Math.min(1,Math.max(0,v)),ease=v=>{v=clamp(v);return v*v*(3-2*v)};
 let raf=0,last=0,active=-1,op=0,mp=0,ot=0,mt=0,manual=false; const naturalProgress=scenes.map(()=>0);
 const reduced=()=>typeof prefersReducedMotion==='function'&&prefersReducedMotion();
 const enabled=()=>!reduced()&&innerHeight>760;
 function progress(el){const r=el.getBoundingClientRect();return clamp(-r.top/Math.max(1,el.offsetHeight-innerHeight))}
 function setStep(i){if(i===active)return;active=i;steps.forEach((s,n)=>s.open=n===i);method.querySelector('.method-number').textContent='0'+(i+1);method.querySelector('.method-output').textContent=outputs[i]}
 function paint(t){
  raf=0;const dt=Math.min(50,t-(last||t-16));last=t;
  const on=enabled();op+=(ot-op)*(1-Math.exp(-dt/140));mp+=(mt-mp)*(1-Math.exp(-dt/140));
  const sceneIndex=Math.min(2,Math.floor(op*3));offer.dataset.active=sceneIndex;
  scenes.forEach((s,i)=>{
   const local=op*3-i,enter=i===0?1:ease((local+.3)/.42),leave=i===2?0:ease((local-.72)/.38),alpha=on?enter*(1-leave):1;
   s.style.opacity=alpha;s.style.visibility=alpha<.005?'hidden':'visible';s.inert=alpha<.5;
   s.style.transform=on?'translate3d(0,'+((1-enter)*55-leave*45)+'px,0)':'none';
   const atmosphere=s.querySelector('.offer-atmosphere'),image=atmosphere&&atmosphere.querySelector('img'),word=atmosphere&&atmosphere.querySelector('strong');
   if(atmosphere){atmosphere.style.opacity=on?Math.min(1,alpha*1.35):1;atmosphere.style.transform=on?'translate3d('+((1-enter)*7-leave*5)+'%,0,0) scale('+(1.035-alpha*.035)+')':'none'}
   if(image)image.style.transform=on?'translate3d('+(local*2.5)+'%,0,0) scale('+(1.13-alpha*.05)+')':'scale(1.08)';
   if(word)word.style.transform=on?'translate3d('+((1-enter)*16-leave*10)+'%,0,0)':'none';
   const natural=naturalProgress[i];
   s.querySelectorAll('[data-piece]').forEach((piece,n)=>{const a=reduced()?1:on?ease((local+.12-n*.055)/.35):ease((natural-n*.05)/.65);piece.style.opacity=a;piece.style.transform='translate3d('+((1-a)*(n%2?22:-22))+'px,'+((1-a)*30)+'px,0) rotate('+((1-a)*0)+'deg)'});
  });
  buttons.forEach((b,i)=>b.setAttribute('aria-current',String(i===sceneIndex)));
  if(on&&!manual&&!method.classList.contains('method-carousel'))setStep(Math.min(3,Math.floor(mp*4)));
  methodWords.forEach((word,i)=>{const d=Math.abs(mp*4-(i+.5)),a=on?clamp(1-d):i===active?1:.12;word.style.opacity=a*.9;word.style.transform=on?'translate3d('+((i%2?-1:1)*(1-a)*15)+'%,0,0) scale('+(1.05-a*.05)+')':'none'});
  if(!method.classList.contains('method-carousel'))method.querySelector('.method-thread i').style.transform='scaleX('+(on?mp:(active+1)/4)+')';
  if(Math.abs(op-ot)>.0001||Math.abs(mp-mt)>.0001)raf=requestAnimationFrame(paint);else last=0;
 }
 function update(){ot=progress(offer);mt=progress(method);scenes.forEach((s,i)=>naturalProgress[i]=clamp((innerHeight-s.getBoundingClientRect().top)/(innerHeight*.65)));if(!raf)raf=requestAnimationFrame(paint)}
 function configure(){const on=enabled();offer.classList.toggle('offer-ready',on&&!offer.classList.contains('services-premium'));method.classList.toggle('method-ready',on&&!method.classList.contains('method-carousel'));if(!on){steps.forEach(s=>s.open=true);active=-1}update()}
 buttons.forEach((b,i)=>b.addEventListener('click',()=>{if(enabled())scrollTo({top:scrollY+offer.getBoundingClientRect().top+(offer.offsetHeight-innerHeight)*(i+.35)/3,behavior:'smooth'});else scenes[i].scrollIntoView({behavior:reduced()?'instant':'smooth',block:'start'})}));
 steps.forEach((s,i)=>s.querySelector('summary').addEventListener('click',e=>{if(enabled()){e.preventDefault();manual=true;setStep(i);update()}}));
 offer.querySelectorAll('.offer-art').forEach(a=>{a.addEventListener('pointermove',e=>{if(!reduced()){const r=a.getBoundingClientRect();a.style.setProperty('--tilt',((e.clientX-r.left)/r.width-.5)*8+'deg')}},{passive:true});['pointerleave','pointerup','pointercancel'].forEach(event=>a.addEventListener(event,()=>a.style.setProperty('--tilt','0deg')))});
 offer.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'&&cursor){cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';cursor.classList.add('is-visible')}},{passive:true});
 offer.addEventListener('pointerleave',()=>cursor&&cursor.classList.remove('is-visible'));
 offer.addEventListener('pointerdown',e=>{offer.style.setProperty('--touch-x',e.clientX+'px');offer.style.setProperty('--touch-y',e.clientY+'px');offer.classList.remove('is-touched');void offer.offsetWidth;offer.classList.add('is-touched');setTimeout(()=>offer.classList.remove('is-touched'),720)},{passive:true});
 const ending=document.querySelector('.concept-end');if(ending)ending.addEventListener('pointermove',e=>{const r=ending.getBoundingClientRect();ending.style.setProperty('--end-x',((e.clientX-r.left)/r.width*100)+'%');ending.style.setProperty('--end-y',((e.clientY-r.top)/r.height*100)+'%')},{passive:true});
 addEventListener('scroll',()=>{manual=false;update()},{passive:true});addEventListener('resize',configure);document.addEventListener('kepp-motion-change',configure);matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',configure);configure();
})();

// Service chapters remain native, keyboard-operable disclosures on every screen.
(()=>{
 const chapters=[...document.querySelectorAll('.services-premium .service-chapter')];if(!chapters.length)return;
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12});
 chapters.forEach(chapter=>{chapter.dataset.reveal='';observer.observe(chapter)});
})();
