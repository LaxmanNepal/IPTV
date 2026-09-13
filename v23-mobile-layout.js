(()=>{
const mq=matchMedia('(max-width:700px)');
const moveGuide=()=>{const guide=document.querySelector('.tv-guide'),layout=document.querySelector('.watch-layout');if(!guide||!layout)return;if(mq.matches){if(guide.parentElement!==layout)layout.insertBefore(guide,layout.querySelector('.channel-panel'));}else if(guide.parentElement!==document.body)document.body.appendChild(guide)};
const dock=()=>{const layout=document.querySelector('.watch-layout');if(!layout)return;if(!mq.matches){document.body.classList.remove('mobile-player-docked');return}const r=layout.getBoundingClientRect();document.body.classList.toggle('mobile-player-docked',r.bottom<60&&r.top<60)};
const init=()=>{moveGuide();dock()};
window.addEventListener('resize',init,{passive:true});window.addEventListener('scroll',dock,{passive:true});mq.addEventListener?.('change',init);new MutationObserver(moveGuide).observe(document.body,{childList:true,subtree:true});init();
})();
