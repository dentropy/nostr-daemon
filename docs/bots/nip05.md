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

* scp
    * SCP_HOST
    * SCP_PATH
* s3 TODO
* nostr pubsub TODO

#### nip05 bot specific tests

``` bash

deno test lib/nip05

# --allow-console --allow-all

```