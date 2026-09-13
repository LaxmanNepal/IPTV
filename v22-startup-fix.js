(()=>{
  const $=s=>document.querySelector(s);
  const nav=document.querySelector('.mobile-nav');
  const search=document.querySelector('#searchInput');
  const headerSearch=document.querySelector('#headerSearch');
  const guidePanel=document.querySelector('.tv-guide');
  let booted=false;

  function focusSearch(e){
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if(!search||!headerSearch)return;
    headerSearch.classList.add('mobile-search-open');
    search.style.display='block';
    search.disabled=false;
    // Focus after the tap event finishes so the mobile browser accepts it.
    requestAnimationFrame(()=>{
      search.focus({preventScroll:true});
      search.select?.();
    });
  }

  function openGuide(e){
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if(!guidePanel)return;
    window.iptvV14?.renderGuide?.();
    document.body.classList.add('guide-open');
  }

  // Capture the mobile Search/Guide taps before any other navigation handler.
  if(nav){
    const searchBtn=nav.querySelector('[data-nav="search"]');
    const guideBtn=nav.querySelector('[data-nav="guide"]');
    searchBtn?.addEventListener('pointerup',focusSearch,{capture:true});
    searchBtn?.addEventListener('click',focusSearch,{capture:true});
    guideBtn?.addEventListener('pointerup',openGuide,{capture:true});
    guideBtn?.addEventListener('click',openGuide,{capture:true});
  }

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
