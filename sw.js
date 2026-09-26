const MODE_SCRIPT='<script src="./mode-system.js?v=1"></script>';
self.addEventListener('install',event=>{self.skipWaiting()});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith('bedside-dashboard-')).map(k=>caches.delete(k)));
    await clients.claim();
    const windows=await clients.matchAll({type:'window'});
    await Promise.all(windows.map(c=>c.navigate(c.url).catch(()=>{})));
  })());
});
async function freshHtml(request){
  try{
    const r=await fetch(request,{cache:'no-store'});
    const type=r.headers.get('content-type')||'';
    if(!type.includes('text/html'))return r;
    let text=await r.text();
    text=text.replace(/shortcuts:\/\/run-shortcut\?name=[^\"'&< ]+/g,'shortcuts://run-shortcut?name=YTMusic');
    if(!text.includes('mode-system.js'))text=text.replace('</body>',MODE_SCRIPT+'</body>');
    const headers=new Headers(r.headers);headers.delete('content-length');headers.delete('content-encoding');
    return new Response(text,{status:r.status,statusText:r.statusText,headers});
  }catch(e){return fetch(request)}
}
self.addEventListener('fetch',event=>{
  if(event.request.mode==='navigate'){event.respondWith(freshHtml(event.request));return}
  event.respondWith(fetch(event.request));
});
