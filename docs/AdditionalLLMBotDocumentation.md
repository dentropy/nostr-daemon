#### llm-thread-bot


``` bash

deno -A cli.js help llm-dm-bot

source <(deno -A cli.js generate-accounts-env -m 'soap vault ahead turkey runway erosion february snow modify copy nephew rude')

export RELAYS='ws://127.0.0.1:6969'
export NIP_65_RELAYS='ws://127.0.0.1:7007'
export RELAYS='ws://127.0.0.1:7007,wss://relay.newatlantis.top'


export BASE_URL='https://ai.newatlantis.top/api'
export OPENAI_API_KEY="sk-ENTROPY"
export BASE_URL='http://127.0.0.1:11434'

curl -H "Authorization: Bearer $OPENAI_API_KEY" $BASE_URL/models | jq

# REMEMBER TO CHECK/SET ENVIRONMENT VARIABLES ARE SET, THEY ARE LISTED ABOVE 
deno -A cli.js llm-bot \
--nsec $NSEC0 \
-r $RELAYS \
--nip_65_relays $RELAYS \
-rdm $RELAYS \
--BASE_URL $BASE_URL \
--OPENAI_API_KEY $OPENAI_API_KEY

```

#### Run Bots Thread or DM Bot Independently

``` bash

deno -A cli.js llm-thread-bot \
--nsec $NSEC0 \
-r $RELAYS \
--BASE_URL $BASE_URL \
--OPENAI_API_KEY $OPENAI_API_KEY


deno -A cli.js llm-dm-bot \
--nsec $NSEC0 \
--nip_65_relays $RELAYS \
-rdm $RELAYS \
--BASE_URL $BASE_URL \
--OPENAI_API_KEY $OPENAI_API_KEY

```