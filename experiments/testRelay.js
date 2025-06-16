import { sign } from 'crypto'
import { generateSecretKey, getPublicKey } from 'nostr-tools/pure'
import { finalizeEvent, verifyEvent } from 'nostr-tools/pure'


// let relay_url = "ws://localhost:6969"
let relay_url = "wss://t.mememap.net"
// let relay_url = "wss://relay.mememaps.net"
const nostrWebsocket = new WebSocket(relay_url)

console.log("relay_url="+relay_url)
// Send a Nostr Event
let sk = generateSecretKey() // `sk` is a Uint8Array
let pk = getPublicKey(sk) // `pk` is a hex string
var signedEvent = finalizeEvent({
    kind: 420,
    created_at: Math.floor(Date.now() / 1000),
    tags: [],
    content: "TEST " + String(new Date()),
}, sk);
// console.log(await(verifyEvent(signedEvent)))
console.log(JSON.stringify(signedEvent, null, 2))
nostrWebsocket.addEventListener('open', async function (event) {
    nostrWebsocket.send(JSON.stringify([
        "EVENT",
        signedEvent
    ]))
});
nostrWebsocket.addEventListener('message', function (event) {
    console.log(`nostrWebsocket Message ${event.data}`)
    if(JSON.parse(event.data)[0] == "OK") {
        console.log("IT WORKED")
    } else {
        console.log("IT FAILED")
    }
})