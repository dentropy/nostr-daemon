#### send-event

``` bash

source <(deno -A cli.js generate-accounts-env -m 'soap vault ahead turkey runway erosion february snow modify copy nephew rude')

export RELAYS='wss://relay.mememaps.net/'

echo $RELAYS

source <(deno -A cli.js generate-accounts-env -m 'soap vault ahead turkey runway erosion february snow modify copy nephew rude')

deno -A cli.js send-event \
-nsec $NSEC0 \
-f './events/filter_experiment.json' \
--relays $RELAYS


```


#### When Developing Locally

``` bash

source <(deno -A cli.js generate-accounts-env -m 'soap vault ahead turkey runway erosion february snow modify copy nephew rude')

# nostr-relay-pip
export RELAYS='ws://127.0.0.1:6969'

# ditto
export RELAYS='ws://127.0.0.1:4036/relay'

# strfry
export RELAYS='ws://127.0.0.1:7777'

# nostr-rs-relay
export RELAYS='ws://127.0.0.1:7007'


# Everything
export RELAYS='ws://127.0.0.1:6969,ws://127.0.0.1:4036/relay,ws://127.0.0.1:7777,ws://127.0.0.1:7007'

echo $RELAYS

source <(deno -A cli.js generate-accounts-env -m 'soap vault ahead turkey runway erosion february snow modify copy nephew rude')

deno -A cli.js send-event \
-nsec $NSEC0 \
-f './events/filter_experiment.json' \
--relays $RELAYS

```