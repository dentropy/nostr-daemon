/*
/nip05 ping
/nip05 list-domains
/nip05 request dentropy@ddaemon.org
/nip05 rotate $NPUB
/nip05 set-relays $RELAYS_SEPARATED_VALUES
/nip05 get-relays $NPUB
/nip05 delete dentropy@ddaemon.org
*/
import { nip05SlashCommand_parser } from "./nip05SlashCommandParser.js";
import { assertEquals } from "jsr:@std/assert";

const test_config = {
  "relays": [
    "ws://127.0.0.1:6969",
    "ws://127.0.0.1:4036/relay"
  ],
  "domain_names": [
    {
      "domain_name": "test.local",
      "update_method": "scp",
      "config": {
        "SCP_HOST": "127.0.0.1",
        "SCP_PATH": "/var/www/html/.well-known/nostr.json"
      }
    },
    {
      "domain_name": "nip05.local",
      "update_method": "filepath",
      "config": {
        "NOSTR_JSON_PATH": "/srv/nginx/html/.well-known/nostr.json"
      }
    }
  ]
}

// "/nip05 ping"
Deno.test("slash-command-prase `/nip05 ping`", async () => {
  const example_convo = [
    {
      decrypted_content: "/nip05 ping",
    },
  ];
  const parsed_command = await nip05SlashCommand_parser(
    example_convo,
    test_config,
  );
  const expected_response = "pong";
  assertEquals(expected_response, parsed_command);
});

Deno.test("slash-command-prase `/ping`", async () => {
  const example_convo = [
    {
      decrypted_content: "/ping",
    },
  ];
  const parsed_command = await nip05SlashCommand_parser(
    example_convo,
    test_config,
  );
  const expected_response = "pong";
  assertEquals(expected_response, parsed_command);
});

Deno.test("slash-command-prase `/pIng`", async () => {
  const example_convo = [
    {
      decrypted_content: "/pIng",
    },
  ];
  const parsed_command = await nip05SlashCommand_parser(
    example_convo,
    test_config,
  );
  const expected_response = "pong";
  assertEquals(expected_response, parsed_command);
});

Deno.test("slash-command-prase `/nip05 PiNg`", async () => {
  const example_convo = [
    {
      decrypted_content: "/pIng",
    },
  ];
  const parsed_command = await nip05SlashCommand_parser(
    example_convo,
    test_config,
  );
  const expected_response = "pong";
  assertEquals(expected_response, parsed_command);
});

Deno.test(`slash-command-prase "ping"`, async () => {
  const example_convo = [
    {
      decrypted_content: "nip05 list-domains",
    },
  ];
  const parsed_command = await nip05SlashCommand_parser(
    example_convo,
    test_config,
  );
  const expected_response =
    "Could not parse slash command data Error:\nMissing Slash";
  assertEquals(expected_response, parsed_command);
});

// "/nip05 list-domains"
Deno.test(`slash-command-prase "/nip05 list-domains"`, async () => {
  const example_convo = [
    {
      decrypted_content: "/nip05 list-domains",
    },
  ];
  const parsed_command = await nip05SlashCommand_parser(
    example_convo,
    test_config,
  );
  let expected_response = "Please use one of the following domain names,"
  for(const domain_name of test_config.domain_names){
    expected_response += `\n* ${domain_name.domain_name}`
  }
  assertEquals(expected_response, parsed_command);
});

Deno.test(`slash-command-prase "nip05 list-domains"`, async () => {
  const example_convo = [
    {
      decrypted_content: "nip05 list-domains",
    },
  ];
  const parsed_command = await nip05SlashCommand_parser(
    example_convo,
    test_config,
  );
  const expected_response =
    "Could not parse slash command data Error:\nMissing Slash";
  assertEquals(expected_response, parsed_command);
});

// "/nip05 request"
Deno.test(`slash-command-prase "/nip05 request"`, async () => {
  const example_convo = [
    {
      decrypted_content: "/nip05 request",
    },
  ];
  const parsed_command = await nip05SlashCommand_parser(
    example_convo,
    test_config,
  );
  const expected_response =
    "You failed to include a NIP05 Internet Identifider, they look like a email address";
  assertEquals(expected_response, parsed_command);
});

Deno.test(`slash-command-prase "/nip05 request anthony"`, async () => {
  const example_convo = [
    {
      decrypted_content: "/nip05 request anthony",
    },
  ];
  const parsed_command = await nip05SlashCommand_parser(
    example_convo,
    test_config,
  );
  const expected_response =
    "A internet identifier should include an @ sign because it looks like an email address";
  assertEquals(expected_response, parsed_command);
});

Deno.test(`slash-command-prase "/nip05 request anthony@invalid.local"`, async () => {
  const example_convo = [
    {
      decrypted_content: "/nip05 request anthony@invalid.local",
    },
  ];
  const parsed_command = await nip05SlashCommand_parser(
    example_convo,
    test_config,
  );
  const expected_response =
    `We don't support that domain name please run "/nip05 list-domains"`;
  assertEquals(expected_response, parsed_command);
});
