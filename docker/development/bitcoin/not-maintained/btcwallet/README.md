#### NOTICE

I never got this working don't use it


#### Running btcwallet on simnet

``` bash

docker build -t btcwallet .


docker cp btcd-simnet:/rpc/rpc.cert ./btcd.cert

docker run \
--name btcwallet-simnet \
--network=simnet \
-p 8332:8332 \
-p 6062:6062 \
-v ./btcd.cert:/root/.btcwallet/btcd.cert \
-v ./sample-btcwallet.conf:/root/.btcwallet/btcwallet.conf \
-it btcwallet bash

# -v ./simnet-wallet:/root/.btcwallet/ \


docker exec -it btcwallet-simnet bash


docker stop btcwallet-simnet
docker rm btcwallet-simnet

```


#### testing btcwallet seed

``` bash

aba173caf9ebb814f624fe4c1846c3c4f7c41a27922eede4633653e5d7de3cfb

```


#### Bash

``` bash

./btcwallet --simnet --help

./btcwallet --simnet \
-c btcd-simnet:8334 \
--cafile /root/.btcwallet/btcd.cert \
--username=devuser \
--password=devpass \
--create 

./btcwallet --simnet \
--noinitialload \
--rpcconnect btcd-simnet:8334 \
--cafile /root/.btcwallet/btcd.cert \
--noinitialload \
--username=devuser \
--password=devpass


```

#### RPC Calls

``` bash

curl --user devuser:devpass --insecure --data-binary '{"jsonrpc": "1.0", "id": "curltest", "method": "getblockchaininfo", "params": []}' -H 'content-type: text/plain;' https://127.0.0.1:8332/ | jq

curl --user devuser:devpass --insecure --data-binary '{"jsonrpc": "1.0", "id": "curltest", "method": "help", "params": []}' -H 'content-type: text/plain;' https://127.0.0.1:8332/ | jq

curl --user devuser:devpass --insecure --data-binary '{"jsonrpc": "1.0", "id": "curltest", "method": "account", "params": []}' -H 'content-type: text/plain;' https://127.0.0.1:8332/ | jq

curl --user devuser:devpass --insecure --data-binary '{"jsonrpc": "1.0", "id": "curltest", "method": "getblockcount", "params": []}' -H 'content-type: text/plain;' https://127.0.0.1:8332/

curl --user devuser:devpass --insecure --data-binary '{"jsonrpc": "1.0", "id": "curltest", "method": "listaccounts", "params": []}' -H 'content-type: text/plain;' https://127.0.0.1:8332/ | jq

curl --user devuser:devpass --insecure --data-binary '{"jsonrpc": "1.0", "id": "curltest", "method": "getinfo", "params": []}' -H 'content-type: text/plain;' https://127.0.0.1:8332/ | jq

```

#### btcd json-rpc

``` bash

curl --user devuser:devpass --insecure --data-binary '{"jsonrpc": "1.0", "id": "curltest", "method": "help", "params": []}' -H 'content-type: text/plain;' https://127.0.0.1:18556/  | jq

curl --user devuser:devpass --insecure --data-binary '{"jsonrpc": "1.0", "id": "curltest", "method": "getblockchaininfo", "params": []}' -H 'content-type: text/plain;' https://127.0.0.1:18556/  | jq

curl --user devuser:devpass --insecure --data-binary '{"jsonrpc": "1.0", "id": "curltest", "method": "getmininginfo", "params": []}' -H 'content-type: text/plain;' https://127.0.0.1:18556/  | jq

curl --user devuser:devpass --insecure --data-binary '{"jsonrpc": "1.0", "id": "curltest", "method": "setgenerate", "params": []}' -H 'content-type: text/plain;' https://127.0.0.1:18556/  | jq

curl --user devuser:devpass --insecure --data-binary '{"jsonrpc": "1.0", "id": "curltest", "method": "createnewaccount", "params": ["np2wkh"]}' -H 'content-type: text/plain;' https://127.0.0.1:18556/  | jq



```

#### btcctl

``` bash

mkdir -p /root/.btcwallet
cp /rpc/rpc.cert /root/.btcwallet/rpc.cert


btcctl \
--simnet \
--rpcuser=devuser \
--rpcpass=devpass \
--rpcserver=localhost \
--wallet listaccounts

```
