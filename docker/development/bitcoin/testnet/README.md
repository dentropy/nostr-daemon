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


### Configure LITD

#### COnfigure LNBits