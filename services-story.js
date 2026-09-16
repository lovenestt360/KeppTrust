(()=>{
 'use strict';
 const root=document.querySelector('.services-journey');if(!root)return;
 const steps=[...root.querySelectorAll('.service-step')],demos=[...root.querySelectorAll('.service-demo')],mobileVisuals=[...root.querySelectorAll('.service-mobile-visual')];
 const counter=root.querySelector('.theatre-count'),caption=root.querySelector('.theatre-caption'),meter=root.querySelector('.theatre-progress i');
 const labels=['Website / computador e telemóvel','Identidade / mensagem e aplicações','Marketing / conteúdo e planeamento'];
 const clamp=v=>Math.max(0,Math.min(1,v)),ease=v=>{v=clamp(v);return v*v*(3-2*v)};
 let raf=0,last=0,value=0,target=0,positions=[],reveals=[0,0,0],mobile=false;
 const reduced=()=>window.keppMotionReduced?.()??matchMedia('(prefers-reduced-motion: reduce)').matches;
 function paint(t){raf=0;const dt=Math.min(48,t-(last||t-16));last=t;const r=reduced();value=r?target:value+(target-value)*(1-Math.exp(-dt/130));
  const base=Math.min(2,Math.floor(value)),fraction=value-base,mix=ease((fraction-.62)/.36),active=mix>.5?Math.min(2,base+1):base;
  demos.forEach((demo,i)=>{const opacity=i===base?1-mix:i===base+1?mix:0;demo.style.opacity=r?(i===active?1:0):opacity;demo.style.visibility=opacity>.001?'visible':'hidden';demo.style.transform=r?'none':`translate3d(${(i>base?1:-1)*(1-opacity)*30}px,0,0) scale(${.94+.06*opacity})`;});
  counter.textContent='0'+(active+1)+' / 03';caption.textContent=labels[active];meter.style.transform=`scaleX(${(value+1)/3})`;
  mobileVisuals.forEach((visual,i)=>{const p=r?1:ease(reveals[i]);visual.style.opacity=mobile?.45+p*.55:1;visual.style.transform=mobile&&!r?`translate3d(0,${(1-p)*22}px,0) scale(${.97+p*.03})`:'none'});
  if(Math.abs(value-target)>.0001)raf=requestAnimationFrame(paint);else last=0;
 }
 function update(){if(!positions.length)return;const line=scrollY+innerHeight*.52;let p=0;
  for(let i=0;i<positions.length;i++){const a=positions[i],next=positions[i+1];if(line>=a.center)p=i+(next?clamp((line-a.center)/(next.center-a.center)):0);reveals[i]=clamp((scrollY+innerHeight*.88-a.visualTop)/(innerHeight*.55));}
  target=Math.max(0,Math.min(2,p));if(!raf)raf=requestAnimationFrame(paint);
 }
 function measure(){mobile=innerWidth<=800;positions=steps.map((step,i)=>{const rect=step.getBoundingClientRect();return{center:scrollY+rect.top+rect.height*.5,visualTop:scrollY+mobileVisuals[i].getBoundingClientRect().top}});update()}
 addEventListener('scroll',update,{passive:true});addEventListener('resize',measure);addEventListener('load',measure);document.addEventListener('kepp-page-positioned',measure);document.addEventListener('kepp-motion-change',measure);document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;last=0}else measure()});new ResizeObserver(measure).observe(root);measure();
})();
