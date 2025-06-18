import { faker } from '@faker-js/faker';
import { Relay, finalizeEvent, nip19, generateSecretKey, getPublicKey, verifyEvent } from "nostr-tools";
import { Buffer } from "node:buffer"


let relay_urls = ["wss://t.mememap.net"]
let nsec = process.argv[2]
let secret_key = ""
if (nsec == undefined || nsec == "") {
    secret_key = generateSecretKey()
} else {
    secret_key = nip19.decode(nsec).data
}
console.log(secret_key)
let public_key = getPublicKey(secret_key)

console.log(`\nnsec   = ${nip19.nsecEncode(new Buffer.from(secret_key, "hex"))}`)
console.log(`npub   = ${nip19.npubEncode(public_key)}`)
console.log(`pubkey = ${getPublicKey(secret_key)}\n`)

const username = faker.internet.username();
let picture = faker.image.avatar()
let discription = faker.food.description()
const bannerUrl = faker.image.url();

let website = faker.internet.url()
let profile = {
    "name": username,
    "display_name": username,
    "nip05": `${username}.TLD`,
    "about": `THIS IS A TEST ACCOUNTn\ ${discription}`,
    "picture": picture,
    "banner": bannerUrl,
    "website": website
}

let profile_event = finalizeEvent({
    kind: 0,
    created_at: Math.floor(Date.now() / 1000),
    tags: [],
    content: JSON.stringify(profile),
}, secret_key)
let isGood = verifyEvent(profile_event)

console.log(`isGood = ${isGood}`)
console.log(profile_event)

let tags = []
for (const relay_url of relay_urls){
    tags.push(["r", relay_url])
}
let nip65_event = finalizeEvent({
    kind: 10002,
    created_at: Math.floor(Date.now() / 1000),
    tags: tags,
    content: JSON.stringify(profile),
}, secret_key)
let isGood2 = verifyEvent(nip65_event)

console.log(`isGood2 = ${isGood2}\n`)

console.log(profile_event)
console.log(nip65_event)

for (const relay_url of relay_urls) {
    const relay = new Relay(relay_url)
    // const relay = new Relay("wss://relay.mememaps.net")
    await relay.connect()
    let answer = await relay.publish(profile_event)
    await relay.publish(nip65_event)
    console.log(`Published to ${relay_url}`)
}