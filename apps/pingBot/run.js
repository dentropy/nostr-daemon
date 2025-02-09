import { pingBot } from './pingBot.js'
import { Buffer } from "node:buffer"

import { generateSecretKey } from 'nostr-tools/pure'
import { nip19 } from 'nostr-tools'

const args = {
    nsec : nip19.nsecEncode(new Buffer.from(generateSecretKey())),
    config_path: "./configExample.json"
}


await pingBot(args)