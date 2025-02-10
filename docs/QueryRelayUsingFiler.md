# Query Relay Using Filter

``` bash

export RELAYS='ws://127.0.0.1:6969'
export RELAYS='ws://127.0.0.1:4036/relay'
export RELAYS='wss://social.mememaps.net/relay'
export RELAYS='wss://relay.primal.net/'

deno -A cli.js filter-query \
--filter_file_path ./filters/test.json \
--relays $RELAYS

```