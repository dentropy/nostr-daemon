import { nip05SlashCommand_parser } from "./nip05SlashCommandParser.js";
import { nip05CheckNostrJsonUpdate } from "./nip05CheckNostrJsonUpdate.js";
import { assertEquals } from "jsr:@std/assert";
import Sinon from "sinon";

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

// TODO fix these tests

// Deno.test(`nostr.json update "/nip05 request anthony@test.local, already exists"`, async () => {
//     const example_convo = [
//         {
//             decrypted_content: "/nip05 request anthony@test.local",
//             pubkey: "c0e6de7e4e57a98fb2f163876d204273fc191792b0f667e958d16c9743fcaa5a"
//         },
//     ];

//     const mockResponse = {
//         names: { fred: "0x1234", george: "0x8765", anthony: "0x6543" },
//     };
//     const fetchStub = Sinon.stub(globalThis, "fetch").resolves({
//         ok: true,
//         status: 200,
//         json: async () => mockResponse,
//     });

//     const parsed_command = await nip05SlashCommand_parser(
//         example_convo,
//         test_config,
//     );
//     let expected_response = {
//         command: "request",
//         data: { user_name: "anthony", domain_name: "test.local", pubkey: "c0e6de7e4e57a98fb2f163876d204273fc191792b0f667e958d16c9743fcaa5a" }
//     };
//     assertEquals(expected_response, parsed_command);

//     const update_command = await nip05CheckNostrJsonUpdate(parsed_command, test_config)
//     expected_response = `user_name="anthony" has already been claimed`
//     assertEquals(expected_response, update_command);

//     fetchStub.restore();
// });


// // TODO this one is still not done
// Deno.test(`nostr.json update "/nip05 request anthony@test.local"`, async () => {
//     const example_convo = [
//         {
//             decrypted_content: "/nip05 request anthony@test.local",
//             pubkey: "c0e6de7e4e57a98fb2f163876d204273fc191792b0f667e958d16c9743fcaa5a"
//         },
//     ];

//     const mockResponse = {
//         names: { fred: "0x1234", george: "0x8765" },
//     };
//     const fetchStub = Sinon.stub(globalThis, "fetch").resolves({
//         ok: true,
//         status: 200,
//         json: async () => mockResponse, // Simulate the json() method
//     });
//     const parsed_command = await nip05SlashCommand_parser(
//         example_convo,
//         test_config,
//     );
//     let expected_response = {
//         command: "request",
//         data: { user_name: "anthony", domain_name: "test.local", pubkey: "c0e6de7e4e57a98fb2f163876d204273fc191792b0f667e958d16c9743fcaa5a" }
//     };
//     assertEquals(expected_response, parsed_command);

//     const update_command = await nip05CheckNostrJsonUpdate(parsed_command, test_config)
//     expected_response = {
//         command: "update_nostr_dot_joson",
//         data:
//         {
//             domain_name: "test.local",
//             nostr_dot_json: {
//                 names: {
//                     fred: "0x1234",
//                     george: "0x8765",
//                     anthony: "c0e6de7e4e57a98fb2f163876d204273fc191792b0f667e958d16c9743fcaa5a"
//                 }
//             }
//         }
//     }
//     assertEquals(expected_response, update_command);

//     fetchStub.restore();
// });
