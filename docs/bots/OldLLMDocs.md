#### Testing LLM Connection

``` bash

export BASE_URL='https://ai.mememaps.net/api'
export OPENAI_API_KEY="sk-ENTROPY"

curl -H "Authorization: Bearer $OPENAI_API_KEY" $BASE_URL/api/models

curl -H "Authorization: Bearer $OPENAI_API_KEY" $BASE_URL/models | jq

curl -X POST $BASE_URL/chat/completions \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-H "Content-Type: application/json" \
-d '{
      "model": "llama3.2:latest",
      "messages": [
        {
          "role": "user",
          "content": "Hello"
        }
      ]
}' | jq

curl -X POST $BASE_URL/chat/completions \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-H "Content-Type: application/json" \
-d '{
      "model": "llama3.2:latest",
      "messages": [
        {
          "role": "user",
          "content": "Why is the sky blue?"
        }
      ]
}' | jq

```

#### llm-bot

To use a test Nostr Relay running on your local machine check out [How to Run A Nostr Relay document](./RunNostrRelay.md).

``` bash

deno -A cli.js help llm-dm-bot

export BASE_URL='https://ai.mememaps.net/api'
export OPENAI_API_KEY="sk-ENTROPY"

# Test the LLM Connection
curl -H "Authorization: Bearer $OPENAI_API_KEY" $BASE_URL/api/models

# Load Nostr Accounts
source <(deno -A cli.js generate-accounts-env -m 'soap vault ahead turkey runway erosion february snow modify copy nephew rude')

export RELAYS='ws://127.0.0.1:6969,ws://localhost:4036/relay'


deno -A cli.js llm-bot \
--nsec $NSEC0 \
--relays $RELAYS \
--nip_65_relays $RELAYS \
--relays_for_dms $RELAYS \
--BASE_URL $BASE_URL \
--OPENAI_API_KEY $OPENAI_API_KEY

```

#### User and Testing the Bot


- [Nostr Connect - Chrome Web Store](https://chromewebstore.google.com/detail/nostr-connect/ampjiinddmggbhpebhaegmjkbbeofoaj?hl=en%2C)
- [Nostr Connect – 🦊 Firefox Extension](https://addons.mozilla.org/en-US/firefox/addon/nostr-connect/)


``` bash

export RELAYS='ws://127.0.0.1:6969,ws://localhost:4036/relay'

deno -A cli.js send-event \
-nsec $NSEC12 \
-f './events/nip65.json' \
--relays $RELAYS

echo $NSEC12

```

Login to [noStrudel](https://nostrudel.ninja/)

Set [noStrudel relays](https://nostrudel.ninja/#/relays)

``` bash

ws://127.0.0.1:6969

ws://localhost:4036/relay

```

Send Direct Message to test