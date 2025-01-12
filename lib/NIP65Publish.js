/*
Inputs
  * NSEC
  * NOSTR_RELAYS
*/

import { finalizeEvent, verifyEvent } from "nostr-tools";
import * as nip19 from "nostr-tools/nip19";
import { Relay } from 'nostr-tools/relay'
import { nip04 } from 'nostr-tools'


let nsec = process.env.NSEC;
if (nsec == "" || nsec == undefined) {
  console.log(
    `You did not set the NSEC environment variable with your nostr key`,
  );
  process.exit();
} else {
  console.log(`\nYour nsec is ${nsec}`);
}
let private_key = nip19.decode(nsec).data;


let relays = process.env.NOSTR_RELAYS;
if (relays == "" || relays == undefined) {
  console.log(
    `You did not set the NOSTR_RELAYS environment variable, use commas to separate relays from one another, for example`,
  );
  console.log(
    `export NOSTR_RELAYS='wss://relay.newatlantis.top/,wss://nos.lol/' `,
  );
  process.exit();
} else {
  relays = relays.split(",");
  console.log(`\nYour relay list is`);
  console.log(relays)
}

let relay_event_tags = []
for(const relay_url of relays){
    relay_event_tags.push(["r", relay_url])
}

const signedEvent = finalizeEvent({
    kind: 10002,
    created_at: Math.floor(Date.now() / 1000),
    tags: relay_event_tags,
    content: "",
  }, private_key)
if(!verifyEvent(signedEvent)){
    console.log("Generated event could not be verified")
}

console.log("Your raw event")
console.log(JSON.stringify(signedEvent, null, 2))

for(const relay_url of relays){
    try {
        const relay = await Relay.connect(relay_url)
        await relay.publish(signedEvent);
        console.log(`Published Event to ${relay_url} success`);
    } catch (error) {
        console.log(`Published Event to ${relay_url} failure`);
        console.log(`    ${error}`)
    }   
}
process.exit()