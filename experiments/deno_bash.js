import { bash } from "https://deno.land/x/bash/mod.ts";


let command = `rsync -Pravdtz -e 'ssh -A -o StrictHostKeyChecking=no' ./test.txt dentropy@apps1.dank:/home/dentropy/test.txt`

const result = await bash(command);
console.log(result); // hello world