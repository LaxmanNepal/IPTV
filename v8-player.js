(()=>{
const v=document.getElementById('video');if(!v)return;
let active=null,attempt=0,timer=0;
const set=(s)=>{const b=document.querySelector(`.channel[data-id="${CSS.escape(active?.id||'')}"] .stream-state`);if(b){b.textContent=s==='live'?'●':s==='retry'?'↻':s==='error'?'!':'◐';b.className=`stream-state ${s}`;b.title=s==='live'?'Playing':s==='retry'?'Retrying':'Buffering'}};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function resilient(c){if(!c)return;active=c;attempt++;const token=attempt;clearTimeout(timer);set('connecting');
  for(let n=0;n<3;n++){
    if(token!==attempt)return;
    set(n?'retry':'connecting');
    try{v.pause();v.removeAttribute('src');v.load();
      if(window.Hls&&Hls.isSupported()){
        const x=new Hls({enableWorker:true,lowLatencyMode:true,autoStartLoad:true,startFragPrefetch:true,startLevel:-1,maxBufferLength:6,maxMaxBufferLength:14,backBufferLength:4,capLevelToPlayerSize:true,liveSyncDurationCount:2,liveMaxLatencyDurationCount:5,manifestLoadingTimeOut:6000,manifestLoadingMaxRetry:1,fragLoadingTimeOut:6000,fragLoadingMaxRetry:2,fragLoadingRetryDelay:300,levelLoadingMaxRetry:2,levelLoadingRetryDelay:300});
        window.__v8hls=x;x.attachMedia(v);x.loadSource(c.url);
        await new Promise((resolve,reject)=>{let done=false;const ok=()=>{if(done)return;done=true;resolve()};const bad=()=>{if(done)return;done=true;reject(new Error('stream'))};x.once(Hls.Events.MANIFEST_PARSED,ok);x.on(Hls.Events.ERROR,(_,d)=>{if(d.fatal)bad()});setTimeout(()=>{if(!done)bad()},7000)});
        if(token!==attempt)return;x.on(Hls.Events.ERROR,(_,d)=>{if(d.fatal&&d.type===Hls.ErrorTypes.MEDIA_ERROR)x.recoverMediaError();else if(d.fatal&&d.type===Hls.ErrorTypes.NETWORK_ERROR)x.startLoad(-1)});
      }else if(v.canPlayType('application/vnd.apple.mpegurl'))v.src=c.url;else throw Error('HLS unsupported');
      v.load();await wait(120);await v.play();set('live');return;
    }catch(e){try{window.__v8hls?.destroy()}catch(_){}window.__v8hls=null;if(n<2)await wait(250*(n+1));}
  }
  if(token===attempt)set('error');
}
window.addEventListener('beforeunload',()=>clearTimeout(timer));
window.v8ResilientPlay=resilient;
})();