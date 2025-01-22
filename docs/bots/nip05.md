# nip05 slash command bot

#### Running the Bot

``` bash

deno -A cli.js nip05-bot -nsec $NSEC0 -i ./configs/example-nip05bot.json

```
#### Example Commands

``` js
/*
/nip05 ping
/nip05 list-domains
/nip05 request dentropy@ddaemon.org
/nip05 rotate $NPUB
/nip05 set-relays $RELAYS_SEPARATED_VALUES
/nip05 get-relays $NPUB
/nip05 delete dentropy@ddaemon.org
*/
```

#### Handlers

* rsync
    * REMOTE_HOST
    * HOST_PATH
* s3 TODO
* nostr pubsub TODO

#### nip05 bot specific tests

``` bash

deno test lib/nip05

# --allow-console --allow-all

```

#### Manual Testing

**Run The Bot**
``` bash

source <(deno -A cli.js generate-accounts-env -m 'soap vault ahead turkey runway erosion february snow modify copy nephew rude')

clear
deno -A cli.js nip05-bot -nsec $NSEC8 -i ./configs/example-nip05bot.json

```

**Test the help command**
``` bash

clear

source <(deno -A cli.js generate-accounts-env -m 'soap vault ahead turkey runway erosion february snow modify copy nephew rude')

export RELAYS='ws://127.0.0.1:6969,ws://127.0.0.1:4036/relay'

echo $RELAYS

deno -A cli.js send-event \
--nsec $NSEC16 \
--event_data './events/nip05_bot_test_help.json' \
--relays $RELAYS


deno -A cli.js send-event \
-nsec $NSEC16 \
-f './events/nip05_bot_test_list_domains.json' \
--relays $RELAYS

deno -A cli.js send-event \
-nsec $NSEC16 \
-f './events/nip05_bot_test_request.json' \
--relays $RELAYS

```

``` bash

nosdump -k 1 ws://127.0.0.1:6969 > ScrapedData/nip05_bot_event1.jsonl

nosdump -k 1 ws://127.0.0.1:4036/relay > ScrapedData/nip05_bot_event1.jsonl

```

``` bash

mkdir -p /tmp/nginx/html/.well-known

echo '{"names":{"dentropy":"cda3a18bb150a58387383b7a2d332423994a1979d8ba61be1d26dafaf6a3d6b2","paul":"827782ff6cf5cfe0732a1470dc399acb3f7eb592187ac88c755aefc82f6a9432"},"relays":{"cda3a18bb150a58387383b7a2d332423994a1979d8ba61be1d26dafaf6a3d6b2":["wss://relay.nostr.band","wss://relay.damus.io/"],"827782ff6cf5cfe0732a1470dc399acb3f7eb592187ac88c755aefc82f6a9432":["wss://relay.damus.io","wss://nos.lol","wss://relay.newatlantis.top","wss://purplerelay.com","wss://relay.nostr.band"]}}' > /tmp/nginx/html/.well-known/nostr.json

cat /tmp/nginx/html/.well-known/nostr.json

cat cat /tmp/nginx/html/.well-known/nostr.json | jq

echo "127.0.0.1 nip05.local" | sudo tee -a /etc/hosts

cd /tmp/nginx/html

python3 -m http.server
```

``` bash

```