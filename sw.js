const CACHE='riven-clicker-v4';

self.addEventListener('install',event=>{
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))
    )).then(()=>self.clients.claim())
  );
});

self.addEventListener('message',event=>{
  if(event.data && event.data.type==='SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET') return;

  // HTML: siempre intenta red primero para que GitHub Pages publique cambios.
  if(req.mode==='navigate' || req.destination==='document'){
    event.respondWith(
      fetch(req, {cache:'no-store'})
        .then(res=>{
          const copy=res.clone();
          caches.open(CACHE).then(c=>c.put(req,copy));
          return res;
        })
        .catch(()=>caches.match(req))
    );
    return;
  }

  // Recursos: red primero, caché como respaldo.
  event.respondWith(
    fetch(req).then(res=>{
      if(res.ok) {
        const copy=res.clone();
        caches.open(CACHE).then(c=>c.put(req,copy));
      }
      return res;
    }).catch(()=>caches.match(req))
  );
});
