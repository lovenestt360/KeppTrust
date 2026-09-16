/* KeppTrust floating navigation, adapted from the supplied Framer Motion reference. */
(()=>{
  'use strict';
  const shell=document.querySelector('.floating-nav-shell');
  const bar=shell?.querySelector('.floating-nav');
  const links=shell?.querySelector('.floating-links');
  const brand=shell?.querySelector('.floating-wordmark');
  const trigger=shell?.querySelector('.nav-expand');
  if(!shell||!bar||!links||!brand||!trigger)return;

  const threshold=80;
  let expanded=true,lastY=scrollY,collapseY=scrollY,frame=0;

  function setExpanded(next){
    if(expanded===next)return;
    expanded=next;
    bar.classList.toggle('is-collapsed',!next);
    bar.dataset.expanded=String(next);
    trigger.setAttribute('aria-expanded',String(next));
    trigger.setAttribute('aria-hidden',String(next));
    trigger.tabIndex=next?-1:0;
    links.inert=!next;
    brand.tabIndex=next?0:-1;
  }

  function update(){
    frame=0;
    const y=Math.max(0,scrollY),delta=y-lastY;
    if(expanded&&delta>1&&y>150&&!shell.matches(':focus-within')){
      collapseY=y;
      setExpanded(false);
    }else if(!expanded&&delta<-1&&collapseY-y>threshold){
      setExpanded(true);
    }
    lastY=y;
  }

  addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(update)},{passive:true});
  trigger.addEventListener('click',()=>setExpanded(true));
  trigger.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setExpanded(true);brand.focus({preventScroll:true})}});
  document.addEventListener('kepp-route-start',()=>shell.classList.remove('nav-visible'));
  const show=()=>shell.classList.add('nav-visible');
  if(window.keppPageReady)show();else document.addEventListener('kepp-page-ready',show,{once:true});
  setTimeout(show,2500);
  addEventListener('pageshow',(event)=>{
    lastY=scrollY;
    collapseY=scrollY;
    setExpanded(true);
    if(event.persisted) show();
  });
})();
