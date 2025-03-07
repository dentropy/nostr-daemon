##### User Journeys

* Host a TOR Hidden Service Static Site
    * Host a TOR Hidden Service via docker
    * Host a TOR Hidden Service via Reverse Proxy in Docker
* Proxy a existing HTTPS site via TOR
    * Proxy an existing site to your own Domain
* Using the TOR Socks5 Proxy
    * How to use a TOR Socks5 Proxy with CURL
    * How to configure Firefox to work Natively with TOR
* TODO
  * Mine for a Specific TOR Address
  * Route ougoing Docker Traffic via TOR
  * Route entire Internet on Machine Through TOR
  * Route all outgoing traffic on Network via TOR

#### Host a TOR Hidden Service Static Site

``` bash
cd nostr-daemon
cd docker/TOR/static-site

# Add static site contents into the assets folder
# Here is what we have in there right now
cat ./assets/index.html

./build.sh
docker compose down
docker compose up -d
```

**Get the Onion Address of the static site**
``` bash

ONION=$(docker compose exec -T static-site-tor-node cat /var/lib/tor/gitea_service/hostname)
echo "Your static site is at is ready under https://${ONION}"

```


#### Proxy a existing HTTPS site via TOR

``` bash
cd nostr-daemon
cd docker/TOR/https-site-proxy

# Change both instances of mememaps.net in the Caddyfile to whatever domain you want
vim ./Caddyfile

./build.sh

docker compose down
docker compose up -d
```

**Get the Onion Address of the static site**
``` bash

ONION=$(docker compose exec -T https-proxy-tor-node cat /var/lib/tor/gitea_service/hostname)
echo "Your static site is at is ready under https://${ONION}"

```

#### Run Docker SOCKS5 Proxy

``` bash

docker run -d --restart=always --name tor-socks-proxy -p 127.0.0.1:9150:9150/tcp peterdavehello/tor-socks-proxy:latest

curl --socks5-hostname localhost:9150 https://check.torproject.org

curl --socks5-hostname localhost:9150 darkfailenbsdla5mal2mxn2uz66od5vtzd5qozslagrfzachha3f3id.onion 

curl --socks5-hostname localhost:9150 https://jkm3qhkjiugjrugpmzuam5zisdv5m7a6wkynlbvc5nyvdv5ih5huieqd.onion/

```


## Sources

- [willcl-ark/nix-onion-proxy: proxy a clearnet site via onion](https://github.com/willcl-ark/nix-onion-proxy/tree/master)
- [tor-gitea/Dockerfile at main · daregit/tor-gitea](https://github.com/daregit/tor-gitea/blob/main/Dockerfile)
- [PeterDaveHello/tor-socks-proxy: 🐳 Tiny Docker image (🤏 10MB) as 🧅 Tor SOCKS5 proxy 🛡](https://github.com/PeterDaveHello/tor-socks-proxy)
