import {
  finalizeEvent,
  getPublicKey,
  nip04,
  nip19,
  Relay,
  verifyEvent,
} from "nostr-tools";

import { nip05SlashCommand_parser } from "./nip05SlashCommandParser.js";
import { nip05CheckNostrJsonUpdate } from "./nip05CheckNostrJsonUpdate.js";
import { nip05UpdateNostrDotJson } from "./nip05UpdateNostrDotJson.js"

export async function nip05BotEventReaction(args, convo, config, nostr_dot_json) {
  const slash_command_results = nip05SlashCommand_parser(convo, config);
  console.log("THE_slash_command_results");
  console.log(slash_command_results);
  if (typeof slash_command_results == typeof ("")) {
    // const signedEvent = finalizeEvent({
    //   kind: 1,
    //   created_at: Math.floor(Date.now() / 1000),
    //   tags: [
    //     ["p", convo[0].pubkey],
    //     ["e", convo[0].id, "", "root"],
    //     ["e", convo[convo.length - 1].id, "", "reply"],
    //   ],
    //   content: slash_command_results,
    // }, nip19.decode(args.nsec).data);
    // console.log("\nsigned_event for slash_command_results");
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
    return slash_command_results;
  }
  const update_nostr_dot_json = await nip05CheckNostrJsonUpdate(
    slash_command_results,
    config,
    nostr_dot_json,
  );

  console.log("update_nostr_dot_json_RESULT")
  console.log(update_nostr_dot_json)

  const updated_nostr_dot_json_result = await nip05UpdateNostrDotJson(nostr_dot_json, update_nostr_dot_json, config)

  console.log("updated_nostr_dot_json_result")
  console.log(updated_nostr_dot_json_result)

  return updated_nostr_dot_json_result
}
