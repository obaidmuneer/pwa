const CACHE_NAME = "assets";
const urlsToCache = ["sw-register.js", "/", "app.mjs"];

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache)
        })
    )
})

// self.addEventListener("fetch", (e) => {
//     e.respondWith(
//         caches.match(e.request).then(cachedResponse => {
//             if (cachedResponse) {
//                 console.log(cachedResponse, "this is cachedResponse");
//                 return cachedResponse;
//             }
//             return fetch(e.request).then(response => {
//                 console.log(response, "this is response");
//                 // if (!response || response.status !== 200 || response.type !== 'basic') {
//                 //     return response;
//                 // }
//                 const responseToCache = response.clone();
//                 caches.open(CACHE_NAME).then(cache => {
//                     cache.put(e.request, responseToCache);
//                 });
//                 return response;
//             });
//         })
//     );
// });


self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches.match(e.request).then(cachedResponse => {
            return fetch(e.request).then(response => {
                console.log(response, "this is response");
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(e.request, responseToCache);
                });
                return response || cachedResponse;
            });
        })
    );
});
