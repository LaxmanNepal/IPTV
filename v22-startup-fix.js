(()=>{
  const $=s=>document.querySelector(s);
  const nav=document.querySelector('.mobile-nav');
  const search=document.querySelector('#searchInput');
  const headerSearch=document.querySelector('#headerSearch');
  const guidePanel=document.querySelector('.tv-guide');
  let booted=false;

  function focusSearch(){
    if(!search)return;
    headerSearch?.classList.add('mobile-search-open');
    search.focus({preventScroll:true});
    search.select?.();
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function openGuide(){
    if(!guidePanel)return;
    window.iptvV14?.renderGuide?.();
    document.body.classList.add('guide-open');
  }

  nav?.querySelectorAll('button').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const type=btn.dataset.nav;
      if(type==='search')focusSearch();
      if(type==='guide')openGuide();
    },true);
  });

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape')headerSearch?.classList.remove('mobile-search-open');
  });

  function startFirstChannel(){
    if(booted)return;
    const list=$('#channelList');
    const channels=list?.querySelectorAll('.channel');
    if(!channels?.length)return;
    booted=true;
    const saved=localStorage.getItem('laxmanIptvLast');
    const target=saved?[...channels].find(b=>b.dataset.id===saved):null;
    const button=target||channels[0];
    button?.click();
    setTimeout(()=>{
      const video=$('#video');
      if(video?.paused){
        const overlay=$('#playerOverlay');
        const status=$('#playerStatus');
        if(status)status.textContent='Tap the player to start live TV';
        overlay?.classList.remove('hidden');
      }
    },1800);
  }

  const list=$('#channelList');
  if(list){
    new MutationObserver(startFirstChannel).observe(list,{childList:true,subtree:true});
    setTimeout(startFirstChannel,1200);
  }

  // A real touch/click is the reliable way around browser audible-autoplay blocking.
  document.addEventListener('pointerdown',e=>{
    if(!e.target.closest('#video,#playerShell,.channel'))return;
    const video=$('#video');
    if(video?.paused&&video.src)video.play().catch(()=>{});
  },{passive:true});
})();
