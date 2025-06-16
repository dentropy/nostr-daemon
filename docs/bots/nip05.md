# nip05 slash command bot


#### Configuring Test Environment

**Set the hostname in hosts file**
``` bash

git clone https://github.com/dentropy/nostr-daemon.git
cd nostr-daemon

docker network create nostr-daemon
cd docker/relays/nostr-relay-pip
./build.sh
docker compose up -d

cd ../..
cd docker/development/ssh-test

# DO NOT SET A PASSPHRASE
ssh-keygen -t rsa -b 4096 -C "nip05@nostr.local" -f id_rsa

./build.sh

docker compose up -d

mkdir -p ./caddy/sites/nip05.local/.well-known
mkdir -p ./caddy/sites/test.local/.well-known
mkdir -p ./caddy/sites/test.tld/.well-known

# This will overwrite your local config
echo '{"names":{},"relays":{}}' > ./caddy/sites/nip05.local/.well-known/nostr.json
echo '{"names":{},"relays":{}}' > ./caddy/sites/test.local/.well-known/nostr.json
echo '{"names":{},"relays":{}}' > ./caddy/sites/test.tld/.well-known/nostr.json

echo "127.0.0.1 test.local" | sudo tee -a /etc/hosts
echo "127.0.0.1 nip05.local" | sudo tee -a /etc/hosts
echo "127.0.0.1 test.tld" | sudo tee -a /etc/hosts
echo "127.0.0.1 blossom.nip05.local" | sudo tee -a /etc/hosts

ssh root@127.0.0.1 -i ./id_rsa -o StrictHostKeyChecking=no -p 2222

ssh root@127.0.0.1 -v -i ./id_rsa -p 2222

```
- Test the caddy server is running correctly
    - [test.local:8090](http://test.local:8090/)
    - [test.local:8090/.well-known/nostr.json](http://test.local:8090/.well-known/nostr.json)
    - [nip05.local:8090](http://nip05.local:8090/)
    - [nip05.local:8090](http://nip05.local:8090/.well-known/nostr.json)



#### Running the Bot

``` bash

git clone https://github.com/dentropy/nostr-daemon.git
cd nostr-daemon


source <(deno -A cli.js generate-accounts-env -m 'soap vault ahead turkey runway erosion february snow modify copy nephew rude')
# Add the relay https://nostrudel.ninja/relays/app
# wss://t.mememap.net
echo https://nostrudel.ninja/u/$NPUB13

echo $NSEC13

deno -A cli.js nip05-bot -nsec $NSEC13 -i ./apps/nip05/configExample.json

deno -A cli.js nip05-bot -nsec $NSEC13 -i ./apps/nip05/configExampleSSL.json
```

Add the relay https://nostrudel.ninja/relays/app

``` bash

echo https://nostrudel.ninja/u/$NPUB13

```
#### Example Commands

``` js
/*
/nip05 ping
/nip05 list-domains
/nip05 request dentropy@ddaemon.org
/nip05 set-relays $RELAYS_SEPARATED_VALUES
/nip05 rotate $NPUB
/nip05 get-relays $NPUB
/nip05 delete dentropy@ddaemon.org
*/
```

#### Handlers

* rsync
    * REMOTE_HOST
    * HOST_PATH
* s3 TODO
* nostr pubsub TODO

#### nip05 bot specific tests

``` bash

deno test lib/nip05

# --allow-console --allow-all

```

#### Manual Testing

**Run test relay**
See [RunNostrRelay for more info if needed](../RunNostrRelay.md)
``` bash

pip install nostr-relay
nostr-relay serve

```



**Run The Bot**
``` bash

source <(deno -A cli.js generate-accounts-env -m 'soap vault ahead turkey runway erosion february snow modify copy nephew rude')

clear
deno -A cli.js nip05-bot -nsec $NSEC8 -i ./configs/example-nip05bot.json

```

**Update events with nostr public key**
``` bash

source <(deno -A cli.js generate-accounts-env -m 'soap vault ahead turkey runway erosion february snow modify copy nephew rude')

export BOT_NPUB_HEX=$NPUBHEX8

jq ".tags[0][1] = \"$BOT_NPUB_HEX\"" ./events/nip05_bot_test_help.json > tmp.json && mv tmp.json ./events/nip05_bot_test_help.json

jq ".tags[0][1] = \"$BOT_NPUB_HEX\"" ./events/nip05_bot_test_list_domains.json > tmp.json && mv tmp.json ./events/nip05_bot_test_list_domains.json

jq ".tags[0][1] = \"$BOT_NPUB_HEX\"" ./events/nip05_bot_test_request.json > tmp.json && mv tmp.json ./events/nip05_bot_test_request.json

jq ".tags[0][1] = \"$BOT_NPUB_HEX\"" ./events/nip05_bot_test_set-relays.json > tmp.json && mv tmp.json ./events/nip05_bot_test_set-relays.json

```

**Test the help command**
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

deno -A cli.js send-event \
-nsec $NSEC16 \
-f './events/nip05_bot_test_set-relays.json' \
--relays $RELAYS

```

``` bash

nosdump -k 1 ws://127.0.0.1:6969 > ScrapedData/nip05_bot_event1.jsonl

nosdump -k 1 ws://127.0.0.1:4036/relay > ScrapedData/nip05_bot_event1.jsonl

```

``` bash

export RELAYS='ws://127.0.0.1:6969,ws://127.0.0.1:4036/relay'

nosdump -k 0 ws://127.0.0.1:6969

nosdump -k 0 ws://127.0.0.1:4036/relay

```

#### Debuggin inside conatiner

``` bash

sshd -T 

```

#### Sources

- [ChatGPT](https://chatgpt.com/share/6791796d-4768-8002-8487-43d26d8120aa)
- [ssh - Docker container SSHOpen not staying up - Server Fault](https://serverfault.com/questions/721026/docker-container-sshopen-not-staying-up)
- [ssh-test-docker](./ssh-test-docker.md)
