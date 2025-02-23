#### Inistal Setup

``` bash

docker network rm simnet

docker network create \
  --subnet=10.100.100.0/24 \
  --gateway=10.100.100.1 \
  simnet

```

#### Reset

``` bash

cd nostr-daemon
cd bitcoin/btcd

```

``` bash

docker compose -f simnet.docker-compose.yml down
sudo rm -rf data-simnet

```

#### Setup

``` bash

export MINING_ADDRESS=rnys2DLSCATuTP5vBnpfV26Uhk5E9xjpba
echo $MINING_ADDRESS
docker compose -f simnet.docker-compose.yml down
docker compose -f simnet.docker-compose.yml up -d
docker exec -it btcd-simnet /start-btcctl.sh generate 400
docker exec -it btcd-simnet /start-btcctl.sh generate 3


export MINING_ADDRESS=$(docker exec -it alice lncli --network=simnet newaddress np2wkh | jq ".address")
export MINING_ADDRESS="${MINING_ADDRESS:1:-1}"
echo $MINING_ADDRESS
docker compose -f simnet.docker-compose.yml down
docker compose -f simnet.docker-compose.yml up -d
docker exec -it btcd-simnet /start-btcctl.sh generate 3


docker exec -it alice lncli --network=simnet walletbalance


```

## Mining



``` bash


lncli --network=simnet wallet --help


lncli --network=simnet wallet accounts list

lncli --network=simnet wallet accounts list | jq 'keys'

lncli --network=simnet wallet accounts list | jq '.accounts[0]'


lncli --network=simnet wallet addresses list

lncli --network=simnet wallet addresses list | jq '.account_with_addresses[0].addresses'



lncli --network=simnet wallet accounts import --help

lncli --network=simnet wallet accounts import "testname" "m/49'/0'/0"

```