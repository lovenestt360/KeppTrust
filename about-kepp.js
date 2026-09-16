(()=>{
 'use strict';
 const reduced=()=>document.documentElement.dataset.motion==='reduced'||(document.documentElement.dataset.motion!=='full'&&matchMedia('(prefers-reduced-motion: reduce)').matches);
 const targets=document.querySelectorAll('.kepp-intro h1>span,.intro-rule,.belief-grid>*,.worktable-title,.process-ribbon,.offer-list article,.method-grid>div:first-child');
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   observer.unobserve(entry.target);
   if(!reduced())entry.target.animate([{opacity:0,transform:'translateY(28px)'},{opacity:1,transform:'translateY(0)'}],{duration:850,easing:'cubic-bezier(.16,1,.3,1)'});
 }),{threshold:.12});
 const start=()=>targets.forEach(el=>observer.observe(el));
 if(window.keppPageReady)start();else document.addEventListener('kepp-page-ready',start,{once:true});
 const details=[...document.querySelectorAll('.kepp-method details')],counter=document.querySelector('.method-counter');
 details.forEach((item,index)=>item.addEventListener('toggle',()=>{
   if(!item.open)return;
   details.forEach(other=>{if(other!==item)other.open=false});
   counter.innerHTML=`0${index+1}<span>/04</span>`;
   if(!reduced())counter.animate([{opacity:.3,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:300,easing:'ease-out'});
 }));
 const photo=document.querySelector('.kepp-worktable img');let scheduled=false;
 function update(){scheduled=false;if(!photo)return;const r=photo.parentElement.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;photo.style.transform=reduced()?'none':`translateY(${Math.max(-16,Math.min(16,(innerHeight/2-r.top-r.height/2)*.035))}px) scale(1.06)`;}
 addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update)}},{passive:true});
 document.addEventListener('kepp-motion-change',update);
})();
