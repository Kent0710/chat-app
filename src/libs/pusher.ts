import PusherServer from "pusher"
import PusherClient from "pusher-js"

export const pusherServer = new PusherServer({
    appId: "1628536",
    key: "2c57050693509d00c223",
    secret: "11a41b8738738d8dcdda",
    cluster: "ap1",
    useTLS: true,
});

export const pusherClient = new PusherClient(
    "2c57050693509d00c223", {
        cluster : "ap1"
    }
)