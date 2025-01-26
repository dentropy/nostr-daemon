
export async function nip05CheckNostrJsonUpdate(command, config, nostr_dot_json) {
    // Fetch nostr_dot_json if we don't have it already
    if (nostr_dot_json[command.data.domain_name] == null) {
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
            nostr_dot_json = await result.json()
            console.log("TROUBLESHOOT")
            console.log(`http://${command.data.domain_name}/.well-known/nostr.json`)
            console.log(nostr_dot_json)
        } catch (error) {
            console.error(error)
        }
    }
    if (command.command == "request") {
        // Check that username already exists
        if (Object.keys(nostr_dot_json.names).includes(command.data.user_name.toLowerCase())) {
            return `user_name="${command.data.user_name.toLowerCase()}" has already been claimed`
        }
        nostr_dot_json.names[command.data.user_name] = command.data.pubkey
        return {
            command: "update_nostr_dot_joson",
            data: {
                domain_name: command.data.domain_name,
                nostr_dot_json: nostr_dot_json
            }
        }
    }
    if (command.command == "set-relays") {
        // Validate that the user requesting the update has the nostr_dot_json

    }
    return "Error"
}