import express from "express"
import cors from "cors"
import webpush from "web-push"
import "dotenv/config"

const PORT = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const subs = []

webpush.setVapidDetails(
    "mailto:obaidmuneer55@gmail.com",
    process.env.PUBLIC_VAPID_KEY,
    process.env.PRIVATE_VAPID_KEY,
)

app.use(express.static("public"))

app.get("/", (req, res) => {
    res.status(200).send("Server is running")
})

app.post("/save-subscription", (req, res) => {
    subs.push(req.body)
    console.log(subs);
    res.status(200).send("Subscription saved")
})

app.get("/get-public-key", (req, res) => {
    res.status(200).send(process.env.PUBLIC_VAPID_KEY)
})

app.get("/send-notification", async (req, res) => {
    try {

        // webpush.sendNotification(
        //     subs[0],
        //     "This is the notification body"
        // );

        const notificationPayload = {
            notification: {
                title: "New Notification",
                body: "This is the body of the notification",
                icon: "assets/icons/maskable_512.png"
            }
        }

        const expiredSubs = []

        Promise.all(subs.map((sub, i) => webpush.sendNotification(sub, JSON.stringify(notificationPayload)))).catch(err => {
            console.error(err)
            if (err.statusCode === 410) {
                console.log(`Subscription invalid or expired:`, sub);
                expiredSubs.push(i)
            }
        })
        expiredSubs.forEach(i => subs.splice(i, 1))

        res.status(200).send("Notifications sent")
    } catch (error) {
        console.log(error);
        res.status(500).send("Error sending notification");
    }
})


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))