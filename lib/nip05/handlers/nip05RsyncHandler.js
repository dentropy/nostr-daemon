import fs from 'node:fs'
export async function nip05RsyncHandler(command, domain_config){
    await fs.writeFileSync("/tmp/nostr.json", JSON.stringify(command.data.nostr_dot_json), "utf8")
    // https://stackoverflow.com/questions/12920947/does-scp-create-the-target-folder-if-it-does-not-exist
    const command = new Deno.Command("rsync", {
        args: [
            "-Pravdtze",
            "ssh",
            "/tmp/nostr.json",
            `${domain_config.config.SCP_HOST}:${domain_config.config.SCP_PATH}`,
        ],
        stdin: "piped",
        stdout: "piped",
    });
    const child = command.spawn();
    return true
}