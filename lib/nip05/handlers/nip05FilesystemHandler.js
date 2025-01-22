import fs from 'node:fs'
export async function nip05FilesystemHandler(command, domain_config){
    await fs.writeFileSync(domain_config.config.NOSTR_JSON_PATH, JSON.stringify(command.data.nostr_dot_json), "utf8")
}