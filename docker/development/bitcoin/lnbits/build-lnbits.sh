#!/bin/bash
git clone https://github.com/lnbits/lnbits.git
cd lnbits
docker build -t lnbits .
