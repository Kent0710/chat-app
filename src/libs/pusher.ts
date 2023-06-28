import PusherServer from "pusher"
import PusherClient from "pusher-js"

export const pusherServer = new PusherServer({
    appId: "1620740",
    key: "3bf15af436f1ac8f2d25",
    secret: "fe7f1683b4d5cc4301e6",
    cluster: "ap1",
    useTLS: true,
});

export const pusherClient = new PusherClient(
    "3bf15af436f1ac8f2d25", {
        cluster : "ap1"
    }
)