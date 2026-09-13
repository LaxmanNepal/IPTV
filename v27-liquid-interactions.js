(()=>{
 const init=()=>{
  const header=document.querySelector('.topbar');
  const nav=document.querySelector('.mobile-nav');
  const search=document.querySelector('#headerSearch');
  const input=document.querySelector('#searchInput');
  if(!header)return;
  let lastY=window.scrollY;
  const sync=()=>{
   const y=window.scrollY||0;
   header.classList.toggle('liquid-scrolled',y>12);
   if(nav)nav.classList.toggle('liquid-nav-scrolled',y>80);
   lastY=y;
  };
  sync();
  window.addEventListener('scroll',sync,{passive:true});
  if(nav){
   nav.querySelectorAll('button').forEach(btn=>{
    btn.addEventListener('pointerdown',()=>{
     nav.querySelectorAll('button').forEach(x=>x.classList.remove('liquid-pressed'));
     btn.classList.add('liquid-pressed');
     setTimeout(()=>btn.classList.remove('liquid-pressed'),260);
    },{passive:true});
   });
  }
  if(input&&search){
   input.addEventListener('focus',()=>search.classList.add('liquid-focus'),{passive:true});
   input.addEventListener('blur',()=>search.classList.remove('liquid-focus'),{passive:true});
  }
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
