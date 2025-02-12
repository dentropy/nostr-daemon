import { nip19, finalizeEvent, getPublicKey, Relay, nip04 } from 'nostr-tools'
import fs from "node:fs";
import Ajv from "npm:ajv";

import { getNostrConvoAndDecrypt } from "./getNostrConvoAndDecrypt.js";

export async function botSubscriptionDM(ndk, args, config, generateResponse) {
    let unix_time = Math.floor((new Date()).getTime() / 1000);
    const dm_filter = {
        "kinds": [4],
        "#p": getPublicKey(nip19.decode(args.nsec).data),
        "since": unix_time - 10,
    };
    const dm_sub = await ndk.subscribe(dm_filter);
    dm_sub.on("event", async (raw_event) => {
        const event = {
            content: raw_event.content,
            tags: raw_event.tags,
            id: raw_event.id,
            kind: raw_event.king,
            created_at: raw_event.created_at,
            pubkey: raw_event.pubkey,
        };
        console.log("\nnip05 bot recieved kind 4 event, raw event below");
        console.log(JSON.stringify(event, null, 2));
        if (getPublicKey(nip19.decode(args.nsec).data) == event.pubkey) {
            console.log("Got message from not itself");
        } else {
            // Process Slash Command Logic
            const convo = await getNostrConvoAndDecrypt(
                config.relays,
                args.nsec,
                nip19.npubEncode(event.pubkey),
            );


            // Generate response CONTENT for event we want to reply with
            let response = "Bot still being developed"
            try {
                response = await generateResponse(convo, config, args)
            } catch (error) {
                response = "Error in bot logic, please contact developer"
            }

            // Send Response
            const encrypted_text = await nip04.encrypt(
                nip19.decode(args.nsec).data,
                nip19.decode(nip19.npubEncode(event.pubkey)).data,
                response,
            );
            const signedEvent = finalizeEvent({
                kind: 4,
                created_at: Math.floor(Date.now() / 1000),
                tags: [
                    ["p", convo[convo.length - 1].pubkey],
                ],
                content: encrypted_text,
            }, nip19.decode(args.nsec).data);
            console.log("signed_event");
            console.log(signedEvent);
            for (const relay_url of config.relays) {
                const relay = await Relay.connect(relay_url);
                try {
                    await relay.publish(signedEvent);
                    console.log(`Published event ${relay_url}`);
                } catch (error) {
                    console.log(`Could not publish to ${relay_url}`);
                    console.log(error);
                }
                relay.close()
            }
        }
    })
}