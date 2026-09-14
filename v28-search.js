(()=>{
 const init=()=>{
  const input=document.querySelector('#searchInput'),box=document.querySelector('#headerSearch');
  if(!input||!box)return;
  let panel=document.querySelector('#searchSuggestions');
  if(!panel){panel=document.createElement('div');panel.id='searchSuggestions';panel.setAttribute('role','listbox')}
  /* On mobile the dropdown lives in <body>, so it can sit below the frozen header
     without becoming part of the search field/header layout. */
  if(window.matchMedia('(max-width:700px)').matches && panel.parentElement!==document.body){document.body.appendChild(panel)}
  else if(!window.matchMedia('(max-width:700px)').matches && panel.parentElement!==box){box.appendChild(panel)}
  const positionMobile=()=>{
   if(!window.matchMedia('(max-width:700px)').matches||panel.parentElement!==document.body)return;
   const r=box.getBoundingClientRect();
   panel.style.position='fixed';
   panel.style.left=`${Math.max(8,r.left)}px`;
   panel.style.width=`${Math.min(r.width,window.innerWidth-16)}px`;
   panel.style.right='auto';
   panel.style.top=`${r.bottom+8}px`;
  };
  const syncParent=()=>{
   const mobile=window.matchMedia('(max-width:700px)').matches;
   if(mobile&&panel.parentElement!==document.body)document.body.appendChild(panel);
   if(!mobile&&panel.parentElement!==box)box.appendChild(panel);
   if(mobile)positionMobile();
   else {panel.style.position='';panel.style.left='';panel.style.width='';panel.style.right='';panel.style.top=''}
  };
  const hide=()=>{panel.classList.remove('show');panel.innerHTML='';input.removeAttribute('aria-expanded')};
  const getChannels=()=>window.__iptvChannels||[];
  const playChannel=c=>{if(typeof window.__iptvPlay==='function'){window.__iptvPlay(c);return}const b=document.querySelector(`#channelList .channel[data-id="${CSS.escape(c.id)}"]`);b?.click()};
  const render=()=>{
   syncParent();
   const q=input.value.trim().toLowerCase();
   if(!q){hide();return}
   const matches=getChannels().filter(c=>`${c.name} ${c.group||''} ${c.category||''} ${c.source||''}`.toLowerCase().includes(q)).slice(0,10);
   panel.innerHTML='';
   if(!matches.length){panel.innerHTML='<div class="search-empty">No channels found</div>';panel.classList.add('show');input.setAttribute('aria-expanded','true');positionMobile();return}
   matches.forEach((c,i)=>{
    const item=document.createElement('button');item.type='button';item.className='search-suggestion';item.setAttribute('role','option');item.dataset.index=i;
    const logo=c.logo?`<img class="channel-logo" src="${String(c.logo).replace(/"/g,'&quot;')}" alt="" loading="lazy">`:'<div class="channel-logo fallback">TV</div>';
    item.innerHTML=`${logo}<div class="channel-info"><strong>${esc(c.name)}</strong><span>${esc(c.group||c.category||'Live stream')} · ${esc((c.source||'').replace('.m3u',''))}</span></div><span class="search-play">▶</span>`;
    item.onclick=()=>{input.value=c.name;hide();playChannel(c);input.blur()};panel.appendChild(item);
   });
   panel.classList.add('show');input.setAttribute('aria-expanded','true');positionMobile();
  };
  const esc=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  input.setAttribute('aria-controls','searchSuggestions');input.setAttribute('aria-expanded','false');
  input.addEventListener('input',()=>requestAnimationFrame(render));
  input.addEventListener('focus',()=>input.value.trim()&&render());
  input.addEventListener('keydown',e=>{
   const items=[...panel.querySelectorAll('.search-suggestion')];
   if(e.key==='Escape'){hide();return}
   if(!items.length)return;
   const active=document.activeElement?.classList.contains('search-suggestion')?document.activeElement:null;
   if(e.key==='ArrowDown'){e.preventDefault();(active?.nextElementSibling||items[0]).focus()}
   if(e.key==='ArrowUp'){e.preventDefault();(active?.previousElementSibling||items[items.length-1]).focus()}
   if(e.key==='Enter'&&active){e.preventDefault();active.click()}
  });
  panel.addEventListener('keydown',e=>{if(e.key==='Escape'){input.focus();hide()}});
  document.addEventListener('pointerdown',e=>{if(!box.contains(e.target)&&!panel.contains(e.target))hide()},{capture:true,passive:true});
  window.addEventListener('resize',syncParent,{passive:true});
  window.addEventListener('scroll',positionMobile,{passive:true});
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
