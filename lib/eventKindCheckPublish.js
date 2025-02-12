import { Relay } from 'nostr-tools'
import { nostrGet } from "./nostrGet.js"
export async function eventKindCheckPublish(relays, event) {
  for (const relay_url of relays) {
    // For now we publish to relay
    // We forgot write logic to validate the contents and tags later
    // Therefore if there is a event published already but with wrong contents
    // It would not be replaced
    try {
      publishToRelay(relay_url, event)
    } catch (error) {
      console.log(error)
    }

    // const filter = {
    //     kinds: [event.kind],
    //     authors: [event.pubkey]
    // }
    // console.log(filter)
    // let relay_response = await nostrGet([relay_url], filter)
    // if (relay_response.length == 0){
    //     console.log(`\nrelay_response ${relay_url}`)
    //     console.log(relay_response)
    //     publishToRelay(relay_url, event)
    // } else {
    //     console.log(`Found kind ${event.kind} of author ${event.pubkey} on relay ${relay_url}`)
    // }
  }

}

async function publishToRelay(relay_url, signedEvent) {
  try {
    const relay = await Relay.connect(relay_url);
    await relay.publish(signedEvent);
    console.log(`\n\nPublished event ${relay_url}\nEvent Contents${JSON.stringify(signedEvent, null, 2)}`);
    relay.close()
  } catch (error) {
    console.log(`\n\nCould not publish to ${relay_url}\nEvent contents:\n${JSON.stringify(signedEvent, null, 2)}`);
    console.log(error)
  }
}