## Outline

* 


#### Add to Tailnet

#### Reconfigure BTCD with mainnet and mainnet keys

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

nano ~/nostr-daemon/docker/development/bitcoin/lnd/data/mainnet/rpc/btcd.cert

cd ~/nostr-daemon/docker/development/bitcoin/lnd

docker network create mainnet

# Get the IP address of the Bitcoin Node if required
sudo tailscale status

vim ~/nostr-daemon/docker/development/bitcoin/lnd/lnd.mainnet.docker-compose.yml
vim ~/nostr-daemon/docker/development/bitcoin/lnd/litd.mainnet.docker-compose.yml

cd ~/nostr-daemon/docker/development/bitcoin/lnd
docker compose -f lnd.mainnet.docker-compose.yml down
docker compose -f lnd.mainnet.docker-compose.yml up -d


```

**Configure Wallet without interactive shell inside container**
``` bash
docker logs lnd-mainnet --follow


# PLEASE RUN ONE AT A TIME
docker exec -it lnd-mainnet bash

# PLEASE RUN ONE AT A TIME
docker exec -it lnd-mainnet \
lncli create # OR RUN  unlock

# OR RUN THIS
docker exec -it lnd-mainnet \
lncli unlock

# PLEASE RUN ONE AT A TIME
docker exec -it lnd-mainnet bash

# PLEASE RUN ONE AT A TIME
docker exec -it lnd-mainnet \
lncli --network=mainnet getinfo

# PLEASE RUN ONE AT A TIME
docker exec -it lnd-mainnet \
lncli --network=mainnet newaddress np2wkh

# PLEASE RUN ONE AT A TIME
docker exec -it lnd-mainnet \
lncli --network=mainnet walletbalance

# PLEASE RUN ONE AT A TIME
docker exec -it lnd-mainnet \
lncli --network=mainnet channelbalance

# PLEASE RUN ONE AT A TIME
docker exec -it lnd-mainnet \
lncli --network=mainnet  listchannels

```

docker logs lnd-mainnet

docker compose -f lnd.mainnet.docker-compose.yml up -d



```