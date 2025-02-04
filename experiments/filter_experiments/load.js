console.log(process.env.NOSDUMP_PATH)

import fs from 'node:fs'
import Database from 'libsql'

const nosdump_data = fs.readFileSync(process.env.NOSDUMP_PATH, "utf-8")

console.log(`\n\nNumber of Lines = ${nosdump_data.split("\n").length}`)

const query_raw = `
INSERT OR IGNORE INTO events (
    event_id,
    raw_event,
    created_at,
    kind,
    pubkey,
    sig,
    content,
    tags
) 
VALUES (
    @id,
    @raw_event,
    @created_at,
    @kind,
    @pubkey,
    @sig,
    @content,
    json(@tags)
);
`
const db = new Database("./singleTableSqlite.sqlite");
let query_prepared = db.prepare(query_raw)

let count = 0;
for (const event of nosdump_data.split("\n")) {
    let parsed_event = JSON.parse(event)
    parsed_event.raw_event = event
    parsed_event.tags = JSON.stringify(parsed_event.tags)
    query_prepared.run(parsed_event)
    count += 1;
    console.log(`Count = ${count}`)
}
