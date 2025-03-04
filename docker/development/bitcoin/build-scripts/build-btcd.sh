#!/bin/bash
git clone https://github.com/btcsuite/btcd.git
cd btcd
docker build -t btcd .
