(()=>{
 const init=()=>{
  if(document.querySelector('#v37Guide'))return;
  const esc=s=>String(s??'').replace(/[&<>\"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[x]));
  const getChannels=()=>window.__iptvChannels||[];
  const getFav=()=>new Set(JSON.parse(localStorage.getItem('laxmanIptvFavorites')||'[]'));
  const getRecent=()=>JSON.parse(localStorage.getItem('laxmanIptvRecent')||'[]');
  const logo=c=>c?.logo?`<img src="${esc(c.logo)}" alt="" loading="lazy" onerror="this.outerHTML='<span class=\"v37-logo-fallback\">TV</span>'">`:'<span class="v37-logo-fallback">TV</span>';
  const root=document.createElement('section');root.id='v37Guide';root.setAttribute('aria-hidden','true');
  root.innerHTML=`<div class="v37-backdrop"></div><div class="v37-sheet"><header class="v37-head"><div><span class="v37-kicker">SMART TV GUIDE</span><h2>TV Guide</h2><p id="v37Clock">Live lineup</p></div><button id="v37Close" aria-label="Close TV Guide">×</button></header><div class="v37-toolbar"><button class="v37-filter active" data-filter="all">All</button><button class="v37-filter" data-filter="nepal">Nepal</button><button class="v37-filter" data-filter="india">India</button><button class="v37-filter" data-filter="favorites">Favorites</button><button class="v37-filter" data-filter="recent">Recent</button></div><div class="v37-info"><span class="v37-live-dot"></span><div><strong>Live channel lineup</strong><span>Program schedules are not included in the current M3U playlists.</span></div></div><div id="v37List" class="v37-list"></div></div>`;
  document.body.appendChild(root);
  let filter='all',query='';
  const list=root.querySelector('#v37List');
  const visible=()=>{
   const all=getChannels(),fav=getFav(),recent=getRecent();
   let a=all;
   if(filter==='nepal')a=a.filter(c=>c.source==='Nepal.m3u');
   if(filter==='india')a=a.filter(c=>c.source==='india.m3u');
   if(filter==='favorites')a=a.filter(c=>fav.has(c.id));
   if(filter==='recent')a=recent.map(id=>all.find(c=>c.id===id)).filter(Boolean);
   if(query)a=a.filter(c=>`${c.name} ${c.group} ${c.category}`.toLowerCase().includes(query));
   return a;
  };
  const render=()=>{
   const a=visible(),last=localStorage.getItem('laxmanIptvLast');
   list.innerHTML='';
   if(!a.length){list.innerHTML='<div class="v37-empty"><span>⌁</span><strong>No channels in this view</strong><small>Try another guide filter or favorite a channel first.</small></div>';return}
   const frag=document.createDocumentFragment();
   a.forEach((c,i)=>{
    const b=document.createElement('button');b.type='button';b.className=`v37-row ${c.id===last?'current':''}`;b.style.setProperty('--i',Math.min(i,24));
    b.innerHTML=`<span class="v37-channel-logo">${logo(c)}</span><span class="v37-channel-copy"><strong>${esc(c.name)}</strong><small>${esc(c.group||c.category||'Live TV')}</small></span><span class="v37-timeline"><i></i><b>LIVE NOW</b><small>Schedule unavailable</small></span><span class="v37-arrow">›</span>`;
    b.onclick=()=>{if(typeof window.__iptvPlay==='function')window.__iptvPlay(c);close();setTimeout(()=>document.querySelector('#playerShell')?.scrollIntoView({behavior:'smooth',block:'start'}),100)};
    frag.appendChild(b);
   });
   list.appendChild(frag);
  };
  const clock=()=>{const d=new Date();root.querySelector('#v37Clock').textContent=d.toLocaleDateString(undefined,{weekday:'long',month:'short',day:'numeric'})+' · '+d.toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'});};
  const open=()=>{root.classList.add('open');root.setAttribute('aria-hidden','false');document.body.classList.add('v37-guide-open');render();clock();};
  const close=()=>{root.classList.remove('open');root.setAttribute('aria-hidden','true');document.body.classList.remove('v37-guide-open');};
  root.querySelector('#v37Close').onclick=close;root.querySelector('.v37-backdrop').onclick=close;
  root.querySelectorAll('.v37-filter').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;root.querySelectorAll('.v37-filter').forEach(x=>x.classList.toggle('active',x===b));render()});
  const guideBtn=document.createElement('button');guideBtn.id='v37GuideBtn';guideBtn.className='small-btn';guideBtn.textContent='☰ TV Guide';guideBtn.onclick=open;document.querySelector('.toolbar-actions')?.prepend(guideBtn);
  window.addEventListener('iptv:channels-ready',render,{passive:true});window.addEventListener('storage',render,{passive:true});setInterval(()=>root.classList.contains('open')&&clock(),30000);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&root.classList.contains('open'))close()});
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
