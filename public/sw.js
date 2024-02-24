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
                // console.log(response, "this is response");
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(e.request, responseToCache);
                });
                return response || cachedResponse;
            });
        })
    );
});



function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

const savePushNotification = async (subcription) => {
    const res = await fetch("/save-subscription", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(subcription)
    })
    console.log(await res.text());
}

self.addEventListener("activate", async (e) => {
    const subcribe = await self.registration.pushManager.getSubscription()
    console.log(subcribe, "subcribes");
    // add logic if client already subscribed don't subscribe again

    const res = await fetch("/get-public-key")
    console.log(res);
    const publicKey = await res.text()
    // console.log(publicKey, "this is public key");

    const sub = await self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(publicKey)
    });
    console.log(sub, "this is sub");
    await savePushNotification(sub)
})

self.addEventListener("push", (e) => {
    console.log(e, "this is e");
    const parseData = JSON.parse(e.data.text())
    console.log(parseData, "this is parsedata");
    self.registration.showNotification(parseData.notification.title, { body: parseData.notification.body, badge: "assets/icons/badge_icon.png" })
})

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    if (event.action === 'archive') {
        console.log(event, "this is event");
    }
}, false);
