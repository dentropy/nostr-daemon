import { LLMBot } from './LLMBot.js'

import { Buffer } from "node:buffer"
import { generateSecretKey } from 'nostr-tools/pure'
import { nip19 } from 'nostr-tools'

const args = {
    nsec : "nsec1m3s259dr0wyl5vd40djdq3qkm0mk4sh5apez347gjn0efja7uunshca4yk",
    // nsec: nip19.nsecEncode(new Buffer.from(generateSecretKey())),
    config_path: "./configExample.json"
}


await LLMBot(args)
