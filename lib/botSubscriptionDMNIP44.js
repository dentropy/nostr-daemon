import { nip19, finalizeEvent, getPublicKey, Relay, nip44 } from 'nostr-tools'

import { getNostrConvoAndDecryptNIP44 } from './getNostrConvoAndDecryptNIP44.js';

const keyStore = {};

// Function to add a key with a timestamp
function addKey(key, value) {
    keyStore[key] = {
        value,
        timestamp: Date.now()
    };
}

// Function to clear keys older than 6 seconds after a 3-second timeout
function clearOldKeys() {
    setTimeout(() => {
        console.log("CLEARING_OUT")
        const now = Date.now();
        for (let key in keyStore) {
            if (keyStore.hasOwnProperty(key)) {
                if (now - keyStore[key].timestamp > 6000) { // 6 seconds in milliseconds
                    console.log(`DELETTING_KEY=${key}`)
                    delete keyStore[key];
                }
            }
        }
    }, 3000);
}

export async function botSubscriptionDMNIP44(ndk, args, config, generateResponse, bot_config) {
    let unix_time = Math.floor((new Date()).getTime() / 1000);
    const dm_filter = {
        "kinds": [1059],
        "#p": getPublicKey(nip19.decode(args.nsec).data),
        "since": unix_time - 5000,
    };
    const dm_sub = await ndk.subscribe(dm_filter);
    console.log("NIP_44_ENABLED")
    dm_sub.on("event", async (raw_event) => {
        console.log("GOT_NIP_44_EVENT")
        clearOldKeys()
        console.log("keyStore")
        console.log(keyStore)
        if(keyStore.hasOwnProperty(raw_event.id)) {
            console.log(`Already have ${raw_event.id}`)
            return
        } else {
            console.log(`Adding ${raw_event.id}`)
            addKey(raw_event.id)
        }
        if(Object)
        console.log("RECIEVED_DM")
        const event = {
            content: raw_event.content,
            tags: raw_event.tags,
            id: raw_event.id,
            kind: raw_event.king,
            created_at: raw_event.created_at,
            pubkey: raw_event.pubkey,
        };
        console.log("\nBot recieved kind 1059 event, raw event below");
        console.log(JSON.stringify(event, null, 2));
        if (getPublicKey(nip19.decode(args.nsec).data) == event.pubkey) {
            console.log("Got message from not itself");
        } else {
            // Process Slash Command Logic
            const convo = await getNostrConvoAndDecryptNIP44(
                config.relays,
                args.nsec,
                nip19.npubEncode(event.pubkey),
            );
            console.log("GOT_CONVO")
            console.log(convo.length)


            // Generate response CONTENT for event we want to reply with
            let response = "Bot still being developed"
            try {
                response = await generateResponse(convo, bot_config)
            } catch (error) {

                console.log("Error in bot logic, please contact developer")
                console.log(error)
                response = "Error in bot logic, please contact developer"
            }

            // Send Response
            const key = nip44.getConversationKey(nip19.decode(args.nsec).data, nip19.decode(nip19.npubEncode(event.pubkey)).data)
            let kind14Ciphertext = nip44.encrypt(response, key)
            let unix_time = Math.floor((new Date()).getTime() / 1000);
            // let kind14Event = await sk1Signer.signEvent({ 
            //     kind: 14, 
            //     content: kind14Ciphertext, 
            //     tags: [["p", nip19.decode(nip19.npubEncode(event.pubkey)).data]], 
            //     created_at: unix_time 
            // })
            const kind14Event = finalizeEvent({
                kind: 14,
                created_at: unix_time,
                tags: [
                    ["p", nip19.decode(nip19.npubEncode(event.pubkey)).data],
                ],
                content: kind14Ciphertext,
            }, nip19.decode(args.nsec).data);
            let kind1059Ciphertext = nip44.encrypt(JSON.stringify(kind14Event), key)
            // let kind1059Event = await sk1Signer.signEvent({ 
            //     kind: 1059, 
            //     content: kind1059Ciphertext, 
            //     tags: [["p", nip19.decode(nip19.npubEncode(event.pubkey)).data]], 
            //     created_at: unix_time 
            // })
            const signedEvent = finalizeEvent({
                kind: 1059,
                created_at: unix_time,
                tags: [
                    ["p", nip19.decode(nip19.npubEncode(event.pubkey)).data],
                ],
                content: kind1059Ciphertext,
            }, nip19.decode(args.nsec).data);
            console.log("signed_event");
            console.log(signedEvent);
            console.log("\n\n\n")
            console.log("config.relays")
            console.log(config.relays)
            for (const relay_url of config.relays) {
                console.log("GOT RELAY_URL")
                console.log(relay_url)
                try {
                    const relay = await Relay.connect(relay_url);
                    await relay.publish(signedEvent);
                    console.log(`Published event ${relay_url} Success`);
                    relay.close()
                } catch (error) {
                    console.log(`Could not publish to ${relay_url} Failed`);
                    console.log(error);
                }
            }
        }
    })
}