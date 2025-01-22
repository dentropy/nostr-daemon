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
-nsec $NSEC16 \
-f './events/nip05_bot_test.json' \
--relays $RELAYS


deno -A cli.js send-event \
-nsec $NSEC16 \
-f './events/nip05_bot_test_list_domains.json' \
--relays $RELAYS

```

``` bash

nosdump -k 1 ws://127.0.0.1:6969 > ScrapedData/nip05_bot_event1.jsonl

nosdump -k 1 ws://127.0.0.1:4036/relay > ScrapedData/nip05_bot_event1.jsonl

```