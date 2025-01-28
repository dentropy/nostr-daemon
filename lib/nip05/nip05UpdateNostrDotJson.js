import { nip05RsyncHandler } from "./handlers/nip05RsyncHandler.js";
import { nip05FilesystemHandler } from "./handlers/nip05FilesystemHandler.js";

export async function nip05UpdateNostrDotJson(
  nostr_dot_json,
  update_nostr_dot_json,
  config,
) {
  console.log("TROUBLESHOOT_TILL_HERE")
  if (update_nostr_dot_json.command == "update_nostr_dot_joson") {
    nostr_dot_json[update_nostr_dot_json.data.domain_name] =
      update_nostr_dot_json.data.nostr_dot_json;
  }
  if (typeof update_nostr_dot_json == typeof ("")) {
    return update_nostr_dot_json;
  }
  let update_success = false;
  console.log("TROUBLESHOOT_TILL_HERE_update_success")
  console.log(update_success)
  console.log(update_nostr_dot_json)
  if (update_nostr_dot_json.command == "update_nostr_dot_joson") {
    console.log("IT_STARTED")
    let domain_config = "";
    for (const domain_name_config of config.domain_names) {
      if (
        domain_name_config.domain_name == update_nostr_dot_json.data.domain_name
      ) {
        domain_config = domain_name_config;
      }
    }
    if (domain_config == "") {
      console.error("COULD_NOT_FIND_CONFIG_FOR_update_nostr_dot_joson");
      return "";
    }
    // #TODO fix the circularity, IDK what is causing this
    const not_circular_nostr_dot_json = {
      names: nostr_dot_json[update_nostr_dot_json.data.domain_name].names,
      relays: nostr_dot_json[update_nostr_dot_json.data.domain_name].relays,
    };
    console.log("not_circular_nostr_dot_json")
    console.log(not_circular_nostr_dot_json)
    console.log("domain_config")
    console.log(domain_config)
    if (domain_config.update_method == "rsync") {
      update_success = await nip05RsyncHandler(
        not_circular_nostr_dot_json,
        domain_config,
      );
    }
    if (domain_config.update_method == "filepath") {
      update_success = await nip05FilesystemHandler(
        not_circular_nostr_dot_json,
        domain_config,
      );
    }
    // #TODO impliment SCP functionality
  }
  let bot_response = "";
  console.log("update_success_update_success")
  console.log(update_success)
  if (update_success == true || update_success == undefined) {
    bot_response = `Update Success`;
  } else {
    bot_response = "Updated failed for some reason, sorry, maybe try again IDK";
  }
  return bot_response;
}
