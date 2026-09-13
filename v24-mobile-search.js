(()=>{
  const boot=()=>{
    const input=document.querySelector('#searchInput');
    const box=document.querySelector('#headerSearch');
    const nav=document.querySelector('.mobile-nav');
    if(!input||!box||!nav)return;

    const openSearch=()=>{
      box.classList.add('mobile-search-open');
      input.hidden=false;
      input.disabled=false;
      input.removeAttribute('disabled');
      input.style.display='block';
      input.style.visibility='visible';
      input.style.opacity='1';
      setTimeout(()=>{
        try{input.focus({preventScroll:true})}catch{input.focus()}
      },20);
    };

    const closeSearch=()=>{
      if(!input.value.trim() && document.activeElement!==input){
        box.classList.remove('mobile-search-open');
      }
    };

    document.addEventListener('pointerdown',e=>{
      const button=e.target.closest('.mobile-nav [data-nav="search"]');
      if(!button)return;
      e.preventDefault();
      e.stopPropagation();
      openSearch();
    },true);

    document.addEventListener('click',e=>{
      const button=e.target.closest('.mobile-nav [data-nav="search"]');
      if(!button)return;
      e.preventDefault();
      e.stopPropagation();
      openSearch();
    },true);

    input.addEventListener('focus',()=>box.classList.add('mobile-search-open'));
    input.addEventListener('keydown',e=>{
      if(e.key==='Escape'){
        input.value='';
        input.dispatchEvent(new Event('input',{bubbles:true}));
        input.blur();
        box.classList.remove('mobile-search-open');
      }
    });

    document.addEventListener('pointerdown',e=>{
      if(!box.contains(e.target) && !e.target.closest('.mobile-nav [data-nav="search"]'))closeSearch();
    },{capture:true,passive:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
