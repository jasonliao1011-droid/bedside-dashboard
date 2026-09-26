(()=>{
  const routes={
    'ChatGPT':'com.openai.chat://',
    'YouTube':'youtube://',
    'YouTube Music':'shortcuts://run-shortcut?name=%E9%96%8B%E5%95%9F%20YouTube%20Music',
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
    button.replaceWith(link);
  });
})();
