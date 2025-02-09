
export function nip05CheckNostrJsonUpdate(command, config, nostr_dot_json) {
    // #TODO we fetch nostr.json somewhere else now
    if (command.command == "request") {
        // Check that username already exists
        // #TODO we need to do better validation in here
        if (nostr_dot_json[command.data.domain_name] == undefined) {
            nostr_dot_json[command.data.domain_name] = {"names": {}, "relays": {}}
        }
        console.log("nostr_dot_json[command.data.domain_name]")
        console.log(nostr_dot_json[command.data.domain_name])
        if (Object.keys(nostr_dot_json[command.data.domain_name].names).includes(command.data.user_name.toLowerCase())) {
            return `user_name="${command.data.user_name.toLowerCase()}" has already been claimed`
        }
        nostr_dot_json[command.data.domain_name].names[command.data.user_name] = command.data.pubkey
        const result_data = {
            command: "update_nostr_dot_joson",
            data: {
                domain_name: command.data.domain_name,
                nostr_dot_json: nostr_dot_json[command.data.domain_name]
            }
        }
        // console.log("REQUEST_COMMAND")
        // console.log(result_data)
        return result_data
    }
    if (command.command == "set-relays") {
        // Validate that the user requesting the update has the nostr_dot_json
        if( command.data.pubkey == nostr_dot_json[command.data.domain_name]["names"][command.data.user_name] ) {
            nostr_dot_json[command.data.domain_name]["relays"][command.data.pubkey] = command.data.relays
            return {
                command: "update_nostr_dot_joson",
                data: {
                    domain_name: command.data.domain_name,
                    nostr_dot_json: nostr_dot_json[command.data.domain_name]
                }
            }
        }
        else {
            return "Error, you don't control that username"
        }
    }
    return "Error"
}