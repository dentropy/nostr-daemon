import fs from 'node:fs'
export async function nip05FilesystemHandler(command, domain_config){
    console.log("PAUL_WAS_HERE")
    console.log(domain_config)
    console.log(domain_config.config.NOSTR_JSON_PATH)
    let dir = domain_config.config.NOSTR_JSON_PATH.split("/")
    dir.pop()
    dir = dir.join("/")
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFileSync(domain_config.config.NOSTR_JSON_PATH, JSON.stringify(command.data.nostr_dot_json), "utf8")
}