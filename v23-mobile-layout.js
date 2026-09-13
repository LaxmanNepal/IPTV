(()=>{
  const moveGuide=()=>{
    const guide=document.querySelector('.tv-guide');
    const layout=document.querySelector('.watch-layout');
    const player=document.querySelector('.player-wrap');
    if(!guide||!layout||!player)return;
    if(window.matchMedia('(max-width:700px)').matches){
      if(guide.parentElement!==layout) layout.insertBefore(guide, layout.querySelector('.channel-panel'));
    }else if(guide.parentElement!==document.body){
      document.body.appendChild(guide);
    }
  };
  moveGuide();
  window.addEventListener('resize',moveGuide,{passive:true});
  new MutationObserver(moveGuide).observe(document.body,{childList:true,subtree:true});
})();
