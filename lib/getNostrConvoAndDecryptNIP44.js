import { nip19, getPublicKey, nip44 } from "nostr-tools";
import { bytesToHex, hexToBytes } from '@noble/hashes/utils'

import { nostrGet } from "./nostrGet.js";

export async function getNostrConvoAndDecryptNIP44(relays, nsec, npub) {

  let account_sent_to = nip19.decode(npub).data
  let account_sent_from = getPublicKey(nip19.decode(nsec).data);
  // Setup the filters and get the messages of this conversation
  let filter_from_bot = {
    authors: [account_sent_to],
    kinds: [1059],
    "#p": account_sent_from,
  }

  console.log("filter_from_bot")
  console.log(JSON.stringify(filter_from_bot, null, 2))
  let events_from_bot = await nostrGet(relays, filter_from_bot);

  // console.log("account_sent_to")
  // console.log(account_sent_to)
  // console.log("nsec")
  // console.log(nsec)
  // console.log("account_sent_from")
  // console.log(account_sent_from)
  // console.log("filter_from_bot")
  // console.log(filter_from_bot)
  // console.log("Got Inital Nostr Events")

  let filter_from_user = {
    authors: [account_sent_from],
    kinds: [1059],
    "#p": account_sent_to,
  };
  let events_from_user = await nostrGet(relays, filter_from_user);

  console.log("Got_Other_NIP_44_Nostr_Events")
  let all_events = events_from_bot.concat(events_from_user);
  let decrypted_events = [];
  let privkey = nip19.decode(nsec).data
  for (let convoEvent of all_events) {
    try {
      const key = nip44.getConversationKey(privkey, convoEvent.pubkey)
      let event13 = JSON.parse(nip44.decrypt(convoEvent.content, key))
      const event13Key = nip44.getConversationKey(privkey, event13.pubkey)
      let decrypted_content = JSON.parse(nip44.decrypt(event13.content, event13Key)).content
      event13Key.decrypted_content = decrypted_content;
      decrypted_events.push(event13Key);
      console.log("SUCCESSFULLY_DECRYPTED_NIP44")
      console.log(event13Key)
    } catch (error) {
      console.log("FAILED_TO_DECRYPT_NIP44")
      console.log(error)
      convoEvent.decrypted_content = "FAILED";
      decrypted_events.push(convoEvent); 
    }
  }
  decrypted_events.sort((a, b) => a.created_at - b.created_at);

  console.log("Returning Events")

  return decrypted_events;
}
