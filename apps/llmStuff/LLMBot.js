import { config_json_schema } from "./configJsonSchema.js";

import { nip19, finalizeEvent, getPublicKey, Relay, nip04 } from 'nostr-tools'
import fs from "node:fs";
import Ajv from "npm:ajv";
import NDK from "@nostr-dev-kit/ndk";
import LLM from "@themaximalist/llm.js";

import { eventKindCheckPublish } from "../../lib/eventKindCheckPublish.js";
import { getNostrConvoAndDecrypt } from "../../lib/getNostrConvoAndDecrypt.js";
import { botSetupDefault } from "../../lib/botSetupDefault.js";

import { botSubscriptionThread } from "../../lib/botSubscriptonThread.js";
import { botSubscriptionDM } from "../../lib/botSubscriptionDM.js";

import LLMSlashCommandConvoParser from "./LLMSlashCommandConvoParser.js";

async function generateResponse(convo, bot_config) {
    console.log("Processing resposne for LLMBot")
    let slashCommandResult = LLMSlashCommandConvoParser(convo, bot_config.config);
    console.log("slashCommandResult")
    console.log(slashCommandResult)

    if (typeof (slashCommandResult) == typeof ("")) {
        return slashCommandResult
    }
    try {
        const ai_assistent_account = getPublicKey(nip19.decode(bot_config.args.nsec).data)
        const llm_messages = []
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
        if (llm_messages.length == 0) {
            return "We cound't find any messages of substance"
        }
        // let llm_response = await fetch(bot_config.config.LLM_URL, {
        //     method: "POST",
        //     body: JSON.stringify({
        //         "model": slashCommandResult.model_selected,
        //         "messages": llm_messages,
        //         "max_tokens": 2048,
        //         "stream": false
        //     }),
        //     headers: {
        //         "Content-Type": "application/json",
        //         "anthropic-version": "2023-06-01",
        //         "x-api-key": bot_config.config.LLM_API_KEY
        //     },
        // });
        // llm_response = await llm_response.json()

        // We gotta match the Nickname to the config
        let llm_config = ""
        console.log("PAUL_WAS_HERE")
        console.log(slashCommandResult.model_selected)
        for (const tmp_llm_config of bot_config.config.LLM_PROVIDERS) {
            if (tmp_llm_config.nickname == slashCommandResult.model_selected) {
                llm_config = tmp_llm_config
            }
        }
        if (llm_config == "") {
            console.log("ERROR with LLMBot, unable to LLM Configfind config")
            console.log("slashCommandResult:")
            console.log(slashCommandResult)
            process.error()
        }
        console.log("llm_config")
        console.log(llm_config)
        if (llm_config.apikey.charAt(0) == "$") {
            console.log("llm_config.apikey.slice(1)")
            console.log(llm_config.apikey.slice(1))
            llm_config.apikey = process.env[llm_config.apikey.slice(1)]
        }
        console.log("llm_config")
        console.log(llm_config)
        // Then substitute the ENV Variable
        let llm_response = "Error with LLM API, please contact developer"
        try {
            const llm = new LLM(llm_config)
            llm_response = await llm.chat(llm_messages, llm_config)
        } catch (error) {
            console.log("LLM API Error")
            console.log(error)
        }
        console.log("Got our response")
        console.log(llm_response)
        return llm_response
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
    if (config.LLM_API_KEY == "USE_CLI_ARGUMENT") {
        config.LLM_API_KEY = args.LLM_API_KEY
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
