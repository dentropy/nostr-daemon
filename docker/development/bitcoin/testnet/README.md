## Steps to get a Lightning Network Node up and Running

* Setup Tailscale or Headscale on VPS if you don't have a Public IP address for your server
  * Or just do everything on a VPS, good luck running a mainnet btcd node ~800 Gb, testnet3 is ~210 Gb
  * Hook public VPS to tailnet
  * Hook up BTCD node to tailnet
* We get btcd Node Running
* Get Valid TLS Certs
    * Get a VPS with public IP address
    * Set DNS names for
        * btc
        * btctestnet
        * btcregtest
        * lnd
        * litd
        * lnbits
        * alice
        * bob
        * mallory
    * Copy caddy files to server
    * Open Firewall using `ufw`
    * Replace domain names in the CaddyFile
    * Run Caddy
    * Copy the certs back to your local system, or wherever they need to go
* Copy certs where they need to go
  * To BTCD node and restart it
  * To lnd node
  * To litd node
* We get LND running
  * Copy the btcd cert used to the LND node
  * Start the node
* Create LND wallet
  * #TODO
* Get Macaroon from LND for LITD
  * We generate a Admin Macaroon
  * We export the Admin Macaroon to file system
  * Move Macaroon to path litd can read it
* We start Lightning Terminal with the Macaroon
* Start lnbits and hook up Lightning Terminal
* Proxy Everything to Clearnet and Voila