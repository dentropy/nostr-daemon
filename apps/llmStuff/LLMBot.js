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

async function generateResponse(convo, bot_config) {
    console.log("Processing resposne for LLMBot")
    let slashCommandResult = LLMSlashCommandConvoParser(convo, bot_config.config.LLM_MODELS_SUPPORTED);
    console.log("slashCommandResult")
    console.log(slashCommandResult)
    
    if (typeof(slashCommandResult) == typeof ("")) {
        return slashCommandResult
    }
    try {
        const ai_assistent_account = getPublicKey(nip19.decode(bot_config.args.nsec).data)
        const llm_messages = []
        console.log("convo_output")
        console.log(convo)
        for (const message of slashCommandResult.parsed_convo) {
            if (message.decrypted_content != "") {
                if (message.pubkey == ai_assistent_account) {
                    llm_messages.push({
                        role: "assistant",
                        content: message.decrypted_content
                    })
                } else {
                    llm_messages.push({
                        role: "user",
                        content: message.decrypted_content
                    })
                }
            }
        }
        console.log("llm_messages")
        console.log(llm_messages)
        if ( llm_messages.length == 0 ) {
            return "We cound't find any messages of substance"
        }
        let llm_response = await fetch(bot_config.config.LLM_URL, {
            method: "POST",
            body: JSON.stringify({
                "model": slashCommandResult.model_selected,
                "messages": llm_messages,
                "max_tokens": 2048,
                "stream": false
            }),
            headers: {
                "Content-Type": "application/json",
                "anthropic-version": "2023-06-01",
                "x-api-key": bot_config.config.LLM_API_KEY
            },
        });
        llm_response = await llm_response.json()
        console.log(llm_response)
        console.log("Got our response")
        console.log(llm_response.content[0].text)
        if (llm_response.content[0].text == undefined) {
            return "Error with llm bot please try again or contact developer"
        }
        return llm_response.content[0].text
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
    const bot_config = {
        args: args,
        config: config
    }
    const ndk = new NDK({
        explicitRelayUrls: config.relays,
    });
    await ndk.connect();
    if (config.THREADS_ENABLED) {
        botSubscriptionThread(ndk, args, config, generateResponse, bot_config)
    }
    if (config.DMS_ENABLED) {
        botSubscriptionDM(ndk, args, config, generateResponse, bot_config)
    }
}
