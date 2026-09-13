(()=>{
  const input=document.querySelector('#searchInput');
  const searchBox=document.querySelector('#headerSearch');
  const nav=document.querySelector('.mobile-nav');
  if(!input||!searchBox||!nav)return;

  const openSearch=()=>{
    searchBox.classList.add('mobile-search-open');
    input.style.display='block';
    requestAnimationFrame(()=>input.focus());
    searchBox.scrollIntoView({behavior:'smooth',block:'nearest'});
  };
  const closeSearch=()=>{
    if(document.activeElement===input && !input.value.trim()){
      input.blur();
      searchBox.classList.remove('mobile-search-open');
    }
  };

  nav.querySelector('[data-nav="search"]')?.addEventListener('click',e=>{
    e.preventDefault();
    openSearch();
  });
  input.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      input.value='';
      input.dispatchEvent(new Event('input',{bubbles:true}));
      input.blur();
      searchBox.classList.remove('mobile-search-open');
    }
  });
  input.addEventListener('focus',()=>searchBox.classList.add('mobile-search-open'));
  input.addEventListener('blur',()=>setTimeout(closeSearch,120));

  nav.querySelector('[data-nav="guide"]')?.addEventListener('click',e=>{
    e.preventDefault();
    document.body.classList.toggle('guide-open');
    window.iptvV14?.renderGuide?.();
    document.querySelector('.tv-guide')?.classList.toggle('mobile-guide-open',document.body.classList.contains('guide-open'));
  });

  const guide=document.querySelector('.tv-guide');
  if(guide){
    new MutationObserver(()=>{
      guide.classList.toggle('mobile-guide-open',document.body.classList.contains('guide-open'));
    }).observe(document.body,{attributes:true,attributeFilter:['class']});
  }
})();
