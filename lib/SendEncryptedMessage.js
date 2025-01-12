/*
Inputs
  * NSEC
  * NPUB
  * NOSTR_RELAYS
  * NOSTR_MESSAGE
*/

import { nostrGet } from "./lib/nostrGet.js";
import { nip04, nip19 } from "nostr-tools";
import { finalizeEvent, verifyEvent } from 'nostr-tools'
import { Relay } from 'nostr-tools/relay'

let nostr_message = process.env.NOSTR_MESSAGE;
if (nostr_message == "" || nostr_message == undefined) {
  console.log(
    `You need to specify a nostr message via the environment variable NOSTR_MESSAGE`,
  );
  process.exit();
} else {
  console.log(`\nYour nostr message is ${nostr_message}`);
}

let npub = process.env.NPUB;
console.log(npub);
if (npub == "" || npub == undefined) {
  console.log(
    `You did not set the NPUB environment variable with your nostr key`,
  );
  process.exit();
} else {
  console.log(`\nYour npub is ${npub}`);
}
const public_key = nip19.decode(npub).data;

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
  console.log(relays);
}

let nsec = process.env.NSEC;
console.log(nsec);
if (nsec == "" || nsec == undefined) {
  console.log(
    `You did not set the NSEC environment variable with your nostr key`,
  );
  process.exit();
} else {
  console.log(`\nYour nsec is ${nsec}`);
}
const private_key = nip19.decode(nsec).data;

// Setup filter
let unix_time = Math.floor((new Date()).getTime() / 1000);
let nostr_filter = {
  // "ids": ["85fb734453ea95e5147ff5d152e33102b7ac48aa827b59c33446d81374305d33"]
  // since: unix_time - 1000000,
  kinds: [10002],
  // "#p": accounts[1].public_key
  authors: [public_key],
};


// Get NIP65 Events
let nip65_events = await nostrGet(relays, nostr_filter);


// Get a list of new Relays from NIP65 Event
let nip65_relays = []
for(let event of nip65_events){
    for(let tag of event["tags"]){
        if(tag[0] == "r"){
            if(tag[1] != undefined){
                nip65_relays.push(tag[1])
            }
        }
    }
}


// Check if nip65 relays exist otherwise use default relay list
if(nip65_relays.length == 0){
    nip65_relays = relays
}


// Create encrypted event
let ciphertext = await nip04.encrypt(private_key, public_key, nostr_message)
let signedEvent = finalizeEvent({
    kind: 4,
    created_at: Math.floor(Date.now() / 1000),
    tags: [ 
      ["p", public_key]
    ],
    content: ciphertext,
  }, private_key)
if(!verifyEvent(signedEvent)){
    console.log("Generated event could not be verified")
}
console.log(signedEvent)

// Loop NIP65 through relays sending event
for(const relay_url of nip65_relays){
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
