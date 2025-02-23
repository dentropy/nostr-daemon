#### SETUP

**scp the required files to the server**
``` bash
export REMOTE_USER=root
export REMOTE_HOST=

cd nostr-daemon
cd docker/development
scp -r ./caddyCerts $REMOTE_USER@$REMOTE_HOST:~

```

**Install Docker**
```
ssh $REMOTE_USER@$REMOTE_HOST

# Install Docker
```
#### Set DNS Settings

**PLEASE REMEMBER TO DO THIS, MAKE SURE IP ADDRESS IS YOUR SERVER**

#### Modify Config as Nessesary


``` bash

ssh $REMOTE_USER@$REMOTE_HOST

cd caddyCerts

export LETS_ENCRYPT_EMAIL="test@gmail.com"
export YOUR_TLD="your.gdn"

cp getcerts.Caddyfile.bak getcerts.Caddyfile

sed -e "s/you@example.com/$LETS_ENCRYPT_EMAIL/g" getcerts.Caddyfile > new.Caddyfile
cp new.Caddyfile getcerts.Caddyfile
rm new.Caddyfile

sed -e "s/nostrtest.com/$YOUR_TLD/g" getcerts.Caddyfile > new.Caddyfile
cp new.Caddyfile getcerts.Caddyfile
rm new.Caddyfile

cat getcerts.Caddyfile

docker compose up -d

```


#### Copy files back for testing

``` bash

cd nostr-daemon
cd docker/development

scp -r $REMOTE_USER@$REMOTE_HOST:~/caddyCerts ./caddyCertsImported/

cp caddyCerts/simnet.* caddyCertsImported/

cd caddyCertsImported/

docker compose -f simnet.docker-compose.yml down
docker compose -f simnet.docker-compose.yml up -d

docker logs caddy

echo "127.0.0.1 alice.testnostr.com" | sudo tee -a /etc/hosts
echo "127.0.0.1 bob.testnostr.com" | sudo tee -a /etc/hosts
echo "127.0.0.1 charlie.testnostr.com" | sudo tee -a /etc/hosts
echo "127.0.0.1 mallory.testnostr.com" | sudo tee -a /etc/hosts
echo "127.0.0.1 aidan.testnostr.com" | sudo tee -a /etc/hosts
echo "127.0.0.1 lnbits.testnostr.com" | sudo tee -a /etc/hosts

```


``` bash


sudo cp ./docker/development/caddyCertsImported/caddy/data/caddy/certificates/acme-v02.api.letsencrypt.org-directory/bob.testnostr.com/* ./bitcoin/lnd/lnd_wallets/bob/

sudo cp ./bitcoin/lnd/lnd_wallets/bob/bob.testnostr.com.crt ./bitcoin/lnd/lnd_wallets/bob/tls.cert
sudo cp ./bitcoin/lnd/lnd_wallets/bob/bob.testnostr.com.key ./bitcoin/lnd/lnd_wallets/bob/tls.key

