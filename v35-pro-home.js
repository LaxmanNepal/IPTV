(()=>{
const init=()=>{
 const main=document.querySelector('#top');if(!main||document.querySelector('#v35Home'))return;
 const esc=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
 const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||f)}catch{return JSON.parse(f)}};
 const logo=c=>c?.logo?`<img src="${esc(c.logo)}" alt="" loading="lazy" decoding="async" onerror="this.style.display='none'">`:'<span class="v35-logo-fallback">TV</span>';
 const play=c=>{if(!c)return;if(typeof window.__iptvPlay==='function')window.__iptvPlay(c);document.querySelector('[data-mobile-tab="home"]')?.click();setTimeout(()=>document.querySelector('#playerShell')?.scrollIntoView({behavior:'smooth',block:'start'}),100)};
 const section=(title,items,kind='rail')=>items.length?`<section class="v35-section"><div class="v35-section-head"><h2>${esc(title)}</h2><span>${items.length}</span></div><div class="v35-${kind}">${items.map((c,i)=>`<button class="v35-card" data-v35-id="${esc(c.id)}" style="--i:${i}"><span class="v35-card-logo">${logo(c)}</span><strong>${esc(c.name)}</strong><small>${esc(c.group||c.category||'Live TV')}</small><span class="v35-live">LIVE</span></button>`).join('')}</div></section>`:'';
 const render=()=>{
  const all=window.__iptvChannels||[];if(!all.length)return;
  const fav=new Set(read('laxmanIptvFavorites','[]'));const recentIds=read('laxmanIptvRecent','[]');
  const recent=recentIds.map(id=>all.find(c=>c.id===id)).filter(Boolean).slice(0,10);
  const favorites=all.filter(c=>fav.has(c.id)).slice(0,10);
  const lastId=localStorage.getItem('laxmanIptvLast');const featured=all.find(c=>c.id===lastId)||recent[0]||all[0];
  const groups=[...new Set(all.map(c=>c.group).filter(Boolean))].slice(0,6);
  const cats=groups.map(g=>({name:g,items:all.filter(c=>c.group===g).slice(0,10)}));
  const host=document.querySelector('#v35Home');
  host.innerHTML=`<div class="v35-hero"><div class="v35-hero-art">${logo(featured)}</div><div class="v35-hero-copy"><span class="v35-kicker">${lastId?'CONTINUE WATCHING':'LIVE NOW'}</span><h1>${esc(featured.name)}</h1><p>${esc(featured.group||featured.category||'Live television')} · Ready to watch</p><button class="v35-play" data-v35-id="${esc(featured.id)}">▶ Watch now</button></div></div>${section('Recently watched',recent)}${section('Favorites',favorites)}${cats.map(x=>section(x.name,x.items)).join('')}`;
  host.querySelectorAll('[data-v35-id]').forEach(b=>b.addEventListener('click',()=>play(all.find(c=>c.id===b.dataset.v35Id))));
 };
 const host=document.createElement('section');host.id='v35Home';host.setAttribute('aria-label','Pro TV home');
 const browse=document.querySelector('.browse-section');main.insertBefore(host,browse||main.querySelector('.watch-layout'));
 window.addEventListener('iptv:channels-ready',render,{passive:true});window.addEventListener('storage',render,{passive:true});
 setInterval(()=>document.body.classList.contains('mobile-channels-active')||render(),4000);render();
};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
