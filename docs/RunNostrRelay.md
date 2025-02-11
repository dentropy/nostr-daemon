## **NOTE** Docker is easier than Native

## Native - Ditto

**Install Deno**
[Deno Docs](https://deno.com/)
``` bash

curl -fsSL https://deno.land/install.sh | sh

```

**Install and Run**
``` bash

cd nostr-daemon

cd docker/relays/ditto

git clone https://gitlab.com/soapbox-pub/ditto.git

cp example.env ./ditto/.env

cd ditto

deno task soapbox

deno run -A --env-file=.env src/server.ts

```

## Native - nostr-relay pip package

This is the easiest to install and run Nostr relay. I like to use it for locally testing stuff on my laptop. If you don't know about python or pip check out the `Ditto Manual` documentation below.

``` bash
# For Ubuntu
sudo apt-get update
sudo apt install python3.11-venv

# For MacOS
brew install python3.11

# For Everyone
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

## Docker - Ditto

``` bash

cd nostr-daemon
cd docker/relays/ditto
bash ./build.sh
docker compose up -d

```

Frontend: [http://localhost:4036/](http://localhost:4036/)
Relay: `ws://localhost:4036/relay`

**To Access Database**
``` bash
# For Ubuntu
apt install postgresql-client-common
apt install postgresql-client-16

# For MacOS
brew install libpq && brew link --force libpq


# For Everyone
psql postgres://postgres:postgres@127.0.0.1:5432/ditto
```

You can also try [DBeaver Community](https://dbeaver.io/) to look inside the database

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


## Docker - StrFry

``` bash

cd nostr-daemon

cd docker/relays/strfry

bash ./build.sh

docker compose up -d

```

## Docker - nostr-relay-pip

``` bash

cd nostr-daemon

cd docker/relays/nostr-relay-pip

bash ./build.sh

docker compose up -d

```

## Docker - nostr-rs-relay

**Warning can take a couple minutes to build docker image**
``` bash

cd nostr-daemon

cd docker/relays/nostr-relay-pip

bash ./build.sh

docker compose up -d

```