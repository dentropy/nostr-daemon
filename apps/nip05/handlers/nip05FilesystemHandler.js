import fs from 'node:fs'
export async function nip05FilesystemHandler(nostr_dot_json, domain_config){
    console.log("DEBUG_nip05FilesystemHandler")
    console.log(domain_config)
    console.log(domain_config.config.NOSTR_JSON_PATH)
    let dir = domain_config.config.NOSTR_JSON_PATH.split("/")
    dir.pop()
    dir = dir.join("/")
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFileSync(domain_config.config.NOSTR_JSON_PATH, JSON.stringify(nostr_dot_json), "utf8")
}