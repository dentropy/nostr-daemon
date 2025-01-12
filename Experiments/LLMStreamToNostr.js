// Thank you Stack Overflow
// [javascript - How to handle streaming data using fetch? - Stack Overflow](https://stackoverflow.com/questions/62121310/how-to-handle-streaming-data-using-fetch)

import {
  finalizeEvent,
  getPublicKey,
  nip04,
  nip19,
  Relay,
  verifyEvent,
} from "nostr-tools";

console.log(`BASE_URL=${process.env.BASE_URL}`);
console.log(`OPENAI_API_KEY=${process.env.OPENAI_API_KEY}`);
console.log(`NSEC=${process.env.NSEC1}`);
console.log(`RELAYS=${process.env.RELAYS}`);
const nsec = process.env.NSEC1;
const npub = nip19.npubEncode(getPublicKey(nip19.decode(nsec).data));
console.log(`Bot npub = ${npub}`);

let body = {
  model: "llama3.2:latest",
  messages: [
    {
      "role": "user",
      "content": "Why is the sky blue?",
    },
  ],
  stream: true,
};

const relay = await Relay.connect(process.env.RELAYS.split(",")[0]);

async function readAllChunks(readableStream) {
  const reader = readableStream.getReader();
  const chunks = [];
  let done, value;
  const decoder = new TextDecoder();
  while (!done) {
    ({ value, done } = await reader.read());
    if (done) {
      return chunks;
    }
    const decoded_value = decoder.decode(value);
    if (decoded_value.includes("data: [DONE]")) {
      console.log("DONE");
      return chunks.join("");
    } else {
      let mah_result = JSON.parse(decoded_value.slice(6, -1));
      if (mah_result.choices[0].finish_reason == null) {
        chunks.push(mah_result.choices[0].delta.content);
      }
      let signedEvent = finalizeEvent({
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: chunks.join(""),
      }, nip19.decode(nsec).data);
      relay.publish(signedEvent);
      console.log(signedEvent);
      console.log(chunks.join(""));
    }
  }
}

fetch(process.env.BASE_URL + "/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
  },
  body: JSON.stringify(body),
})
  .then((response) => {
    // const reader = response.body.getReader();
    readAllChunks(response.body);
  });
