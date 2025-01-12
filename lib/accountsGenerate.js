import bip39 from "bip39"
import { Buffer } from "node:buffer"

// const mnemonic = process.env.MNEMONIC ||  bip39.generateMnemonic();
// let accounts = generateNostrAccountsFromMnemonic(mnemonic)

// console.log("To import a mnemonic run the following,")
// console.log("export mnemonic='unlock secret your mnemonic goes here'")
// // console.log(accounts)
// for(let i = 0 ; i < accounts.length; i++){
//   console.log(accounts[i])
//   console.log(`NSEC${i}`)
//   process.env[`NSEC${i}`] = accounts[i].nsec;
//   process.env[`NPUB${i}`] = accounts[i].npub;
// }
// console.log("Backup your Mnemonic which is,")
// console.log(mnemonic)
// console.log("To set NSEC run the following for account 0")
// console.log(`export NSEC='${accounts[0].nsec}'`)

import { getPublicKey, nip19 } from "nostr-tools";
import { privateKeyFromSeedWords, validateWords } from "nostr-tools/nip06";
import { bytesToHex, hexToBytes } from '@noble/hashes/utils'


export default function generateNostrAccountsFromMnemonic(mnemonic) {
  let mnemonic_validation = validateWords(mnemonic);
  if (!mnemonic_validation) {
    console.log("Invalid Mnemonic");
    process.exit(0);
  }
  let accounts = [];
  for (var i = 0; i < 20; i++) {
    let secret_key = privateKeyFromSeedWords(mnemonic, "", i);
    let public_key = getPublicKey(secret_key);
    let uint8_secret_key = new Buffer.from(secret_key, "hex");
    let nsec = nip19.nsecEncode(uint8_secret_key);
    let npub = nip19.npubEncode(public_key);
    accounts.push({
      secret_key: bytesToHex(secret_key),
      pubkey: public_key,
      nsec: nsec,
      npub: npub,
    });
  }
  return accounts
}