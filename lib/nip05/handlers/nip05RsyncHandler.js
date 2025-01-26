import fs from "node:fs";
import { bash } from "https://deno.land/x/bash/mod.ts";

export async function nip05RsyncHandler(command, domain_config) {
  await fs.writeFileSync(
    `${Deno.cwd()}/nostr.json`,
    JSON.stringify(command.data.nostr_dot_json),
    "utf8",
  );
  //   const raw_command = `/usr/bin/rsync -avzhe \
  // 'ssh -p 2222' \
  // /tmp/nostr.json \
  // root@localhost:/usr/share/caddy/.well-known/nostr.json`;
  //   console.log("RAW_COMMAND")
  //   console.log(raw_command)
  const args = [
    "rsync",
    "-Pravdtz",
    `-e 'ssh -o StrictHostKeyChecking=no -p ${domain_config.config.REMOTE_PORT}'`,
    // "-avzhe",
    // `'ssh -p ${domain_config.config.REMOTE_PORT}'`,
    `${Deno.cwd()}/nostr.json`,
    `${domain_config.config.REMOTE_USER}@${domain_config.config.REMOTE_HOST}:${domain_config.config.REMOTE_PATH}`,
  ];
  console.log("ARGS_GO_HERE");
  console.log("\n\n" + args.join(" ") + "\n\n");
  //   // https://stackoverflow.com/questions/12920947/does-scp-create-the-target-folder-if-it-does-not-exist
  //   const system_command = new Deno.Command("rsync", {
  //     args: args,
  //     stdin: "inherit",
  //     stdout: "inherit",
  //   })
  try {
    // system_command.spawn();
    await bash(args.join(" "));
    return true;
  } catch (error) {
    console.log("Error with Rsync Handler system_command");
    console.log(error);
  }
}
