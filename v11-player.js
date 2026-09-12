(()=>{
const v=document.getElementById('video');if(!v)return;
let current=null,token=0,timer=0,stallTimer=0,recovery=0,lastTime=0,lastProgress=Date.now(),quality='auto';
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const overlay=(text,spin=true)=>{const o=document.getElementById('playerOverlay'),p=document.getElementById('playerStatus');if(o&&p){o.classList.remove('hidden');p.textContent=text;const s=o.querySelector('.spinner');if(s)s.style.display=spin?'block':'none'}};
const state=s=>{const id=current?.id;if(!id)return;const b=document.querySelector(`.channel[data-id="${CSS.escape(id)}"] .stream-state`);if(!b)return;b.textContent=s==='live'?'●':s==='retry'?'↻':s==='error'?'!':'◐';b.className=`stream-state ${s}`;b.title=s==='live'?'Playing':s==='retry'?'Retrying':s==='error'?'Stream unavailable':'Connecting'};
const activeHls=()=>window.__iptvHls;
const clearTimers=()=>{clearTimeout(timer);clearTimeout(stallTimer)};
const destroy=()=>{const h=activeHls();if(h){try{h.stopLoad()}catch(_){}try{h.destroy()}catch(_){}}};
const recreate=async(t)=>{if(t!==token||!current)return false;const h=activeHls();if(h){try{h.destroy()}catch(_){}}window.__iptvHls=null;try{v.pause();v.removeAttribute('src');v.load()}catch(_){}await wait(120);if(t!==token)return false;return false};
const recover=async(t=token)=>{if(t!==token||!current)return;const h=activeHls();recovery++;
 if(recovery===1){state('retry');overlay('Reconnecting…');try{h?.startLoad(-1)}catch(_){}try{v.play().catch(()=>{})}catch(_){}return}
 if(recovery===2){state('retry');overlay('Recovering live stream…');try{h?.recoverMediaError()}catch(_){}try{h?.startLoad(-1)}catch(_){}try{v.play().catch(()=>{})}catch(_){}return}
 if(recovery===3){state('retry');overlay('Restarting stream…');await recreate(t);if(t!==token)return;try{window.play?.(current)}catch(_){}return}
 state('error');overlay('Stream unavailable — try another channel',false);
};
const arm=c=>{clearTimers();current=c;const t=++token;recovery=0;lastTime=v.currentTime;lastProgress=Date.now();state('connecting');overlay(`Connecting to ${c.name}…`);let started=false;
 const startup=async()=>{if(t!==token||started)return;if(!v.paused&&v.readyState>=2&&v.currentTime!==lastTime){started=true;return}if(recovery<3){await recover(t);if(t===token)timer=setTimeout(startup,2500)}else state('error')};
 timer=setTimeout(startup,6500);
};
const oldPlay=window.play;
if(typeof oldPlay==='function')window.play=function(c){if(current?.id!==c?.id)clearTimers();arm(c);return oldPlay(c)};
v.addEventListener('playing',()=>{clearTimers();recovery=0;lastTime=v.currentTime;lastProgress=Date.now();state('live')});
v.addEventListener('timeupdate',()=>{if(!current)return;if(v.currentTime!==lastTime){lastTime=v.currentTime;lastProgress=Date.now()}});
v.addEventListener('waiting',()=>{if(!current)return;state('buffering');clearTimeout(stallTimer);stallTimer=setTimeout(()=>recover(token),1400)});
v.addEventListener('stalled',()=>{if(!current)return;state('retry');clearTimeout(stallTimer);stallTimer=setTimeout(()=>recover(token),1000)});
v.addEventListener('error',()=>{if(!current)return;clearTimeout(stallTimer);stallTimer=setTimeout(()=>recover(token),500)});
setInterval(()=>{if(!current||v.paused)return;if(Date.now()-lastProgress>9000)recover(token)},3000);
window.addEventListener('online',()=>current&&recover(token));
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&current&&v.paused)v.play().catch(()=>{})});
const addQuality=()=>{if(document.getElementById('qualityBtn'))return;const host=document.querySelector('.now-playing');if(!host)return;const b=document.createElement('button');b.id='qualityBtn';b.className='control-btn';b.textContent='⚙ Auto';b.title='Stream quality';b.onclick=()=>{const h=activeHls();if(!h||!h.levels?.length)return;const levels=h.levels.map((x,i)=>({i,h:x.height||0})).sort((a,b)=>b.h-a.h);const next=quality==='auto'?levels[0].i:quality===levels[0].i?levels.length>1?levels[1].i:'auto':'auto';quality=next;b.textContent=next==='auto'?'⚙ Auto':`⚙ ${h.levels[next]?.height||'HD'}p`;h.currentLevel=next==='auto'?-1:next;localStorage.setItem('laxmanIptvQuality',String(next))};host.appendChild(b)};
quality=localStorage.getItem('laxmanIptvQuality')||'auto';addQuality();
const mo=new MutationObserver(addQuality);mo.observe(document.body,{childList:true,subtree:true});
})();
