import NDK from "@nostr-dev-kit/ndk";
import { nip19, nip04, getPublicKey } from 'nostr-tools'
import { llm_dm_chatbot_response } from "./LLMDMChatbot.js";
import { check_NIP65_published } from "./LLMDMChatbot.js";
import Ajv from 'ajv'

export const LLMDMBotJSONSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Generated schema for Root",
  "type": "object",
  "properties": {
    "nsec": {
      "type": "string"
    },
    "nip_65_relays": {
      "type": "string"
    },
    "relays_for_dms": {
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
    "nip_65_relays",
    "relays_for_dms",
    "BASE_URL",
    "OPENAI_API_KEY"
  ]
}

export async function LLMDMBot(args) {
  // TODO Configure nip65 (Relay Metadata)
  // TODO Configure Profile
  // TODO Test LLM Connection

  // Argument Validation
  console.log("Arguments recieved by LLMThreadBot")
  console.log(JSON.stringify(args, null, 2))
  const ajv = new Ajv()
  const args_validator = ajv.validate(LLMDMBotJSONSchema, args)
  if (!args_validator) {
    console.log("We got an error running LLMDMBot, invalid input arguments")
    console.log(ajv.errors)
    console.log("Please make the input conform to the following JSONSchema")
    console.log(JSON.stringify(LLMDMBotJSONSchema, null, 2))
    return ajv.errors
  }

  await check_NIP65_published(
    args.nip_65_relays.split(","),
    args.nsec,
    args.relays_for_dms.split(","),
  );
  
  const npub = nip19.npubEncode(getPublicKey(nip19.decode(args.nsec).data));
  console.log(`Bot npub = ${npub}`)
  console.log("relays_to_store_dms");
  console.log(args.relays_to_store_dms);
  const ndk = new NDK({
    explicitRelayUrls: args.relays_for_dms.split(","),
  });

  await ndk.connect();

  const unix_time = Math.floor((new Date()).getTime() / 1000);
  const filter = {
    "kinds": [4],
    "#p": getPublicKey(nip19.decode(args.nsec).data),
    "since": unix_time - 10,
  };
  console.log(JSON.stringify(filter, null, 2));
  let sub = await ndk.subscribe(filter);
  sub.on("event", async (event) => {
    console.log("Recieved and event");
    console.log(`content           = ${event.content}`);
    console.log(`tags              = ${event.tags}`);
    console.log(`id                = ${event.id}`);
    console.log(`kind              = ${event.kind}`);
    console.log(`created_at        = ${event.created_at}`);
    console.log(`pubkey            = ${event.pubkey}`);
    if (event.kind == 4) {
      let decrypted_content = await nip04.decrypt(
        nip19.decode(args.nsec).data,
        event.pubkey,
        event.content,
      );
      console.log(`decrypted_content = ${decrypted_content}`);
    }
    console.log("");
    llm_dm_chatbot_response(
      args.relays_for_dms.split(","),
      args.nsec,
      args.nip_65_relays.split(","),
      nip19.npubEncode(event.pubkey),
      args.BASE_URL,
      args.OPENAI_API_KEY,
    );
  });
}
