#### SQL Queries

## Loading into SQLite

``` bash

# Profiles
nosdump -k 0 wss://relay.damus.io > event0.jsonl
# Microblogging/Tweets
nosdump -k 1 wss://relay.damus.io > event1.jsonl

# Look inside the file
head event0.jsonl
tail event0.jsonl

# Could number of lines
wc -l event0.jsonl

deno -A cli.js load-nosdump-into-sqlite -db ./db.sqlite -f event0.jsonl

deno -A cli.js sql-query -db ./db.sqlite -sql 'SELECT COUNT(*) FROM events;'

```
#### Nosdump SQL Example

``` bash
deno install -g -A "jsr:@jiftechnify/nosdump@0.7.1"

nosdump -k 0 wss://relay.damus.io >> ScrapedData/event0.jsonl
nosdump -k 1 wss://relay.damus.io >> ScrapedData/event1.jsonl

# Look inside the file
head ScrapedData/event0.jsonl
tail ScrapedData/event0.jsonl

# Could number of lines
wc -l ./ScrapedData/event0.jsonl

export RELAYS='ws://127.0.0.1:7007'
export RELAYS='ws://127.0.0.1:3003'
export RELAYS='ws://127.0.0.1:4036/relay'
export RELAYS='wss://relay.newatlantis.top'
echo $RELAYS

deno -A cli.js replay-nosdump-file -f ./ScrapedData/event0.jsonl --relays $RELAYS

nosdump -k 1 $RELAYS >> ScrapedData/scraped_ecents.jsonl

```
