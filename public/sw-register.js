const regiesterSW = async () => {
    if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.register("./sw.js");
        // reg.showNotification("Hello Push Notification")
    }
}

const requestNotificationPermission = async () => {
    if ("Notification" in window) {
        const permission = await Notification.requestPermission()
        const registration = await navigator.serviceWorker.getRegistration()

        console.log(permission);
        if (permission == "granted") {
            console.log("permission", permission);
            registration.showNotification("Hello World", {
                actions: [{ action: 'archive', title: "Archive" }],
                badge: "assets/icons/badge_icon.png",
                body: "this is body",
            })
        } else {
            console.log("Permission not granted");
        }
    }
}

regiesterSW()
// requestNotificationPermission()