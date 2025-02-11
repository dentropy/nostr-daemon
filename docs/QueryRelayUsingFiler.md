# Query Relay Using Filter

``` bash

# Choose only one of the following
export RELAYS='wss://relay.mememaps.net/'
export RELAYS='wss://relay.primal.net/'
export RELAYS='wss://nostr.wine/'
export RELAYS='wss://nostr.lol/'
export RELAYS='wss://nostr.land/'
export RELAYS='wss://purplerelay.com/'
export RELAYS='wss://relay.damus.io/'


deno -A cli.js filter-query \
--filter_file_path ./filters/test.json \
--relays $RELAYS

```

#### Relays for local testing

``` bash

# nostr-relay-pip
export RELAYS='ws://127.0.0.1:6969'

# ditto
export RELAYS='ws://127.0.0.1:4036/relay'

# strfry
export RELAYS='ws://127.0.0.1:7777'

# nostr-rs-relay
export RELAYS='ws://127.0.0.1:7007'

deno -A cli.js filter-query \
--filter_file_path ./filters/test.json \
--relays $RELAYS

```