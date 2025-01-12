#### get-encrypted-convo

**Generate an Encrypted Conversation**
``` bash

source <(deno -A cli.js generate-accounts-env -m 'soap vault ahead turkey runway erosion february snow modify copy nephew rude')

echo $NSEC0
echo $NSEC1

export RELAYS='ws://127.0.0.1:7007'
export RELAYS='wss://relay.newatlantis.top'
echo $RELAYS

deno -A cli.js gen-fake-dm-convo -from $NSEC0 -to $NSEC1 --relays $RELAYS

```

**Decrypt the Conversation**
``` bash

source <(deno -A cli.js generate-accounts-env -m 'soap vault ahead turkey runway erosion february snow modify copy nephew rude')

echo $NSEC0
echo $NSEC1

export RELAYS='ws://127.0.0.1:7007'
export RELAYS='wss://relay.newatlantis.top'
echo $RELAYS

deno -A cli.js get-encrypted-convo -from $NSEC1 -to $NPUB0 --relays $RELAYS

```
