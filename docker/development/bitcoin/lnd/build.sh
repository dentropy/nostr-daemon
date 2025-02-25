#!/bin/bash
git clone https://github.com/lightningnetwork/lnd.git
cd lnd
docker build -t lnd .
