import parse from "jsr:@inro/slash-command-parser";

export function slashCommandParse(convo) {
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
      console.error(error);
      return {
        is_slash_command: false,
        error: error,
      };
    }
  } else {
    return {
      is_slash_command: false,
      error: "",
    };
  }
  command_data.is_slash_command = true;
  return command_data;
}
