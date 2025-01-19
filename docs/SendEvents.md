#### send-event

``` bash

source <(deno -A cli.js generate-accounts-env -m 'soap vault ahead turkey runway erosion february snow modify copy nephew rude')

export RELAYS='ws://127.0.0.1:6969'
export RELAYS='wss://social.mememaps.net/relay'
export RELAYS='ws://127.0.0.1:4036/relay'

echo $RELAYS

deno -A cli.js send-event \
-nsec $NSEC0 \
-f './event-data.json' \
--relays $RELAYS


```