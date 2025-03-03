## Outline

* 


#### Add to Tailnet

#### Reconfigure BTCD with mainnet and testnet keys

``` bash

export BTCD_USER=
export BTCD_HOST=

ssh $BTCD_USER@$BCD_HOST
docker compose down
cd nostr-daemon/docker/development/bitcoin/btcd/mainnet/
cd data

sudo cat rpc.cert

```

#### Build The Images

``` bash

git clone https://github.com/dentropy/nostr-daemon.git
cd ~/nostr-daemon/docker/development/bitcoin/lnd
./build.sh
./build-litd.sh
cd ~/nostr-daemon/docker/development/bitcoin/lnbits
./build-lnbits.sh

```

#### Replace the Certs

``` bash

mkdir -p ~/nostr-daemon/docker/development/bitcoin/lnd/data/mainnet/rpc

nano ~/nostr-daemon/docker/development/bitcoin/lnd/data/mainnet/rpc/rpc.cert

cd ~/nostr-daemon/docker/development/bitcoin/lnd

docker network create mainnet

# Get the IP address of the Bitcoin Node if required
sudo tailscale status

vim lnd.mainnet.docker-compose.yml
vim litd.mainnet.docker-compose.yml

docker compose -f lnd.mainnet.docker-compose.yml up -d


docker logs lnd-mainnet

docker compose -f lnd.mainnet.docker-compose.yml up -d



```