'use strict';
(()=>{
 const root=document.querySelector('.concept-journey');if(!root)return;
 const worlds=[...root.querySelectorAll('.concept-world')],curtain=root.querySelector('.concept-curtain'),name=curtain.querySelector('strong'),label=curtain.querySelector('small');
 const names=['Visão.','Elo.','Raiz.'],sectors=['CONSTRUÇÃO','CLÍNICA','MICROCRÉDITO'];
 // A viewport curtain must sit outside the isolated project stage.
 curtain.classList.add('project-transition-layer');document.body.append(curtain);
 const push=root.querySelector('.engineer-pusher'),walker=root.querySelector('.engineer-walker'),floor=root.querySelector('.engineer-floor'),story=[...root.querySelectorAll('.engineer-story span')];
 const clamp=v=>Math.min(1,Math.max(0,v)),smooth=v=>{v=clamp(v);return v*v*(3-2*v)},phase=(p,a,b)=>smooth((p-a)/(b-a));
 const reduced=()=>typeof prefersReducedMotion==='function'&&prefersReducedMotion();
 let start=0,length=1,target=0,current=0,frame=0,last=0,selected=-1,transition=null,introDone=false,actorScale=1,ready=false,exitProgress=.84;
 // The first build runs by time; its former empty scroll interval is removed.
 const toProgress=raw=>raw<1.8?.84+raw*.96/1.8:raw;
 const completed=new Set(),skip=root.querySelector('.scene-skip'),foundation=root.querySelector('.raiz-foundation');
 const build={started:null,y:0,boost:0,value:0};
 function beginBuild(t){build.started=t;build.y=scrollY;build.boost=0;build.value=0;skip.hidden=false}
 function markComplete(){completed.add(selected);skip.hidden=true}
 const parts=worlds.map(w=>({pin:w.querySelector('.concept-pin'),heading:w.querySelector('.concept-heading'),desktop:w.querySelector('.concept-desktop'),nav:w.querySelector('.concept-nav'),copy:w.querySelector('.concept-screen-copy'),art:w.querySelector('.concept-type-art'),footer:w.querySelector('.concept-screen-footer'),phone:w.querySelector('.concept-phone'),foot:w.querySelector('.concept-foot'),meta:w.querySelector('.concept-meta')}));
 // Align the palm / torso between poses, instead of shifting the whole body at every frame.
 const pushFrames=[[25,0],[294,0],[545,0],[783,0],[1031,0],[21,280],[294,280],[542,280],[786,280],[1031,280]];
 const walkFrames=[[21,565],[293,565],[552,565],[795,565],[1022,565]];
 const spriteLayers=new Map([push,walker].map(el=>{const first=el.firstElementChild,second=first.cloneNode(false);second.setAttribute('aria-hidden','true');el.append(second);return [el,[first,second]]}));
 function sprite(el,frames,distance,pace=el===walker?55:70){const phase=Math.abs(distance)/pace,index=Math.floor(phase),mix=smooth(phase-index),layers=spriteLayers.get(el);layers.forEach((layer,i)=>{const at=frames[(index+i)%frames.length];layer.style.backgroundPosition=`${-at[0]}px ${-at[1]}px`;layer.style.opacity=i?mix:1-mix})}
 function reveal(el,p,y=55,scale=1){el.style.opacity=p;el.style.transform=`translate3d(0,${(1-p)*y}px,0) scale(${scale+(1-scale)*p})`}
 function measure(){start=root.getBoundingClientRect().top+scrollY;length=Math.max(1,root.offsetHeight-innerHeight);actorScale=Math.min(innerWidth<700?180:270,innerHeight*.34)/280;root.style.setProperty('--engineer-scale',actorScale);update()}
 function update(){if(!ready)return;if(build.started!==null&&!completed.has(selected)){build.boost+=Math.max(0,scrollY-build.y)/Math.max(1,innerHeight)*.75;build.y=scrollY}target=toProgress(clamp((scrollY-start)/length)*3.8);if(!frame)frame=requestAnimationFrame(paint)}
 skip.addEventListener('click',()=>{build.value=1;markComplete(performance.now());update()});
 function select(index){selected=index;worlds.forEach((w,i)=>{w.style.visibility=i===index?'visible':'hidden';w.inert=i!==index;w.setAttribute('aria-hidden',String(i!==index))});root.dataset.project=String(index)}
 function begin(index,t){
  build.started=null;build.value=0;skip.hidden=true;
  const entering=!introDone&&index===0;
  transition={index,time:t,switched:false,horizontal:entering||(selected===0&&index===1)||(selected===1&&index===0),from:entering?-1:selected};introDone=true;
  name.replaceChildren(...[...names[index]].map(char=>{const span=document.createElement('span');span.textContent=char;return span}));
  label.textContent=`EXPLORAÇÃO 0${index+1} / ${sectors[index]}`;curtain.style.visibility='visible';
 }
 function paint(t){
  frame=0;if(!ready)return;const dt=Math.min(48,t-(last||t-16));last=t;const r=reduced();current=r?target:current+(target-current)*(1-Math.exp(-dt/160));
  if(scrollY<start-innerHeight*.5){introDone=false;transition=null;build.started=null;skip.hidden=true;curtain.style.visibility='hidden'}
  const exitTarget=completed.has(0)?Math.max(.84,Math.min(1.8,current)):.84;
  const exitDelta=(exitTarget-exitProgress)*(1-Math.exp(-dt/150));
  exitProgress=r?exitTarget:exitProgress+Math.max(-dt*.00055,Math.min(dt*.00055,exitDelta));
  // Small boundary tolerances prevent touchpad bounce from opening opposite curtains.
  const requested=selected===1?(current<1.76?0:current>=2.82?2:1):selected===2?(current<2.76?1:2):(current>=1.8?1:0);
  // A fast wheel/touch gesture may move the document, but never skips a half-built project.
  const canAdvance=completed.has(selected);
  const desired=!introDone?0:selected===0?(canAdvance&&requested>0&&(r||exitProgress>1.795)?1:0):selected===1?(requested<1?0:canAdvance?requested:1):selected===2&&requested<2?1:requested;
  if(selected<0)select(desired);
  const inView=scrollY+1>=start&&scrollY<start+length+innerHeight;
  if(transition&&!inView){transition=null;curtain.style.visibility='hidden';skip.hidden=true}
  if(!transition&&inView&&(!introDone||selected!==desired)){if(r){select(desired);completed.add(desired);introDone=true}else begin(desired,t)}
  if(transition){
   const elapsed=(t-transition.time)/1000;
   if(r||elapsed>2.40){const arrived=transition.index;select(arrived);if(r)completed.add(arrived);if(build.started===null&&!completed.has(arrived))beginBuild(t);transition=null;curtain.style.visibility='hidden';curtain.style.transform='translate3d(0,-120%,0)'}
   else{
    const close=phase(elapsed,0,.60),open=phase(elapsed,1.45,2.33);
    if(transition.horizontal){
     const tx=elapsed<.60?-(1-close)*115:open*115;curtain.style.transform=`translate3d(${tx}%,0,0)`;
     curtain.style.borderRadius=elapsed<.60?`0 ${(1-close)*40}% ${(1-close)*40}% 0 / 0 50% 50% 0`:`${open*40}% 0 0 ${open*40}% / 50% 0 0 50%`;
    }else{
     curtain.style.transform=elapsed<.60?`translate3d(0,${(1-close)*115}%,0)`:`translate3d(0,${-open*115}%,0)`;
     curtain.style.borderRadius=elapsed<.60?`${(1-close)*48}% ${(1-close)*48}% 0 0 / 16% 16% 0 0`:`0 0 ${open*48}% ${open*48}% / 0 0 16% 16%`;
    }
    if(elapsed>=.60&&!transition.switched){select(transition.index);transition.switched=true}
    if(elapsed>=1.7&&build.started===null&&!completed.has(selected))beginBuild(t);
    const fade=1-phase(elapsed,1.42,1.68);name.parentElement.style.opacity='1';name.parentElement.style.transform='none';
    [...name.children].forEach((letter,i)=>{const p=phase(elapsed,.53+i*.047,.92+i*.047);letter.style.opacity=p*fade;letter.style.transform=`translate3d(0,${(1-p)*125-open*25}%,0) rotate(${(1-p)*12}deg)`});label.style.opacity=phase(elapsed,.74,1)*fade;
   }
  }else curtain.style.visibility='hidden';
  const local=selected===0?exitProgress:selected===1?current-1.8:current-2.8;
  const arrivalGate=1;
  if(build.started!==null&&!completed.has(selected)){const goal=clamp((t-build.started)/2800+build.boost);build.value+=(goal-build.value)*(1-Math.exp(-dt/85));if(build.value>.995){build.value=1;markComplete(t)}}
  const autoP=completed.has(selected)||r?1:build.value;
  const p=autoP===null?.35+.65*clamp(local/.82):autoP,a=parts[selected],value=(x,y)=>r?1:phase(p,x,y)*arrivalGate;
  reveal(a.meta,value(.28,.4),15);reveal(a.heading,value(.32,.47),65);reveal(a.desktop,value(.39,.55),110,.82);reveal(a.nav,value(.48,.58),20);reveal(a.copy,value(.53,.66),45);reveal(a.art,value(.56,.71),70);reveal(a.footer,value(.64,.75),20);reveal(a.phone,value(.67,.82),130,.85);reveal(a.foot,value(.77,.86),20);a.foot.inert=p<.77&&!r;
  // Hands arrive at the composition edge before any horizontal displacement.
  const isFirst=selected===0&&!r&&canAdvance,arrival=phase(local,.94,1.06),pushing=phase(local,1.07,1.60),walking=phase(local,1.48,1.80);
  const sceneX=isFirst?-pushing*innerWidth*1.30:0;
  parts[0].pin.style.transform=`translate3d(${sceneX}px,0,0)`;
  parts[0].pin.inert=isFirst&&local>.99;
  const handOffset=30*actorScale,edge=innerWidth*.98;
  const pushX=edge-handOffset+(1-arrival)*innerWidth*.27+sceneX;
  push.style.opacity=isFirst?arrival*(1-phase(local,1.56,1.64)):0;
  push.style.transform=`translate3d(${pushX}px,0,0)`;sprite(push,pushFrames,arrival*90+pushing*innerWidth*1.30);
  let walkX=-250*actorScale+walking*(innerWidth*.65+250*actorScale);
  let walkOpacity=isFirst?phase(local,1.48,1.57):0;
  walker.style.opacity=r?0:walkOpacity;walker.style.transform=`translate3d(${walkX}px,0,0)`;sprite(walker,walkFrames,walkX);
  floor.style.opacity=isFirst?phase(local,.88,1.02)*(1-phase(local,1.72,1.8)):0;floor.style.backgroundPositionX=(-walking*innerWidth*.8)+'px';
  story[0].style.opacity=isFirst?phase(local,1.49,1.55)*(1-phase(local,1.60,1.65)):0;
  story[1].style.opacity=isFirst?phase(local,1.66,1.71)*(1-phase(local,1.77,1.80)):0;
  foundation.style.opacity=selected===2?1:0;
  foundation.style.transform=`scaleX(${selected===2?(r?1:phase(p,0,.35)):0})`;
  if(selected===2&&!r){
   const build=phase(p,.28,.72),phone=phase(p,.58,.87);
   a.desktop.style.opacity=build;a.desktop.style.transform=`perspective(1100px) translate3d(0,${(1-build)*110}px,0) rotateX(${(1-build)*68}deg) scale(${.78+build*.22})`;
   a.phone.style.opacity=phone;a.phone.style.transform=`translate3d(${(1-phone)*-100}px,${(1-phone)*80}px,0) rotate(${(1-phone)*-14}deg)`;
  }
  if(transition||(completed.has(selected)&&!canAdvance)||(build.started!==null&&!completed.has(selected))||Math.abs(exitProgress-exitTarget)>.0001||Math.abs(current-target)>.0001||(inView&&selected!==desired))frame=requestAnimationFrame(paint);else last=0;
 }
 worlds.forEach(w=>{w.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||reduced())return;w.style.setProperty('--cursor-x',((e.clientX/innerWidth-.5)*10)+'px')},{passive:true});w.addEventListener('pointerleave',()=>w.style.setProperty('--cursor-x','0px'))});
 function resume(e){ready=true;measure();current=target;if(e?.detail?.restore&&scrollY>=start){completed.add(0);completed.add(1);completed.add(2);introDone=true;select(current<1.8?0:current<2.8?1:2);exitProgress=Math.max(.84,Math.min(1.8,current));build.started=null}update()}
 function reset(){skip.hidden=true;build.started=null;build.value=0;build.boost=0;exitProgress=.84;transition=null;introDone=false;curtain.style.visibility='hidden';completed.clear();selected=-1;current=target=.84;last=0;}
 document.addEventListener('kepp-home-reset',reset);document.addEventListener('kepp-route-start',()=>{reset();ready=false});document.addEventListener('kepp-page-ready',resume);
 root.classList.add('sequence-ready');addEventListener('scroll',update,{passive:true});addEventListener('resize',measure);addEventListener('load',measure);document.addEventListener('kepp-layout-ready',measure);document.addEventListener('kepp-motion-change',measure);matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',measure);new ResizeObserver(measure).observe(document.querySelector('main'));measure();if(window.keppPageReady)resume({detail:{restore:scrollY>start}});
})();
