## Ping Bot

This bot is a tempalte so you can develop other bots


``` bash

git clone https://github.com/dentropy/nostr-daemon.git
cd nostr-daemon
deno i
deno -A cli.js ping-bot --help

# Please subsitute your own NSEC in prod
source <(deno -A cli.js generate-accounts-env -m 'soap vault ahead turkey runway erosion february snow modify copy nephew rude')

# Validate the relays in the config
cat ./apps/pingBot/configExample.json


deno -A cli.js ping-bot -nsec $NSEC11 -c ./apps/pingBot/configExample.json

# For relays outside the testing environment
cat ./apps/nip05/configExampleSSL.json

deno -A cli.js ping-bot -nsec $NSEC11 -c ./apps/nip05/configExampleSSL.json

```