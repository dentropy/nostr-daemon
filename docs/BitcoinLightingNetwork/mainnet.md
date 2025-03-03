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


docker exec -it lnd-mainnet bash

```

## Run litd

``` bash


mkdir -p ~/nostr-daemon/docker/development/bitcoin/lnd/data/mainnet-litd/rpc
docker cp lnd-mainnet:/root/.lnd/tls.cert ~/nostr-daemon/docker/development/bitcoin/lnd/data/mainnet-litd/rpc/lnd.cert
cp ~/nostr-daemon/docker/development/bitcoin/lnd/data/mainnet/rpc/btcd.cert ~/nostr-daemon/docker/development/bitcoin/lnd/data/mainnet-litd/rpc/btcd.cert


docker exec -it lnd-mainnet lncli bakemacaroon --save_to /litd.macaroon \
   address:read address:write \
   info:read info:write \
   invoices:read invoices:write \
   macaroon:generate macaroon:read macaroon:write \
   message:read message:write \
   offchain:read offchain:write \
   onchain:read onchain:write \
   peers:read peers:write \
   signer:generate signer:read

docker cp lnd-mainnet:/litd.macaroon ~/nostr-daemon/docker/development/bitcoin/lnd/data/mainnet-litd/litd.macaroon


# FOR THE LOVE OF GOD PLEASE CHANGE THE PASSWORD IN THIS FILE
vim  ~/nostr-daemon/docker/development/bitcoin/lnd/litd.mainnet.docker-compose.yml

# PLEASE CHANGE PASSWORD IN DOCKER-COMPOSE
cd ~/nostr-daemon/docker/development/bitcoin/lnd
# PLEASE CHANGE PASSWORD IN DOCKER-COMPOSE
docker compose -f litd.mainnet.docker-compose.yml down
# PLEASE CHANGE PASSWORD IN DOCKER-COMPOSE
docker compose -f litd.mainnet.docker-compose.yml up -d
# PLEASE CHANGE PASSWORD IN DOCKER-COMPOSE

docker logs litd-mainnet --follow


docker exec -it litd-mainnet bash

```

## Troubleshoot Bitcoin RPC

``` bash

sudo tailscale status

echo "$bitcoin_node_IP_ADDRESS btcd-mainnet" | sudo tee -a /etc/hosts

ping btcd-mainnet

curl -X POST --user USER:PASS --insecure \
-H 'Content-Type: application/json' \
-d '{"jsonrpc":"1.0","id":"id","method":"help","params":[]}' \
https://btcd-mainnet:8334 | jq


```

#### Troubleshoot OpenSSL


``` bash


openssl x509 -in  ~/nostr-daemon/docker/development/bitcoin/lnd/data/mainnet-litd/rpc/lnd.cert  -text -noout 



```

#### Troubleshoot via rap IP address


``` bash


docker inspect lnd-mainnet | jq ".[0].NetworkSettings.Networks.mainnet.IPAddress"

```