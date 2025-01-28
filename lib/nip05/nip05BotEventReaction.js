import {
  finalizeEvent,
  getPublicKey,
  nip04,
  nip19,
  Relay,
  verifyEvent,
} from "nostr-tools";

import { nip05RsyncHandler } from "./handlers/nip05RsyncHandler.js";
import { nip05FilesystemHandler } from "./handlers/nip05FilesystemHandler.js";

import { nip05SlashCommand_parser } from "./nip05SlashCommandParser.js";
import { nip05CheckNostrJsonUpdate } from "./nip05CheckNostrJsonUpdate.js";

export async function nip05BotEventReaction(args, convo, config) {
  let slash_command_results = nip05SlashCommand_parser(convo, config);
  console.log("THE_slash_command_results");
  console.log(slash_command_results);
  if (typeof slash_command_results == typeof ("")) {
    const signedEvent = finalizeEvent({
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ["p", convo[0].pubkey],
        ["e", convo[0].id, "", "root"],
        ["e", convo[convo.length - 1].id, "", "reply"],
      ],
      content: slash_command_results,
    }, nip19.decode(args.nsec).data);
    console.log("\nsigned_event for slash_command_results");
    console.log(signedEvent);
    for (const relay_url of config.relays) {
      try {
        const relay = await Relay.connect(relay_url);
        await relay.publish(signedEvent);
        console.log(`Published event ${relay_url}`);
      } catch (error) {
        console.error(`Could not publish to ${relay_url}`);
        console.error(error);
      }
    }
    return slash_command_results;
  }
  const update_nostr_dot_json = await nip05CheckNostrJsonUpdate(
    slash_command_results,
    config,
    nostr_dot_json,
  );
  if (update_nostr_dot_json.command == "update_nostr_dot_joson") {
    nostr_dot_json[update_nostr_dot_json.data.domain_name] =
      update_nostr_dot_json.data.nostr_dot_json;
  }
  if (typeof update_nostr_dot_json == typeof ("")) {
    return update_nostr_dot_json
    // const signedEvent = finalizeEvent({
    //   kind: 1,
    //   created_at: Math.floor(Date.now() / 1000),
    //   tags: [
    //     ["p", convo[0].pubkey],
    //     ["e", convo[0].id, "", "root"],
    //     ["e", convo[convo.length - 1].id, "", "reply"],
    //   ],
    //   content: update_nostr_dot_json,
    // }, nip19.decode(args.nsec).data);
    // console.log("\nsigned_event for update_nostr_dot_json");
    // console.log(signedEvent);
    // for (const relay_url of config.relays) {
    //   try {
    //     const relay = await Relay.connect(relay_url);
    //     await relay.publish(signedEvent);
    //     console.log(`Published event ${relay_url}`);
    //   } catch (error) {
    //     console.error(`Could not publish to ${relay_url}`);
    //     console.error(error);
    //   }
    // }
    // return;
  }
  // Update nostr.json
  let update_success = false;
  if (update_nostr_dot_json.command == "update_nostr_dot_joson") {
    let domain_config = "";
    for (const domain_name_config of config.domain_names) {
      if (
        domain_name_config.domain_name == update_nostr_dot_json.data.domain_name
      ) {
        domain_config = domain_name_config;
      }
    }
    console.log("PAUL_WAS_HERE_987");
    console.log(domain_config);
    if (domain_config == "") {
      console.error("COULD_NOT_FIND_CONFIG_FOR_update_nostr_dot_joson");
      return "";
    }
    if (domain_config.update_method == "rsync") {
      update_success = await nip05RsyncHandler(
        update_nostr_dot_json,
        domain_config,
      );
    }
    if (domain_config.update_method == "filepath") {
      update_success = await nip05FilesystemHandler(
        update_nostr_dot_json,
        domain_config,
      );
    }
  }
  let bot_response = "";
  if (update_success == true) {
    bot_response = `Update Success`;
  } else {
    bot_response = "Updated failed for some reason, sorry, maybe try again IDK";
  }
  return bot_response;
  // Save to /tmp/nostr.json
  // await Deno.writeTextFile('/tmp/nostr.json', JSON.stringify(result));
  // Run the scp command
  // await new Deno.Command(`scp /tmp/nostr.json ${REMOTE_HOST}:${REMOTE_PATH}`)
}
