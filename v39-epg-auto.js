(()=>{
 const init=()=>{
  if(window.__v39EPG)return;window.__v39EPG=true;
  const PLAYLISTS=['Nepal.m3u','india.m3u'];
  const KEY='laxmanIptvEpgSource',CACHE='laxmanIptvEpgCacheV39',MAX_AGE=6*60*60*1000;
  const safeUrl=u=>{try{const x=new URL(u,location.href);return /^https?:$/.test(x.protocol)?x.href:''}catch{return ''}};
  const sourcesFromText=text=>{const out=[];const re=/(?:url-tvg|x-tvg-url|tvg-url|epg)\s*=\s*["']([^"']+)["']/ig;let m;while((m=re.exec(text))) {const u=safeUrl(m[1]);if(u&&!out.includes(u))out.push(u)}return out};
  const get=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch{return d}};
  const set=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
  const status=(text)=>{const s=document.querySelector('#v38Source');if(s)s.textContent=text;window.dispatchEvent(new CustomEvent('iptv:epg-status',{detail:{text}}))};
  const cacheRead=()=>get(CACHE,null);
  const cacheWrite=(xml,url)=>set(CACHE,{xml,url,updated:Date.now()});
  const apply=async(xml,url,label)=>{if(!xml)return false;try{if(typeof window.__v38SetEPG!=='function')return false;window.__v38SetEPG(xml,url);status(label||`${url} · EPG ready`);return true}catch(e){console.warn('V39 apply failed',e);return false}};
  const fetchXml=async url=>{const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(`HTTP ${r.status}`);const text=await r.text();if(!/<(?:tv|programme)\b/i.test(text))throw new Error('Not XMLTV');return text};
  const discover=async()=>{const found=[];await Promise.all(PLAYLISTS.map(async file=>{try{const r=await fetch(file,{cache:'no-store'});if(r.ok)found.push(...sourcesFromText(await r.text()))}catch(e){}}));return [...new Set(found)]};
  const refresh=async(force=false)=>{
   const manual=safeUrl(localStorage.getItem(KEY)||'');
   const cached=cacheRead();
   if(!force&&cached?.xml&&Date.now()-cached.updated<MAX_AGE){await apply(cached.xml,cached.url,`Cached EPG · updated ${new Date(cached.updated).toLocaleString()}`)}
   status('Finding EPG source…');
   const candidates=[...(manual?[manual]:[]),...(await discover())];
   if(!candidates.length){if(cached?.xml){await apply(cached.xml,cached.url,'Cached EPG · no source advertised today')}else status('No XMLTV source advertised by playlists');return}
   for(const url of candidates){try{status(`Loading EPG · ${new URL(url).hostname}`);const xml=await fetchXml(url);cacheWrite(xml,url);await apply(xml,url,`${url} · EPG updated`);return}catch(e){console.warn('V39 EPG source failed',url,e)}}
   if(cached?.xml)await apply(cached.xml,cached.url,'Cached EPG · refresh failed');else status('EPG source found, but browser could not load it');
  };
  const addUI=()=>{
   const statusBox=document.querySelector('.v38-status');if(!statusBox||document.querySelector('#v39EpgSettings'))return;
   const box=document.createElement('div');box.id='v39EpgSettings';box.innerHTML='<button id="v39Refresh" type="button">↻ Refresh EPG</button><button id="v39SourceBtn" type="button">⚙ Source</button><div id="v39SourcePanel" hidden><input id="v39SourceInput" type="url" placeholder="Optional XMLTV URL"><button id="v39SaveSource" type="button">Save</button><button id="v39ClearSource" type="button">Clear</button><small>Playlists are scanned automatically for XMLTV. Use a URL only if your provider does not advertise one.</small></div>';
   statusBox.after(box);
   const input=box.querySelector('#v39SourceInput');input.value=localStorage.getItem(KEY)||'';
   box.querySelector('#v39Refresh').onclick=()=>refresh(true);
   box.querySelector('#v39SourceBtn').onclick=()=>box.querySelector('#v39SourcePanel').toggleAttribute('hidden');
   box.querySelector('#v39SaveSource').onclick=()=>{const u=safeUrl(input.value.trim());if(!u){status('Enter a valid HTTP(S) XMLTV URL');return}localStorage.setItem(KEY,u);refresh(true)};
   box.querySelector('#v39ClearSource').onclick=()=>{localStorage.removeItem(KEY);input.value='';refresh(true)};
  };
  window.__v39RefreshEPG=()=>refresh(true);
  window.addEventListener('iptv:channels-ready',()=>{addUI();refresh(false)},{once:true});
  setTimeout(()=>{addUI();refresh(false)},1200);
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
