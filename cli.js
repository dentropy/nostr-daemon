import { Command, Option } from "commander";

import 'dotenv/config'
import bip39 from "bip39";
import fs from 'node:fs'
import Database from 'libsql';
import postgres from 'postgres'

import { Relay, nip19, nip04, finalizeEvent, verifyEvent, getPublicKey } from 'nostr-tools'
import NDK from "@nostr-dev-kit/ndk";

import generateNostrAccountsFromMnemonic from './lib/accountsGenerate.js'
import { getThread, getThreadToJSON } from "./lib/getThread.js";
import { fakeDMConvo } from "./lib/fakeDMConvo.js";
import { getNostrConvoAndDecrypt } from './lib/getNostrConvoAndDecrypt.js'
import { fakeThread } from "./lib/fakeThread.js";
import { dentropysObsidianPublisher } from "./lib/dentropysObsidianPublisher.js";
import { nostrGet } from "./lib/nostrGet.js";
import { check_NIP65_published, llm_dm_chatbot_response } from "./lib/llmStuff/LLMDMChatbot.js"
// import { llm_respond_to_thread } from "./lib/llmStuff/LLMSlashCommandConvoParser.js"
import { LLMDMBot } from "./lib/llmStuff/LLMDMBot.js";
import { LLMThreadBot } from "./lib/llmStuff/LLMThreadBot.js";

function myParseInt(value, dummyPrevious) {
    // parseInt takes a string and a radix
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
        throw new Error("Invalid Number");
    }
    return parsedValue;
}

const program = new Command();

program
    .name('nostr-cli')
    .description('CLI so you can talk on Nostr')
    .version('0.0.1')

program.command('generate-mnemonic')
    .description('Generate a Mnemonic which is used to generate NOSTR accounts')
    .action((str, options) => {
        console.log(bip39.generateMnemonic())
    })

program.command('generate-accounts-env')
    .description('Input a Mnemonic and outputs a script of your Nostr accounts as ENV variables')
    .option('-m, --mnemonic <string>', 'Your Mnemonic')
    .action((args, options) => {
        let mnemonic = ""
        if (Object.keys(args).length == 0) {
            mnemonic = process.env.MNEMONIC
        } else {
            mnemonic = args.mnemonic
        }
        if (bip39.validateMnemonic(mnemonic)) {
            let accounts = generateNostrAccountsFromMnemonic(mnemonic)
            console.log(`export MNEMONIC='${mnemonic}'`)
            for (let i = 0; i < accounts.length; i++) {
                console.log(`export NSEC${i}='${accounts[i].nsec}'`)
                console.log(`export NPUB${i}='${accounts[i].npub}'`)
            }
        } else {
            console.log('Mnemonic is invalid')
        }
    })

program.command('generate-accounts-json')
    .description('Input a Mnemonic and outputs a script of your Nostr accounts as JSON')
    .option('-m, --mnemonic <string>', 'Your Mnemonic')
    .action((args, options) => {
        console.log(args)
        let mnemonic = ""
        if (Object.keys(args).length == 0) {
            mnemonic = process.env.MNEMONIC
        } else {
            mnemonic = args.mnemonic
        }
        if (bip39.validateMnemonic(mnemonic)) {
            let accounts = generateNostrAccountsFromMnemonic(mnemonic)
            console.log(accounts)
        } else {
            console.log('Mnemonic is invalid')
        }
    })

program.command('send-event')
    .description('send-event')
    .requiredOption('-r, --relays <string>', 'A list of nostr relays')
    .requiredOption('-f, --event_data <string>', 'JSON with at least the keys content : string and kind : number')
    .requiredOption('-nsec, --nsec <string>', 'Nostr private key encoded as nsec using NIP19')
    .action(async (args, options) => {
        let fileContents = ""
        try {
            fileContents = fs.readFileSync(args.event_data, 'utf-8')
            fileContents = JSON.parse(fileContents)
        } catch (error) {
            console.log(`Error reading file ${args.event_data} error posted below`)
            console.log(error)
        }
        if (!Object.keys(fileContents).includes("tags")) {
            fileContents.tags = []
        }
        console.log("fileContents")
        console.log(fileContents)
        let signedEvent = ""
        try {
            signedEvent = finalizeEvent({
                kind: fileContents.kind,
                created_at: Math.floor(Date.now() / 1000),
                tags: fileContents.tags,
                content: fileContents.content,
            }, nip19.decode(args.nsec).data)
            console.log("Your signed event is:")
            console.log(signedEvent)
        } catch (error) {
            console.log("We got an error encoding your event, it is posted below")
            console.log(error)
            process.exit()
        }
        for (const relay_url of args.relays.split(',')) {
            try {
                const relay = await Relay.connect(relay_url)
                await relay.publish(signedEvent)
                console.log(`Published event ${relay_url}`)
            } catch (error) {
                console.log(`Could not publish to ${relay_url}`)
                console.log(error)
            }
        }
        process.exit()
    })

program.command('load-nosdump-into-sqlite')
    .description('Loads the output of nosdump into a sqlite database for easy querrying')
    .requiredOption('-db, --db_path <string>', 'The file path to a sqlite datebase, will create one if it does not exist')
    .requiredOption('-f, --nosdump_file <string>', 'The output of a nosdump file')
    .action(async (args, options) => {
        let populate_data = `
        CREATE TABLE IF NOT EXISTS events (
            event_id TEXT PRIMARY KEY,
            kind     INTEGER,
            event    JSONB
        );
        CREATE TABLE IF NOT EXISTS tags (
            event_id    TEXT NOT NULL,
            kind        INTEGER NOT NULL,
            tag         JSONB NOT NULL,
            tag_index_0 TEXT NOT NULL,
            tag_index_1 TEXT,
            tag_index_2 TEXT,
            tag_index_3 TEXT,
            PRIMARY KEY (event_id, kind, tag)
        );
        `
        const db = new Database(args.db_path);
        try {
            await db.exec(populate_data);
        } catch (error) {
            console.log(`Could not open sqlite datebase at path ${args.db_path} error posted below\n`)
            console.log(error)
            process.exit()
        }

        let file_contents = ''
        try {
            file_contents = await fs.readFileSync(args.nosdump_file, 'utf-8')
        } catch (error) {
            console.log(`Could not read nosdump_file ${args.nosdump_file} error posted below\n`)
            console.log(error)
            process.exit()
        }
        file_contents = file_contents.split("\n")
        const raw_event_query = `
            INSERT OR IGNORE INTO events(event_id, kind, event) 
            VALUES (@id, @kind, json(@event));
        `
        let event_query = db.prepare(raw_event_query)
        const raw_tag_query = `
            INSERT OR IGNORE INTO tags (
                event_id,
                kind,
                tag,
                tag_index_0,
                tag_index_1,
                tag_index_2,
                tag_index_3
            ) 
            VALUES (
                @id,
                @kind,
                json(@event),
                @tag_index_0,
                @tag_index_1,
                @tag_index_2,
                @tag_index_3
            );
        `
        let tag_query = db.prepare(raw_tag_query)
        let event_data_to_insert = []
        let tag_data_to_insert = []

        for (const line of file_contents) {
            try {
                const event = JSON.parse(line)
                let data = {
                    id: event.id,
                    kind: event.kind,
                    event: line
                }
                event_data_to_insert.push(data)
                for (const tag of event.tags) {
                    console.log("TAG")
                    console.log(tag)
                    tag_data_to_insert.push(
                        {
                            id: event.id,
                            kind: event.kind,
                            event: line,
                            tag_index_0: tag[0],
                            tag_index_1: tag[1],
                            tag_index_2: tag[2],
                            tag_index_3: tag[3]
                        }
                    )
                }
                // await query.run(data);
            } catch (error) {
                if (error instanceof SyntaxError) {
                    // handle syntax error
                    console.error('Invalid JSON syntax:', error);
                } else {
                    console.log(error)
                }
            }
        }
        const insertManyEvents = db.transaction((the_data) => {
            for (const item of the_data) event_query.run(item);
        });
        await insertManyEvents(event_data_to_insert)
        const insertManyTags = db.transaction((the_data) => {
            for (const item of the_data) {
                console.log("ITEM")
                console.log(item)
                let tmp_result = tag_query.run(item)
                console.log(tmp_result)
            }
        });
        await insertManyTags(tag_data_to_insert)
        // console.log(tag_data_to_insert)
        console.log("Seems like data inserted sucessfully")
    })


program.command('load-nosdump-into-postgres')
    .description('Loads the output of nosdump into a sqlite database for easy querrying')
    .requiredOption('-db, --db_url <string>', 'The file path to a sqlite datebase, will create one if it does not exist')
    .requiredOption('-f, --nosdump_file <string>', 'The output of a nosdump file')
    .action(async (args, options) => {
        let sql = ""
        try {
            console.log("args.db_url")
            console.log(args.db_url)
            sql = postgres(args.db_url, {
                transform: {
                    undefined: null
                }
            })
        } catch (error) {
            console.log("Got error loading psql connection string, try sql")
            process.exit()
        }
        let create_tables_query_events = await sql`
        CREATE TABLE IF NOT EXISTS events (
            event_id TEXT PRIMARY KEY,
            kind     INTEGER,
            event    JSONB
        );
        `
        let create_tables_query_tags = await sql`
        CREATE TABLE IF NOT EXISTS tags (
            event_id    TEXT NOT NULL,
            kind        INTEGER NOT NULL,
            tag_index   INTEGER NOT NULL,
            tag         JSONB NOT NULL,
            tag_value_index_0 TEXT NOT NULL,
            tag_value_index_1 TEXT,
            tag_value_index_2 TEXT,
            tag_value_index_3 TEXT,
            PRIMARY KEY (event_id, kind, tag_index)
        );`
        let file_contents = ''
        try {
            file_contents = await fs.readFileSync(args.nosdump_file, 'utf-8')
        } catch (error) {
            console.log(`Could not read nosdump_file ${args.nosdump_file} error posted below\n`)
            console.log(error)
            process.exit()
        }
        file_contents = file_contents.split("\n")
        let event_data_to_insert = []
        let tag_data_to_insert = []
        let total_events = 0
        let total_tags = 0
        for (const line of file_contents) {
            try {
                const event = JSON.parse(line)
                total_events+=1
                let data = {
                    event_id: event.id,
                    kind: event.kind,
                    event: event
                }
                event_data_to_insert.push(data)
                if (event_data_to_insert.length == 3000) {
                    console.log("INSERTING_EVENTS")
                    let result_001 = await sql`
                    INSERT INTO events 
                    ${sql(event_data_to_insert,
                        'event_id',
                        'kind',
                        'event'
                    )}
                    ON CONFLICT (event_id)
                    DO NOTHING;
                `
                    event_data_to_insert = []
                }
                for (const tag_index in event.tags) {
                    try {
                        total_tags+=1
                        const tag_object = {
                            event_id: event.id,
                            kind: event.kind,
                            tag_index: tag_index,
                            tag: event,
                            tag_value_index_0: event.tags[tag_index][0],
                            tag_value_index_1: event.tags[tag_index][1],
                            tag_value_index_2: event.tags[tag_index][2],
                            tag_value_index_3: event.tags[tag_index][3]
                        }
                        tag_data_to_insert.push(tag_object)
                        if (tag_data_to_insert.length >= 5000) {
                            console.log("INSERTING_TAGS")
                            await sql`
                            INSERT INTO tags ${sql(tag_data_to_insert,
                                'event_id',
                                'kind',
                                'tag_index',
                                'tag',
                                'tag_value_index_0',
                                'tag_value_index_1',
                                'tag_value_index_2',
                                'tag_value_index_3',
                            )}
                        ON CONFLICT (event_id, kind, tag_index)
                        DO NOTHING;
                        `
                            tag_data_to_insert = []
                        }
                    } catch (error) {
                        console.log("Error processing tag")
                        console.log(event.tags[tag_index])
                        console.log(error)
                    }
                }
                // await query.run(data);
            } catch (error) {
                if (error instanceof SyntaxError) {
                    // handle syntax error
                    console.log('Invalid JSON syntax:');
                } else {
                    console.log(error)
                }
            }
        }
        // const insertManyEvents = db.transaction((the_data) => {
        //     for (const item of the_data) event_query.run(item);
        // });
        // await insertManyEvents(event_data_to_insert)
        // const insertManyTags = db.transaction((the_data) => {
        //     for (const item of the_data) {
        //         console.log("ITEM")
        //         console.log(item)
        //         let tmp_result = tag_query.run(item)
        //         console.log(tmp_result)
        //     }
        // });
        // await insertManyTags(tag_data_to_insert)
        console.log(`total_events = ${total_events.toLocaleString()}`)
        console.log(`total_tags   = ${total_tags.toLocaleString()}`)
        let result_001 = await sql`
            INSERT INTO events 
            ${sql(event_data_to_insert,
            'event_id',
            'kind',
            'event'
        )}
            ON CONFLICT (event_id)
            DO NOTHING;
        `
        await sql`
        INSERT INTO tags ${sql(tag_data_to_insert,
            'event_id',
            'kind',
            'tag_index',
            'tag',
            'tag_value_index_0',
            'tag_value_index_1',
            'tag_value_index_2',
            'tag_value_index_3',
        )}
    ON CONFLICT (event_id, kind, tag_index)
    DO NOTHING;
    `
    console.log("Seems like data inserted sucessfully")
    process.exit()
    })

program.command('sql-query')
    .description('Just query a sqlite database')
    .option('-sql, --sql_query <string>', 'The SQL for the query')
    .option('-db, --db_path <string>', 'The file path to a sqlite datebase, will create one if it does not exist')
    .action(async (args, options) => {
        if (!Object.keys(args).includes('db_path')) {
            console.log("ERROR: Missing db_path argument")
            process.exit();
        }
        if (!Object.keys(args).includes('sql_query')) {
            console.log("ERROR: Missing sql_query argument")
            process.exit();
        }
        const db = new Database(args.db_path);
        try {
            console.log(`QUERY:\n${String(args.sql_query)}`)
            let query = await db.prepare(String(args.sql_query)).all();
            console.log(`\nRESULT:\n${JSON.stringify(query, null, 2)}`)
        } catch (error) {
            console.log(`Could not query sqlite datebase at path ${args.db_path} error posted below\n`)
            console.log(error)
            process.exit()
        }
    })

program.command('gen-fake-dm-convo')
    .description('Get and decrypted a Direct Message nostr conversation')
    .requiredOption('-from, --from_nsec <string>', 'Must include nsec or private key')
    .requiredOption('-to, --to_nsec <string>', 'Must include nsec or private key')
    .requiredOption('-r, --relays <string>', 'A list of nostr relays')
    .action(async (args, options) => {
        try {
            await fakeDMConvo(args.from_nsec, args.to_nsec, args.relays.split(','))
            console.log("Fake DM convo generated sucessfully")
        } catch (error) {
            console.log("We got an error generating the DM conversation, it is posted below")
            console.log(error)
        }
        process.exit()
    })

program.command('get-encrypted-convo')
    .description('Get and decrypted a Direct Message nostr conversation')
    .requiredOption('-from, --from_nsec <string>', 'Must include nsec or private key')
    .requiredOption('-to, --to_npub <string>', 'Must include nsec or private key')
    .requiredOption('-r, --relays <string>', 'A list of nostr relays')
    .action(async (args, options) => {
        let convo = await getNostrConvoAndDecrypt(args.relays.split(','), args.from_nsec, args.to_npub)
        console.log(convo)
        process.exit()
    })

program.command('fake-thread')
    .description('Generate a fake Nostr thread using 3 Nostr Accounts')
    .requiredOption('-nsec0, --nsec0 <string>', 'Must include nsec or private key')
    .requiredOption('-nsec1, --nsec1 <string>', 'Must include nsec or private key')
    .requiredOption('-nsec2, --nsec2 <string>', 'Must include nsec or private key')
    .requiredOption('-r, --relays <string>', 'A list of nostr relays')
    .option('-dr, --default_relay <string>', 'The relay included in the events to lookup the event it is replying to')
    .option('-ms, --ms_wait_time <number>', 'Number of miliseconds to wait between sending events')
    .action(async (args, options) => {
        let response = await fakeThread(
            args.nsec1,
            args.nsec2,
            args.nsec1,
            args.relays.split(','),
            args.default_relay,
            args.ms_wait_time
        )
        console.log(response)
        process.exit()
    })

program.command('get-thread-events')
    .description('Downloads all the events from a Nostr thread as jsonl (nosdump Format)')
    .requiredOption('-e, --event_id <string>', 'The id key in the nostr event\'s JSON')
    .requiredOption('-r, --relays <string>', 'A list of nostr relays to query for this thread')
    .action(async (args, options) => {
        let result = await getThread(args.relays.split(','), args.event_id)
        console.log(JSON.stringify(getThreadToJSON(result), null, 2))
        process.exit()
    })

program.command('dentropys-obsidian-publisher')
    .description('Take sqlite output of dentropys-obsidian-publisher and publish to nostr using NIP52 wiki\'s')
    .requiredOption('-sqlite, --sqlite_path <string>', 'The id key in the nostr event\'s JSON')
    .requiredOption('-nsec, --nsec <string>', 'Nostr private key encoded as nsec using NIP19')
    .requiredOption('-r, --relays <string>', 'A list of nostr relays to query for this thread')
    .option('-l, --logging', 'enable logging to the sqlite database you are reading from')
    .action(async (args, options) => {
        let result = ""
        if (Object.keys(args).includes('logging')) {
            result = await dentropysObsidianPublisher(
                args.relays.split(','),
                args.nsec,
                args.sqlite_path,
                true
            )
        } else {
            result = await dentropysObsidianPublisher(
                args.relays.split(','),
                args.nsec,
                args.sqlite_path,
                false
            )
        }
        console.log(result)
        process.exit()
    })

program.command('llm-bot')
    .description('Feed in a openai RPC and now the bot will reply when pinged or')
    .requiredOption('-nsec, --nsec <string>', 'Nostr private key encoded as nsec using NIP19')
    .requiredOption('-r, --relays <string>', 'A list of nostr relays to query for this thread')
    .requiredOption('-r65, --nip_65_relays <string>', '')
    .requiredOption('-rdm, --relays_for_dms <string>', 'A list of nostr relays to query for this thread')
    .requiredOption('-url, --BASE_URL <string>', 'OPENAI API HOST')
    .requiredOption('-api_key, --OPENAI_API_KEY <string>', 'OPENAI_API_KEY')
    .action(async (args, options) => {
        LLMThreadBot(args, options)
        LLMDMBot(args, options)
    })

program.command('llm-dm-bot')
    .description('Feed in a openai RPC and now the bot will reply when pinged or')
    .requiredOption('-nsec, --nsec <string>', 'Nostr private key encoded as nsec using NIP19')
    .requiredOption('-r65, --nip_65_relays <string>', '')
    .requiredOption('-rdm, --relays_for_dms <string>', 'A list of nostr relays to query for this thread')
    .requiredOption('-url, --BASE_URL <string>', 'OPENAI API HOST')
    .requiredOption('-api_key, --OPENAI_API_KEY <string>', 'OPENAI_API_KEY')
    .action( (args, options) => {
        LLMDMBot(args, options)
    })

program.command('llm-thread-bot')
    .description('Feed in a openai RPC and now the bot will reply when pinged or')
    .requiredOption('-nsec, --nsec <string>', 'Nostr private key encoded as nsec using NIP19')
    .requiredOption('-r, --relays <string>', 'A list of nostr relays to query for this thread')
    .requiredOption('-url, --BASE_URL <string>', 'OPENAI API HOST')
    .requiredOption('-api_key, --OPENAI_API_KEY <string>', 'OPENAI_API_KEY')
    .action(async (args, options) => {
        LLMThreadBot(args, options)
    })

program.command('replay-nosdump-file')
    .description('Reads each even in a nosdump file send it\s it to a relay of your choice')
    .requiredOption('-r, --relays <string>', 'A list of nostr relays to query for this thread')
    .requiredOption('-f, --nosdump_file <string>', 'The output of a nosdump file')
    .addOption(new Option('-d, --delay_ms <number>', 'Delay in ms between messages').default(500).argParser(myParseInt))
    .addOption(new Option('-o, --offset <number>', 'Delay in ms between messages').default(0).argParser(myParseInt))
    .action(async (args, options) => {
        let file_contents = ''
        try {
            file_contents = await fs.readFileSync(args.nosdump_file, 'utf-8')
        } catch (error) {
            console.log(`Could not read nosdump_file ${args.nosdump_file} error posted below\n`)
            console.log(error)
            process.exit()
        }
        file_contents = file_contents.split("\n")
        const relay = await Relay.connect(args.relays.split(',')[0])
        let count = 0
        for (const line of file_contents) {
            if (count >= args.offset) {
                try {
                    const event = JSON.parse(line)
                    await relay.publish(event)
                    console.log(`Event Count = ${('000000' + count).slice(-6)}   Republished event id=${event.id}`)
                    count++
                    await new Promise((r) => setTimeout(() => r(), args.delay_ms));
                } catch (error) {
                    console.log(error)
                }
            }
        }
    })

program.command('filter-query')
    .description('Read filter via JSON file and queyr a relay')
    .requiredOption('-f, --filter_file_path <string>', 'The JSON of the filter')
    .requiredOption('-r, --relays <string>', 'A list of relays separated via commas')
    .action(async (args, options) => {
        let fileContents = ""
        try {
            fileContents = fs.readFileSync(args.filter_file_path, 'utf-8')
            fileContents = JSON.parse(fileContents)
        } catch (error) {
            console.log(`Error reading file ${args.filter_file_path} error posted below`)
            console.log(error)
        }
        console.log("The filter is,")
        console.log(JSON.stringify(fileContents))
        let result = await nostrGet(args.relays.split(','), fileContents)
        console.log(result)
    })
// program.command('get-nip65')
//     .description('nostr-cli -npub <NPUB> -relays <RELAYS>')
//     .option('-npub, --npub', 'npub of the user\'s Relay List Metadata')
//     .requiredOption('-r, --relays <string>', 'A list of nostr relays')
//     .action((str, options) => {
//         console.log(bip39.generateMnemonic())
//     })

// program.command('get-profile')
//     .description('nostr-cli create-profile -nsec <NSEC> -profile_json <PROFILE_JSON> -relays <RELAYS>')
//     .option('-npub, --npub', 'npub of the user\'s Relay List Metadata')
//     .option('-pj, --profile_json', 'The JSON you want to encode into the Nostr accounts profile and publish it')
//     .option('-r, --relays', 'A list of nostr relays')
//     .action((str, options) => {
//         console.log(bip39.generateMnemonic())
//     })
// program.command('create-profile')
//     .description('nostr-cli create-profile -nsec <NSEC> -profile_json <PROFILE_JSON> -relays <RELAYS>')
//     .option('-nsec, --nsec', 'nsec of the user\'s Relay List Metadata')
//     .option('-pj, --profile_json', 'The JSON you want to encode into the Nostr accounts profile and publish it')
//     .option('-r, --relays', 'A list of nostr relays')
//     .action((str, options) => {
//         console.log(bip39.generateMnemonic())
//     })

// program.command('download')
//     .description('nostr-cli download -nostr_filter <NOSTR_FILTER> -from_relays <RELAYS> -db_path <SQLITE_PATH>')
//     .option('-nf, --nostr_filter', 'Nostr Filter')
//     .option('-db, --db_path', 'The file path to a sqlite datebase, will create one if it does not exist')
//     .option('-r, --relays', 'A list of nostr relays')
//     .action((str, options) => {
//         console.log('TODO')
//     })

// program.command('rebroadcast')
//     .description('nostr-cli rebroadcast -nostr_filter <NOSTR_FILTER> -from_relays -to_relays')
//     .option('-filter, --nostr_filter', 'A filter to query')
//     .option('-fr, --from_relays', 'A list of nostr relays, can point to local sqlite database')
//     .option('-tr, --to_relays', 'A list of nostr relays')
//     .action((str, options) => {
//         console.log('TODO')
//     })

// program.command('filter-query-download')
//     .description('nostr-cli filter-query-download -nostr_filter -db_path <SQLITE_PATH>')
//     .option('-filter, --nostr_filter', 'The JOSN of a nostr filter')
//     .option('-db, --db_path', 'The file path to a sqlite datebase, will create one if it does not exist')
//     .action((str, options) => {
//         console.log('TODO')
//     })

program.parse();
