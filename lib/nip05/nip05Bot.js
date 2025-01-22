import fs from 'node:fs'
import Ajv from 'npm:ajv'
import NDK from "@nostr-dev-kit/ndk";
import { Relay, nip19, nip04, finalizeEvent, verifyEvent, getPublicKey } from 'nostr-tools'
import { nip05SlashCommand_parser } from './nip05SlashCommandParser.js'
import { SimplePool } from "nostr-tools/pool";
import { RetriveThread } from "../RetriveThread.js";

export async function nip05bot(args, options) {
    // Validate Config
    console.log(args)
    // Load the config file_path
    let config = {}
    try {
        config = JSON.parse(fs.readFileSync(args.config_path));
    } catch (error) {
        console.log("Got error trying to read config file")
        console.log(error)
    }
    // Validate nsec is valid
    let nsec = ""
    try {
        nsec = nip19.decode(args.nsec).data
    } catch (error) {
        console.log("Unable to decode nsec")
        console.log(error)
    }
    // Validate the Config
    // Thanks https://transform.tools/json-to-json-schema
    const config_json_schema = {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "title": "Generated schema for Root",
        "type": "object",
        "properties": {
            "relays": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "domain_names": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "domain_name": {
                            "type": "string"
                        },
                        "update_method": {
                            "type": "string"
                        },
                        "config": {
                            "type": "object",
                            "properties": {},
                            "required": []
                        }
                    },
                    "required": [
                        "domain_name",
                        "update_method",
                        "config"
                    ]
                }
            }
        },
        "required": [
            "relays",
            "domain_names"
        ]
    }
    const ajv = new Ajv()
    const valid = ajv.validate(config_json_schema, config)
    if (!valid) {
        console.log("Unable to validate config")
        console.log(ajv.errors)
        process.exit()
    }
    if (!("relays" in config)) {
        console.log(`relays key is missing in your config=${args.config_path}`);
        process.exit()
    }
    if (typeof (config.relays) != typeof ([])) {
        console.log(`relays requires a list of strings where each string is a NOSTR relay`);
        process.exit()
    }
    if (!("domain_names" in config)) {
        console.log(`domain_names key is missing in your config=${args.config_path}`);
        process.exit()
    }
    if (typeof (config.domain_names) != typeof ({})) {
        console.log(`key domain_names requires each domain configured to be a key object pair`);
        process.exit()
    }
    for (const domain_name in config.domain_names) {
        if (!("update_method" in config.domain_names[domain_name])) {
            console.log(`For config=${args.config_path}\nUnder key ".domain_names"\nupdate_method is missing`);
            process.exit()
        }
    }
    // The JSONSchema used by ajv above does not valite what is validated below
    for (const domain_name_index in config.domain_names) {
        if (config.domain_names[domain_name_index].update_method == "scp") {
            if (!("SCP_HOST" in config.domain_names[domain_name_index].config)) {
                console.log(`Invalid Config, domain_name=${domain_name_index} method is missing SCP_HOST`);
                process.exit()
            }
            if (!("SCP_PATH" in config.domain_names[domain_name_index].config)) {
                console.log(`Invalid Config, domain_name=${domain_name_index} method is missing SCP_PATH`);
                process.exit()
            }
        }
        if (config.domain_names[domain_name_index].update_method == "filepath") {
            if (!("NOSTR_JSON_PATH" in config.domain_names[domain_name_index].config)) {
                console.log(`Invalid Config, domain_name=${domain_name_index} method is missing NOSTR_JSON_PATH`);
                process.exit()
            }
        }
    }
    // #TODO Configure Bot Profile
    // #TODO Configure NIP65
    // #TODO Send event kind 1 with instructions on how to use the bot
    // Actually setup the listning bot
    const myPool = new SimplePool();
    const ndk = new NDK({
        explicitRelayUrls: config.relays,
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
        if (getPublicKey(nip19.decode(args.nsec).data) != event.pubkey) {
            // Process Slash Command Logic
            let convo = await RetriveThread(relays, event_id);
            let slash_command_results = nip05SlashCommand_parser(convo, config)
            if (typeof(slash_command_results) == typeof("")){
                const signedEvent = finalizeEvent({
                    kind: 1,
                    created_at: Math.floor(Date.now() / 1000),
                    tags: [
                      ["p", convo[0].pubkey],
                      ["e", convo[0].id, "", "root"],
                      ["e", convo[convo.length - 1].id, "", "reply"],
                    ],
                    content: llm_response,
                  }, nip19.decode(nsec).data);
                  console.log("signed_event");
                  console.log(signedEvent);
                  await myPool.publish(config.relays, signedEvent);
            }
            // Save to /tmp/nostr.json
            // await Deno.writeTextFile('/tmp/nostr.json', JSON.stringify(result));
            // Run the scp command
            // await new Deno.Command(`scp /tmp/nostr.json ${REMOTE_HOST}:${REMOTE_PATH}`)
        }
    })

}