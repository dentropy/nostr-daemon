
export async function nip05CheckNostrJsonUpdate(command, config) {
    if (command.command == "request") {
        // Check that username already exists
        let result = ""
        try {
            result = await fetch(`https://${command.data.domain_name}/.well-known/nostr.json`)
        } catch (error) {
            console.error(error)
        }
        try {
            result = await result.json()
        } catch (error) {
            console.error(error)
        }
        if (Object.keys(result.names).includes(command.data.user_name.toLowerCase())) {
            return `user_name="${command.data.user_name.toLowerCase()}" has already been claimed`
        }
        result.names[command.data.user_name] = command.data.pubkey
        return {
            command: "update_nostr_dot_joson",
            data: {
                domain_name: command.data.domain_name,
                nostr_dot_json: result
            }
        }
    }
    return "Error"
}