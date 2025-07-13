# nostr-rs-relay

``` bash

export ERD_PATH='./nostr-rs-relay'
export PROJECT_NAME='nostr-rs-relay'
export SQLITE_PATH="$(pwd)/build/nostr-rs-relay/data/nostr.db"
export SQLITE_URL=sqlite:///$SQLITE_PATH


mkdir $ERD_PATH
eralchemy2 -i $SQLITE_URL -o $ERD_PATH/$PROJECT_NAME.pdf
eralchemy2 -i $SQLITE_URL -o $ERD_PATH/$PROJECT_NAME.md
eralchemy2 -i $SQLITE_URL -o $ERD_PATH/$PROJECT_NAME.png
eralchemy2 -i $SQLITE_URL -o $ERD_PATH/$PROJECT_NAME.jpg
sqlite3 $SQLITE_PATH .schema > $ERD_PATH/$PROJECT_NAME.sql

```