(()=>{
  const init=()=>{
    const view=document.querySelector('#mobileChannelsView'),grid=document.querySelector('#mobileChannelsGrid'),count=document.querySelector('#mobileChannelCount');
    if(!view||!grid)return;
    const head=view.querySelector('.mobile-channels-head');
    if(!head)return;
    if(view.querySelector('.v32-channel-tools'))return;
    const tools=document.createElement('div'); tools.className='v32-channel-tools';
    tools.innerHTML='<label class="v32-channel-search"><span>⌕</span><input id="mobileChannelSearch" type="search" placeholder="Search channels…" autocomplete="off"></label><div id="mobileChannelFilters" class="v32-channel-filters" role="tablist" aria-label="Channel filters"></div>';
    head.insertAdjacentElement('afterend',tools);
    const input=tools.querySelector('#mobileChannelSearch'),filters=tools.querySelector('#mobileChannelFilters');
    let active='All',query='';
    const esc=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
    const logo=c=>c.logo?`<img src="${esc(c.logo)}" alt="" loading="lazy" decoding="async" onerror="this.outerHTML='<span class="mobile-channel-logo fallback">TV</span>'>`:'<span class="mobile-channel-logo fallback">TV</span>';
    const render=()=>{
      const all=window.__iptvChannels||[];
      const groups=['All',...new Set(all.map(c=>String(c.group||c.category||'').trim()).filter(Boolean))];
      if(!groups.includes(active))active='All';
      filters.innerHTML=groups.slice(0,14).map(g=>`<button type="button" role="tab" aria-selected="${g===active}" class="${g===active?'active':''}" data-filter="${esc(g)}">${esc(g)}</button>`).join('');
      const q=query.toLowerCase().trim();
      const list=all.filter(c=>{const group=String(c.group||c.category||'').trim();return (active==='All'||group===active)&&(!q||`${c.name||''} ${group} ${c.source||''}`.toLowerCase().includes(q));});
      count.textContent=`${list.length} of ${all.length} channel${all.length===1?'':'s'}`;
      if(!list.length){grid.innerHTML='<div class="mobile-channel-empty">No channels found.<small>Try another search or category.</small></div>';return;}
      const frag=document.createDocumentFragment();
      list.forEach((c,i)=>{const b=document.createElement('button');b.type='button';b.className='mobile-channel-card';b.style.setProperty('--card-i',Math.min(i,30));b.innerHTML=`<span class="mobile-channel-top">${logo(c)}<span class="mobile-channel-live">LIVE</span></span><strong>${esc(c.name)}</strong><span>${esc(c.group||c.category||'Live stream')}</span>`;b.onclick=()=>{b.classList.add('is-selected');if(typeof window.__iptvPlay==='function')window.__iptvPlay(c);document.querySelector('[data-mobile-tab="home"]')?.click();setTimeout(()=>document.querySelector('#playerShell')?.scrollIntoView({behavior:'smooth',block:'start'}),120)};frag.appendChild(b);});
      grid.replaceChildren(frag);
    };
    filters.addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;active=b.dataset.filter;render();});
    input.addEventListener('input',()=>{query=input.value;render();});
    window.addEventListener('iptv:channels-ready',render,{passive:true});
    render();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
