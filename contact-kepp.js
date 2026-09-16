(()=>{
const form=document.querySelector('#brief-form');if(!form)return;
const progress=document.querySelector('.brief-progress'),bar=progress.querySelector('progress'),label=document.querySelector('#brief-progress-label');
progress.hidden=false;
function update(){const fields=[form.elements.name,form.elements.email,form.elements.message];const filled=fields.filter(el=>el.value.trim()&&el.validity.valid).length;bar.value=filled;label.textContent=`${filled} de 3 campos obrigatórios preenchidos`;}
form.addEventListener('input',update);update();
const reduced=()=>document.documentElement.dataset.motion==='reduced'||(document.documentElement.dataset.motion!=='full'&&matchMedia('(prefers-reduced-motion: reduce)').matches);
const observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{if(!isIntersecting)return;observer.unobserve(target);if(!reduced())target.animate([{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.16,1,.3,1)'});}),{threshold:.1});
let started=false;const hero=document.querySelector('.contact-opening');
async function start(){
 if(started)return;started=true;
 document.querySelectorAll('.brief-heading,.contact-note-card,.form-row,.form-services').forEach(el=>observer.observe(el));
 const heading=hero.querySelector('h1');
 if(reduced()){hero.classList.add('hero-light');return;}
 heading.setAttribute('aria-label','A tua próxima fase começa numa conversa.');
 const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 nodes.forEach(node=>{const fragment=document.createDocumentFragment();node.textContent.split(/(\s+)/).forEach(word=>{if(!word.trim()){fragment.append(document.createTextNode(word));return;}const span=document.createElement('span');span.className='assemble-word';span.setAttribute('aria-hidden','true');span.textContent=word;fragment.append(span);});node.replaceWith(fragment);});
 const animations=[...heading.querySelectorAll('.assemble-word')].map((word,i)=>word.animate([{opacity:0,transform:`translate3d(${i%2?14:-14}px,46px,0) rotate(${i%2?2:-2}deg)`},{opacity:1,transform:'translate3d(0,0,0) rotate(0)'}],{duration:1500,delay:250+i*210,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'}));
 await Promise.allSettled(animations.map(a=>a.finished));
 if(reduced()){hero.classList.add('hero-light');return;}
 hero.classList.add('hero-revealing');
 const wash=document.createElement('div');wash.className='contact-gradient-wash';wash.setAttribute('aria-hidden','true');hero.prepend(wash);
 await wash.animate([{transform:'translateX(-100%)'},{transform:'translateX(0)'}],{duration:3800,delay:450,easing:'cubic-bezier(.45,0,.2,1)',fill:'both'}).finished.catch(()=>{});
 hero.classList.add('hero-light');hero.classList.remove('hero-revealing');wash.remove();
}
let frame=0;function curve(){frame=0;const rect=hero.getBoundingClientRect();const amount=Math.max(0,Math.min(1,(innerHeight-rect.bottom)/innerHeight));hero.style.setProperty('--exit-curve',(reduced()?0:Math.sin(amount*Math.PI)*70)+'px');}
addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(curve)},{passive:true});
document.addEventListener('kepp-motion-change',()=>{if(reduced())hero.classList.add('hero-light');curve();});
if(window.keppPageReady)start();else document.addEventListener('kepp-page-ready',start,{once:true});
})();
