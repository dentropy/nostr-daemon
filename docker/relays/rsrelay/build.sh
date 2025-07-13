#!/bin/bash
git clone https://git.sr.ht/~gheartsfield/nostr-rs-relay
cd nostr-rs-relay
docker build -t rsrelay .
