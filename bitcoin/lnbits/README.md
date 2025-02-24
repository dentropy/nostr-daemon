## Reset

``` bash
cd nostr-daemon
cd bitcoin/lnbits


docker compose down
sudo rm -rf data

```

## Setup

**Remember to have LND and BTCD setup first**
``` bash

docker exec -it bob lncli --network=simnet  bakemacaroon --save_to /lnbits.macaroon \
   address:read address:write \
   info:read info:write \
   invoices:read invoices:write \
   macaroon:generate macaroon:read macaroon:write \
   message:read message:write \
   offchain:read offchain:write \
   onchain:read onchain:write \
   peers:read peers:write \
   signer:generate signer:read

docker cp bob:/lnbits.macaroon ./lnbits.macaroon
docker cp bob:/root/.lnd/tls.cert ./tls.cert

# ./build.sh if you get an error
docker compose up -d

docker logs lnbits-simnet

```
