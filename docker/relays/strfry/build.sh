#!/bin/bash
docker pull alpine:3.18.3
git clone https://github.com/hoytech/strfry.git
cd strfry
docker build -t strfry .
