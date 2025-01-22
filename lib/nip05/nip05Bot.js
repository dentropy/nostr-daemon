import fs from 'node:fs'
import Ajv from 'npm:ajv'

export function nip05bot(args, options) {
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
    if (typeof(config.relays) != typeof([])) {
        console.log(`relays requires a list of strings where each string is a NOSTR relay`);
        process.exit()
    }
    if (!("domain_names" in config)) {
        console.log(`domain_names key is missing in your config=${args.config_path}`);
        process.exit()
    }
    if (typeof(config.domain_names) != typeof({})) {
        console.log(`key domain_names requires each domain configured to be a key object pair`);
        process.exit()
    }
    for( const domain_name in config.domain_names){
        if (!("update_method" in config.domain_names[domain_name])) {
            console.log(`For config=${args.config_path}\nUnder key ".domain_names"\nupdate_method is missing`);
            process.exit()
        }
    }
    // The JSONSchema used by ajv above does not valite what is validated below
    for( const domain_name_index in config.domain_names){
        if( config.domain_names[domain_name_index].update_method == "scp") {
            if (!("SCP_HOST" in config.domain_names[domain_name_index].config)) {
                console.log(`Invalid Config, domain_name=${domain_name_index} method is missing SCP_HOST`);
                process.exit()
            }
            if (!("SCP_PATH" in config.domain_names[domain_name_index].config)) {
                console.log(`Invalid Config, domain_name=${domain_name_index} method is missing SCP_PATH`);
                process.exit()
            }
        }
        if( config.domain_names[domain_name_index].update_method == "filepath") {
            if (!("NOSTR_JSON_PATH" in config.domain_names[domain_name_index].config)) {
                console.log(`Invalid Config, domain_name=${domain_name_index} method is missing NOSTR_JSON_PATH`);
                process.exit()
            }
        }
    }
    // Configure Bot Profile
    // Configure NIP65
    // Send event kind 1 with instructions on how to use the bot
    // Actually setup the listning bot
        // Parse the slash command

}