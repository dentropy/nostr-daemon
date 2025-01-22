import fs from 'node:fs'
export function nip05bot(args, options) {
    // Validate Config
    console.log(args)
    // Read the config path
    let config = {}
    try {
        config = JSON.parse(fs.readFileSync(args.config_path));
    } catch (error) {
        console.log("Got error trying to read config file")
        console.log(error)
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
    for( const domain_name in config.domain_names){
        if( config.domain_names[domain_name].update_method == "scp") {
            if (!("SCP_HOST" in config.domain_names[domain_name])) {
                console.log(`Invalid Config, domain_name=${domain_name} method is missing SCP_HOST`);
                process.exit()
            }
            if (!("SCP_PATH" in config.domain_names[domain_name])) {
                console.log(`Invalid Config, domain_name=${domain_name} method is missing SCP_PATH`);
                process.exit()
            }
        }
        if( config.domain_names[domain_name].update_method == "filepath") {
            if (!("NOSTR_JSON_PATH" in config.domain_names[domain_name])) {
                console.log(`Invalid Config, domain_name=${domain_name} method is missing NOSTR_JSON_PATH`);
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