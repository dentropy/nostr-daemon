#!/bin/bash
cp $HOME/.ssh/id_rsa.pub id_rsa.pub
id_rsa.pub
docker build -t ssh-test .
