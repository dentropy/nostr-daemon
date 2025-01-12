#### dentropys-obsidian-publisher


``` bash

source <(deno -A cli.js generate-accounts-env -m 'soap vault ahead turkey runway erosion february snow modify copy nephew rude')

export RELAYS='ws://127.0.0.1:7007'

export RELAYS='wss:relay.newatlantis.top,wss://relay.damus.io/,wss://nos.lol/,wss://nostr.wine,relay.primal.net'
export RELAYS='wss://relay.newatlantis.top'

deno -A cli.js dentropys-obsidian-publisher --relays $RELAYS --nsec $NSEC0 --sqlite_path './pkm.sqlite'

```