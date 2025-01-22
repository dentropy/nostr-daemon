// Thank you Stack Overflow
// [javascript - How to handle streaming data using fetch? - Stack Overflow](https://stackoverflow.com/questions/62121310/how-to-handle-streaming-data-using-fetch)

console.log(`BASE_URL=${process.env.BASE_URL}`);
console.log(`OPENAI_API_KEY=${process.env.OPENAI_API_KEY}`);

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
      // console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n")
      console.clear();
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
  .then(async (response) => {
    // const reader = response.body.getReader();
    readAllChunks(response.body);
  });
