#!/bin/bash
git clone https://gitlab.com/soapbox-pub/ditto.git
cd ditto
docker build -t ditto .
