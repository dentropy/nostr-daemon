#### fake-thread

``` bash

source <(deno -A cli.js generate-accounts-env -m 'soap vault ahead turkey runway erosion february snow modify copy nephew rude')

echo $NSEC0
echo $NSEC1

export RELAYS='ws://127.0.0.1:7007'
export RELAYS='wss://relay.newatlantis.top'
echo $RELAYS

deno -A cli.js fake-thread -nsec0 $NSEC0 -nsec1 $NSEC1 -nsec2 $NPUB0 --relays $RELAYS


```
#### get-thread-events

**NOT IMPLIMENTED YET**
``` bash

source <(deno -A cli.js generate-accounts-env -m 'soap vault ahead turkey runway erosion february snow modify copy nephew rude')

export EVENT_ID='ee54d3d5ed8f9b02c1fc210a6244f7a17f72c443a582e75cd229eed2ed89a09b'
export RELAYS='ws://127.0.0.1:7007'

export RELAYS='wss://relay.damus.io/,wss://nos.lol/,wss://nostr.wine,relay.primal.net'

deno -A cli.js get-thread-events --event_id $EVENT_ID --relays "$RELAYS"



nosdump $RELAYS
nosdump -e '04429d6207af389fba1f0da8ebcaabc963a157a3d77a871ef1b17891185ecb23' $RELAYS


cd NostrTutorials
cd lib
deno repl --allow-all --eval-file='./retriveThread.js'


```