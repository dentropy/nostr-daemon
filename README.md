# Getting Started with Nostr

#### What is NOSTR?

NOSTR(Notes and Other Stuff Transmitted through Relays) is a Decentralized Soverign Social Media Protocol that works as an alternative to stuff like TikTok, Reddit, Discord, Telegram, X, Mastodon and the like.

NOSTR is different from other social media platforms and protocols because of its separation between User Account and Client. This allows the user to use the same account across multiple applications. This is equivilent using the same account across TikTok, Reddit, Discord, Telegram, X, and Mastodon.

Traditional social media uses Comments, Posts, and Messages while NOSTR uses a composable and extendable social media format called events. NOSTR Event's come in all shapes and sizes, from Multimedia Posts like Instagram and Tik Tok, to Microblogging like X and Mastodon, to custom reactions like on Discord and Telegram, Long form content like Blogs and Substack, and even more nuanced stuff like Calendar Events, Wiki Pages, Follow Lists modular and pluggable.

NOSTR uses Public Private Key Cryptography as the root of Accounts/Identities which allows secure encrypted messaging between users just like Signal, and Whatsapp. This is like using a SSH key or Crypto Wallet to send Messages(Events).

NOSTR has deep integration with the Bitcoin Lightning network via [NIP57 Zaps](https://github.com/nostr-protocol/nips/blob/master/57.md). Zaps are micro transactions users can attach to their Posts which include real Bitcoin with them. PLEASE NOTE, NOSTR ACCOUNTS ARE NOT BITCOING LIGHTING WALLETS AND CAN NOT RECIEVE ANY CRYPTO. [NIP57 Zaps](https://github.com/nostr-protocol/nips/blob/master/57.md) are just a Metadata standard for a special kind of NOSTR event. Or in simple words, The `Other Stuff` in the name NOSTR(Notes and Other Stuff Transmitted Through Relays) means that individuals can broadcast their lnurl(Lightning Network URL) as part of their profile which can be used by people on the public internet not only send them Lightning Bitcoin but querry transactions sent to their Bitcoin Lightning Network Wallet. Bitcoin Lightning Network transaction data is sent in Events which can be querried the same way traditional reactions are on NOSTR.

#### Description

This repo works as a introduction to NOSTR(Described Above) including links to related Applications, Documentation, and Tools for Development. This repo includes a NOSTR a CLI tool, which contains simple CODE examples for you to use in your projects. The CLI tool includes functionality such as,

* Creating Accounts
* Sending Events
* Scraping, and Querrying Scraped Events
* Publisher tool for Markdown Notes ([Obsidian](https://obsidian.md/)) to NOSTR via [obsidian-publisher](https://github.com/dentropy/obsidian-publisher)
* A bot that allows LLM use on NOSTR

#### Getting Started Links

- [Nostr Connect - Chrome Web Store](https://chromewebstore.google.com/detail/nostr-connect/ampjiinddmggbhpebhaegmjkbbeofoaj?hl=en%2C)
- [Nostr Connect – Get this Extension for 🦊 Firefox (en-US)](https://addons.mozilla.org/en-US/firefox/addon/nostr-connect/)
- [Nostr Profile Manager](https://metadata.nostr.com/#)

#### Clients

- [Primal](https://primal.net/home)
- [noStrudel](https://nostrudel.ninja/)
- [Feeds](https://coracle.social/notes)
- [Nostr Apps](https://nostrapps.com/)
- [Article on Nostr Apps](https://nostrudel.ninja/#/articles/naddr1qvzqqqr4gupzq3svyhng9ld8sv44950j957j9vchdktj7cxumsep9mvvjthc2pjuqy88wumn8ghj7mn0wvhxcmmv9uq3wamnwvaz7tmkd96x7u3wdehhxarjxyhxxmmd9uqq6vfhxgurgwpcxumnjd34xv4h36kx)

#### Tooling

- [Filter Console](https://nostrudel.ninja/#/tools/console)
- [NostrTool - Generate Accounts](https://nostrtool.com/)
- [Nostr Profile and Relay Manager](https://metadata.nostr.com/)
- [NIP19 Nostr Army Knife](https://nak.nostr.com/)
- [Get NIP-05 verified](https://nostr-how.vercel.app/en/guides/get-verified)
- [CodyTseng/nostr-relay-tray: a nostr relay for desktop](https://github.com/CodyTseng/nostr-relay-tray)
- [awesome-nostr](https://nostr.net/)

#### Example Events

* [Example Event](https://coracle.social/notes/nevent1qy2hwumn8ghj7un9d3shjtnyv9kh2uewd9hj7qg3waehxw309ahx7um5wgh8w6twv5hsz9nhwden5te0wfjkccte9ekk7um5wgh8qatz9uqsuamnwvaz7tmwdaejumr0dshsz9mhwden5te0wfjkccte9ec8y6tdv9kzumn9wshsqgpxcvgj7qs5lqxknnnq2jg7qxqkgfswh22qsxk2ansstrltm2rf7uj0yfrd)
* [Article on Nostr Apps](https://nostrudel.ninja/#/articles/naddr1qvzqqqr4gupzq3svyhng9ld8sv44950j957j9vchdktj7cxumsep9mvvjthc2pjuqy88wumn8ghj7mn0wvhxcmmv9uq3wamnwvaz7tmkd96x7u3wdehhxarjxyhxxmmd9uqq6vfhxgurgwpcxumnjd34xv4h36kx)

#### Sections

* [Generate Accounts](./docs/GenerateAccounts.md)
* [Run a local Nostr Relay](./docs/RunNostrRelay.md)
* [Query Relay using Filter](./docs/QueryRelayUsingFiler.md)
* [Scrape Nostr Using Nosdump](./docs/nodsump.md)
  * [Index using postgres](./docs/postgres.md)
  * [Index using sqlite](./docs/sqlite.md)
* [Encrypted Direct Messages](./docs/EncryptedDirectMessages.md)
* [Thead Functions](./docs/ThreadFunctions.md)
* [Publish wiki from dentropys-obsidian-publisher](./docs/PublishWiki.md)
* [Bots on Nostr](./docs/Bots.md)

## Basics

#### send-event

``` bash

source <(deno -A cli.js generate-accounts-env -m 'soap vault ahead turkey runway erosion february snow modify copy nephew rude')

export RELAYS='ws://127.0.0.1:6969'
export RELAYS='wss://social.mememaps.net/relay'
export RELAYS='ws://127.0.0.1:4036/relay'

echo $RELAYS

deno -A cli.js send-event -nsec $NSEC0 -f './event-data.json' --relays $RELAYS

```

## Running Tests

``` bash

deno test

deno test --allow-all

```