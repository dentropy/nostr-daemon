import { nip19, finalizeEvent, getPublicKey, Relay, nip04 } from 'nostr-tools'
import fs from "node:fs";
import Ajv from "npm:ajv";
import NDK from "@nostr-dev-kit/ndk";

import { eventKindCheckPublish } from "./eventKindCheckPublish.js";

export async function botSetupDefault(args, config_json_schema) {
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
    const ajv = new Ajv();
    const valid = ajv.validate(config_json_schema, config);
    if (!valid) {
        console.log("Unable to validate config");
        console.log(ajv.errors);
        process.exit();
    }
    console.log("Config is valid")

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

    return config
}