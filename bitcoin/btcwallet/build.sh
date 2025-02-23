#!/bin/bash
git clone https://github.com/btcsuite/btcwallet.git
cd btcwallet
git checkout 311812f21bba1efc3f2cb04f2dd7cbe8a69c6b04
go build
