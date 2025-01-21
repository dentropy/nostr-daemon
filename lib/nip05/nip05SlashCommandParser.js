import { slashCommandParse } from "../slashCommandParse.js";

export function NIP05SlashCommand_parser(convo, app_settings) {
const slash_command_data = slashCommandParse(convo)
  if( slash_command_data == false){
    return `Could not parse slash command data Error:\n${slash_command_data.error}`
  }
  if(
    slash_command_data.command.toLowerCase() == "ping" || slash_command_data.subCommands[0].toLowerCase() == "ping"
  ) {
    return "pong"
  }
}
