/*

/reset

/help
  reset
  llm

/llm
  reset
  list-models
  select-model
  msg-offset

*/

import parse from "jsr:@inro/slash-command-parser";

const test_slash_commands = [
  "/help",
  "/reset",
  "/llm help",
  // "/llm help examples",
  // "/llm help reset",
  // "/llm help list-models",
  // "/llm help select-model",
  // "/llm help msg-offset",
  "/llm list-models",
  "/llm run select-model: llama3.2:latest",
  "/llm run select-model: llama3.2 msg-offset: 3",
  " test then /llm /test",
];

for (const command_string of test_slash_commands) {
  console.log(`\n${command_string}`);
  const result = parse(command_string);
  console.log(result);
}
