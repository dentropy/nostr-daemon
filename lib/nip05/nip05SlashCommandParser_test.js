/*
/nip05 ping
/nip05 list-domains
/nip05 request dentropy@ddaemon.org
/nip05 rotate $NPUB
/nip05 set-relays $RELAYS_SEPARATED_VALUES
/nip05 get-relays $NPUB
/nip05 delete dentropy@ddaemon.org
*/
import { NIP05SlashCommand_parser } from "./nip05SlashCommandParser.js";
import { assertEquals } from "jsr:@std/assert";
import Sinon from "sinon";

// "/nip05 ping"
Deno.test("slash-command-prase `/nip05 ping`", async () => {
  const example_convo = [
    {
      decrypted_content: "/nip05 ping",
    },
  ];
  const parsed_command = await NIP05SlashCommand_parser(
    example_convo,
    {
      domain_names: ["test.local"],
    },
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
  const parsed_command = await NIP05SlashCommand_parser(
    example_convo,
    {
      domain_names: ["test.local"],
    },
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
  const parsed_command = await NIP05SlashCommand_parser(
    example_convo,
    {
      domain_names: ["test.local"],
    },
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
  const parsed_command = await NIP05SlashCommand_parser(
    example_convo,
    {
      domain_names: ["test.local"],
    },
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
  const parsed_command = await NIP05SlashCommand_parser(
    example_convo,
    {
      domain_names: ["test.local"],
    },
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
  const parsed_command = await NIP05SlashCommand_parser(
    example_convo,
    {
      domain_names: ["test.local"],
    },
  );
  const expected_response = JSON.stringify(["test.local"]);
  assertEquals(expected_response, parsed_command);
});

Deno.test(`slash-command-prase "nip05 list-domains"`, async () => {
  const example_convo = [
    {
      decrypted_content: "nip05 list-domains",
    },
  ];
  const parsed_command = await NIP05SlashCommand_parser(
    example_convo,
    {
      domain_names: ["test.local"],
    },
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
  const parsed_command = await NIP05SlashCommand_parser(
    example_convo,
    {
      domain_names: ["test.local"],
    },
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
  const parsed_command = await NIP05SlashCommand_parser(
    example_convo,
    {
      domain_names: ["test.local"],
    },
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
  const parsed_command = await NIP05SlashCommand_parser(
    example_convo,
    {
      domain_names: ["test.local"],
    },
  );
  const expected_response =
    `We don't support that domain name please run "/nip05 list-domains"`;
  assertEquals(expected_response, parsed_command);
});

Deno.test(`slash-command-prase "/nip05 request anthony@test.local"`, async () => {
    const example_convo = [
      {
        decrypted_content: "/nip05 request anthony@test.local",
      },
    ];
  
    const mockResponse = {
      names: { fred: "0x1234", george: "0x8765", anthony: "0x6543" },
    };
    const fetchStub = Sinon.stub(globalThis, "fetch").resolves({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });
  
    const parsed_command = await NIP05SlashCommand_parser(
      example_convo,
      {
        domain_names: ["test.local"],
      },
    );
    fetchStub.restore();
    const expected_response = 'user_name="anthony" has already been claimed';
    assertEquals(expected_response, parsed_command);
  });
  

// TODO this one is still not done
Deno.test(`slash-command-prase "/nip05 request anthony@test.local"`, async () => {
  const example_convo = [
    {
      decrypted_content: "/nip05 request anthony@test.local",
    },
  ];

  const mockResponse = {
    names: { fred: "0x1234", george: "0x8765" },
  };
  const fetchStub = Sinon.stub(globalThis, "fetch").resolves({
    ok: true,
    status: 200,
    json: async () => mockResponse, // Simulate the json() method
  });
  const parsed_command = await NIP05SlashCommand_parser(
    example_convo,
    {
      domain_names: ["test.local"],
    },
  );
  fetchStub.restore();
  const expected_response = undefined;
  assertEquals(expected_response, parsed_command);
});
