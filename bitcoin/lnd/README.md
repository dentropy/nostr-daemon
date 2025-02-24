## Reset

``` bash

cd nostr-daemon
cd bitcoin/lnd

```


``` bash

docker compose -f docker-compose.yml down
sudo rm -rf lnd_wallets

mkdir -p ./lnd_wallets/bob

sudo cp ../../docker/development/caddyCertsImported/caddy/data/caddy/certificates/acme-v02.api.letsencrypt.org-directory/bob.testnostr.com/* ./lnd_wallets/bob/

sudo cp ./lnd_wallets/bob/bob.testnostr.com.crt ./lnd_wallets/bob/tls.cert
sudo cp ./lnd_wallets/bob/bob.testnostr.com.key ./lnd_wallets/bob/tls.key

```


## Setup

**REMEMBER TO START BTCD FIRST**
``` bash

mkdir -p rpc

docker cp btcd-simnet:/rpc/rpc.cert ./rpc/rpc.cert
docker cp btcd-simnet:/rpc/rpc.key ./rpc/rpc.key

```


## Run two LND Nodes


``` bash


docker compose down
docker compose up -d

```


#### Create Wallet and Mine into wallet


``` bash
docker exec -it btcd-simnet /start-btcctl.sh generate 400


export MINING_ADDRESS=$(docker exec -it alice lncli --network=simnet newaddress np2wkh | jq ".address")
export MINING_ADDRESS="${MINING_ADDRESS:1:-1}"
echo $MINING_ADDRESS
docker compose -f simnet.docker-compose.yml down
docker compose -f simnet.docker-compose.yml up -d
docker exec -it btcd-simnet /start-btcctl.sh generate 10


docker exec -it alice lncli --network=simnet walletbalance




echo $MINING_ADDRESS
docker exec -it btcd-simnet echo $MINING_ADDRESS
docker exec -it btcd-simnet bash
echo $MINING_ADDRESS





export MINING_ADDRESS=$(docker exec -it bob lncli --network=simnet newaddress np2wkh | jq ".address")
export MINING_ADDRESS="${MINING_ADDRESS:1:-1}"
echo $MINING_ADDRESS
docker compose -f simnet.docker-compose.yml down
docker compose -f simnet.docker-compose.yml up -d
docker exec -it btcd-simnet /start-btcctl.sh generate 10


docker exec -it bob lncli --network=simnet walletbalance


```

#### Add Nodes

``` bash

export ALICE_NODE_PUBKEY=$(docker exec -it alice lncli --network=simnet getinfo | jq ".identity_pubkey")
export ALICE_NODE_PUBKEY="${ALICE_NODE_PUBKEY:1:-1}"


export BOB_NODE_PUBKEY=$(docker exec -it bob lncli --network=simnet getinfo | jq ".identity_pubkey")
export BOB_NODE_PUBKEY="${BOB_NODE_PUBKEY:1:-1}"

echo ALICE_NODE_PUBKEY=$ALICE_NODE_PUBKEY
echo BOB_NODE_PUBKEY=$BOB_NODE_PUBKEY


# echo lncli --network=simnet connect $BOB_NODE_PUBKEY@bob

docker exec -it alice  lncli --network=simnet connect $BOB_NODE_PUBKEY@bob

docker exec -it alice  lncli --network=simnet listpeers


# Get Balance of Alice
docker exec -it alice lncli --network=simnet walletbalance

# Get Balance of Bob
docker exec -it bob lncli --network=simnet walletbalance

# Get Bob's Address and send a million sats
export BOB_ADDRESS=$(docker exec -it bob lncli --network=simnet newaddress np2wkh | jq ".address")
export BOB_ADDRESS="${BOB_ADDRESS:1:-1}"
docker exec -it alice  lncli --network=simnet sendcoins $BOB_ADDRESS 100000000
docker exec -it btcd-simnet /start-btcctl.sh generate 10

# Mine 3 Blocks
docker exec -it btcd-simnet /start-btcctl.sh generate 3

# Get Balance of Alice
docker exec -it alice lncli --network=simnet walletbalance

# Get Balance of Bob
docker exec -it bob lncli --network=simnet walletbalance

# Create a 100000 sat channel with Bob
docker exec -it alice \
lncli --network=simnet \
openchannel \
--node_key=$BOB_NODE_PUBKEY \
--local_amt=100000


# Create a 100000 sat channel with Alice
docker exec -it bob \
lncli --network=simnet \
openchannel \
--node_key=$ALICE_NODE_PUBKEY \
--local_amt=100000


# List the Peers
echo ALICE
docker exec -it alice  \
lncli --network=simnet listpeers
echo BOB
docker exec -it alice  \
lncli --network=simnet listpeers

# List the channels
echo ALICE
docker exec -it alice \
lncli --network=simnet listchannels
echo BOB
docker exec -it bob \
lncli --network=simnet listchannels




docker exec -it alice bash
```



``` bash


docker exec -it bash alice


lncli printmacaroon --macaroon_file /admin.macaroon


lncli --bitcoin.simnet 


lncli --network=simnet bakemacaroon

lncli --network=simnet listpermissions

lncli --network=simnet listmacaroonids

lncli --network=simnet printmacaroon


docker exec -it alice lncli --network=simnet  bakemacaroon --save_to /lnbits.macaroon \
   address:read address:write \
   info:read info:write \
   invoices:read invoices:write \
   macaroon:generate macaroon:read macaroon:write \
   message:read message:write \
   offchain:read offchain:write \
   onchain:read onchain:write \
   peers:read peers:write \
   signer:generate signer:read

lncli --network=simnet bakemacaroon --save_to /lnbits2.macaroon \
   address:read address:write \
   info:read info:write \
   invoices:read invoices:write \
   macaroon:generate macaroon:read macaroon:write \
   message:read message:write \
   offchain:read offchain:write \
   onchain:read onchain:write \
   peers:read peers:write \
   signer:generate signer:read

docker cp alice:/lnbits.macaroon ./lnbots.macaroon

```


#### Scratchpad

``` bash

docker stop alice
docker rm alice

docker stop bob
docker rm bob

sudo rm -rf lnd_wallets

```


``` bash

export WALLET_NAME=

docker stop $WALLET_NAME
docker rm $WALLET_NAME

mkdir -p $(pwd)/lnd_wallets/$WALLET_NAME

docker compose \
-f ./simnet.docker-compose.yml \
run --name $WALLET_NAME \
--volume $(pwd)/lnd_wallets/$WALLET_NAME:/root/.lnd \
--volume $(pwd)/start-lnd.sh:/lnd/start-lnd.sh \
lnd

```


``` bash

export BACKEND=btcd
export CHAIN=bitcoin
export DEFAULT_NETWORK=simnet
export NETWORK=simnet

export RPCHOST=btcd-simnet
export RPCCRTPATH=/rpc/rpc.cert
export RPCUSER=devuser
export RPCPASS=devpass

```