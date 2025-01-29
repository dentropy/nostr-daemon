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
    return slash_command_results;
  }
  const update_nostr_dot_json = await nip05CheckNostrJsonUpdate(
    slash_command_results,
    config,
    nostr_dot_json,
  );
  const updated_nostr_dot_json_result = await nip05UpdateNostrDotJson(nostr_dot_json, update_nostr_dot_json, config)
  return updated_nostr_dot_json_result
}
