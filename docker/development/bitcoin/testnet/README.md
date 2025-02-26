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

sed -e "s/testnostr.com/$YOUR_TLD/g" example.getcerts.Caddyfile > new.Caddyfile
cp new.Caddyfile getcerts.Caddyfile
rm new.Caddyfile

sed -e "s/you@example.com/$LETS_ENCRYPT_EMAIL/g" example.getcerts.Caddyfile > new.Caddyfile
cp new.Caddyfile getcerts.Caddyfile
rm new.Caddyfile

cat getcerts.Caddyfile

docker compose up -d

```

## 
