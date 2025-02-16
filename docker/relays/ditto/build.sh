#!/bin/bash
docker pull denoland/deno:2.1.1
git clone https://gitlab.com/soapbox-pub/ditto.git
cd ditto
docker build -t ditto .
