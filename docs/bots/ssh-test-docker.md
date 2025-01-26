
``` bash
cd docker/ssh-test

ssh-keygen -t rsa -b 4096 -C "nip05@test.local" -f ./id_rsa

./build.sh

sudo docker compose up -d

ssh root@127.0.0.1 -p 2222

```

#### Testing end to end

**Run test relay**
``` bash

pip install nostr-relay
nostr-relay serve

```

**Set the hostname in hosts file**
``` bash

echo "127.0.0.1 test.local" | sudo tee -a /etc/hosts
echo "127.0.0.1 nip05.local" | sudo tee -a /etc/hosts

ssh root@127.0.0.1 -o StrictHostKeyChecking=no -p 2222

```
- Test the caddy server is running correctly
    - [test.local:8090](http://test.local:8090/)
    - [nip05.local:8090](http://nip05.local:8090/)

**Run the bot**
``` bash

source <(deno -A cli.js generate-accounts-env -m 'soap vault ahead turkey runway erosion february snow modify copy nephew rude')

clear

deno -A cli.js nip05-bot -nsec $NSEC8 -i ./configs/example-nip05bot.json

```

**Update vents with nostr public key**
``` bash

jq ".tags[0][1] = \"$NPUBHEX8\"" ./events/nip05_bot_test_help.json > tmp.json && mv tmp.json ./events/nip05_bot_test_help.json

jq ".tags[0][1] = \"$NPUBHEX8\"" ./events/nip05_bot_test_list_domains.json > tmp.json && mv tmp.json ./events/nip05_bot_test_list_domains.json

jq ".tags[0][1] = \"$NPUBHEX8\"" ./events/nip05_bot_test_request.json > tmp.json && mv tmp.json ./events/nip05_bot_test_request.json

```

**Send events out that are used to test bot**
``` bash

clear

source <(deno -A cli.js generate-accounts-env -m 'soap vault ahead turkey runway erosion february snow modify copy nephew rude')

export RELAYS='ws://127.0.0.1:6969,ws://127.0.0.1:4036/relay'

echo $RELAYS

deno -A cli.js send-event \
--nsec $NSEC16 \
--event_data './events/nip05_bot_test_help.json' \
--relays $RELAYS


deno -A cli.js send-event \
-nsec $NSEC16 \
-f './events/nip05_bot_test_list_domains.json' \
--relays $RELAYS

deno -A cli.js send-event \
-nsec $NSEC16 \
-f './events/nip05_bot_test_request.json' \
--relays $RELAYS

```

**Scrape the events to find replies**
``` bash

nosdump -k 1 ws://127.0.0.1:6969 > ScrapedData/nip05_bot_event1.jsonl

nosdump -k 1 ws://127.0.0.1:4036/relay > ScrapedData/nip05_bot_event1.jsonl

```


#### Sources

- [ChatGPT](https://chatgpt.com/share/6791796d-4768-8002-8487-43d26d8120aa)
- [ssh - Docker container SSHOpen not staying up - Server Fault](https://serverfault.com/questions/721026/docker-container-sshopen-not-staying-up)