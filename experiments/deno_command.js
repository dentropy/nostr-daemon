const args = [
    "-Pravdtz",
    `-e`,
    `\'ssh -A -o StrictHostKeyChecking=no\'`,
    "./test.txt",
    "dentropy@apps1.dank:/home/dentropy/test.txt",
]
const raw_args = args.join(" ")
console.log("\n\nrsync " + raw_args + "\n\n")

const command = new Deno.Command("/usr/bin/rsync", {
    args: args,
    stdin: "piped",
    stdout: "piped",
});
const child = command.spawn();
