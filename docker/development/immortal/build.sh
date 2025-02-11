#!/bin/bash
git clone https://github.com/dezh-tech/immortal.git
cd immortal
docker build -t immortal-nostr-relay .
cd ..
git clone git@github.com:dezh-tech/kraken.git
cd kraken
docker build -t kraken-immortal-manager .
