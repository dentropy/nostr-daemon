/*
Inputs
  * NSEC
  * NPUB
  * NOSTR_RELAYS
*/
import "dotenv/config";
import LLMConvo from "./LLMConvo.js";
import { finalizeEvent, nip19 } from "nostr-tools";
import { SimplePool } from "nostr-tools/pool";
import { RetriveThread } from "../RetriveThread.js";
import { RemoveNIP19FromContent } from "../RemoveNIP19FromContent.js";
import { LLMSlashCommandConvoParser } from "./LLMSlashCommandConvoParser.js";

// TODO check for NIP65 integration
export async function llm_respond_to_thread(
  relays,
  nsec,
  event_id,
  BASE_URL,
  OPENAI_API_KEY,
) {
  let convo = await RetriveThread(relays, event_id);
  let convo_reply = convo[convo.length -1]
  console.log("convo_reply")
  console.log(convo_reply)
  convo.forEach((element, index) => {
    convo[index].decrypted_content = RemoveNIP19FromContent(element.content);
  });
  convo = LLMSlashCommandConvoParser(convo, [
    "llama3.2:latest",
    "llama2-uncensored:latest",
  ]);
  console.log("CONVO_PRIME")
  console.log(typeof(convo))
  const myPool = new SimplePool();
  if (typeof(convo) == typeof ("")) {
    // We need to get all the e and p tags
    const signedEvent = finalizeEvent({
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ["p", convo_reply.pubkey],
        ["e", convo_reply.id, "", "root"],
        ["e", convo_reply.id, "", "reply"],
      ],
      content: convo,
    }, nip19.decode(nsec).data);
    console.log("signed_event");
    console.log(signedEvent);

    // Send message to the users relays
    // user_nip65_relays should be used below #TODO
    await myPool.publish(relays, signedEvent);
    console.log("We should have replied");
    return;
  }
  let selected_llm_model = convo.model_selected;
  convo = convo.parsed_convo;
  console.log("LLM_Formated_Conversation");
  console.log(JSON.stringify(convo, null, 2));
  // Create a new message with the response
  console.log("THE_CONVO");
  console.log(convo);
  console.log(convo[convo.length - 1]);
  if (
    convo[convo.length - 1].decrypted_content.toLowerCase().replace(/\n/g, "")
      .trim() == "help"
  ) {
    console.log("HELP_MESSAGE_ACTIVATED");
    const signedEvent = finalizeEvent({
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ["p", convo[0].pubkey],
        ["e", convo[0].id, "", "root"],
        ["e", convo[convo.length - 1].id, "", "reply"],
      ],
      content: "You asked for help, IDK what to say yet",
    }, nip19.decode(nsec).data);
    await myPool.publish(relays, signedEvent);
    console.log("We should have replied");
    return;
  }
  const llm_response = await LLMConvo(BASE_URL, OPENAI_API_KEY, convo, nsec); // selected_llm_model
  // We need to get all the e and p tags
  const signedEvent = finalizeEvent({
    kind: 1,
    created_at: Math.floor(Date.now() / 1000),
    tags: [
      ["p", convo[0].pubkey],
      ["e", convo[0].id, "", "root"],
      ["e", convo[convo.length - 1].id, "", "reply"],
    ],
    content: llm_response,
  }, nip19.decode(nsec).data);
  console.log("signed_event");
  console.log(signedEvent);

  // Send message to the users relays
  // user_nip65_relays should be used below #TODO
  await myPool.publish(relays, signedEvent);
  console.log("We should have replied");
}

// const ndk = new NDK({
//     explicitRelayUrls: relays,
// });

// await ndk.connect();

// let unix_time = Math.floor((new Date()).getTime() / 1000);
// let filter = {
//     "kinds": [1],
//     "#p": getPublicKey(nip19.decode(nsec).data),
//     "since": unix_time - 10
// }
// console.log(JSON.stringify(filter, null, 2))
// let sub = await ndk.subscribe(filter);
// sub.on("event", async (event) => {
//     console.log("Recieved and event")
//     console.log(`content           = ${event.content}`)
//     console.log(`tags              = ${event.tags}`)
//     console.log(`id                = ${event.id}`)
//     console.log(`kind              = ${event.kind}`)
//     console.log(`created_at        = ${event.created_at}`)
//     console.log(`pubkey            = ${event.pubkey}`)
//     let raw_event = {
//         content: event.content,
//         tags: event.tags,
//         id: event.id,
//         kind: event.king,
//         created_at: event.created_at,
//         pubkey: event.pubkey
//     }
//     console.log(JSON.stringify(raw_event, null, 2))
//     console.log("")
//     console.log("PAUL_WAS_HERE")
//     console.log(getPublicKey(nip19.decode(nsec).data))
//     console.log(event.pubkey)
//     if( getPublicKey(nip19.decode(nsec).data) != event.pubkey) {
//         respond_to_thread(relays, nsec, nip_65_relays, raw_event.id)
//     }
// })
