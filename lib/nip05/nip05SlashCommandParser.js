import parse from "jsr:@inro/slash-command-parser";

export function NIP05SlashCommand_parser(convo, app_settings) {
  let command_data = "";
  if (
    convo[convo.length - 1].decrypted_content.toLowerCase()
      .replace(/\n/g, "")
      .trim()[0] == "/"
  ) {
    try {
      command_data = parse(
        convo[convo.length - 1].decrypted_content.split("\n")[0].trim(),
      );
    } catch (error) {
      console.log(error);
    }
  } else {
    return "Failed to Parse";
  }
  return command_data;
}
