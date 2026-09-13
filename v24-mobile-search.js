(()=>{
  const boot=()=>{
    const input=document.querySelector('#searchInput');
    const box=document.querySelector('#headerSearch');
    const nav=document.querySelector('.mobile-nav');
    if(!input||!box||!nav)return;
    let suggestions;

    const ensureSuggestions=()=>{
      if(suggestions)return suggestions;
      suggestions=document.createElement('div');
      suggestions.id='searchSuggestions';
      suggestions.setAttribute('role','listbox');
      box.appendChild(suggestions);
      return suggestions;
    };

    const openSearch=()=>{
      box.classList.add('mobile-search-open'); input.hidden=false; input.disabled=false; input.removeAttribute('disabled');
      input.style.display='block'; input.style.visibility='visible'; input.style.opacity='1';
      setTimeout(()=>{try{input.focus({preventScroll:true})}catch{input.focus()}},20);
    };

    const renderSuggestions=()=>{
      const root=ensureSuggestions(),q=input.value.trim().toLowerCase();
      root.innerHTML='';
      if(!q){root.classList.remove('show');return;}
      // Let the existing IPTV search engine filter the real channel list first.
      input.dispatchEvent(new Event('input',{bubbles:true}));
      setTimeout(()=>{
        const matches=[...document.querySelectorAll('#channelList .channel')].slice(0,8);
        root.innerHTML='';
        if(!matches.length){root.innerHTML='<div class="search-empty">No channels found</div>';root.classList.add('show');return;}
        matches.forEach((channel,i)=>{
          const b=document.createElement('button'); b.type='button'; b.className='search-suggestion'; b.setAttribute('role','option'); b.tabIndex=i===0?0:-1;
          const logo=channel.querySelector('.channel-logo')?.cloneNode(true);
          const info=channel.querySelector('.channel-info')?.cloneNode(true);
          if(logo)b.appendChild(logo); if(info)b.appendChild(info);
          const state=channel.querySelector('.stream-state')?.cloneNode(true); if(state)b.appendChild(state);
          b.addEventListener('click',()=>{channel.click();root.classList.remove('show');input.blur();});
          b.addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const all=[...root.querySelectorAll('.search-suggestion')];const n=e.key==='ArrowDown'?Math.min(all.length-1,i+1):Math.max(0,i-1);all[n]?.focus();}if(e.key==='Enter')b.click();});
          root.appendChild(b);
        });
        root.classList.add('show');
      },0);
    };

    document.addEventListener('pointerdown',e=>{const button=e.target.closest('.mobile-nav [data-nav="search"]');if(!button)return;e.preventDefault();e.stopPropagation();openSearch();},true);
    document.addEventListener('click',e=>{const button=e.target.closest('.mobile-nav [data-nav="search"]');if(!button)return;e.preventDefault();e.stopPropagation();openSearch();},true);
    input.addEventListener('focus',()=>box.classList.add('mobile-search-open'));
    input.addEventListener('input',renderSuggestions);
    input.addEventListener('keydown',e=>{if(e.key==='Escape'){input.value='';input.dispatchEvent(new Event('input',{bubbles:true}));input.blur();box.classList.remove('mobile-search-open');suggestions?.classList.remove('show');}if(e.key==='ArrowDown'){const first=suggestions?.querySelector('.search-suggestion');if(first){e.preventDefault();first.focus();}}});
    document.addEventListener('pointerdown',e=>{if(!box.contains(e.target)&&!e.target.closest('.mobile-nav [data-nav="search"]'))suggestions?.classList.remove('show');},{capture:true,passive:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();