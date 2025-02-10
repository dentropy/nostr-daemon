import { slashCommandParse } from "../../lib/slashCommandParse.js";
export const nip05_help_command = `Example Command Use Includes
/nip05 ping
/nip05 list-domains
/nip05 request dentropy@ddaemon.org
/nip05 rotate $NPUB
/nip05 set-relays $RELAYS_SEPARATED_VALUES
/nip05 get-relays $NPUB
/nip05 delete dentropy@ddaemon.org`

export function nip05SlashCommand_parser(convo, config) {
  const slash_command_data = slashCommandParse(convo);
  if (slash_command_data.is_slash_command == false) {
    return `Could not parse slash command data Error:\n${slash_command_data.error}`;
  }
  if (
    slash_command_data.command.toLowerCase() == "ping" ||
    slash_command_data.subCommands[0].toLowerCase() == "ping"
  ) {
    return "pong";
  }
  if (
    slash_command_data.command.toLowerCase() == "nip05" &&
    slash_command_data.subCommands[0].toLowerCase() == "help"
  ) {
    return nip05_help_command
  }
  if (
    slash_command_data.command.toLowerCase() == "nip05" &&
    slash_command_data.subCommands[0].toLowerCase() == "list-domains"
  ) {
    let domain_names = []
    let response = "Please use one of the following domain names,"
    for(const domain_name of config.domain_names){
      domain_names.push(domain_name.domain_name)
      response += `\n* ${domain_name.domain_name}`
    }
    return response;
  }
  if (
    slash_command_data.command.toLowerCase() == "nip05" &&
    slash_command_data.subCommands[0].toLowerCase() == "request"
  ) {
    if (slash_command_data.subCommands.length != 2) {
      return "You failed to include a NIP05 Internet Identifider, they look like a email address";
    }
    if (!slash_command_data.subCommands[1].includes("@")) {
      return "A internet identifier should include an @ sign because it looks like an email address";
    }
    const user_name = slash_command_data.subCommands[1].split("@")[0];
    const domain_name = slash_command_data.subCommands[1].split("@")[1];
    let domain_names = []
    for(const domain_name of config.domain_names){
      domain_names.push(domain_name.domain_name)
    }
    if (!domain_names.includes(domain_name.toLowerCase())) {
      return `We don't support that domain name please run "/nip05 list-domains"`;
    }
    return {
      command : "request",
      data: {
        user_name: user_name,
        domain_name: domain_name,
        pubkey: convo[convo.length - 1].pubkey
      }
    }
  }
  if (
    slash_command_data.command.toLowerCase() == "nip05" &&
    slash_command_data.subCommands[0].toLowerCase() == "set-relays"
  ) {
    console.log(slash_command_data)
    if (slash_command_data.subCommands.length < 2) {
      return "You failed to include a NIP05 Internet Identifider, they look like a email address";
    }
    if (!slash_command_data.subCommands[1].includes("@")) {
      return "A internet identifier should include an @ sign because it looks like an email address";
    }
    const user_name = slash_command_data.subCommands[1].split("@")[0];
    const domain_name = slash_command_data.subCommands[1].split("@")[1];
    let domain_names = []
    for(const domain_name of config.domain_names){
      domain_names.push(domain_name.domain_name)
    }
    console.log("DOMAIN_NAMES_BELOW")
    console.log(domain_names)
    if (!domain_names.includes(domain_name.toLowerCase())) {
      return `We don't support that domain name please run "/nip05 list-domains"`;
    }
    if (!Object.keys(slash_command_data.options).includes("relays")){
      return `Please include "relays:" followed by a list of relays like "ws://test.local wss://nip05.net" as such\n\n/nip05 set-relays $USERNAME@$DOMAIN_NAME :relays $RELAY1 $RELAY2`;
    }
    return {
      command : "set-relays",
      data: {
        user_name: user_name,
        domain_name: domain_name,
        pubkey: convo[convo.length - 1].pubkey,
        relays: slash_command_data.options.relays.split(" ")
      }
    }
  }
  return false
}
