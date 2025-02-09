import fs from "node:fs";
import { bash } from "https://deno.land/x/bash/mod.ts";

export async function nip05RsyncHandler(nostr_dot_json, domain_config) {
  await fs.writeFileSync(
    `${Deno.cwd()}/nostr.json`,
    JSON.stringify(nostr_dot_json),
    "utf8",
  );

  let ssh_key_config = "";
  if (Object.keys(domain_config.config).includes("SSH_KEY_PATH")) {
    ssh_key_config = "-i " + domain_config.config.SSH_KEY_PATH;
  }

  const args = [
    "rsync",
    "-Pravdtz",
    `-e 'ssh -o StrictHostKeyChecking=no -p ${domain_config.config.REMOTE_PORT} ${ssh_key_config}'`,
    // "-avzhe",
    // `'ssh -p ${domain_config.config.REMOTE_PORT}'`,
    `${Deno.cwd()}/nostr.json`,
    `${domain_config.config.REMOTE_USER}@${domain_config.config.REMOTE_HOST}:${domain_config.config.REMOTE_PATH}`,
  ];
  console.log("\nRSYNC_COMMAND\n\n" + args.join(" ") + "\n\n");
  try {
    await bash(args.join(" "));
    return true;
  } catch (error) {
    console.log("Error with Rsync Handler system_command");
    console.log(error);
  }
}
