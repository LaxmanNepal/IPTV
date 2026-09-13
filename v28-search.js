(()=>{
 const init=()=>{
  const input=document.querySelector('#searchInput'),box=document.querySelector('#headerSearch');
  if(!input||!box)return;
  let panel=document.querySelector('#searchSuggestions');
  if(!panel){panel=document.createElement('div');panel.id='searchSuggestions';panel.setAttribute('role','listbox');box.appendChild(panel)}
  const hide=()=>{panel.classList.remove('show');panel.innerHTML='';input.removeAttribute('aria-expanded')};
  const getChannels=()=>window.__iptvChannels||[];
  const playChannel=c=>{if(typeof window.__iptvPlay==='function'){window.__iptvPlay(c);return}const b=document.querySelector(`#channelList .channel[data-id="${CSS.escape(c.id)}"]`);b?.click()};
  const render=()=>{
   const q=input.value.trim().toLowerCase();
   if(!q){hide();return}
   const matches=getChannels().filter(c=>`${c.name} ${c.group||''} ${c.category||''} ${c.source||''}`.toLowerCase().includes(q)).slice(0,10);
   panel.innerHTML='';
   if(!matches.length){panel.innerHTML='<div class="search-empty">No channels found</div>';panel.classList.add('show');input.setAttribute('aria-expanded','true');return}
   matches.forEach((c,i)=>{
    const item=document.createElement('button');item.type='button';item.className='search-suggestion';item.setAttribute('role','option');item.dataset.index=i;
    const logo=c.logo?`<img class="channel-logo" src="${String(c.logo).replace(/"/g,'&quot;')}" alt="" loading="lazy">`:'<div class="channel-logo fallback">TV</div>';
    item.innerHTML=`${logo}<div class="channel-info"><strong>${esc(c.name)}</strong><span>${esc(c.group||c.category||'Live stream')} · ${esc((c.source||'').replace('.m3u',''))}</span></div><span class="search-play">▶</span>`;
    item.onclick=()=>{input.value=c.name;hide();playChannel(c);input.blur()};panel.appendChild(item);
   });
   panel.classList.add('show');input.setAttribute('aria-expanded','true');
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
  document.addEventListener('pointerdown',e=>{if(!box.contains(e.target))hide()},{capture:true,passive:true});
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
