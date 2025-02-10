// Validate CLI Args
// Load Config
// Validate Config
// Deal with Profile and NIP-65
// Start Listener


import { config_json_schema } from "./configJsonSchema.js";
import { nip19, finalizeEvent, getPublicKey, Relay } from 'nostr-tools'
import fs from "node:fs";
import Ajv from "npm:ajv";
import { eventKindCheckPublish } from "../../lib/eventKindCheckPublish.js";
import NDK from "@nostr-dev-kit/ndk";

function generateResponse(event){
  let response_contents = "response_contents"
  if (event.content.toLowerCase().includes("ping")) {
    response_contents = "pong"
  } else {
    response_contents = "I didn't see a ping in there"
  }
  return response_contents
}

export async function pingBot(args) {

  // Validate nsec is valid
  let nsec = "";
  try {
    nsec = nip19.decode(args.nsec).data;
  } catch (error) {
    console.log("Unable to decode nsec");
    console.log(error);
  }
  const npub = nip19.npubEncode(getPublicKey(nip19.decode(args.nsec).data))
  console.log(`Bot npub = ${npub}`)

  // Validate Config
  console.log("\nOur config below");
  console.log(args);
  // Load the config file_path
  let config = {};
  try {
    config = JSON.parse(fs.readFileSync(args.config_path));
  } catch (error) {
    console.log("Got error trying to read config file");
    console.log(error);
    process.error("")
  }
  console.log("Config is valid")
  const ajv = new Ajv();
  const valid = ajv.validate(config_json_schema, config);
  if (!valid) {
    console.log("Unable to validate config");
    console.log(ajv.errors);
    process.exit();
  }

  function mergeUniqueStrings(list1, list2) {
    return [...new Set([...list1, ...list2])];
  }
  const allRelays = mergeUniqueStrings(config.relays, config.nip65_metadata_profile_relays)

  // Publish Profile
  const profileEvent = await finalizeEvent({
    kind: 0,
    created_at: Math.floor(Date.now() / 1000),
    tags: [],
    content: JSON.stringify(config.bot_profile_json),
  }, nip19.decode(args.nsec).data);
  eventKindCheckPublish(allRelays, profileEvent)

  // Publish nip-65 Relay
  let relay_list_for_event = [];
  for (const relay of config.relays) {
    relay_list_for_event.push(["r", relay]);
  }
  const nip65RelayMetadataEvent = finalizeEvent({
    kind: 10002,
    created_at: Math.floor(Date.now() / 1000),
    tags: relay_list_for_event,
    content: "",
  }, nip19.decode(args.nsec).data);
  eventKindCheckPublish(allRelays, nip65RelayMetadataEvent)

  const ndk = new NDK({
    explicitRelayUrls: config.relays,
  });
  await ndk.connect();

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
      kind: raw_event.king,
      created_at: raw_event.created_at,
      pubkey: raw_event.pubkey,
    };
    console.log("WE RECEIVED AN EVENT")
    console.log(event)
    let response = "Bot still being developed"
    try {
      response = await generateResponse(event)
    } catch (error) {
      response = "Error in bot logic, please contact developer"
    }
    const signedEvent = finalizeEvent({
      kind: 4,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ["p", event.pubkey],
      ],
      content: response,
    }, nip19.decode(args.nsec).data)
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