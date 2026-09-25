(()=>{
  const routes={
    'ChatGPT':'com.openai.chat://',
    'YouTube':'youtube://',
    'YouTube Music':'https://music.youtube.com/',
    'Calendar':'googlecalendar://'
  };
  document.querySelectorAll('.quick').forEach(button=>{
    const name=(button.querySelector('span:last-child')?.textContent||'').trim();
    const url=routes[name];
    if(!url)return;
    const link=document.createElement('a');
    link.className=button.className;
    link.innerHTML=button.innerHTML;
    link.href=url;
    link.setAttribute('aria-label','開啟 '+name+' App');
    link.style.textDecoration='none';
    if(name==='YouTube Music') link.rel='external';
    button.replaceWith(link);
  });
})();
