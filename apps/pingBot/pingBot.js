// Validate CLI Args
// Load Config
// Validate Config
// Deal with Profile and NIP-65
// Start Listener


import { config_json_schema } from "./configJsonSchema.js";
import { nip19 } from 'nostr-tools'
import fs from "node:fs";
import Ajv from "npm:ajv";

export async function pingBot(args){

  // Validate nsec is valid
  let nsec = "";
  try {
    nsec = nip19.decode(args.nsec).data;
  } catch (error) {
    console.log("Unable to decode nsec");
    console.log(error);
  }

  // Validate Config
  console.log("\nOur config below");
  console.log(args);
  // Load the config file_path
  let config = {};
  try {
    config = JSON.parse(fs.readFileSync(args.config_path));
  } catch (error) {
    console.log("Got error trying to read config file");
    console.log(error);
    process.error("")
  }
  console.log("Config is valid")
  const ajv = new Ajv();
  const valid = ajv.validate(config_json_schema, config);
  if (!valid) {
    console.log("Unable to validate config");
    console.log(ajv.errors);
    process.exit();
  }
}