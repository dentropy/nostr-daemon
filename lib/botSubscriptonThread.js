import { nip19, finalizeEvent, getPublicKey, Relay, nip04 } from 'nostr-tools'
import fs from "node:fs";
import Ajv from "npm:ajv";

import { RetriveThread } from "./RetriveThread.js";

export async function botSubscriptionThread(ndk, args, config, generateResponse) {
      let unix_time = Math.floor((new Date()).getTime() / 1000);
      let default_filter = {
        "kinds": [1],
        "#p": getPublicKey(nip19.decode(args.nsec).data),
        "since": unix_time - 10,
      };
      const defult_filter_subscription = await ndk.subscribe(default_filter);
      defult_filter_subscription.on("event", async (raw_event) => {
        const event = {
          content: raw_event.content,
          tags: raw_event.tags,
          id: raw_event.id,
          kind: raw_event.kind,
          created_at: raw_event.created_at,
          pubkey: raw_event.pubkey,
        };
        console.log("WE RECEIVED AN EVENT")
        console.log(event)
    
        const convo = await RetriveThread(config.relays, event.id);
        for (const item in convo) {
          convo[item].decrypted_content = convo[item].content;
        }
    
        // Generate response CONTENT for event we want to reply with
        let response = "Bot still being developed"
        try {
          response = await generateResponse(convo, config, args)
        } catch (error) {
          response = "Error in bot logic, please contact developer"
        }
    
        // Geneate response TAGS for event we want to reply with
        let response_tags = []
        for (const tag of event.tags) {
          if (tag[0] == "e" && tag[3] == "root") {
            console.log("FOUND_ROOT_TAG")
            console.log(tag)
            response_tags.push(tag)
            response_tags.push(["e", event.id, "", "reply"])
          }
        }
        if (response_tags.length == 0) {
          response_tags.push(["e", event.id, "", "root"])
        }
        response_tags.push(["p", event.pubkey])
    
        // Send Response
        const signedEvent = finalizeEvent({
          kind: 1,
          created_at: Math.floor(Date.now() / 1000),
          tags: response_tags,
          content: response,
        }, nip19.decode(args.nsec).data)
        console.log("RESPONSE_TO_EVENT")
        console.log(signedEvent)
        // TODO Enable NIP05 and NIP65 lookup of user accounts
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
      })
}