/*
Inputs
  * NSEC
  * NSEC1
  * NOSTR_RELAYS
*/
import { LoremIpsum } from "lorem-ipsum";
import { finalizeEvent, nip04 } from "nostr-tools";
import { bytesToHex } from '@noble/hashes/utils'
import { SimplePool } from "nostr-tools/pool";

import genNostrAccount from './genNostrAccount.js'

export async function fakeDMConvo(nsec, nsec1, relays) {
  console.log(`${nsec}`)
  console.log(`${nsec1}`)
  console.log(`${relays}`)
  let accounts = []
  accounts.push(genNostrAccount(nsec))
  accounts.push(genNostrAccount(nsec1))
  console.log(accounts)

  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4,
    },
    wordsPerSentence: {
      max: 16,
      min: 4,
    },
  });

  const myPool = new SimplePool()
  for (var i = 0; i < 2; i++) {
    var random_text = lorem.generateParagraphs(3);
    var encrypted_text = await nip04.encrypt(
      accounts[0].secret_key,
      accounts[1].pubkey,
      random_text,
    );
    var signedEvent = finalizeEvent({
      kind: 4,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ["p", accounts[1].pubkey],
      ],
      content: encrypted_text,
    }, accounts[0].secret_key);
    await myPool.publish(relays, signedEvent);
    console.log("accounts[1].pubkey")
    console.log(accounts[1].pubkey)
    console.log("Signed Event");
    console.log(signedEvent);
    await new Promise((r) => setTimeout(() => r(), 1000));

    // Other User
    var random_text = lorem.generateParagraphs(3);
    var encrypted_text = await nip04.encrypt(
      bytesToHex(accounts[1].secret_key),
      accounts[0].pubkey,
      random_text,
    );
    var signedEvent = finalizeEvent({
      kind: 4,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ["p", accounts[0].pubkey],
      ],
      content: encrypted_text,
    }, accounts[1].secret_key);
    await myPool.publish(relays, signedEvent);
    console.log("Signed Event");
    console.log(signedEvent);
    await new Promise((r) => setTimeout(() => r(), 500));
  }
  return(true)
}
