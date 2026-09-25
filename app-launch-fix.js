(()=>{
  const routes={
    'ChatGPT':'chatgpt://',
    'YouTube':'youtube://',
    'YouTube Music':'youtubemusic://',
    'Calendar':'googlecalendar://'
  };
  document.querySelectorAll('.quick').forEach(button=>{
    const label=(button.textContent||'').trim().replace(/\s+/g,' ');
    const route=Object.entries(routes).find(([name])=>label.includes(name));
    if(!route)return;
    const url=route[1];
    const clean=button.cloneNode(true);
    clean.removeAttribute('data-fallback');
    clean.setAttribute('data-scheme',url);
    clean.onclick=e=>{
      e.preventDefault();
      e.stopPropagation();
      window.location.href=url;
    };
    button.replaceWith(clean);
  });
})();
