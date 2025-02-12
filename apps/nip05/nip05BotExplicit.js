import fs from "node:fs";
import Ajv from "npm:ajv";
import NDK from "@nostr-dev-kit/ndk";
import {
  finalizeEvent,
  getPublicKey,
  nip04,
  nip19,
  Relay,
  verifyEvent,
} from "nostr-tools";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils"; // already an installed dependency

// Dependencies I wrote
import { RetriveThread } from "../../lib/RetriveThread.js";
import { nip05BotEventReaction } from "./nip05BotEventReaction.js";
import { getNostrConvoAndDecrypt } from "../../lib/getNostrConvoAndDecrypt.js";
import { nip05CheckNostrJsonUpdate } from "./nip05CheckNostrJsonUpdate.js";
import { nip05UpdateNostrDotJson } from "./nip05UpdateNostrDotJson.js";

export async function nip05botExplicit(args, options) {

  // Validate Config
  console.log("\nOur config below");
  console.log(args);
  // Load the config file_path
  let config = {};
  try {
    config = JSON.parse(fs.readFileSync(args.config_path));
  } catch (error) {
    console.log("Got error trying to read config file");
    console.log(error);
  }
  // Validate nsec is valid
  let nsec = "";
  try {
    nsec = nip19.decode(args.nsec).data;
  } catch (error) {
    console.log("Unable to decode nsec");
    console.log(error);
  }
  // Thanks https://transform.tools/json-to-json-schema
  const config_json_schema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Generated schema for Root",
    "type": "object",
    "properties": {
      "relays": {
        "type": "array",
        "items": {
          "type": "string",
        },
      },
      "domain_names": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "domain_name": {
              "type": "string",
            },
            "update_method": {
              "type": "string",
            },
            "bot_username": {
              "type": "string",
            },
            "config": {
              "type": "object",
              "properties": {},
              "required": [],
            },
          },
          "required": [
            "domain_name",
            "update_method",
            "bot_username",
            "config",
          ],
        },
      },
    },
    "required": [
      "relays",
      "domain_names",
    ],
  };
  const ajv = new Ajv();
  const valid = ajv.validate(config_json_schema, config);
  if (!valid) {
    console.log("Unable to validate config");
    console.log(ajv.errors);
    process.exit();
  }
  if (!("relays" in config)) {
    console.log(`relays key is missing in your config=${args.config_path}`);
    process.exit();
  }
  if (typeof (config.relays) != typeof []) {
    console.log(
      `relays requires a list of strings where each string is a NOSTR relay`,
    );
    process.exit();
  }
  if (!("domain_names" in config)) {
    console.log(
      `domain_names key is missing in your config=${args.config_path}`,
    );
    process.exit();
  }
  if (typeof (config.domain_names) != typeof ({})) {
    console.log(
      `key domain_names requires each domain configured to be a key object pair`,
    );
    process.exit();
  }
  for (const domain_name in config.domain_names) {
    if (!("update_method" in config.domain_names[domain_name])) {
      console.log(
        `For config=${args.config_path}\nUnder key ".domain_names"\nupdate_method is missing`,
      );
      process.exit();
    }
  }
  // The JSONSchema used by ajv above does not valite what is validated below
  for (const domain_name_index in config.domain_names) {
    if (config.domain_names[domain_name_index].update_method == "rsync") {
      if (!("REMOTE_USER" in config.domain_names[domain_name_index].config)) {
        console.log(
          `Invalid Config, domain_name=${
            config.domain_names[domain_name_index].domain_name
          } method is missing REMOTE_USER`,
        );
        process.exit();
      }
      if (!("REMOTE_HOST" in config.domain_names[domain_name_index].config)) {
        console.log(
          `Invalid Config, domain_name=${
            config.domain_names[domain_name_index].domain_name
          } method is missing REMOTE_HOST`,
        );
        process.exit();
      }
      if (!("REMOTE_PATH" in config.domain_names[domain_name_index].config)) {
        console.log(
          `Invalid Config, domain_name=${
            config.domain_names[domain_name_index].domain_name
          } method is missing HOST_PATH`,
        );
        process.exit();
      }
      if (!("REMOTE_PORT" in config.domain_names[domain_name_index].config)) {
        console.log(
          `Invalid Config, domain_name=${
            config.domain_names[domain_name_index].domain_name
          } method is missing REMOTE_PORT`,
        );
        process.exit();
      }
    }
    if (config.domain_names[domain_name_index].update_method == "filepath") {
      if (
        !("NOSTR_JSON_PATH" in config.domain_names[domain_name_index].config)
      ) {
        console.log(
          `Invalid Config, domain_name=${
            config.domain_names[domain_name_index].domain_name
          } method is missing NOSTR_JSON_PATH`,
        );
        process.exit();
      }
    }
  }

  console.log("\nFetching nostr.json for all the domains configured")
  let nostr_dot_json = {}
  for (const domain_name_config of config.domain_names) {
    if (nostr_dot_json[domain_name_config.domain_name] == undefined) {
        let result = ""
        try {
            result = await fetch(`https://${domain_name_config.domain_name}/.well-known/nostr.json`)
        } catch (error) {
            console.error(error)
            try {
                result = await fetch(`http://${domain_name_config.domain_name}/.well-known/nostr.json`)
            } catch (error) {
                console.error(error)
            }
        }
        try {
            nostr_dot_json[domain_name_config.domain_name] = await result.json()
            // console.log("TROUBLESHOOT")
            // console.log(`http://${domain_name_config.domain_name}/.well-known/nostr.json`)
            // console.log(nostr_dot_json[domain_name_config.domain_name])
        } catch (error) {
            console.error(error)
        }
    }
  }

  console.log("\nConfiguring username for bot across all domain names at once")
  for (const domain_name_config of config.domain_names) {
    console.log("Configuring Domain Name:");
    console.log(domain_name_config);
    try {
        delete nostr_dot_json[domain_name_config.domain_name].names[domain_name_config.bot_username]
    } catch (error) {
        console.log(`username=${domain_name_config.bot_username} was not already set for domain_name=${domain_name_config.domain_name}`)
    }
    const command = {
      command: "request",
      data: {
        domain_name: domain_name_config.domain_name,
        user_name: domain_name_config.bot_username,
        pubkey: bytesToHex(nip19.decode(args.nsec).data),
      },
    };
    const update_command_nostr_dot_json = await nip05CheckNostrJsonUpdate(
      command,
      config,
      nostr_dot_json,
    );
    await nip05UpdateNostrDotJson(
      update_command_nostr_dot_json.data.nostr_dot_json,
      update_command_nostr_dot_json,
      config,
    );
  }

  console.log("\nConfiguring NIP65 Relay Metadata and publishing it");
  let relay_list_for_event = [];
  for (const relay of config.relays) {
    relay_list_for_event.push(["r", relay]);
  }
  console.log("\nPublished NIP05 Relay List");
  console.log(relay_list_for_event);
  const nip65RelayMetadataEvent = finalizeEvent({
    kind: 10002,
    created_at: Math.floor(Date.now() / 1000),
    tags: relay_list_for_event,
    content: "",
  }, nip19.decode(args.nsec).data);
  for (const relay_url of config.nip65_metadata_profile_relays) {
    try {
      const relay = await Relay.connect(relay_url);
      await relay.publish(nip65RelayMetadataEvent);
      console.log(`Published event ${relay_url}`);
    } catch (error) {
      console.log(`Could not publish to ${relay_url}`);
      console.log(error);
    }
  }
  for (const relay_url of config.relays) {
    try {
      const relay = await Relay.connect(relay_url);
      await relay.publish(nip65RelayMetadataEvent);
      console.log(`Published event ${relay_url}`);
    } catch (error) {
      console.log(`Could not publish to ${relay_url}`);
      console.log(error);
    }
  }
  console.log("Configuring bot profiling and publishing");
  console.log(
    "      We default to first domain name for NIP05 username of bot",
  );
  const profileEvent = finalizeEvent({
    kind: 0,
    created_at: Math.floor(Date.now() / 1000),
    tags: [],
    content: JSON.stringify(config.bot_profile_json),
  }, nip19.decode(args.nsec).data);
  for (const relay_url of config.nip65_metadata_profile_relays) {
    try {
      const relay = await Relay.connect(relay_url);
      await relay.publish(profileEvent);
      console.log(`Published event ${relay_url}`);
    } catch (error) {
      console.log(`Could not publish to ${relay_url}`);
      console.log(error);
    }
  }
  for (const relay_url of config.nip65_metadata_profile_relays) {
    try {
      const relay = await Relay.connect(relay_url);
      await relay.publish(profileEvent);
      console.log(`Published event ${relay_url}`);
    } catch (error) {
      console.log(`Could not publish to ${relay_url}`);
      console.log(error);
    }
  }
  // #TODO Send event kind 1 with instructions on how to use the bot

  // Actually setup the listning bot
  const ndk = new NDK({
    explicitRelayUrls: config.relays,
  });
  await ndk.connect();

  let unix_time = Math.floor((new Date()).getTime() / 1000);

  let filter = {
    "kinds": [1],
    "#p": getPublicKey(nip19.decode(args.nsec).data),
    "since": unix_time - 10,
  };
  console.log("\nFilter we are listening on");
  console.log(JSON.stringify(filter, null, 2));
  const sub = await ndk.subscribe(filter);
  sub.on("event", async (event) => {
    const raw_event = {
      content: event.content,
      tags: event.tags,
      id: event.id,
      kind: event.king,
      created_at: event.created_at,
      pubkey: event.pubkey,
    };
    console.log("\nnip05 bot recieved kind 1 event, raw event below");
    console.log(JSON.stringify(raw_event, null, 2));
    if (getPublicKey(nip19.decode(args.nsec).data) == event.pubkey) {
      console.log("Got message from not itself");
    } else {
      // Process Slash Command Logic
      const convo = await RetriveThread(config.relays, raw_event.id);
      for (const item in convo) {
        convo[item].decrypted_content = convo[item].content;
      }
      const bot_response = await nip05BotEventReaction(args, convo, config, nostr_dot_json);
      const signedEvent = finalizeEvent({
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
          ["p", convo[0].pubkey],
          ["e", convo[0].id, "", "root"],
          ["e", convo[convo.length - 1].id, "", "reply"],
        ],
        content: bot_response,
      }, nip19.decode(args.nsec).data);
      console.log("signed_event");
      console.log(signedEvent);
      for (const relay_url of config.relays) {
        try {
          const relay = await Relay.connect(relay_url);
          await relay.publish(signedEvent);
          console.log(`Published event ${relay_url}`);
        } catch (error) {
          console.log(`Could not publish to ${relay_url}`);
          console.log(error);
        }
      }
    }
  });

  const dm_filter = {
    "kinds": [4],
    "#p": getPublicKey(nip19.decode(args.nsec).data),
    "since": unix_time - 10,
  };
  const dm_sub = await ndk.subscribe(dm_filter);
  dm_sub.on("event", async (event) => {
    const raw_event = {
      content: event.content,
      tags: event.tags,
      id: event.id,
      kind: event.king,
      created_at: event.created_at,
      pubkey: event.pubkey,
    };
    console.log("\nnip05 bot recieved kind 4 event, raw event below");
    console.log(JSON.stringify(raw_event, null, 2));
    if (getPublicKey(nip19.decode(args.nsec).data) == event.pubkey) {
      console.log("Got message from not itself");
    } else {
      // Process Slash Command Logic
      const convo = await getNostrConvoAndDecrypt(
        config.relays,
        args.nsec,
        nip19.npubEncode(event.pubkey),
      );
      const bot_response = await nip05BotEventReaction(args, convo, config, nostr_dot_json);
      const encrypted_text = await nip04.encrypt(
        nip19.decode(args.nsec).data,
        nip19.decode(nip19.npubEncode(event.pubkey)).data,
        bot_response,
      );
      const signedEvent = finalizeEvent({
        kind: 4,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
          ["p", convo[0].pubkey],
        ],
        content: encrypted_text,
      }, nip19.decode(args.nsec).data);
      console.log("signed_event");
      console.log(signedEvent);
      for (const relay_url of config.relays) {
        const relay = await Relay.connect(relay_url);
        try {
          await relay.publish(signedEvent);
          console.log(`Published event ${relay_url}`);
        } catch (error) {
          console.log(`Could not publish to ${relay_url}`);
          console.log(error);
        }
        relay.close()
      }
    }
  });
}
