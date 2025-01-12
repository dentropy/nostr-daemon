
#### Load Data

``` bash

deno -A cli.js load-nosdump-into-sqlite -db ./ScrapedData/db.sqlite -f ScrapedData/event0.jsonl

deno -A cli.js sql-query -db ./ScrapedData/db.sqlite -sql 'SELECT COUNT(*) FROM events;'

```

## Profile Queries

#### Get all the profile JSON data into a separate table


``` sql

.mode column
.headers on

SELECT event_id, json_extract(event, '$.content') as profile_json
FROM events
WHERE json_valid(profile_json) = 1;

CREATE TABLE IF NOT EXISTS profile_events (
    event_id TEXT PRIMARY KEY,
    profile_json TEXT
);

INSERT into profile_events
SELECT event_id, json_extract(event, '$.content') as profile_json
FROM events
WHERE json_valid(profile_json) = 1;

select profile_json from profile_events limit 1;

```

#### Get a list of all tags via SQL

``` SQL

.mode column
.headers on

SELECT distinct j.key
FROM profile_events t, json_each(profile_json) j;

```

#### Get all matching tags via SQL

``` SQL

.mode column
.headers on

SELECT event_id, json_extract(profile_json, '$.name')
FROM profile_events;

SELECT event_id, json_extract(profile_json, '$.about') as special_tag, profile_json
FROM profile_events where special_tag is not null;


```

#### Calculate percentages
``` sql

.mode column
.headers on

SELECT j.key, count(j.key) as key_count
  FROM profile_events t, json_each(profile_json) j
  GROUP by key
  order by key_count desc;

```

## Reaction Queries 

``` bash

# Emoji Reactions
nosdump -k 7 wss://relay.damus.io > event7.jsonl

wc -l event7.jsonl

deno -A cli.js load-nosdump-into-sqlite -db ./db.sqlite -f event7.jsonl

```

``` sql

-- Get a list of distinct reactions (emoji)
SELECT distinct json_extract(event, '$.content') as reaction
FROM events where kind = 7;

-- Take a look at the tags of the reactions
SELECT event_id, json_extract(event, '$.tags') as reaction
FROM events where kind = 7;

-- Get most popular reactions
SELECT count(*) as count, json_extract(event, '$.content') as reaction
FROM events where kind = 7
group by reaction
order by count desc;

-- Get most reaction to post
-- TODO we need to get the tags extracted separately

```



``` SQL

SELECT * FROM events where kind=30818;

SELECT json_extract(event, '$.tags') as tags
FROM events where kind = 30818;
```

#### Query by Tag

``` SQL
select * from 
(
  SELECT
    event_id,
    json_extract(event, '$.tags') as tags
  FROM events
) as tags_t,
json_each(tags_t.tags)

select event_id, key as key_L1, value as value_L1, fullkey as fullkey_L1 from 
(
  SELECT
    event_id,
    json_extract(event, '$.tags') as tags
  FROM events
) as tags_t,
json_each(tags_t.tags)


select * from (
select event_id, key as key_L1, value as value_L1, fullkey as fullkey_L1 from 
(
  SELECT
    event_id,
    json_extract(event, '$.tags') as tags
  FROM events
) as tags_t,
json_each(tags_t.tags)
) as individual_tags_t,
json_each(individual_tags_t.value_L1)


select 
  event_id,
  key_L1,
  value_L1,
  fullkey_L1,
  key as key_L2,
  value as value_L2,
   fullkey as fullkey_L2 
from 
(
  select event_id, key as key_L1, value as value_L1, fullkey as fullkey_L1 from 
  (
    SELECT
      event_id,
      json_extract(event, '$.tags') as tags
    FROM events
  ) as tags_t,
  json_each(tags_t.tags)
) as individual_tags_t,
json_each(individual_tags_t.value_L1)

```
## SQLITE CLI Settings

``` bash

sqlite3 db.sqlite

```

``` sql

.mode column
.headers on


.tables
.schema $TABLE_NAME

```

#### Querrying a database

``` bash

export RELAYS='ws://127.0.0.1:7007'
export RELAYS='ws://127.0.0.1:3003'
export RELAYS='wss://relay.newatlantis.top'
echo $RELAYS

deno -A cli.js filter-query --filter_file_path ./ScrapedData/filter.json -r $RELAYS


```

``` js

let thread = await RetriveThread(process.env.RELAYS.split(','), process.env.EVENT_ID)

Object.keys(thread)
Object.keys(thread.events_by_id)
Object.keys(thread.root_event)
Object.keys(thread.root_event.replies)
console.log(thread.root_event.replies[0])
Object.keys(thread.root_event.replies[0].reply_to)

for(const event_id of Object.keys(thread.events_by_id)){
    console.log(thread.events_by_id[event_id].event_data.id)
    console.log(thread.events_by_id[event_id].depth_index)
}

for(const event_id of Object.keys(thread.events_by_id)){
    console.log(`thread.events_by_id['${event_id}']`)
}

thread.events_by_id['ee54d3d5ed8f9b02c1fc210a6244f7a17f72c443a582e75cd229eed2ed89a09b']
thread.events_by_id['61d36ac51a3f32d6c2dba9937a37a6bb7dfc9733c264c106e6606c3980dd9f72']
thread.events_by_id['36b7afd5a9dabefe16ca509728d3c70f99d38c24bef7ee8d36ae454e13cb71f3']
thread.events_by_id['ead28b10273eab94bc4e39f87a730f3c6efcfd24c77f0fe3ae337ba9842bc223']

```
