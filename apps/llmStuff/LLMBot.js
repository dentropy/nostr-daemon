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

import LLMSlashCommandConvoParser from "./LLMSlashCommandConvoParser.js";

async function generateResponse(convo) {
    convo = LLMSlashCommandConvoParser(convo, [
        "llama3.2:latest",
        "llama2-uncensored:latest",
      ]);
    let selected_llm_model = convo.model_selected
    try {
        let llm_response = await fetch(`${BASE_URL}/chat/completions`, {
            method: "POST",
            body: JSON.stringify({
                "model": selected_llm_model,
                "messages": llm_messages,
                "stream": false
            }),
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
        });
        llm_response = await llm_response.json()
        return llm_response.choices[0].message.content
    } catch (error) {
        console.log("llm_response_error")
        console.log(error)
        return "Error with llm bot please try again or contact developer"
    }
}

export async function LLMBot(args) {
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
    }
}
