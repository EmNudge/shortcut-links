const envText = await Deno.readTextFile("./.env");

const envVars = new Map<string, string>(envText.split('\n').map(line => {
    const [key, value] = line.split('=');
    if (!value) throw new Error('No value found for ' + key);

    return [key, value] as const;
}));

const REPLACE_FILES = ["./cloudflare/wrangler.toml", "./chrome-extension/routes.json"];

const replaces = REPLACE_FILES.map(async filePath => {
    let text = await Deno.readTextFile(filePath);
    for (const [key, val] of envVars) {
        text = text.replace(`ENV.${key}`, val);
    }

    return Deno.writeTextFile(filePath, text);
})
await Promise.all(replaces);

console.log('successfully wrote env variables!');