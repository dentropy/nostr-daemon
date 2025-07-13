#!/bin/bash
echo "127.0.0.1 ditto.local" | sudo tee -a /etc/hosts
echo "127.0.0.1 khatru.local" | sudo tee -a /etc/hosts
echo "127.0.0.1 rsrelay.local" | sudo tee -a /etc/hosts
echo "127.0.0.1 sqlitenode.local" | sudo tee -a /etc/hosts
echo "127.0.0.1 strfry.local" | sudo tee -a /etc/hosts

# This one does not work with nostrfy, simulates broken relay
echo "127.0.0.1 piprelay.local" | sudo tee -a /etc/hosts
