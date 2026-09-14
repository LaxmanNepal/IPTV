(()=>{
  const init=()=>{
    const nav=document.querySelector('.mobile-nav');
    const home=document.querySelector('#top');
    const channelsView=document.querySelector('#mobileChannelsView');
    const grid=document.querySelector('#mobileChannelsGrid');
    if(!nav||!home||!channelsView||!grid)return;
    const buttons=[...nav.querySelectorAll('[data-mobile-tab]')];
    let current='home';
    const setTab=(tab,animate=true)=>{
      if(tab===current&&!animate)return;
      const previous=current; current=tab;
      buttons.forEach(b=>b.classList.toggle('active',b.dataset.mobileTab===tab));
      document.body.classList.toggle('mobile-channels-active',tab==='channels');
      if(tab==='channels'){
        channelsView.classList.remove('mobile-view-exit');
        channelsView.classList.add('mobile-view-enter');
        render();
        requestAnimationFrame(()=>channelsView.classList.add('is-visible'));
        channelsView.setAttribute('aria-hidden','false');
      }else{
        channelsView.classList.remove('is-visible','mobile-view-enter');
        channelsView.classList.add('mobile-view-exit');
        channelsView.setAttribute('aria-hidden','true');
        home.scrollIntoView({behavior:animate?'smooth':'auto',block:'start'});
        setTimeout(()=>channelsView.classList.remove('mobile-view-exit'),320);
      }
      if(previous!==tab)window.scrollTo({top:0,behavior:animate?'smooth':'auto'});
    };
    const esc=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
    const logo=c=>c.logo?`<img src="${esc(c.logo)}" alt="" loading="lazy" decoding="async" onerror="this.outerHTML='<span class=\"mobile-channel-logo fallback\">TV</span>'>`:'<span class="mobile-channel-logo fallback">TV</span>';
    const render=()=>{
      const channels=window.__iptvChannels||[];
      if(!channels.length){grid.innerHTML='<div class="mobile-channel-empty">Loading channels…</div>';return}
      grid.innerHTML='';
      const frag=document.createDocumentFragment();
      channels.forEach((c,i)=>{
        const b=document.createElement('button');b.type='button';b.className='mobile-channel-card';b.style.setProperty('--card-i',Math.min(i,30));
        b.innerHTML=`<span class="mobile-channel-top">${logo(c)}<span class="mobile-channel-live">LIVE</span></span><strong>${esc(c.name)}</strong><span>${esc(c.group||c.category||'Live stream')}</span>`;
        b.onclick=()=>select(c,b);frag.appendChild(b);
      });
      grid.appendChild(frag);
    };
    const select=(c,button)=>{
      button.classList.add('is-selected');
      if(typeof window.__iptvPlay==='function')window.__iptvPlay(c);
      setTab('home',true);
      setTimeout(()=>{
        document.querySelector('#playerShell')?.scrollIntoView({behavior:'smooth',block:'start'});
        document.querySelectorAll('.mobile-nav [data-mobile-tab]').forEach(b=>b.classList.toggle('active',b.dataset.mobileTab==='home'));
      },80);
    };
    buttons.forEach(b=>b.addEventListener('click',e=>{e.preventDefault();setTab(b.dataset.mobileTab,true)}));
    window.addEventListener('iptv:channels-ready',render,{passive:true});
    render();
    setTab('home',false);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
