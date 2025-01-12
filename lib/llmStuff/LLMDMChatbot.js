/*
Inputs
  * NSEC
  * NPUB
  * NOSTR_RELAYS
*/
import "dotenv/config";
import { getNostrConvoAndDecrypt } from "../getNostrConvoAndDecrypt.js";
import LLMConvo from "./LLMConvo.js";
import { nostrGet } from "../nostrGet.js";
import { finalizeEvent, getPublicKey, nip04, nip19 } from "nostr-tools";
import { SimplePool } from "nostr-tools/pool";
import { Relay } from "nostr-tools/relay";
import { RemoveNIP19FromContent } from '../RemoveNIP19FromContent.js'
import { LLMSlashCommandConvoParser } from "./LLMSlashCommandConvoParser.js";

// TODO this should be rewritten to support npub, npub, public_key buffer, public key array, private_key buffer, private_key array
export async function check_NIP65_published(
  nip_65_relays,
  nsec,
  relays_to_store_dms,
) {
  let nostr_filter = {
    kinds: [10002],
    authors: [getPublicKey(nip19.decode(nsec).data)], // Yea I know this is dangerous
  };
  console.log("nostr_filter");
  console.log(nostr_filter);
  let events = await nostrGet(nip_65_relays, nostr_filter);
  // console.log("THE_EVENTS")
  // console.log(events)
  if (events.length == 0) {
    let relay_event_tags = [];
    for (const relay_url of relays_to_store_dms) {
      relay_event_tags.push(["r", relay_url]);
    }
    const signedEvent = finalizeEvent({
      kind: 10002,
      created_at: Math.floor(Date.now() / 1000),
      tags: relay_event_tags,
      content: "",
    }, nip19.decode(nsec).data);
    for (const relay_url of nip_65_relays) {
      try {
        const relay = await Relay.connect(relay_url);
        await relay.publish(signedEvent);
        console.log(`Published Event to ${relay_url} success`);
      } catch (error) {
        console.log(`Published Event to ${relay_url} failure`);
        console.log(`    ${error}`);
      }
    }
  } else {
    console;
    console.log(
      `We found your npub= ${
        nip19.npubEncode(getPublicKey(nip19.decode(nsec).data))
      } already published on some of the relays you listed`,
    );
  }
}

export async function llm_dm_chatbot_response(
  relays,
  nsec,
  nip_65_relays,
  npub,
  BASE_URL,
  OPENAI_API_KEY,
) {
  console.log("MY_NPUB");
  console.log(npub);
  let convo = await getNostrConvoAndDecrypt(
    relays,
    nsec,
    npub,
  );
  console.log(convo)
  convo.forEach((element, index) => {
    convo[index].decrypted_content = RemoveNIP19FromContent(element.decrypted_content);
  });
  convo = LLMSlashCommandConvoParser(convo, [
    "llama3.2:latest",
    "llama2-uncensored:latest",
  ]);
  let selected_llm_model = convo.model_selected
  console.log("OUTPUT_CONVO");
  console.log(convo);
  let llm_response = "GOT ERROR SOMEHOW";
  if (typeof convo == typeof ("")) {
    llm_response = convo;
  } else {
    llm_response = await LLMConvo(
      BASE_URL,
      OPENAI_API_KEY,
      convo.parsed_convo,
      nsec,
    );
  }

  // Get the users's NIP65 relays we need to send the response to
  let nostr_filter = {
    kinds: [10002],
    authors: [nip19.decode(npub).data],
  };
  let events = await nostrGet(nip_65_relays, nostr_filter);
  let user_nip65_relays = [];
  if (events.length == 0) {
    console.log("\nThis filter returned nothing");
    console.log(JSON.stringify(nostr_filter, null, 2));
    console.log("");
    user_nip65_relays = relays;
  } else {
    for (const tag of events[0].tags) {
      console.log("tag");
      console.log(tag);
      if (tag[0] == "r" && tag[1] != undefined) {
        user_nip65_relays.push(tag[1]);
      }
    }
    if (user_nip65_relays.length == 0) {
      user_nip65_relays = nip_65_relays;
    }
  }

  // Create a new message with the response
  const myPool = new SimplePool();
  const encrypted_text = await nip04.encrypt(
    nip19.decode(nsec).data,
    nip19.decode(npub).data,
    llm_response,
  );
  const signedEvent = finalizeEvent({
    kind: 4,
    created_at: Math.floor(Date.now() / 1000),
    tags: [
      ["p", nip19.decode(npub).data],
    ],
    content: encrypted_text,
  }, nip19.decode(nsec).data);
  // Send message to the users relays
  await myPool.publish(user_nip65_relays, signedEvent);

  console.log("We should have replied");
}
