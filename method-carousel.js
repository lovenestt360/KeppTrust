(()=>{
'use strict';
const root=document.querySelector('.method-carousel');if(!root)return;
const data=[['Descobrir','Primeiro, percebemos o teu negócio.','Ouvimos os teus objetivos, conhecemos o público e identificamos o que precisa de mudar.','Um brief claro.'],['Definir','Uma direção. Todos alinhados.','Alinhamos o posicionamento, a direção criativa e as prioridades antes de começar a produzir.','Uma direção aprovada.'],['Criar','A ideia ganha forma, contigo.','Desenhamos, desenvolvemos e afinamos a solução contigo, com momentos de revisão ao longo do projeto.','Uma solução construída.'],['Lançar','Tudo pronto para entrar em ação.','Testamos, revemos os detalhes e preparamos a entrega para a tua marca se apresentar com confiança.','A tua presença pronta.']];
const tabs=[...root.querySelectorAll('.method-tabs button')],stage=root.querySelector('.method-stage'),number=root.querySelector('.method-number'),title=root.querySelector('.method-message'),prev=root.querySelector('[data-method=prev]'),next=root.querySelector('[data-method=next]');
let index=0,total=0,lastWheel=0,lastChange=0,direction=0;
const reduced=()=>typeof prefersReducedMotion==='function'?prefersReducedMotion():matchMedia('(prefers-reduced-motion: reduce)').matches;
function show(target){target=Math.max(0,Math.min(3,target));if(target===index)return;const dir=target>index?1:-1;index=target;lastChange=performance.now();const d=data[index];
root.getAnimations({subtree:true}).forEach(a=>a.cancel());root.querySelector('.method-badge').textContent='0'+(index+1)+' / '+d[0];number.textContent='0'+(index+1);title.textContent=d[1];title.setAttribute('aria-label',d[1]);root.querySelector('.method-description').textContent=d[2];root.querySelector('.method-output').textContent=d[3];root.querySelector('.method-thread i').style.transform='scaleY('+((index+1)/4)+')';tabs.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));prev.disabled=index===0;next.disabled=index===3;
if(!reduced()){title.replaceChildren(...d[1].split(' ').map((word,i)=>{const span=document.createElement('span');span.textContent=word;span.setAttribute('aria-hidden','true');span.animate([{opacity:0,transform:'translateY('+(dir*22)+'px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,delay:i*35,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});return span;}));number.animate([{opacity:0,translate:'0 '+(dir*35)+'px'},{opacity:1,translate:'0 0'}],{duration:750,easing:'cubic-bezier(.16,1,.3,1)'});root.querySelectorAll('.method-description,.method-result').forEach(el=>el.animate([{opacity:0,transform:'translateY('+(dir*12)+'px)'},{opacity:1,transform:'translateY(0)'}],{duration:550,easing:'ease-out'}));}
root.querySelector('.method-status').textContent='Etapa '+(index+1)+' de 4: '+d[0];}
tabs.forEach((b,i)=>b.addEventListener('click',()=>show(i)));prev.addEventListener('click',()=>show(index-1));next.addEventListener('click',()=>show(index+1));prev.disabled=true;
stage.addEventListener('wheel',e=>{
if(e.ctrlKey||e.metaKey||Math.abs(e.deltaX)>Math.abs(e.deltaY)||!e.deltaY)return;
const dir=Math.sign(e.deltaY),now=performance.now(),gap=now-lastWheel;lastWheel=now;
if((dir<0&&index===0)||(dir>0&&index===3)){total=0;return;}
const rect=stage.getBoundingClientRect();if(rect.top<0||rect.bottom>innerHeight)return;
e.preventDefault();if(now-lastChange<800){total=0;return;}
if(gap>180||direction!==dir)total=0;direction=dir;total+=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);
if(Math.abs(total)>=65){show(index+dir);total=0;}
},{passive:false});
stage.addEventListener('pointerleave',()=>{total=0;direction=0;});
})();
