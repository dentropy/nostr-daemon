# LLM(Large Language Model) NOSTR Bot

## Description

You can deploy this bot to integrate LLM's into NOSTR conversations be it Encrypted direct messages or in threads with the context of the conversation fed into the bot.

## Running

This bot is a tempalte so you can develop other bots

**REMEMBER TO SET YOUR ANTHROPIC API KEY**

``` bash

git clone https://github.com/dentropy/nostr-daemon.git
cd nostr-daemon
deno i
deno -A cli.js llm-bot --help

# Please subsitute your own NSEC in prod
source <(deno -A cli.js generate-accounts-env -m 'soap vault ahead turkey runway erosion february snow modify copy nephew rude')

export LLM_API_KEY=k-ant-api03-ENTROPY

deno -A cli.js llm-bot \
--nsec $NSEC12 \
--config_path ./apps/llmStuff/configExample.json

```

## Sources

* [llm.js/src/index.js themaximalist/llm.js](https://github.com/themaximalist/llm.js/blob/cb88e2eb5ae9e8f439791f60c14838fa4dfd80ab/src/index.js#L75C21-L75C28)

