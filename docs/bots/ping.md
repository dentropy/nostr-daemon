## Ping Bot

This bot is a tempalte so you can develop other bots


``` bash

git clone https://github.com/dentropy/nostr-daemon.git
cd nostr-daemon
deno i
deno -A cli.js ping-bot --help

# Please subsitute your own NSEC in prod
source <(deno -A cli.js generate-accounts-env -m 'soap vault ahead turkey runway erosion february snow modify copy nephew rude')

deno -A cli.js ping-bot -nsec $NSEC11 -c ./apps/nip05/configExample.json

```