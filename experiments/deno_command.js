const command = new Deno.Command("rsync", {
    args: [
        "-Pravdtze",
        "ssh",
        "./test.txt",
        "root@apps1.dank:/home/dentropy/test.txt",
    ],
    stdin: "piped",
    stdout: "piped",
});
const child = command.spawn();
