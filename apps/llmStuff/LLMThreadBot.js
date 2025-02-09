import NDK from "@nostr-dev-kit/ndk";
import { Relay, nip19, nip04, finalizeEvent, verifyEvent, getPublicKey } from 'nostr-tools'
import { llm_dm_chatbot_response } from "./LLMDMChatbot.js";
import { check_NIP65_published } from "./LLMDMChatbot.js";
import { llm_respond_to_thread } from "./LLMRespondToThread.js";
import Ajv from 'ajv'

export const LLMDMThreadJSONSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Generated schema for Root",
    "type": "object",
    "properties": {
      "nsec": {
        "type": "string"
      },
      "relays": {
        "type": "string"
      },
      "BASE_URL": {
        "type": "string"
      },
      "OPENAI_API_KEY": {
        "type": "string"
      }
    },
    "required": [
      "nsec",
      "relays",
      "BASE_URL",
      "OPENAI_API_KEY"
    ]
  }

export async function LLMThreadBot(args) {
        // TODO Configure nip65 (Relay Metadata)
        // TODO Configure Profile
        // TODO Test LLM Connection

        // Argument Validation
        console.log("Arguments recieved by LLMThreadBot")
        console.log(JSON.stringify(args, null, 2))
        const ajv = new Ajv()
        const args_validator = ajv.validate(LLMDMThreadJSONSchema, args)
        if (!args_validator) {
          console.log("We got an error running LLMDMThreadJSONSchema, invalid input arguments")
          console.log(ajv.errors)
          console.log("Please make the input conform to the following JSONSchema")
          console.log(JSON.stringify(LLMDMThreadJSONSchema, null, 2))
          return ajv.errors
        }


        const npub = nip19.npubEncode(getPublicKey(nip19.decode(args.nsec).data))
        console.log(`Bot npub = ${npub}`)
        const ndk = new NDK({
          explicitRelayUrls: args.relays.split(','),
        });
        
        await ndk.connect();
        
        let unix_time = Math.floor((new Date()).getTime() / 1000);
        let filter = {
          "kinds": [1],
          "#p": getPublicKey(nip19.decode(args.nsec).data),
          "since": unix_time - 10
        }
        console.log(JSON.stringify(filter, null, 2))
        let sub = await ndk.subscribe(filter);
        sub.on("event", async (event) => {
            console.log("Recieved and event")
            let raw_event = {
                content: event.content,
                tags: event.tags,
                id: event.id,
                kind: event.king,
                created_at: event.created_at,
                pubkey: event.pubkey
            }
            console.log("Raw Event")
            console.log(JSON.stringify(raw_event, null, 2))
            if( getPublicKey(nip19.decode(args.nsec).data) != event.pubkey) {
                llm_respond_to_thread(
                    args.relays.split(','),
                    args.nsec,
                    raw_event.id,
                    args.BASE_URL,
                    args.OPENAI_API_KEY
                )
            }
        })
}