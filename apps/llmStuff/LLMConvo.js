import { nip19, getPublicKey } from "nostr-tools";

export default async function LLMConvo(BASE_URL, OPENAI_API_KEY, messages, nsec) {
    const ai_assistent_account = getPublicKey(nip19.decode(nsec).data)
    const llm_messages = []
    console.log("MY_MESSAGES")
    console.log(messages)
    for (const message of messages) {
        if (message.pubkey == ai_assistent_account) {
            llm_messages.push({
                role: "assistant",
                content: message.decrypted_content
            })
        }
        else {
            llm_messages.push({
                role: "user",
                content: message.decrypted_content
            })
        }
    }

    // console.log("\n\nllm_messages")
    // console.log(llm_messages)
    let llm_response = await fetch(`${BASE_URL}/chat/completions`, {
        method: "POST",
        body: JSON.stringify({
            "model": "llama3.2:latest",
            "messages": llm_messages,
            "stream": false
        }),
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
    });
    llm_response = await llm_response.json()
    // console.log("\n")
    // console.log("llm_response")
    // console.log(llm_response)
    return llm_response.choices[0].message.content
}