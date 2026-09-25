(()=>{
  const routes={
    'ChatGPT':'com.openai.chat://',
    'YouTube':'youtube://',
    'YouTube Music':'vnd.youtube.music://music.youtube.com/',
    'Calendar':'googlecalendar://'
  };
  document.querySelectorAll('.quick').forEach(button=>{
    const label=(button.textContent||'').trim().replace(/\s+/g,' ');
    const route=Object.entries(routes).find(([name])=>label.includes(name));
    if(!route)return;
    const url=route[1];
    const link=document.createElement('a');
    link.className=button.className;
    link.innerHTML=button.innerHTML;
    link.href=url;
    link.setAttribute('aria-label','開啟 '+route[0]+' App');
    link.style.textDecoration='none';
    button.replaceWith(link);
  });
})();
