import fs from 'node:fs'
export async function nip05RsyncHandler(command, domain_config){
    await fs.writeFileSync("/tmp/nostr.json", JSON.stringify(command.data.nostr_dot_json), "utf8")
    // https://stackoverflow.com/questions/12920947/does-scp-create-the-target-folder-if-it-does-not-exist
    const system_command = new Deno.Command("rsync", {
        args: [
            "-Pravdtze",
            "ssh",
            "-o",
            "StrictHostKeyChecking=no",
            "/tmp/nostr.json",
            `${domain_config.config.SCP_HOST}:${domain_config.config.SCP_PATH}`,
        ],
        stdin: "piped",
        stdout: "piped",
    });
    const child = system_command.spawn();
    return true
}