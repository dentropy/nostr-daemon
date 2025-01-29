## Get IP Address of Server

## Set DNS Names to IP Address of server

## Open Ports on VPS

## Git clone code

``` bash

https://github.com/dentropy/nostr-daemon.git

```

## Update Caddy File

``` bash

# Remember to change these
export LETS_ENCRYPT_EMAIL="test@gmail.com"
export YOUR_TLD="your.gdn"

cd nostr-daemon/docker/nostr-daemon

cp example.Caddyfile Caddyfile

sed -e "s/nip05.local/$YOUR_TLD/g" Caddyfile > new.Caddyfile
cp new.Caddyfile Caddyfile
rm new.Caddyfile

sed -e "s/you@example.com/$LETS_ENCRYPT_EMAIL/g" Caddyfile > new.Caddyfile
cp new.Caddyfile Caddyfile
rm new.Caddyfile

```

**Here is an example for referecne**
``` toml
# Static Sites mounted on Server
test.local {
	root * /usr/share/caddy/sites/test.local
	encode gzip
	file_server
    tls you@example.com
}

nip05.local {
	root * /usr/share/caddy/sites/nip05.local
	encode gzip
	file_server
    tls you@example.com
}

# Relay
relay.nip05.local {
    reverse_proxy localhost:6969
    tls you@example.com
}


# Blossom
relay.nip05.local {
    reverse_proxy localhost:1971
    tls you@example.com
}

# S3
s3.nip05.local {
    reverse_proxy localhost:9000
    tls you@example.com
}

```

## Update s3 and blossom config with secure username and passwords

``` bash

cd nostr-daemon/docker/nostr-daemon

cp example.minio.env minio.env
cp example.blossom-config.yml blossom-config.yml

export testaccesskey=$(openssl rand -base64 24)
echo "testaccesskey=$testaccesskey"
export testaccesssecretkey=$(openssl rand -base64 24)
echo "testaccesskey=$testaccesssecretkey"

sed -e "s/testaccesskey/$testaccesskey/g"  minio.env > newminio.env
cp newminio.env minio.env
rm newminio.env
sed -e "s/testaccesssecretkey/$testaccesssecretkey/g" minio.env > newminio.env
cp newminio.env minio.env
rm newminio.env

sed -e "s/testaccesskey/$testaccesskey/g" blossom-config.yml > new.blossom-config.yml
cp new.blossom-config.yml blossom-config.yml
rm new.blossom-config.yml
sed -e "s/testaccesssecretkey/$testaccesssecretkey/g" blossom-config.yml > new.blossom-config.yml
cp new.blossom-config.yml blossom-config.yml
rm new.blossom-config.yml

```

## Build nostr-relay

``` bash

cd nostr-daemon/docker/nostr-relay

./build.sh

```

## Open Firewall 

``` bash
sudo ufw status

sudo ufw allow 443

```
## Run everything with docker

``` bash

docker network create nostr-daemon

docker compose up -d

```

## Configure Config

#TODO

## Get Prof NSEC

``` bash

deno -A cli.js generate-mnemonic

export MNEMONIC=$(deno -A cli.js generate-mnemonic)
echo $MNEMONIC
deno -A cli.js generate-accounts-env

```