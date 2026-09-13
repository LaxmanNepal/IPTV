(()=>{
 const init=()=>{
  const input=document.querySelector('#searchInput'),box=document.querySelector('#headerSearch');
  if(!input||!box)return;
  let panel=document.querySelector('#searchSuggestions');
  if(!panel){panel=document.createElement('div');panel.id='searchSuggestions';panel.setAttribute('role','listbox');box.appendChild(panel)}
  const hide=()=>{panel.classList.remove('show');panel.innerHTML=''};
  const render=()=>{
   const q=input.value.trim().toLowerCase();
   if(!q){hide();return}
   const source=[...document.querySelectorAll('#channelList .channel')];
   const matches=source.filter(b=>b.textContent.toLowerCase().includes(q)).slice(0,8);
   panel.innerHTML='';
   if(!matches.length){panel.innerHTML='<div class="search-empty">No channels found</div>';panel.classList.add('show');return}
   matches.forEach((original,i)=>{
    const item=document.createElement('button');item.type='button';item.className='search-suggestion';item.setAttribute('role','option');item.innerHTML=original.innerHTML;
    item.addEventListener('click',e=>{e.preventDefault();input.value=original.querySelector('.channel-info strong')?.textContent||original.textContent.trim();input.dispatchEvent(new Event('input',{bubbles:true}));original.click();hide();input.blur()});
    panel.appendChild(item);
   });
   panel.classList.add('show');
  };
  input.addEventListener('input',()=>requestAnimationFrame(render));
  input.addEventListener('focus',()=>{if(input.value.trim())render()});
  input.addEventListener('keydown',e=>{if(e.key==='Escape')hide();if(e.key==='ArrowDown'){const x=panel.querySelector('.search-suggestion');if(x){e.preventDefault();x.focus()}}});
  document.addEventListener('pointerdown',e=>{if(!box.contains(e.target))hide()},{capture:true,passive:true});
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
