/*
/nip05 ping 
/nip05 request dentropy@ddaemon.org
/nip05 rotate $NPUB
/nip05 set-relays $RELAYS_SEPARATED_VALUES
/nip05 delete dentropy@ddaemon.org
*/
import { NIP05SlashCommand_parser } from './nip05SlashCommandParser.js' 
import { assertEquals } from "jsr:@std/assert";

Deno.test("slash-command-prase /nip05 ping", () => {
  const example_convo = [
    {
      decrypted_content: "/nip05 ping",
    },
  ];
  const parsed_command = NIP05SlashCommand_parser(
    example_convo,
    {
        domain_names: ["test.local"]
    }
  );
  const expected_response = ""
  assertEquals(expected_response, parsed_command);
});