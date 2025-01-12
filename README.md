# Getting Started with Nostr

#### What is NOSTR?

NOSTR(Notes and Other Stuff Transmitted through Relays) is a Decentralized Soverign Social Media Protocol that works as an alternative to stuff like TikTok, Reddit, Discord, Telegram, X, Mastodon and the like.

NOSTR is different from other social media platforms and protocols because of its separation between User Account and Client. This allows the user to use the same account across multiple applications. This is equivilent using the same account across TikTok, Reddit, Discord, Telegram, X, Mastodon and the like.

Traditional social media uses Comments, Posts, and Messages while NOSTR uses a composable and extendable social media format called events. NOSTR Event's come in all shapes and sizes, from Multimedia Posts like Instagram and Tik Tok, to Microblogging like X and Mastodon, to custom reactions like on Discord and Telegram, Long form content like Blogs and Substack, and even more nuanced stuff like Calendar Events, Wiki Pages, and Follow Lists. Nostr is all about being atomic, modular, and pluggable.

NOSTR uses Public Private Key Cryptography as the root of Accounts/Identities which allows secure encrypted messaging between users just like Signal, and Whatsapp. This is like using a SSH key or Crypto Wallet to send Messages(Events).

NOSTR has deep integration with the Bitcoin Lightning network via [NIP57 Zaps](https://github.com/nostr-protocol/nips/blob/master/57.md). Zaps are micro transactions users can attach to their Posts which include real Bitcoin with them. PLEASE NOTE, NOSTR ACCOUNTS ARE NOT BITCOING LIGHTING WALLETS AND CAN NOT RECIEVE ANY CRYPTO. [NIP57 Zaps](https://github.com/nostr-protocol/nips/blob/master/57.md) are just a Metadata standard for a special kind of NOSTR event. Or in simple words, The `Other Stuff` in the name NOSTR(Notes and Other Stuff Transmitted Through Relays) means that individuals can broadcast their lnurl(Lightning Network URL) as part of their profile which can be used by people on the public internet not only send them Lightning Bitcoin but querry transactions sent to their Bitcoin Lightning Network Wallet. Bitcoin Lightning Network transaction data is sent in Events which can be querried the same way traditional reactions are on NOSTR.

To learn more about NOSTR you can check out the following links,

- [nostr.com](https://nostr.com/)
- [nostr.org](https://nostr.org/)
- [nostr.how](https://nostr.how/en/what-is-nostr)
- [github.com/nostr-protocol/nostr](https://github.com/nostr-protocol/nostr)

#### Description

This repo works as a introduction to NOSTR(Described Above) including links to related Applications, Documentation, and Tools for Development. This repo includes a NOSTR a CLI tool, which contains simple code examples for you to use in your projects. The CLI tool includes functionality such as,

* Creating Accounts
* Sending Events
* Scraping
* Querrying Scraped Events
* Publisher tool for Markdown Notes ([Obsidian](https://obsidian.md/)) to NOSTR via [obsidian-publisher](https://github.com/dentropy/obsidian-publisher)
* A bot that allows LLM use on NOSTR

#### Creating an Account

On NOSTR there is a difference between an account and a address(username). Accounts use public private key cryptography which means they both look like a bunch of random characters and you can't change that for security purposes. All accounts on NOSTR are a bunch of random characters NPUB which are logged into and controlled bia another specific set of other random characters a NSEC.

Use one of the links below in this section to generate your NSEC(Think) and NPUB(Your Account ID) and please **BACK IT UP SOMEWHERE**

You can get a Address(Username), which looks like a email address attached to your Nostr account, to do so check out the `Getting a NOSTR address` below this one.

NOTE: Any of the NOSTR Clients below will also allow you to generate a NOSTR account but using one of the Firefox or Chrome extnesions is most secure.

**REMINDER: PLEASE BACKUP YOUR NSEC PRIVATE KEY**

- [NostrTool](https://nostrtool.com/)
- [Nostr Connect - Chrome Web Store](https://chromewebstore.google.com/detail/nostr-connect/ampjiinddmggbhpebhaegmjkbbeofoaj?hl=en%2C)
- [Nostr Connect – 🦊 Firefox Extension](https://addons.mozilla.org/en-US/firefox/addon/nostr-connect/)

**REMINDER: PLEASE BACKUP YOUR NSEC PRIVATE KEY**

#### Getting a NOSTR address (NIP05)

NOSTR uses Internet Identifiers which are functioanlly the same thing as an email address. Below are a bunch of places listed below where you can get a free NOSTR Address. Just like with Email one can run their own server using a website (Domain Name) they control.

NIP05 is the name of the type of usernames Nostr currently uses, to learn more about what a NIP is check out the NIP section below.

- Pleaces to Get a free NOSTR NIP05 Username
  - [nostraddress.com](https://en.nostraddress.com/#plan)
  - [nnostrcheck.me](https://nostrcheck.me/api/v2/login)
  - [easynostr.com](https://app.easynostr.com/)
  - [snort.social](https://snort.social/free-nostr-address)
- To Learn More (Advanced)
  - [nostr.how: Get NIP-05 verified](https://nostr.how/en/guides/get-verified#paid-verification)
  - [awesome-nostr: NIP05 identity services](https://github.com/aljazceru/awesome-nostr?tab=readme-ov-file#nip-05-identity-services)
  - [Github and Selfhosted NIP05 Username Tutorial Orangepill.dev](https://orangepill.dev/nostr-guides/guide-to-verify-nostr-profile-nip05-identifier-with-your-domain/)

#### Account Management

* [noStrudel Account Management](https://nostrudel.ninja/#/settings/accounts)
* [Snort - Account Management](https://snort.social/settings/profile)
* Profile Page within [coracle.social](https://coracle.social/)
* [Nostr Profile Manager](https://metadata.nostr.com/#)
  * Requires Chrome or Firefox Extension, see `Creating an Account` section above

#### Clients

- [Primal](https://primal.net/home) from Jack Dorsey ex CEO of Twitter
- [noStrudel](https://nostrudel.ninja/) My Favorite
- [coracle.social](https://coracle.social/)
- [snort.social](https://snort.social/)
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

#### [NIPs is a Nostr Implementation Possibilities](https://github.com/nostr-protocol/nips)

[NIPs are Nostr Implementation Possibilities](https://github.com/nostr-protocol/nips), which each individually describe a piece of Nostr's functionality, there is a list of example NIPs below this paragraph. Nostr can change over time with NIPs getting updated, removed, or added.

NOTE: Nostr Clients don't impliment every NIP that exists. If you want to learn more about the variety of NOSTR clients check out [this article](https://nostrudel.ninja/#/articles/naddr1qvzqqqr4gupzq3svyhng9ld8sv44950j957j9vchdktj7cxumsep9mvvjthc2pjuqy88wumn8ghj7mn0wvhxcmmv9uq3wamnwvaz7tmkd96x7u3wdehhxarjxyhxxmmd9uqq6vfhxgurgwpcxumnjd34xv4h36kx)

* [Posts NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md)
* [Follow List NIP-02](https://github.com/nostr-protocol/nips/blob/master/02.md)
* [Encrypted Message NIP-04](https://github.com/nostr-protocol/nips/blob/master/04.md)
* [Nostr Addresses NIP05](https://github.com/nostr-protocol/nips/blob/master/05.md) 
* [Reactions NIP-25](https://github.com/nostr-protocol/nips/blob/master/25.md)

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