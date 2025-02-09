import { generateSecretKey, getPublicKey } from 'nostr-tools'
import { generateSeedWords, validateWords, privateKeyFromSeedWords } from 'nostr-tools/nip06'
import * as nip19 from 'nostr-tools/nip19'
import { finalizeEvent, verifyEvent } from 'nostr-tools'
import { Relay } from 'nostr-tools'
import Database from "libsql";

import { CID } from 'npm:multiformats/cid'
import * as raw from 'npm:multiformats/codecs/raw'
import { sha256 } from 'npm:multiformats/hashes/sha2'

export async function dentropysObsidianPublisher(relays, nsec0, sqlite_path, logging=false) {
    function transformString(str) {
        return str.toLowerCase().replace(/\d+/g, '-').replace(/[^a-z]/g, '_');
    }

    function convertString(str) {
        return str.toLowerCase().replace(/[^a-z]/g, '-');
    }
    function transformString(str) {
        return str.toLowerCase()
            .replace(/ /g, '_')
            // .replace(/\d+/g, '-')
            .replace(/[^\w-]/g, '-');
    }
    function findIndiciesOfCharacter(input_string, character) {
        var indices = [];
        for (var i = 0; i < input_string.length; i++) {
            // console.log("input_string[i]")
            // console.log(input_string[i])
            if (input_string[i] === character) indices.push(i);
        }
        return indices
    }
    function fixIndicies(input_string, character) {
        let tmpTransformedString = transformString(input_string)
        let tmpStringIndicies = findIndiciesOfCharacter(input_string, character)
        for (var position = 0; position < tmpStringIndicies.length; position++) {
            tmpTransformedString = tmpTransformedString.slice(0, tmpStringIndicies[position]) + character + tmpTransformedString.slice(tmpStringIndicies[position] + 1);
        }
        return tmpTransformedString
    }
    function removeYamlFromMarkdown(markdown) {
        if (markdown == undefined) {
            return undefined
        }
        const lines = markdown.trim().split('\n');
        if (lines[0].trim() === '---') {
            let index = lines.indexOf('---', 1);
            if (index !== -1) {
                lines.splice(0, index + 1);
            }
        }
        const updatedMarkdown = lines.join('\n').trim();
        return updatedMarkdown;
    }

    const db = await new Database(sqlite_path);
    if (logging) {
        let populate_data = `
        CREATE TABLE IF NOT EXISTS events (
            event_id TEXT PRIMARY KEY,
            kind INTEGER,
            event TEXT
        );
        `
        await db.exec(populate_data);
    }
    let query = `SELECT * FROM markdown_nodes;`
    // query = `SELECT * FROM markdown_nodes where title like 'Project Update Posts' OR title like 'ETL%' OR title like 'index' order by title DESC LIMIT 10;`
    // query = `SELECT *  from markdown_nodes where id in (SELECT to_node_id from markdown_edges where title='index') or title = 'index'; `

    let documents = db.prepare(query).all()
    console.log(`Got ${documents.length} Documents`)
    for (var i = 0; i < documents.length; i++) {
        await new Promise(r => setTimeout(() => r(), 1000));
        console.log("Fetching Document");
        let tags = [
            ['d', convertString(documents[i].title)]
        ]
        if (convertString(documents[i].title) != transformString(documents[i].title)) {
            tags.push(['d', transformString(documents[i].title)])
        }
        if (transformString(documents[i].title) != fixIndicies(documents[i].title, ",")) {
            tags.push(['d', fixIndicies(documents[i].title, ",")])
        }
        tags.push(['uuid', documents[i].id])

        const textEncoder = new TextEncoder();
        const content = removeYamlFromMarkdown(documents[i].raw_markdown)
        console.log('content')
        console.log(content)
        const hash = await sha256.digest(raw.encode(textEncoder.encode(content)))
        const myCID = CID.create(1, raw.code, hash)
        tags.push(['CID', String(myCID) ])
        let signedEvent = finalizeEvent({
            kind: 30818,
            created_at: Math.floor(Date.now() / 1000),
            tags: tags,
            content: content,
        }, nip19.decode(nsec0).data)
        for(const relay_url of relays){
            const relay = await Relay.connect(relay_url)
            let published = await relay.publish(signedEvent)
        }
        let naddr_info = {
            identifier: convertString(documents[i].title),
            pubkey: getPublicKey(nip19.decode(nsec0).data),
            kind: 30818,
            relays: [relays[0]]
        }
        let naddr = nip19.naddrEncode(naddr_info)
        let raw_name_naddr_info = {
            identifier: convertString(documents[i].title),
            pubkey: getPublicKey(nip19.decode(nsec0).data),
            kind: 30818,
            relays: [relays[0]]
        }
        let raw_name_naddr = nip19.naddrEncode(raw_name_naddr_info)
        console.log(`Sending ${documents[i].title}`)
        console.log("published")
        // console.log(published)
        // console.log(signedEvent)
        console.log(signedEvent.tags)
        console.log("addr")
        console.log(naddr)
        console.log("https://nostrudel.ninja/#/articles/" + naddr)
        console.log("raw_name_naddr")
        console.log(raw_name_naddr)
        console.log("https://nostrudel.ninja/#/articles/" + raw_name_naddr)
        console.log("\n\n")
        console.log(JSON.stringify(signedEvent))
        if (logging){
            try {
                const raw_query = `
            INSERT OR IGNORE INTO events(event_id, kind, event) 
            VALUES (@id, @kind, json(@event));
                `
                let data = {
                    id: signedEvent.id,
                    kind: signedEvent.kind,
                    event: signedEvent
                }
                await db.prepare(raw_query).run(data);   
            } catch (error) {
                console.log("Error inserting event")
                console.log(error)
                process.exit()
            }
        }
    }
    console.log("Done")
}