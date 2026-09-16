/* KeppTrust motion choreography, studied from the supplied recording and reference timings. */
(()=>{
'use strict';
const root=document.documentElement,layer=document.querySelector('#page-curtain'),word=document.querySelector('#curtain-word');
if(!layer||!word)return;
// The studio experience opens with full choreography; visitors can still choose reduced motion.
if(!root.dataset.motion)root.dataset.motion='full';
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const reduced=()=>root.dataset.motion==='reduced'||(root.dataset.motion!=='full'&&reduce.matches);
window.keppMotionReduced=reduced;
const animations=new Set();let busy=false,generation=0;
window.keppPageReady=false;
const positionKey='kepp-scroll:'+location.pathname+location.search;
const navigationType=performance.getEntriesByType('navigation')[0]?.type;
let savedPosition=null,restoring=false,positionTimer=0;
try{const n=Number(sessionStorage.getItem(positionKey));if(sessionStorage.getItem(positionKey)!==null&&Number.isFinite(n)&&n>=0)savedPosition=n}catch{}
if((navigationType==='reload'||navigationType==='back_forward')&&savedPosition!==null){history.scrollRestoration='manual';restoring=true}
function rememberPosition(){if(!window.keppPageReady||busy)return;try{sessionStorage.setItem(positionKey,String(scrollY))}catch{}}
addEventListener('scroll',()=>{if(!positionTimer)positionTimer=setTimeout(()=>{positionTimer=0;rememberPosition()},200)},{passive:true});
addEventListener('pagehide',rememberPosition);addEventListener('beforeunload',rememberPosition);
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function animate(el,frames,options){if(!el?.animate)return Promise.resolve();const a=el.animate(frames,options);animations.add(a);return a.finished.catch(()=>{}).finally(()=>animations.delete(a))}
function lock(on){root.classList.toggle('motion-busy',on);layer.hidden=!on;document.querySelector('main')?.setAttribute('aria-busy',String(on));}
function clear(cancelContent=true){generation++;if(cancelContent){animations.forEach(a=>a.cancel());animations.clear()}layer.getAnimations?.().forEach(a=>a.cancel());word.getAnimations?.().forEach(a=>a.cancel());busy=false;lock(false);root.classList.remove('motion-boot');layer.style.transform='translateY(-120%)';layer.style.removeProperty('--curve');word.style.opacity='1';word.style.transform='';clearTimeout(window.keppMotionFailsafe);if(!window.keppPageReady){window.keppPageReady=true;document.dispatchEvent(new CustomEvent('kepp-page-ready',{detail:{restore:restoring}}));restoring=false}rememberPosition();}
window.keppMotionFinish=clear;
const pageName=()=>document.title.replace(/\s*[—–].*$/,'').trim()==='KeppTrust'?'Início':document.title.replace(/\s*[—–].*$/,'').trim();
function entryContent(){const items=document.querySelectorAll('.page-title h1,.page-title>p,.case-meta,.hero-description,.hero-bottom,.location,.hero-stage');items.forEach((el,i)=>animate(el,[{transform:`translateY(${innerWidth>720?100:55}px)`,opacity:0},{transform:'translateY(0)',opacity:1}],{duration:1100,delay:i*70,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'}));const hero=document.querySelector('.hero-art');if(hero)animate(hero,[{transform:'scale(1.12)',filter:'brightness(.72)'},{transform:'scale(1.035)',filter:'brightness(1)'}],{duration:1700,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'});}
async function uncover(token){if(token!==generation)return;if(reduced()){await animate(layer,[{opacity:1},{opacity:0}],{duration:120});if(token===generation)clear(false);return;}layer.style.setProperty('--curve',innerWidth>720?'10vh':'5vh');entryContent();animate(word,[{opacity:1,transform:'translateY(-35px)'},{opacity:0,transform:'translateY(-60px)'}],{duration:300,fill:'forwards'});await animate(layer,[{transform:'translateY(0)',borderRadius:'0 0 0 0 / 0 0 0 0'},{transform:'translateY(-45%)',borderRadius:'0 0 50% 50% / 0 0 8% 8%',offset:.5},{transform:'translateY(-115%)',borderRadius:'0 0 0 0 / 0 0 0 0'}],{duration:800,easing:'cubic-bezier(.76,0,.24,1)',fill:'forwards'});if(token===generation)clear(false);}
async function preparePosition(isPending){if(document.readyState==='loading')await new Promise(resolve=>document.addEventListener('DOMContentLoaded',resolve,{once:true}));await Promise.race([document.fonts?.ready||Promise.resolve(),sleep(2000)]);await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));document.dispatchEvent(new Event('kepp-layout-ready'));if(restoring&&!isPending)scrollTo({top:savedPosition,behavior:'instant'});else if(isPending&&!location.hash)scrollTo({top:0,behavior:'instant'});if(isPending)restoring=false;document.dispatchEvent(new CustomEvent('kepp-page-positioned',{detail:{restore:restoring}}));}
async function enter(){const token=++generation;busy=true;lock(true);root.classList.remove('motion-boot');layer.style.transform='translateY(0)';let pending=null;try{pending=JSON.parse(sessionStorage.getItem('kepp-route')||'null');sessionStorage.removeItem('kepp-route')}catch{}const isPending=pending&&pending.url===location.pathname+location.search&&Date.now()-pending.at<15000;const prepared=preparePosition(isPending);word.textContent=isPending?pending.title:pageName();if(reduced()){await prepared;await sleep(30);return uncover(token)}
if(!isPending&&location.pathname==='/'){
const words=['Hello','Bonjour','स्वागत है','Ciao','Olá','こんにちは','Hallå','Guten Tag','Hallo'];
word.textContent=words[0];await animate(word,[{opacity:0,transform:'translateY(0)'},{opacity:1,transform:'translateY(-35px)'}],{duration:500,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'});
for(const greeting of words){if(token!==generation)return;word.textContent=greeting;await sleep(greeting===words[0]?250:150)}await sleep(200);
}else{await animate(word,[{opacity:0,transform:'translateY(0)'},{opacity:1,transform:'translateY(-35px)'}],{duration:500,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'});await sleep(150)}
await prepared;await uncover(token);}
const labels={'/':'Início','/projetos/':'Projetos','/sobre/':'Sobre nós','/contacto/':'Contacto','/projetos/forma-studio/':'Forma Studio','/projetos/terra-sol/':'Terra & Sol','/projetos/nexo/':'Nexo'};
document.addEventListener('click',async e=>{
const a=e.target.closest('a[href]');if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.hasAttribute('download')||(a.target&&a.target!=='_self'))return;
const url=new URL(a.href,location.href);if(url.origin!==location.origin||!/^https?:$/.test(url.protocol))return;
const samePage=url.pathname===location.pathname&&url.search===location.search;
const homeReturn=samePage&&url.pathname==='/'&&!url.hash;
if(samePage&&!homeReturn)return;
if(!url.pathname.endsWith('/')&&!url.pathname.endsWith('.html'))return;
e.preventDefault();if(busy)return;rememberPosition();busy=true;const token=++generation;word.textContent=labels[url.pathname]||a.dataset.pageTitle||'KeppTrust';word.style.opacity='0';word.style.transform='';lock(true);layer.style.transform='translateY(115%)';
if(!homeReturn)try{sessionStorage.setItem('kepp-route',JSON.stringify({url:url.pathname+url.search,title:word.textContent,at:Date.now()}))}catch{}
window.keppPageReady=false;document.dispatchEvent(new Event('kepp-route-start'));
// A navigation that fails or is cancelled must never leave an opaque overlay locked.
window.keppMotionFailsafe=setTimeout(clear,8000);
if(!reduced()){await animate(layer,[{transform:'translateY(115%)',borderRadius:'50% 50% 0 0 / 12% 12% 0 0'},{transform:'translateY(0)',borderRadius:'0 0 0 0 / 0 0 0 0'}],{duration:500,easing:'cubic-bezier(.7,0,1,.5)',fill:'forwards'});}else layer.style.transform='translateY(0)';
if(token!==generation)return;
if(homeReturn){document.dispatchEvent(new Event('kepp-home-reset'));scrollTo({top:0,behavior:'instant'});if(location.hash)history.replaceState(history.state,'',url.pathname+url.search);document.dispatchEvent(new Event('kepp-page-positioned'));word.textContent='Início';await animate(word,[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(-35px)'}],{duration:320,fill:'forwards'});await sleep(160);await uncover(token);const heading=document.querySelector('#hero-title');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true})}return;}
location.assign(url.href);
});
addEventListener('pageshow',e=>{if(e.persisted){clear();document.dispatchEvent(new CustomEvent('kepp-page-ready',{detail:{restore:true}}));word.textContent=pageName();const token=++generation;busy=true;lock(true);layer.style.transform='translateY(0)';uncover(token)}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&busy)clear()});
const choice=document.querySelector('#motion-choice');if(choice){choice.value=root.dataset.motion||'system';choice.addEventListener('change',()=>{root.dataset.motion=choice.value;try{localStorage.setItem('kepp-motion',choice.value)}catch{}clear();document.dispatchEvent(new Event('kepp-motion-change'));document.querySelector('#motion-status').textContent=choice.value==='full'?'Animações completas ativadas.':choice.value==='reduced'?'Movimento reduzido ativado.':'A seguir as definições do dispositivo.'})}
reduce.addEventListener?.('change',()=>{if(reduced())clear()});
enter().catch(clear);
})();
