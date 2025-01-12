import parse from "jsr:@inro/slash-command-parser";
import Handlebars from "npm:handlebars";

export const help_response =
  "Please enter one of the following slash commands\nhelp\n/reset\n/llm to get more information on each of the commands for this bot\nExample Commands include\n/llm list-models\n/llm run select-model: llama3.2:latest\n/llm run select-model: llama2-uncensored:latest\n/llm run msg-offset: 2";

export const reset_response = "Resetting the stuff";

export const select_model_error =
  `Invalid Option select-model:{{select-model}} make sure it is from this list \n
{{models_supported}}
}\nOr run "\\llm help" to learn more`;

export const msg_offset_error = `For msg-offset please input a valid number`

export function LLMSlashCommandConvoParser(convo, models_supported) {
  let parsed_convo = [];
  let model_selected = models_supported[0];

  console.log("CONVO_SHOULD_GO_HERE")
  console.log(convo)
  // Parse /reset or /llm reset
  for (const event of convo) {
    if (
      event.decrypted_content.toLowerCase()
        .replace(/\n/g, "")
        .trim()[0] == "/"
    ) {
      let command_data = {};
      try {
        command_data = parse(event.decrypted_content.split("\n")[0].trim());
      } catch (error) {
        console.log(
          `Error in LLMSlashCommandConvoParser reset\n${event.decrypted_content}\n`,
        );
        console.log(error);
        parsed_convo.push(event);
        continue;
      }
      if (command_data.command.toLowerCase() == "llm") {
        if (command_data.subCommands[0] == "reset") {
          parsed_convo = [];
          continue;
        }
      }
      if (command_data.command.toLocaleLowerCase() == "reset") {
        parsed_convo = [];
        continue;
      }
      parsed_convo.push(event);
    } else {
      parsed_convo.push(event);
    }
  }

  // Parse the most recent event
  if (parsed_convo.length == 0) {
    return reset_response;
  }
  const latest_event = parsed_convo[parsed_convo.length - 1].decrypted_content;
  if (
    latest_event
      .replace(/\n/g, "").trim()[0] == "/"
  ) {
    let command_data = {};
    try {
      command_data = parse(latest_event.split("\n")[0].trim());
      let formatted_latest_event = parsed_convo[parsed_convo.length - 1].decrypted_content
      formatted_latest_event = formatted_latest_event.split("\n")
      formatted_latest_event = formatted_latest_event.slice(1)
      if( formatted_latest_event.length == 0){
        formatted_latest_event = ""
      } else {
        formatted_latest_event = formatted_latest_event.join("\n")
      }
      parsed_convo[parsed_convo.length - 1].decrypted_content = formatted_latest_event
    } catch (error) {
      console.log("Error in LLMSlashCommandConvoParser recent message");
      console.log(error);
      return help_response;
    }
    if (command_data.command.toLocaleLowerCase() == "help") {
      return help_response;
    }
    // DO NOT MOVE THE CODE BELOW UP
    if(command_data.subCommands.length == 0){
      return help_response;
    }
    if (
      command_data.command.toLocaleLowerCase() == "llm" &&
      command_data.subCommands[0].toLocaleLowerCase() == "help"
    ) {
      return help_response;
    }
    if (
      command_data.command.toLocaleLowerCase() == "llm" &&
      command_data.subCommands[0].toLocaleLowerCase() == "list-models"
    ) {
      return `${JSON.stringify(models_supported)}`;
    }
    // /llm run
    if (
      command_data.command.toLocaleLowerCase() == "llm" &&
      command_data.subCommands[0].toLocaleLowerCase() == "run"
    ) {
      // Check for invalid Options
      const valid_options = ["select-model", "msg-offset"];
      for (const command_option of Object.keys(command_data.options)) {
        if (!valid_options.includes(command_option.toLowerCase())) {
          return `Invalid Option ${command_option} make sure it is from this list \n${
            JSON.stringify(valid_options)
          }\nOr run "\\llm help" to learn more`;
        }
      }
      // Parse select-model
      if (Object.keys(command_data.options).includes("select-model")) {
        // Check if model exists
        if (!models_supported.includes(command_data.options["select-model"])) {
          const select_model_template = Handlebars.compile(select_model_error);
          return select_model_template({
            "select-model": command_data.options["select-model"],
            "models_supported": JSON.stringify(models_supported)
          });
        } else {
          model_selected = command_data.options["select-model"];
        }
      }
      // Parse msg-offset
      if (Object.keys(command_data.options).includes("msg-offset")) {
        // Verify Offset is valid
        const offset = parseInt(command_data.options["msg-offset"]);
        if (offset == isNaN) {
          return msg_offset_error;
        }
        if (offset >= parsed_convo.length) {
          return `For msg-offset This thread is only ${parsed_convo.length} events in length, your offset ${offset}`;
        }
        if (offset <= 0) {
          return msg_offset_error;
        }
        parsed_convo = parsed_convo.slice(-(offset + 1));
      }
    }
  }
  console.log("parsed_convo_final")
  console.log(parsed_convo)
  return {
    parsed_convo: parsed_convo,
    model_selected: model_selected,
  };
}
