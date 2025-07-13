#!/bin/bash
docker pull python:3.11-slim
docker build -t nostr-relay-pip .
