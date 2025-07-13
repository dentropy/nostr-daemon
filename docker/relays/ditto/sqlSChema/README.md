# khatru

``` bash

export ERD_PATH='./sqlSchema'
export PROJECT_NAME='ditto'
export POSTGRES_URL_RAW="postgresql://postgres:postgres@127.0.0.1:5432/ditto"
export POSTGRES_URL="postgresql+psycopg2://postgres:postgres@127.0.0.1:5432/ditto"
export SQLITE_URL=sqlite:///$SQLITE_PATH


mkdir $ERD_PATH
eralchemy2 -i $POSTGRES_URL -o $ERD_PATH/$PROJECT_NAME.pdf
eralchemy2 -i $POSTGRES_URL -o $ERD_PATH/$PROJECT_NAME.md
eralchemy2 -i $POSTGRES_URL -o $ERD_PATH/$PROJECT_NAME.png
eralchemy2 -i $POSTGRES_URL -o $ERD_PATH/$PROJECT_NAME.jpg
# brew install postgresql@17
docker exec -it ditto-postgres pg_dump --schema-only $POSTGRES_URL_RAW > $ERD_PATH/$PROJECT_NAME.sql

```