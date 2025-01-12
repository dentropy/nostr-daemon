import { getPublicKey, nip19 } from "nostr-tools";
import { bytesToHex, hexToBytes } from '@noble/hashes/utils'


export default function genNostrAccount(nsec) {
  let secret_key = nip19.decode(nsec).data
  let public_key = getPublicKey(nip19.decode(nsec).data);
  let npub = nip19.npubEncode(public_key);
  let account = {
    secret_key: secret_key,
    pubkey: public_key,
    nsec: nsec,
    npub: npub,
  }
  return account
}