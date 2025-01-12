#### Accounts Commands

``` bash

deno -A cli.js generate-mnemonic

export MNEMONIC=$(deno -A cli.js generate-mnemonic)
echo $MNEMONIC

deno -A cli.js generate-accounts-json

deno -A cli.js generate-accounts-json -m 'soap vault ahead turkey runway erosion february snow modify copy nephew rude'

deno -A cli.js generate-accounts-env

deno -A cli.js generate-accounts-env -m 'soap vault ahead turkey runway erosion february snow modify copy nephew rude'

# Reminder of how ENV variables work
export MNEMONIC='soap vault ahead turkey runway erosion february snow modify copy nephew rude'
echo $MNEMONIC
source <(deno -A cli.js generate-accounts-env)


deno -A cli.js generate-accounts-env -m 'soap vault ahead turkey runway erosion february snow modify copy nephew rude' > .env
cat .env
source .env
echo $NPUB0


source <(deno -A cli.js generate-accounts-env -m 'soap vault ahead turkey runway erosion february snow modify copy nephew rude')

echo $MNEMONIC
echo $NSEC10
echo $NPUB10

```