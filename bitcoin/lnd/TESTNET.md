##

``` bash
cd nostr-daemon
cd bitcoin/lnd

export BTCD_USER=
export BTCD_HOST=

mkdir -p testnet/rpc
scp -r $BTCD_USER@$BTCD_HOST:~/btcd/testnet/data/rpc.cert ./testnet/rpc/rpc.cert

docker network create testnet


docker compose -f testnet.docker-compose.yml down
docker compose -f testnet.docker-compose.yml up -d


docker exec -it btcd-testnet sh

btcctl --testnet --rpcserver 127.0.0.1:18335 --rpcuser=USER --rpcpass=PASS getinfo

docker compose -f testnet2.docker-compose.yml down
docker compose -f testnet2.docker-compose.yml up -d


```





``` bash

docker exec -it lnd-testnet bash
docker exec -it lnd-testnet2 bash

lncli create
lncli --network=testnet getinfo
lncli --network=testnet newaddress np2wkh
lncli --network=testnet walletbalance
lncli --network=testnet channelbalance
lncli --network=testnet sendcoins $USER_ADDRESS 5000

docker exec -it lnd-testnet bash

docker exec -it lnd-testnet \
lncli --network=testnet getinfo

docker exec -it lnd-testnet \
lncli --network=testnet newaddress np2wkh

docker exec -it lnd-testnet \
lncli --network=testnet walletbalance

docker exec -it lnd-testnet \
lncli --network=testnet channelbalance



docker exec -it lnd-testnet2 \
lncli --network=testnet newaddress np2wkh


docker exec -it lnd-testnet2 \
lncli --network=testnet walletbalance

docker exec -it lnd-testnet2 lncli --network=testnet getinfo


```



## Add Peers for Lightning

``` bash

export TESTNET_NODE_1=$(docker exec -it lnd-testnet lncli --network=testnet getinfo | jq ".identity_pubkey")
export TESTNET_NODE_1="${TESTNET_NODE_1:1:-1}"


export TESTNET_NODE_2=$(docker exec -it lnd-testnet2 lncli --network=testnet getinfo | jq ".identity_pubkey")
export TESTNET_NODE_2="${TESTNET_NODE_2:1:-1}"

echo TESTNET_NODE_1=$TESTNET_NODE_1
echo TESTNET_NODE_2=$TESTNET_NODE_2


docker exec -it lnd-testnet \
lncli --network=testnet \
connect $TESTNET_NODE_2@lnd-testnet2


docker exec -it lnd-testnet \
lncli --network=testnet openchannel \
--node_key=$TESTNET_NODE_2 \
--local_amt=5000


docker exec -it lnd-testnet \
lncli --network=testnet openchannel \
--node_key=$TESTNET_NODE_2 \
--local_amt=20000


``` 

#### Close Channel

``` bash

lncli --network=testnet listchannels

lncli --network=testnet closechannel --funding_txid=177da5a3cdbd453a297b29444bf879dd681144ff9a4855b3dcc9ff4e802a2f41 --output_index=0

```