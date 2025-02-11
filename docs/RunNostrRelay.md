## Ditto Manual

**Install Deno**
[Deno Docs](https://deno.com/)
``` bash

curl -fsSL https://deno.land/install.sh | sh

```

**Install and Run**
``` bash

```

## nostr-relay pip package

This is the easiest to install and run Nostr relay. I like to use it for locally testing stuff on my laptop. If you don't know about python or pip check out the `Ditto Manual` documentation below.

``` bash

sudo apt-get update
sudo apt install python3.11-venv
python3 -m venv env
source env/bin/activate

pip install nostr-relay

nostr-relay --help

# To specify the port you need to use config.yaml, check out links below
nostr-relay serve

```

Now just use use `ws://127.0.0.1:6969` to connect all things Nostr 

- [nostr-relay: pip package](https://pypi.org/project/nostr-relay/)
- [nostr relay: config.yaml exmaple](https://code.pobblelabs.org/fossil/nostr_relay/file?name=nostr_relay/config.yaml)

## Ditto Docker

``` bash

git clone https://github.com/dentropy/NOSTR-Tutorial.git
cd NOSTR-Tutorial/docker/ditto
bash ./clone.sh
bash ./build.sh
docker compose up -d

```

Frontend: [http://localhost:4036/](http://localhost:4036/)
Relay: `ws://localhost:4036/relay`

``` bash
apt install postgresql-client-common
apt install postgresql-client-16

psql postgres://postgres:postgres@127.0.0.1:5432/ditto
```


**Get the source code**
``` bash
# Please Run one Line at a time
git clone https://github.com/soapbox-pub/ditto.git
cd ditto
deno task nsec
```

**Set the config file**
``` config
# file .env
DITTO_NSEC=nsec*****
```

**Run the Relay**
``` bash
sudo apt install -y curl
sudo apt install -y unzip

deno task soapbox


deno run -A --env-file --watch src/server.ts

```
