#!/usr/bin/env bash

# exit from script if error was raised.

echo "PAUL_WAS_HERE_12"

set -e

# error function is used within a bash function in order to send the error
# message directly to the stderr output and exit.
error() {
    echo "$1" > /dev/stderr
    exit 0
}

# return is used within the bash function in order to return the value.
return() {
    echo "$1"
}

# set_default function gives the ability to move the setting of default
# env variable from docker file to the script thereby giving the ability to the
# user to override it during container start.
set_default() {
    # docker initialized env variables with blank string and we can't just
    # use -z flag as usually.
    BLANK_STRING='""'

    VARIABLE="$1"
    DEFAULT="$2"

    if [[ -z "$VARIABLE" || "$VARIABLE" == "$BLANK_STRING" ]]; then

        if [ -z "$DEFAULT" ]; then
            error "You should specify default variable"
        else
            VARIABLE="$DEFAULT"
        fi
    fi

   return "$VARIABLE"
}

# Set default variables if needed.
RPCUSER=$(set_default "$RPCUSER" "devuser")
RPCPASS=$(set_default "$RPCPASS" "devpass")
DEBUG=$(set_default "$BTCD_DEBUG" "info")
NETWORK=$(set_default "$NETWORK" "simnet")

PARAMS=""
if [ "$NETWORK" != "mainnet" ]; then
   PARAMS="--$NETWORK"
fi

PARAMS=$(echo $PARAMS \
    "--debuglevel=$DEBUG" \
    "--rpcuser=$RPCUSER" \
    "--rpcpass=$RPCPASS" \
    "--datadir=/data" \
    "--logdir=/data" \
    "--rpccert=/rpc/rpc.cert" \
    "--rpckey=/rpc/rpc.key" \
    "--rpclisten=0.0.0.0" \
    "--txindex"
)

echo "PAUL_WAS_HERE"

# Set the mining flag only if address is non empty.
if [[ -n "$MINING_ADDRESS" ]]; then
    PARAMS="$PARAMS --miningaddr=$MINING_ADDRESS"
fi

# Add user parameters to the command.
PARAMS="$PARAMS $@"

echo "PAUL_WAS_HERE"

# Print command and start bitcoin node.
echo "Command: btcd $PARAMS"
exec btcd $PARAMS