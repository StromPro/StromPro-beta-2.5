var CACHE='strompro-beta-2-5';
var SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(SHELL);}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){
  var req=e.request;if(req.method!=='GET')return;
  var url=new URL(req.url);
  if(url.origin===location.origin){
    /* app files: try the network first so updates arrive, fall back to the saved copy offline */
    e.respondWith(fetch(req).then(function(r){var cp=r.clone();caches.open(CACHE).then(function(c){c.put(req,cp);});return r;}).catch(function(){return caches.match(req).then(function(m){return m||caches.match('index.html');});}));
  }else if(/fonts\.(googleapis|gstatic)\.com$/.test(url.host)){
    /* fonts: keep after the first online visit */
    e.respondWith(caches.match(req).then(function(m){return m||fetch(req).then(function(r){var cp=r.clone();caches.open(CACHE).then(function(c){c.put(req,cp);});return r;});}));
  }
});
