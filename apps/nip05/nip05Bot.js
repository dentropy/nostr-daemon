import { config_json_schema } from "./configJsonSchema.js";

import { nip19, finalizeEvent, getPublicKey, Relay, nip04 } from 'nostr-tools'
import fs from "node:fs";
import Ajv from "npm:ajv";
import NDK from "@nostr-dev-kit/ndk";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";

import { eventKindCheckPublish } from "../../lib/eventKindCheckPublish.js";
import { getNostrConvoAndDecrypt } from "../../lib/getNostrConvoAndDecrypt.js";
import { botSetupDefault } from "../../lib/botSetupDefault.js";

import { botSubscriptionThread } from "../../lib/botSubscriptonThread.js";
import { botSubscriptionDM } from "../../lib/botSubscriptionDM.js";

import { nip05BotEventReaction } from "./nip05BotEventReaction.js";
import { nip05CheckNostrJsonUpdate } from "./nip05CheckNostrJsonUpdate.js";
import { nip05UpdateNostrDotJson } from "./nip05UpdateNostrDotJson.js";

async function generateResponse(convo, bot_config) {
    return await nip05BotEventReaction(bot_config.args, convo, bot_config.config, bot_config.nostr_dot_json);
}

export async function nip05bot(args) {
    let config = await botSetupDefault(args, config_json_schema)

    console.log("Doing additional config validation")
    for (const domain_name_index in config.domain_names) {
        if (config.domain_names[domain_name_index].update_method == "rsync") {
            if (!("REMOTE_USER" in config.domain_names[domain_name_index].config)) {
                console.log(
                    `Invalid Config, domain_name=${config.domain_names[domain_name_index].domain_name
                    } method is missing REMOTE_USER`,
                );
                process.exit();
            }
            if (!("REMOTE_HOST" in config.domain_names[domain_name_index].config)) {
                console.log(
                    `Invalid Config, domain_name=${config.domain_names[domain_name_index].domain_name
                    } method is missing REMOTE_HOST`,
                );
                process.exit();
            }
            if (!("REMOTE_PATH" in config.domain_names[domain_name_index].config)) {
                console.log(
                    `Invalid Config, domain_name=${config.domain_names[domain_name_index].domain_name
                    } method is missing HOST_PATH`,
                );
                process.exit();
            }
            if (!("REMOTE_PORT" in config.domain_names[domain_name_index].config)) {
                console.log(
                    `Invalid Config, domain_name=${config.domain_names[domain_name_index].domain_name
                    } method is missing REMOTE_PORT`,
                );
                process.exit();
            }
        }
        if (config.domain_names[domain_name_index].update_method == "filepath") {
            if (
                !("NOSTR_JSON_PATH" in config.domain_names[domain_name_index].config)
            ) {
                console.log(
                    `Invalid Config, domain_name=${config.domain_names[domain_name_index].domain_name
                    } method is missing NOSTR_JSON_PATH`,
                );
                process.exit();
            }
        }
        console.log("Config if definaly valid\n\n")

        console.log("\nFetching nostr.json for all the domains configured")
        let nostr_dot_json = {}
        for (const domain_name_config of config.domain_names) {
            if (nostr_dot_json[domain_name_config.domain_name] == undefined) {
                let result = ""
                try {
                    result = await fetch(`https://${domain_name_config.domain_name}/.well-known/nostr.json`)
                } catch (error) {
                    console.error(error)
                    try {
                        result = await fetch(`http://${domain_name_config.domain_name}/.well-known/nostr.json`)
                    } catch (error) {
                        console.error(error)
                    }
                }
                try {
                    nostr_dot_json[domain_name_config.domain_name] = await result.json()
                    // console.log("TROUBLESHOOT")
                    // console.log(`http://${domain_name_config.domain_name}/.well-known/nostr.json`)
                    // console.log(nostr_dot_json[domain_name_config.domain_name])
                } catch (error) {
                    console.error(error)
                }
            }
        }

        console.log("\nConfiguring username for bot across all domain names at once")
        for (const domain_name_config of config.domain_names) {
            console.log("Configuring Domain Name:");
            console.log(domain_name_config);
            try {
                delete nostr_dot_json[domain_name_config.domain_name].names[domain_name_config.bot_username]
            } catch (error) {
                console.log(`username=${domain_name_config.bot_username} was not already set for domain_name=${domain_name_config.domain_name}`)
            }
            const command = {
                command: "request",
                data: {
                    domain_name: domain_name_config.domain_name,
                    user_name: domain_name_config.bot_username,
                    pubkey: bytesToHex(nip19.decode(args.nsec).data),
                },
            };
            const update_command_nostr_dot_json = await nip05CheckNostrJsonUpdate(
                command,
                config,
                nostr_dot_json,
            );
            await nip05UpdateNostrDotJson(
                update_command_nostr_dot_json.data.nostr_dot_json,
                update_command_nostr_dot_json,
                config,
            );
        }

        const bot_config = {
            args: args,
            config: config,
            nostr_dot_json: nostr_dot_json
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
}