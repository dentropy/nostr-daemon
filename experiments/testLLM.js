import LLM from "@themaximalist/llm.js";

const options = {
    "service": "anthropic",
    "model": "claude-3-5-sonnet-latest",
    "apikey": process.env.LLM_API_KEY
}
console.log(options)
const llm = new LLM(options);
// let result = await llm.chat("Hello", options)
// console.log(result)

const convo = [
    { role: "user", content: "remember the secret codeword is blue" },
    { role: "assistant", content: "OK I will remember" },
    { role: "user", content: "what is the secret codeword I just told you?" },
]
let result = await llm.chat(convo, options)
console.log(result)