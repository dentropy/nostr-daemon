``` bash

source <(deno -A cli.js generate-accounts-env -m 'soap vault ahead turkey runway erosion february snow modify copy nephew rude')

deno -A cli.js test-profile \
--nsec $NSEC4 \
--config_path ./configs/test-relays.json


echo $NSEC4

cat ./configs/test-relays.json

```
