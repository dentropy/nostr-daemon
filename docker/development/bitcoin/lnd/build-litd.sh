#!/bin/bash
git clone https://github.com/lightninglabs/lightning-terminal.git
cd lightning-terminal
docker build -t litd .
