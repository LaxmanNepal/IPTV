(()=>{
const init=()=>{
 const shell=document.querySelector('#playerShell'),video=document.querySelector('#video');if(!shell||!video||document.querySelector('#v36Player'))return;
 const bar=document.createElement('div');bar.id='v36Player';bar.innerHTML='<button data-v36="prev" aria-label="Previous channel">‹</button><div class="v36-center"><span class="v36-live-dot"></span><span id="v36Status">LIVE</span></div><button data-v36="next" aria-label="Next channel">›</button><button data-v36="mute" aria-label="Mute">🔊</button><button data-v36="pip" aria-label="Picture in picture">▣</button><button data-v36="full" aria-label="Fullscreen">⛶</button>';
 shell.appendChild(bar);
 const click=id=>document.querySelector('#'+id)?.click();
 bar.querySelector('[data-v36="prev"]').onclick=()=>click('prevBtn');bar.querySelector('[data-v36="next"]').onclick=()=>click('nextBtn');
 bar.querySelector('[data-v36="mute"]').onclick=()=>{video.muted=!video.muted;bar.querySelector('[data-v36="mute"]').textContent=video.muted?'🔇':'🔊'};
 bar.querySelector('[data-v36="pip"]').onclick=async()=>{try{if(document.pictureInPictureElement)await document.exitPictureInPicture();else if(document.pictureInPictureEnabled)await video.requestPictureInPicture()}catch{}};
 bar.querySelector('[data-v36="full"]').onclick=()=>{try{document.fullscreenElement?document.exitFullscreen():shell.requestFullscreen()}catch{}};
 video.addEventListener('playing',()=>{document.querySelector('#v36Status').textContent='LIVE';shell.classList.remove('v36-buffering')});video.addEventListener('waiting',()=>{document.querySelector('#v36Status').textContent='BUFFERING';shell.classList.add('v36-buffering')});video.addEventListener('error',()=>{document.querySelector('#v36Status').textContent='STREAM ERROR'});
 let sy=0;video.addEventListener('touchstart',e=>{sy=e.touches[0].clientY},{passive:true});video.addEventListener('touchend',e=>{const dy=e.changedTouches[0].clientY-sy;if(Math.abs(dy)>70){dy<0?click('nextBtn'):click('prevBtn')}},{passive:true});
};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
