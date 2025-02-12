``` bash

mkdir -p /tmp/nginx/html/.well-known

echo '{"names":{"dentropy":"cda3a18bb150a58387383b7a2d332423994a1979d8ba61be1d26dafaf6a3d6b2","paul":"827782ff6cf5cfe0732a1470dc399acb3f7eb592187ac88c755aefc82f6a9432"},"relays":{"cda3a18bb150a58387383b7a2d332423994a1979d8ba61be1d26dafaf6a3d6b2":["wss://relay.nostr.band","wss://relay.damus.io/"],"827782ff6cf5cfe0732a1470dc399acb3f7eb592187ac88c755aefc82f6a9432":["wss://relay.damus.io","wss://nos.lol","wss://relay.newatlantis.top","wss://purplerelay.com","wss://relay.nostr.band"]}}' > /tmp/nginx/html/.well-known/nostr.json

cat /tmp/nginx/html/.well-known/nostr.json

cat cat /tmp/nginx/html/.well-known/nostr.json | jq

echo "127.0.0.1 nip05.local" | sudo tee -a /etc/hosts

cd /tmp/nginx/html

python3 -m http.server
```