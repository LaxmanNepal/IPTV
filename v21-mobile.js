(()=>{
  const init=()=>{
    const input=document.querySelector('#searchInput');
    const searchBox=document.querySelector('#headerSearch');
    const nav=document.querySelector('.mobile-nav');
    if(!input||!searchBox||!nav)return;

    const openSearch=()=>{
      searchBox.classList.add('mobile-search-open');
      input.hidden=false;
      input.style.display='block';
      input.removeAttribute('disabled');
      try{input.focus({preventScroll:true})}catch{input.focus()}
    };

    const searchBtn=nav.querySelector('[data-nav="search"]');
    if(searchBtn && !searchBtn.dataset.searchBound){
      searchBtn.dataset.searchBound='1';
      ['pointerdown','touchstart','click'].forEach(type=>searchBtn.addEventListener(type,e=>{
        e.preventDefault();
        e.stopImmediatePropagation();
        openSearch();
      },{capture:true,passive:false}));
    }

    input.addEventListener('focus',()=>searchBox.classList.add('mobile-search-open'),{passive:true});
    input.addEventListener('keydown',e=>{
      if(e.key==='Escape'){
        input.value='';
        input.dispatchEvent(new Event('input',{bubbles:true}));
        input.blur();
        searchBox.classList.remove('mobile-search-open');
      }
    });
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
