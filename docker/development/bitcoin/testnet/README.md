## Steps to get a Lightning Network Node up and Running

* Get VPS with Public IP Address
* Configure DNS
    * Buy Domain Name
    * Set Nameservers to Cloudflare or something unless you wanna set the manually and wait hours for record to propgate
    * Set subdomain DNS names for
        * btc
        * btctestnet
        * btcregtest
        * lnd
        * litd
        * lnbits
        * alice
        * bob
        * charlie
        * mallory
        * aidan
        * local
* Get Server btcd Node Running
  * Connect to tailnet
* Get a SECURE SERVER to install lnd on
  * Connect to tailnet
* Setup Tailscale or Headscale on VPS if you don't have a Public IP address for your server
  * Or just do everything on a VPS, good luck running a mainnet btcd node ~800 Gb, testnet3 is ~210 Gb
  * Hook public VPS to tailnet
  * Hook up BTCD node to tailnet
* Get Valid TLS Certs
    * Copy caddy files to server
    * Open Firewall using `ufw`
    * Replace domain names in the CaddyFile
    * Run Caddy
    * Copy the certs back to your local system, or wherever they need to go
* Copy certs where they need to go
  * To BTCD node and restart it
  * To lnd node
  * To litd node
* We get LND running
  * Copy the btcd cert used to the LND node
  * Start the node
* Create LND wallet
  * #TODO
* Get Macaroon from LND for LITD
  * We generate a Admin Macaroon
  * We export the Admin Macaroon to file system
  * Move Macaroon to path litd can read it
* We start Lightning Terminal with the Macaroon
* Start lnbits and hook up Lightning Terminal
* Proxy Everything to Clearnet and Voila

#### Install and run btcd on a HOST


``` bash
export BTCD_USER=
export BTCD_HOST=

ssh $BTCD_USER@$BCD_HOST

git clone https://github.com/dentropy/nostr-daemon.git

cd nostr-daemon
cd docker/development/bitcoin

# Choose mainnet, testnet or simnet

docker compose up -d

```

#### Install Tailscale Across Nodes

``` bash

curl -fsSL https://tailscale.com/install.sh | sh

sudo tailscale up

sudo tailscale status

```

Go to [https://login.tailscale.com/admin/machines](https://login.tailscale.com/admin/machines) to manage your tailnet

[Tailscale Download and Install](https://tailscale.com/download)


My Hostnames

* ln-proxy
* bitcoin-node
* my-desktop
* ln-node

#### Configure Proxy Server and Get TLS Certs

**Optional, Install Oh My Zsh**

``` bash

sudo apt install -y zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

```


**Install Docker**
**Install Docker**
**Install Docker**

**Configure Firewall**

``` bash

# HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Mainnet BTCD
sudo ufw allow 8333
sudo ufw allow 8334

# LND
sudo ufw allow 10009

# LITD
sudo ufw allow 9735

```



**Get the Certs** 

``` bash

LN_NODE_USER=
LN_NODE_HOST=

cd nostr-daemon
cd docker/development

# Test SSH Connection
ssh $LN_NODE_USER@$LN_NODE_HOST
exit

scp -r ./caddyCerts $LN_NODE_USER@$LN_NODE_HOST:~

```

**Get Certs on the Public Facing Server**

``` bash
export LN_NODE_USER=
export LN_NODE_HOST=

ssh $LN_NODE_USER@$LN_NODE_HOST

export LETS_ENCRYPT_EMAIL="test@gmail.com"
export YOUR_TLD="your.gdn"

git clone https://github.com/dentropy/nostr-daemon.git
cd nostr-daemon
cd docker/development/caddyCerts

sed -e "s/nostrtest.com/$YOUR_TLD/g" example.getcerts.Caddyfile > new.Caddyfile
cp new.Caddyfile getcerts.Caddyfile
rm new.Caddyfile

sed -e "s/you@example.com/$LETS_ENCRYPT_EMAIL/g" getcerts.Caddyfile > new.Caddyfile
cp new.Caddyfile getcerts.Caddyfile
rm new.Caddyfile

cat getcerts.Caddyfile

docker compose up -d

docker logs caddy

# Take a look at the certs you just got
find . -type f -name "*$YOUR_TLD*.crt"
find . -type f -name "*$YOUR_TLD*.key"

# Copy The Certs and Keys 
# into a single folder

sudo su

cd ~ 
mkdir certs
mkdir certsWithKeys
find . -type f -name "*$YOUR_TLD*.crt"| while read -r file; do
    echo "Found: $file"
    cp $file ./certs
    cp $file ./certsWithKeys
done
find . -type f -name "*$YOUR_TLD*.key" | while read -r file; do
    echo "Found: $file"
    cp $file ./certsWithKeys
done

```

#### Reconfigure BTCD with mainnet and testnet keys

``` bash

export BTCD_USER=
export BTCD_HOST=

ssh $BTCD_USER@$BCD_HOST
docker compose down
cd nostr-daemon/docker/development/bitcoin/btcd/testnet/
cd data

sudo rm rpc.key
sudo nano rpc.key

sudo rm rpc.cert
sudo nano rpc.cert


```


#### Configure BTCD with Valid Certs

``` bash
# On Host Machine
export LN_NODE_USER=
export LN_NODE_HOST=

export BTCD_USER=
export BTCD_HOST=

export YOUR_TLD=


# We use /tmp so they get deleted after
cd /tmp
scp -r $LN_NODE_USER@$LN_NODE_HOST:~/certsWithKeys certsWithKeys
cd /tmp/certsWithKeys


scp btctestnet.$YOUR_TLD.crt   $BTCD_USER@$BTCD_HOST:~/testnet.cert
scp btctestnet.$YOUR_TLD.key   $BTCD_USER@$BTCD_HOST:~/testnet.key

scp btc.$YOUR_TLD.crt   $BTCD_USER@$BTCD_HOST:~/mainnet.cert
scp btc.$YOUR_TLD.key   $BTCD_USER@$BTCD_HOST:~/mainnet.key


ssh $BTCD_USER@$BTCD_HOST
sudo cp ~/testnet.cert ~/nostr-daemon/docker/development/bitcoin/btcd/testnet/data/rpc.cert
sudo cp ~/testnet.key ~/nostr-daemon/docker/development/bitcoin/btcd/testnet/data/rpc.key
sudo cp ~/mainnet.cert ~/nostr-daemon/docker/development/bitcoin/btcd/mainnet/data/rpc.cert
sudo cp ~/mainnet.key ~/nostr-daemon/docker/development/bitcoin/btcd/mainnet/data/rpc.key


cd ~/nostr-daemon/docker/development/bitcoin/btcd/testnet
docker compose down
docker compose up -d

cd ~/nostr-daemon/docker/development/bitcoin/btcd/mainnet
docker compose down
docker compose up -d

```

#### Configure LND

**Copy the .cert file for the btcd instance to the correct path**

``` bash
export LN_NODE_USER=root
export LN_NODE_HOST=ln-node
ssh $LN_NODE_USER@$LN_NODE_HOST

export YOUR_TLD="your.gdn"


cd ~/nostr-daemon/docker/development/bitcoin/lnd

mkdir -p ~/nostr-daemon/docker/development/bitcoin/lnd/testnet/rpc

sudo cp ~/certs/btctestnet.$YOUR_TLD.crt ~/nostr-daemon/docker/development/bitcoin/lnd/testnet/rpc/btcd.cert
sudo cp ~/certsWithKeys/lnd.$YOUR_TLD.crt ~/nostr-daemon/docker/development/bitcoin/lnd/testnet/rpc/rpc.cert
sudo cp ~/certsWithKeys/lnd.$YOUR_TLD.key ~/nostr-daemon/docker/development/bitcoin/lnd/testnet/rpc/rpc.key

cd ~/nostr-daemon/docker/development/bitcoin/lnd

sudo ./build.sh

cd ~/nostr-daemon/docker/development/bitcoin/lnd

docker network create testnet

docker compose -f lnd.testnet.docker-compose.yml down
docker compose -f lnd.testnet.docker-compose.yml up -d

docker logs lnd-testnet

```

**Configure Wallet without interactive shell inside container**
``` bash
docker logs lnd-testnet --follow


# PLEASE RUN ONE AT A TIME
docker exec -it lnd-testnet bash

# PLEASE RUN ONE AT A TIME
docker exec -it lnd-testnet \
lncli create # OR RUN  unlock

# OR RUN THIS
docker exec -it lnd-testnet \
lncli unlock

# PLEASE RUN ONE AT A TIME
docker exec -it lnd-testnet bash

# PLEASE RUN ONE AT A TIME
docker exec -it lnd-testnet \
lncli --network=testnet getinfo

# PLEASE RUN ONE AT A TIME
docker exec -it lnd-testnet \
lncli --network=testnet newaddress np2wkh

# PLEASE RUN ONE AT A TIME
docker exec -it lnd-testnet \
lncli --network=testnet walletbalance

# PLEASE RUN ONE AT A TIME
docker exec -it lnd-testnet \
lncli --network=testnet channelbalance

# PLEASE RUN ONE AT A TIME
docker exec -it lnd-testnet \
lncli --network=testnet  listchannels

```

**Configure Wallet**
``` bash
export LN_NODE_USER=root
export LN_NODE_HOST=ln-node
ssh $LN_NODE_USER@$LN_NODE_HOST

# PLEASE RUN ONE AT A TIME
docker logs lnd-testnet

# PLEASE RUN ONE AT A TIME
docker exec -it lnd-testnet bash

# PLEASE RUN ONE AT A TIME
lncli --network=testnet create # or
lncli --network=testnet unlock

# PLEASE RUN ONE AT A TIME
docker exec -it lnd-testnet bash

# PLEASE RUN ONE AT A TIME
lncli --network=testnet getinfo

# PLEASE RUN ONE AT A TIME
lncli --network=testnet newaddress np2wkh

# PLEASE RUN ONE AT A TIME
lncli --network=testnet walletbalance

# PLEASE RUN ONE AT A TIME
lncli --network=testnet channelbalance

```

**Fill up with Testnet Bitcoin**

- [coinfaucet.eu/en/btc-testnet](https://coinfaucet.eu/en/btc-testnet/)
- [tbtc.bitaps.com](https://tbtc.bitaps.com/)
- [tBTC Faucet](https://bitcoinfaucet.vercel.app/)

**Testnet Block Explorers**

- [Bitcoin Testnet Explorer - Blockstream.info](https://blockstream.info/testnet/)
- [Lightning Explorer - mempool - Bitcoin Testnet3](https://mempool.space/testnet/lightning)

#### Configure LND to use Correct Cert


**LND DOES NOT WANT a Let's Encrypt Cert**
``` bash
# export LN_NODE_USER=root
# export LN_NODE_HOST=ln-node
# ssh $LN_NODE_USER@$LN_NODE_HOST


# export YOUR_TLD="your.gdn"


# sudo cp ~/certsWithKeys/lnd.$YOUR_TLD.crt ~/nostr-daemon/docker/development/bitcoin/lnd/testnet/rpc/rpc.cert
# sudo cp ~/certsWithKeys/lnd.$YOUR_TLD.key ~/nostr-daemon/docker/development/bitcoin/lnd/testnet/rpc/rpc.key

# cd ~/nostr-daemon/docker/development/bitcoin/lnd


# docker compose -f lnd.testnet.docker-compose.yml down
# docker compose -f lnd.testnet.docker-compose.yml up -d

```

#### Connect LND Nodes, Opening a Channel, Closing a Channel

* Where to find nodes
  * [Connectivity Ranking - mempool - Bitcoin Testnet3](https://mempool.space/testnet/lightning/nodes/rankings/connectivity)

``` bash

docker exec -it lnd-testnet \
lncli --network=testnet getinfo

docker exec -it lnd-testnet \
lncli --network=testnet \
connect 0270685ca81a8e4d4d01beec5781f4cc924684072ae52c507f8ebe9daf0caaab7b@159.203.125.125


docker exec -it lnd-testnet \
lncli --network=testnet openchannel \
--node_key=02312627fdf07fbdd7e5ddb136611bdde9b00d26821d14d94891395452f67af248 \
--local_amt=20000

docker exec -it lnd-testnet \
lncli --network=testnet channelbalance

docker exec -it lnd-testnet \
lncli --network=testnet  listchannels

docker exec -it lnd-testnet \
lncli --network=testnet \
closechannel \
--funding_txid=245c341b463b506259e76f8d5a6cd4ae0f57ec2029019326d2665d665afbc95e \
--output_index=1

```

#### Configure LITD

``` bash
export LN_NODE_USER=root
export LN_NODE_HOST=ln-node
ssh $LN_NODE_USER@$LN_NODE_HOST


export YOUR_TLD="your.gdn"


sudo cp ~/certsWithKeys/litd.$YOUR_TLD.crt ~/nostr-daemon/docker/development/bitcoin/lnd/data/testnet-litd/litd.cert
sudo cp ~/certsWithKeys/litd.$YOUR_TLD.key ~/nostr-daemon/docker/development/bitcoin/lnd/data/testnet-litd/litd.key

# Build litd
cd ~/nostr-daemon/docker/development/bitcoin/lnd
bash ./build-litd.sh

# Generate Macaroon for litd from lnd
docker exec -it lnd-testnet lncli unlock

mkdir -p ./data/testnet-litd

docker exec -it lnd-testnet lncli --network=testnet  bakemacaroon --save_to /litd.macaroon \
   address:read address:write \
   info:read info:write \
   invoices:read invoices:write \
   macaroon:generate macaroon:read macaroon:write \
   message:read message:write \
   offchain:read offchain:write \
   onchain:read onchain:write \
   peers:read peers:write \
   signer:generate signer:read

docker cp lnd-testnet:/litd.macaroon ./data/testnet-litd/litd.macaroon
docker cp lnd-testnet:/root/.lnd/tls.cert ./data/testnet-litd/lnd.cert

docker compose -f litd.testnet.docker-compose.yml down
docker compose -f litd.testnet.docker-compose.yml up -d

docker logs litd-testnet

```


#### Configure lnbits

``` bash

cd ~/nostr-daemon/docker/development/bitcoin/lnbits

sudo ./build.sh

mkdir -p ./data/lnbits-testnet

docker exec -it lnd-testnet \
lncli unlock

docker exec -it lnd-testnet lncli --network=testnet  bakemacaroon --save_to /lnbits.macaroon \
   address:read address:write \
   info:read info:write \
   invoices:read invoices:write \
   macaroon:generate macaroon:read macaroon:write \
   message:read message:write \
   offchain:read offchain:write \
   onchain:read onchain:write \
   peers:read peers:write \
   signer:generate signer:read


docker cp lnd-testnet:/rpc/rpc.cert ./data/lnbits-testnet/lnd.cert
docker cp lnd-testnet:/lnbits.macaroon ./data/lnbits-testnet/lnbits.macaroon
docker cp lnd-testnet:/root/.lnd/tls.cert ./data/lnbits-testnet/lnd.cert

cd ~/nostr-daemon/docker/development/bitcoin/lnbits

docker compose -f lnbits.testnet.docker-compose.yml down
docker compose -f lnbits.testnet.docker-compose.yml up -d

docker logs lnbits-testnet


docker logs lnbits-testnet --follow

docker exec -it lnbits-testnet bash 

```


**Other lnbits troubleshooting commands**
``` bash
docker inspect lnd-testnet | grep IPAddress
# or
docker inspect lnd-testnet | jq ".[0].NetworkSettings.Networks.testnet.IPAddress"


openssl x509 -in ./data/lnbits-testnet/lnd.cert -text -noout

openssl x509 -in  ~/certsWithKeys/lnd.$YOUR_TLD.crt -text -noout


docker cp lnd-testnet:/root/.lnd/tls.cert ~/nostr-daemon/docker/development/bitcoin/lnd/testnet/rpc/rpc.cert
openssl x509 -in  ~/nostr-daemon/docker/development/bitcoin/lnd/testnet/rpc/rpc.cert -text -noout

```
