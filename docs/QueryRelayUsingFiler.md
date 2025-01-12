# Query Relay Using Filter

``` bash

export RELAYS='ws://127.0.0.1:6969'
export RELAYS='wss://social.mememaps.net/relay'
export RELAYS='ws://127.0.0.1:4036/relay'

deno -A cli.js filter-query --filter_file_path ./ScrapedData/filter.json -r $RELAYS

```