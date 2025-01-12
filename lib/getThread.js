import { nostrGet } from "./nostrGet.js";

// We should treat reply_to as a dictionary to reuse the same code for complex graph's later on
  // Well what kind of reply to is the question, leaving it as is is simpler
// We can't assume we will have a root and reply mentioned in the event
// If these parts of the tag are not there we can assume the event is a reply to another event

export function getThreadToJSON(result) {
    for (let event of Object.keys(result.events_by_id)) {
        if ("reply_to" in result.events_by_id[event]) {
            result.events_by_id[event].reply_to = result.events_by_id[event].reply_to.event_data.id
        }
        if (Object.keys(result.events_by_id[event].replies).length != 0) {
            result.events_by_id[event].replies = Object.keys(result.events_by_id[event].replies)
        }
        if (Object.keys(result.events_by_id[event].responses).length != 0) {
            for (const response_kind of Object.keys(result.events_by_id[event].responses)) {
                result.events_by_id[event].responses[response_kind] = Object.keys(result.events_by_id[event].responses[response_kind])
            }
        }
    }
    return result
}

export async function getThread(relays, event_id) {
    let thread = {
        events_by_id: {}
    }
    function findMatchingFirstStringOfTag(event, firstTagString) {
        if (event == undefined) {
            return []
        }
        let resultTags = []
        for (const tag of event.tags) {
            if (tag[0] == firstTagString) {
                resultTags.push(tag)
            }
        }
        return resultTags
    }
    function augmentRelaysFromEvent(relays, event) {
        let e_tags = findMatchingFirstStringOfTag(event, 'e')
        for (const tag of e_tags) {
            if (tag[2] != "") {
                if (!relays.includes(tag[2])) {
                    relays.push(tag[2])
                }
            }
        }
        return relays
    }
    function isRootEvent(event) {
        // Returns true or returns the id of the rootEvent
        let eTags = findMatchingFirstStringOfTag(event[0], 'e')
        for (const tag of eTags) {
            if (tag[3] == "root") {
                return tag[1]
            }
        }
        return true
    }
    async function getRelyEvent(relays, the_event, depth_index) {
        // Get reply tag and update
        let eTags = findMatchingFirstStringOfTag(the_event[0], 'e')
        // Update the replies and replied_to
        for (const tag of eTags) {
            if (tag[3] = "reply") {
                console.log("tag[1]")
                console.log(tag[1])
                // thread.events_by_id[tag[1]].replied_to = thread.events_by_id[the_event.id]
                // thread.events_by_id[the_event.id].replies.push(thread.events_by_id[tag[1]])
            }
        }
        await checkForReplies(augmentRelaysFromEvent(relays, the_event), the_event.id, depth_index)
    }
    async function checkForReplies(relays, event_id, depth_index) {
        if (depth_index == 4) {
            return
        }
        let replies = await nostrGet(relays, { "#e": [event_id] })
        for (const event of replies) {
            if (thread.events_by_id[event.id] == undefined) {
                thread.events_by_id[event.id] = {
                    reply_to: thread.events_by_id[event_id],
                    event_data: event,
                    depth_index: depth_index + 1,
                    replies: {},
                    responses: {}
                }
            }
            if (event.kind == 1) {
                await getRelyEvent(relays, event, depth_index + 1)
                thread.events_by_id[event_id].replies[event.id] = thread.events_by_id[event.id]
            } else {
                if (thread.events_by_id[event_id].responses[event.kind] == undefined) {
                    thread.events_by_id[event_id].responses[event.kind] = {}
                    thread.events_by_id[event_id].responses[event.kind][event.id] = thread.events_by_id[event.id]
                } else {
                    thread.events_by_id[event_id].responses[event.kind][event.id] = thread.events_by_id[event.id]
                }
            }
        }
    }


    let firstEvent = await nostrGet(relays, { ids: [event_id] })
    thread.events_by_id[event_id] = {
        event_data: firstEvent[0],
        depth_index: -1,
        replies: {},
        responses: {}
    }
    if (isRootEvent(firstEvent)) {
        thread.root_event = thread.events_by_id[event_id]
        thread.events_by_id[event_id].depth_index = 0
    } else {
        const rootEvent = await nostrGet(relays, { ids: [isRootEvent(event_id)] })
        thread.events_by_id[event_id] = {
            event_data: rootEvent[0],
            depth_index: 0,
            replies: {},
            responses: {}
        }
    }

    await checkForReplies(relays, thread.root_event.event_data.id, 0)
    return thread
}







export async function RetriveThreadOld(relays, event_id) {

    let firstEvent = await nostrGet(
        relays,
        {
            "ids": [event_id]
        }
    )
    // Loop getting reply events
    async function get_replies(events, relays) {
        // Check if event is reply or root


        let the_event = events[events.length - 1]
        console.log("events.length")
        console.log(events.length)
        console.log(events)


        // let reply_to_event = ""
        // for (const tag of the_event.tags) {
        //     if (tag[0] == "e" && tag[3] == "reply") {
        //         reply_to_event = tag[1]
        //         let response_event = await nostrGet(
        //             relays,
        //             {
        //                 "ids": [tag[1]]
        //             }
        //         )            
        //         if(response_event[0] != undefined){
        //             events.push(response_event[0])
        //             reply_to_event = ""
        //         }
        //     }
        // }
        // if( reply_to_event == ""){
        //     for (const tag of the_event.tags) {
        //         if (tag[0] == "e" && tag[3] == "root") {
        //             reply_to_event = tag[1]
        //             let response_event = await nostrGet(
        //                 relays,
        //                 {
        //                     "ids": [tag[1]]
        //                 }
        //             )
        //             if(response_event[0] != undefined){
        //                 events.push(response_event[0])
        //                 reply_to_event = ""
        //             }
        //         }
        //     }
        // }
        // if( reply_to_event == ""){
        //     return events.reverse()
        // } else {
        //     return await get_replies(events, relays)
        // }

        let reply_event = ""
        let root_event = ""
        for (const tag of the_event.tags) {
            if (tag[0] == "e" && tag[3] == "reply") {
                reply_event = tag[1]
            }
            if (tag[0] == "e" && tag[3] == "root") {
                root_event = tag[1]
            }
        }
        console.log("reply_event")
        console.log(`reply_event=${reply_event} root_event=${root_event}`)
        console.log("\n\n\n")

        if (reply_event == root_event || reply_event == undefined || reply_event == "") {
            let response_event = await nostrGet(
                relays,
                {
                    "ids": [root_event]
                }
            )
            if (response_event[0] != undefined) {
                events.push(response_event[0])
            }
            return events.reverse()
        } else {
            let response_event = await nostrGet(
                relays,
                {
                    "ids": [reply_event]
                }
            )
            if (response_event[0] != undefined) {
                events.push(response_event[0])
            }
            return await get_replies(events, relays)
        }

    }
    return await get_replies([firstEvent[0]], relays)
}
