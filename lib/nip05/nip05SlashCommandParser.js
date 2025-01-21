import { slashCommandParse } from "../slashCommandParse.js";
export async function NIP05SlashCommand_parser(convo, app_settings) {
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
    return JSON.stringify(app_settings.domain_names);
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
    if (!app_settings.domain_names.includes(domain_name.toLowerCase())) {
      return `We don't support that domain name please run "/nip05 list-domains"`;
    }
    // Check that username already exists
    let result = ""
    try {
      result = await fetch(`https://${domain_name}/.well-known/nostr.json`)
    } catch (error) {
      console.error(error)
    }
    try {
      result = await result.json()
    } catch (error) {
      console.error(error)
    }
    // TODO NOT DONE
    if(Object.keys(result.names).includes(user_name.toLowerCase())){
      return `user_name="${user_name.toLowerCase()}" has already been claimed`
    }
    console.log("WE GOT RESULT");
    console.log(result);
    console.log(typeof(result))

  }
}
