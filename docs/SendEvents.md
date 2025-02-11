#### send-event

``` bash

source <(deno -A cli.js generate-accounts-env -m 'soap vault ahead turkey runway erosion february snow modify copy nephew rude')

export RELAYS='wss://relay.mememaps.net/'

echo $RELAYS

deno -A cli.js send-event \
-nsec $NSEC0 \
-f './events/filter_experiment.json' \
--relays $LOCAL_RELAYS


```


#### When Developing Locally

``` bash

source <(deno -A cli.js generate-accounts-env -m 'soap vault ahead turkey runway erosion february snow modify copy nephew rude')

# nostr-relay-pip
export LOCAL_RELAYS='ws://127.0.0.1:6969'

# ditto
export LOCAL_RELAYS='ws://127.0.0.1:4036/relay'

# strfry
export LOCAL_RELAYS='ws://127.0.0.1:7777'

# nostr-rs-relay
export LOCAL_RELAYS='ws://127.0.0.1:7007'


# Everything
export LOCAL_RELAYS='ws://127.0.0.1:6969,ws://127.0.0.1:4036/relay,ws://127.0.0.1:7777,ws://127.0.0.1:7007'

echo $LOCAL_RELAYS

deno -A cli.js send-event \
-nsec $NSEC0 \
-f './events/filter_experiment.json' \
--relays $LOCAL_RELAYS

```