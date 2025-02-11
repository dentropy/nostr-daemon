# nostr-dameon

This repo provides a introduction to nostr, a CLI tool for using NOSTR, and a couple bots you can run on Nostr. To get started check out the [Onboarding Documentation](./docs/README.md)

#### What is NOSTR?

NOSTR(Notes and Other Stuff Transmitted through Relays) is a Simple, Decentralized, Sovereign, Censorship Resistant, Social Media Protocol that works as an alternative to platforms and protocols such as TikTok, Reddit, Discord, Telegram, X, Mastodon and the like.

NOSTR is different from other social media platforms and protocols because of its separation between User Account and Client. This allows the user to use the same account across multiple applications. This is equivilent using the same account across TikTok, Reddit, Discord, Telegram, X, Mastodon and the like.

Traditional social media uses Comments, Posts, and Messages while NOSTR uses a composable and extendable social media format called events. NOSTR Event's come in all shapes and sizes, from Multimedia Posts like Instagram and Tik Tok, to Microblogging like X and Mastodon, to custom reactions like on Discord and Telegram, Long form content like Blogs and Substack, and even more nuanced stuff like Calendar Events, Wiki Pages, and Follow Lists. Nostr is all about being atomic, modular, and pluggable.

NOSTR uses Public Private Key Cryptography as the root of Accounts/Identities which allows secure encrypted messaging between users just like Signal, and Whatsapp. For the nerds out there this is like using a SSH key or Crypto Wallet to send Messages(Events).

If you want to know more about how Nostr integrates with Bitcoin please check the `Zaps` section below.

To learn more about NOSTR you can check out the [Onboarding Documentation](./docs/README.md)

#### Description

This repo works as a [introduction to NOSTR(Described Above)](./docs/README.md) including links to related Applications, Documentation, and Tools for Development. The product of this repo is a NOSTR a CLI tool, which contains simple code examples for you to use in your projects. The CLI tool includes functionality such as,

* Creating Accounts
* Sending Events
* Scraping
* Querrying Scraped Events
* Publisher tool for Markdown Notes ([Obsidian](https://obsidian.md/)) to NOSTR via [obsidian-publisher](https://github.com/dentropy/obsidian-publisher)
* A bot that allows LLM use on NOSTR
* A bot that can assign Nostr Usernames via NIP05

If you are new to Nostr the [Onboarding Documentation](./docs/README.md) is a great place to start, from there you can try a bunch of Nostr Clients to get a feel for what Nostr is all about.

#### Requirements

* Linux or MacOS
  * On windows use [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install)
* [git](https://docs.github.com/en/get-started/getting-started-with-git/set-up-git)
* [deno](https://deno.com/)
* Optional - [docker](https://www.docker.com/get-started/)

#### Sections

* [Onboarding Documentation](./docs/README.md)
* [Generate Accounts](./docs/GenerateAccounts.md)
* [Run a local Nostr Relay](./docs/RunNostrRelay.md)
* [Send Events](./docs/SendEvents.md)
* [Example Events](./docs/ExampleEvents.md)
* [Query Relay using Filter](./docs/QueryRelayUsingFiler.md)
* [Scrapeing Nostr Using Nosdump](./docs/nodsump.md)
  * [Index using postgres](./docs/postgres.md)
  * [Index using sqlite](./docs/sqlite.md)
* [Encrypted Direct Messages](./docs/EncryptedDirectMessages.md)
* [Thead Functions](./docs/ThreadFunctions.md)
* [Publish wiki from dentropys-obsidian-publisher](./docs/PublishWiki.md)
* [llm(Large Language Model) bot on Nostr](./docs/Bots.md)
  * [llm bot](./docs/bots/LLM.md)
  * [nip05 bot](./docs/bots/nip05.md)
* [Running Tests](./docs/RunningTests.md)
* [Setting up a blossom server with S3](./docs/ConfigureBlossomWithS3.md)
* [Deploy to Prod](./docs/DeployToProd.md)
