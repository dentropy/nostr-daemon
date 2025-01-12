/*
Inputs
  * NSEC
  * NSEC1
  * NOSTR_RELAYS
*/
import genNostrAccount from './genNostrAccount.js'

import { LoremIpsum } from "lorem-ipsum";
import { finalizeEvent, getPublicKey, nip04 } from "nostr-tools";
import { bytesToHex } from '@noble/hashes/utils'
import { SimplePool } from "nostr-tools/pool";

export async function fakeThread(nsec0, nsec1, nsec2, relays, default_relay = "", ms_wait_time = 500, ) {

    const lorem = new LoremIpsum({
        sentencesPerParagraph: {
            max: 8,
            min: 4,
        },
        wordsPerSentence: {
            max: 16,
            min: 4,
        },
    });

    let accounts = []
    accounts.push(genNostrAccount(nsec0))
    accounts.push(genNostrAccount(nsec1))
    accounts.push(genNostrAccount(nsec2))
    console.log(accounts)


    const myPool = new SimplePool()

    let thread = {
        events_by_id: {}
    }
    // Produce Root Message
    var random_text = lorem.generateParagraphs(1);
    var rootEvent = finalizeEvent({
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: "Root Event",
    }, accounts[0].secret_key);
    await myPool.publish(relays, rootEvent);
    await new Promise((r) => setTimeout(() => r(), ms_wait_time));
    thread.events_by_id[rootEvent.id] = {
        event_data: rootEvent,
        replies: {},
        depth_index: 0,
        responses: {}
    }
    thread.root_event = rootEvent.id

    // Generate reaction to root event
    var reactionEvent = finalizeEvent({
        kind: 7,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
            ["p", accounts[0].pubkey],
            ["e", rootEvent.id, default_relay, "root"],
            ["e", rootEvent.id, default_relay, "reply"]
        ],
        content: "+",
    }, accounts[1].secret_key);
    await myPool.publish(relays, reactionEvent);
    await new Promise((r) => setTimeout(() => r(), ms_wait_time));

    // Generate second reaction to root event
    var reactionEvent = finalizeEvent({
        kind: 7,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
            ["p", accounts[0].pubkey],
            ["e", rootEvent.id, default_relay, "root"],
            ["e", rootEvent.id, default_relay, "reply"]
        ],
        content: "+",
    }, accounts[2].secret_key);
    await myPool.publish(relays, reactionEvent);
    await new Promise((r) => setTimeout(() => r(), ms_wait_time));


    // First Level Responses
    var random_text = lorem.generateParagraphs(1);
    var signedEvent = finalizeEvent({
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
            ["p", accounts[0].pubkey],
            ["e", rootEvent.id, default_relay, "root"],
            ["e", rootEvent.id, default_relay, "reply"]
        ],
        content: random_text,
    }, accounts[1].secret_key);
    await myPool.publish(relays, signedEvent);
    await new Promise((r) => setTimeout(() => r(), ms_wait_time))
    thread.events_by_id[signedEvent.id] = {
        event_data: signedEvent,
        reply_to: {
            [rootEvent.id]: thread.events_by_id[rootEvent.id]
        },
        replies: {},
        depth_index: 1
    }
    thread.events_by_id[rootEvent.id].replies = thread.events_by_id[signedEvent.id]

    // Second First Level Response
    var random_text = lorem.generateParagraphs(1);
    var firstLevelResponse = finalizeEvent({
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
            ["p", accounts[0].pubkey],
            ["e", rootEvent.id, default_relay, "root"],
            ["e", rootEvent.id, default_relay, "reply"]
        ],
        content: random_text,
    }, accounts[1].secret_key);
    await myPool.publish(relays, firstLevelResponse);
    await new Promise((r) => setTimeout(() => r(), ms_wait_time))
    thread.events_by_id[firstLevelResponse.id] = {
        event_data: firstLevelResponse,
        replies: {},
        reply_to: {
            [rootEvent.id]: thread.events_by_id[rootEvent.id]
        },
        depth_index: 1
    }
    thread.events_by_id[rootEvent.id].replies = thread.events_by_id[firstLevelResponse.id]

    // Third Level Response
    var random_text = lorem.generateParagraphs(1);
    var signedEvent = finalizeEvent({
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
            ["p", accounts[0].pubkey],
            ["p", accounts[1].pubkey],
            ["e", rootEvent.id, default_relay, "root"],
            ["e", firstLevelResponse.id, default_relay, "reply"]
        ],
        content: random_text,
    }, accounts[2].secret_key);
    await myPool.publish(relays, signedEvent);
    await new Promise((r) => setTimeout(() => r(), ms_wait_time));
    thread.events_by_id[signedEvent.id] = {
        event_data: rootEvent,
        reply_to: {
            [firstLevelResponse.id]: thread.events_by_id[firstLevelResponse.id]
        },
        depth_index: 2
    }
    thread.events_by_id[firstLevelResponse.id].replies[signedEvent.id] = thread.events_by_id[signedEvent.id]
    return thread
}

