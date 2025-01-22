import { slashCommandParse } from "../slashCommandParse.js";
export async function nip05SlashCommand_parser(convo, config) {
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
  return false
}
