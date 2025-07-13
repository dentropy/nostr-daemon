#### ftsrelay

``` bash

export ERD_PATH='./ftsrelay'
export PROJECT_NAME='ftsrelay'
export SQLITE_PATH="$(pwd)/build/ftsrelay/relay.sqlite"
export SQLITE_URL=sqlite:///$SQLITE_PATH
sqlite3 $SQLITE_PATH .schema > $ERD_PATH/$PROJECT_NAME.sql

grep -v 'fts5' $ERD_PATH/$PROJECT_NAME.sql > $ERD_PATH/$PROJECT_NAME.NO_fts5.sql
# Additional Troubleshooting is nessesary

rm /tmp/ftsrelay.db
sqlite3 /tmp/ftsrelay.db < $ERD_PATH/$PROJECT_NAME.NO_fts5.sql

export SQLITE_URL=sqlite:////tmp/ftsrelay.db
eralchemy2 -i sqlite:////tmp/ftsrelay.db -o $ERD_PATH/$PROJECT_NAME.pdf

eralchemy2 -i $SQLITE_URL -o $ERD_PATH/$PROJECT_NAME.md
eralchemy2 -i $SQLITE_URL -o $ERD_PATH/$PROJECT_NAME.png
eralchemy2 -i $SQLITE_URL -o $ERD_PATH/$PROJECT_NAME.jpg


mkdir $ERD_PATH
plant_erd sqlite3 --database $SQLITE_PATH 
sqlite3 $SQLITE_PATH .schema > $ERD_PATH/$PROJECT_NAME.sql

```