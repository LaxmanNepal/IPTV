(()=>{
 const init=()=>{
  let deferred=null;
  const banner=document.createElement('div'); banner.className='v34-install-banner'; banner.innerHTML='<div><strong>Install Laxman IPTV</strong><span>Get the full-screen TV app experience.</span></div><button class="v34-install">Install</button><button class="v34-dismiss" aria-label="Dismiss">×</button>';
  document.body.appendChild(banner);
  const install=banner.querySelector('.v34-install');
  const dismiss=()=>banner.classList.remove('show');
  banner.querySelector('.v34-dismiss').onclick=dismiss;
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;setTimeout(()=>banner.classList.add('show'),1800)});
  install.onclick=async()=>{if(!deferred)return;deferred.prompt();try{await deferred.userChoice}catch(e){}deferred=null;dismiss()};
  window.addEventListener('appinstalled',()=>{deferred=null;dismiss();document.body.classList.add('pwa-installed')});
  if(window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone){document.body.classList.add('pwa-installed')}
  if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(()=>{}))}
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
