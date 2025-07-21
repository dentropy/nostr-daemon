import { config_json_schema } from "./configJsonSchema.js";

import { nip19, finalizeEvent, getPublicKey, Relay, nip04 } from 'nostr-tools'
import fs from "node:fs";
import Ajv from "npm:ajv";
import NDK from "@nostr-dev-kit/ndk";

import { eventKindCheckPublish } from "../../lib/eventKindCheckPublish.js";
import { getNostrConvoAndDecrypt } from "../../lib/getNostrConvoAndDecrypt.js";
import { botSetupDefault } from "../../lib/botSetupDefault.js";

import { botSubscriptionThread } from "../../lib/botSubscriptonThread.js";
import { botSubscriptionDM } from "../../lib/botSubscriptionDM.js";
import { botSubscriptionDMNIP44 } from "../../lib/botSubscriptionDMNIP44.js";

function generateResponse(convo) {
    console.log("generateResponse_Ran")
    console.log(convo)
    let response_contents = "response_contents"
    if (convo[convo.length - 1].decrypted_content.toLowerCase().includes("ping")) {
        response_contents = "pong"
    } else {
        response_contents = "I didn't see a ping in there"
    }
    return response_contents
}

export async function pingBot(args) {
    let config = await botSetupDefault(args, config_json_schema)
    if (config.THREADS_ENABLED == false && config.DMS_ENABLED == false) {
        console.log("You need to enable THREADS_ENABLED or DMS_ENABLED for the bot to work")
        process.exit()
    }
    const ndk = new NDK({
        explicitRelayUrls: config.relays,
    });
    await ndk.connect();
    if (config.THREADS_ENABLED) {
        botSubscriptionThread(ndk, args, config, generateResponse)
    }
    if (config.DMS_ENABLED) {
        botSubscriptionDM(ndk, args, config, generateResponse)
        botSubscriptionDMNIP44(ndk, args, config, generateResponse)
    }

}
