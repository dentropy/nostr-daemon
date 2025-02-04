import fs from 'node:fs'
import Database from 'libsql'

const query = fs.readFileSync("./singleTableSQLite.sql", "utf-8")

console.log(`\n\nQuery:\n${query}`)

const db = new Database("./singleTableSqlite.sqlite");
try {
    await db.exec(query);
} catch (error) {
    console.log(error)
}
