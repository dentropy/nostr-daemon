## Ditto Docker

``` bash
git clone https://github.com/dentropy/NOSTR-Tutorial.git
cd NOSTR-Tutorial/docs
bash ./clone.sh
bash ./build.sh
docker compose up -d
```

Frontend: [http://localhost:4036/](http://localhost:4036/)
Relay: `ws://localhost:4036/relay`

## Ditto Manual

**Install Deno**
[Deno Docs](https://deno.com/)
``` bash

curl -fsSL https://deno.land/install.sh | sh

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
deno run -A --env-file --watch src/server.ts
```


## Run python nostr-relay pip package

``` bash

pip install nostr-relay

nostr-relay --help

nostr-relay serve

```

- [nostr-relay: pip package](https://pypi.org/project/nostr-relay/)
- [nostr relay: config.yaml exmaple](https://code.pobblelabs.org/fossil/nostr_relay/file?name=nostr_relay/config.yaml)
