
export async function nip05CheckNostrJsonUpdate(command, config, nostr_dot_json) {
    // Fetch nostr_dot_json if we don't have it already
    console.log(nostr_dot_json)
    console.log(command.data.domain_name)
    if (nostr_dot_json[command.data.domain_name] == undefined) {
        let result = ""
        try {
            result = await fetch(`https://${command.data.domain_name}/.well-known/nostr.json`)
        } catch (error) {
            console.error(error)
            try {
                result = await fetch(`http://${command.data.domain_name}/.well-known/nostr.json`)
            } catch (error) {
                console.error(error)
            }
        }
        try {
            nostr_dot_json[command.data.domain_name] = await result.json()
            console.log("TROUBLESHOOT")
            console.log(`http://${command.data.domain_name}/.well-known/nostr.json`)
            console.log(nostr_dot_json[command.data.domain_name])
        } catch (error) {
            console.error(error)
        }
    }
    if (command.command == "request") {
        // Check that username already exists
        if (Object.keys(nostr_dot_json[command.data.domain_name].names).includes(command.data.user_name.toLowerCase())) {
            return `user_name="${command.data.user_name.toLowerCase()}" has already been claimed`
        }
        nostr_dot_json[command.data.domain_name].names[command.data.user_name] = command.data.pubkey
        return {
            command: "update_nostr_dot_joson",
            data: {
                domain_name: command.data.domain_name,
                nostr_dot_json: nostr_dot_json[command.data.domain_name]
            }
        }
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