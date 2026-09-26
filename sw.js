const CACHE='bedside-dashboard-v17';
self.addEventListener('install',event=>{self.skipWaiting();});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith('bedside-dashboard-')).map(k=>caches.delete(k)));
    await clients.claim();
  })());
});
async function freshHtml(request){
  try{
    const r=await fetch(request,{cache:'no-store'});
    const type=r.headers.get('content-type')||'';
    if(!type.includes('text/html')) return r;
    let text=await r.text();
    text=text.replace(/shortcuts:\/\/run-shortcut\?name=[^\"'&< ]+/g,'shortcuts://run-shortcut?name=YTMusic');
    const headers=new Headers(r.headers);
    headers.delete('content-length');
    headers.delete('content-encoding');
    return new Response(text,{status:r.status,statusText:r.statusText,headers});
  }catch(e){
    return fetch(request);
  }
}
self.addEventListener('fetch',event=>{
  if(event.request.mode==='navigate'){
    event.respondWith(freshHtml(event.request));
  }
});
