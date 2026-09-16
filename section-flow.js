(()=>{'use strict';
const pairs=[['.studio-opening','#f4f5f1'],['.studio-about','#f4f5f1']].map(([selector,color])=>{const section=document.querySelector(selector);if(!section)return null;const edge=document.createElement('div');edge.className='section-flow-edge';edge.setAttribute('aria-hidden','true');edge.style.setProperty('--edge-color',color);section.append(edge);return {section,edge,end:0};}).filter(Boolean);
let frame=0;
const clamp=n=>Math.min(1,Math.max(0,n));
function draw(){frame=0;for(const item of pairs){const top=item.end-scrollY;const depth=clamp(top/innerHeight);item.edge.style.setProperty('--edge-depth',window.keppMotionReduced?.()?0:depth);}}
function update(){if(!frame)frame=requestAnimationFrame(draw);}
function measure(){for(const item of pairs)item.end=item.section.getBoundingClientRect().bottom+scrollY;update();}
addEventListener('scroll',update,{passive:true});addEventListener('resize',measure);addEventListener('load',measure);addEventListener('pageshow',measure);document.addEventListener('kepp-motion-change',measure);new ResizeObserver(measure).observe(document.querySelector('main'));measure();
})();
