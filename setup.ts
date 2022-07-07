import { parse as parseArgs } from 'https://deno.land/std@0.134.0/flags/mod.ts';

const userArgs = parseArgs(Deno.args);
const DEVELOPMENT_MODE = userArgs.development || userArgs.dev;
const REVERSE_REPLACE = userArgs.reverse || userArgs.rev;
const GIT_DISABLE = userArgs.git;


const REPLACE_FILES = [
    './cloudflare/wrangler.toml',
    './chrome-extension/routes.json',
    './www/.env' + (DEVELOPMENT_MODE ? '.development' : ''),
];


const parseEnv = (envText: string) =>
    new Map<string, string>(envText.split('\n').map(line => {
        const [key, value] = line.split('=');
        if (!value) throw new Error('No value found for ' + key);

        return [key, value] as const;
    }));

const getReplaceMap = (env: Map<string, string>, rev = false) => {
    const newEntries = [...env.entries()].map(([k, value]) => {
        const key = `L_ENV.${k}`;
        if (rev) return [value, key] as const;
        return [key, value] as const;
    });
    return new Map(newEntries);
};

const envFileName = DEVELOPMENT_MODE ? '.env.development' : '.env';

const envVars = parseEnv(await Deno.readTextFile(envFileName))
const replaceMap = getReplaceMap(envVars, REVERSE_REPLACE);

const replaces = REPLACE_FILES.map(async filePath => {
    let text = await Deno.readTextFile(filePath);
    for (const [key, val] of replaceMap) {
        text = text.replaceAll(key, val);
    }

    return Deno.writeTextFile(filePath, text);
})
await Promise.all(replaces);

const run = (cmd: string) => Deno.run({ cmd: cmd.split(/\s+/), stdout: 'null' });
if (GIT_DISABLE) {
    run('git update-index --assume-unchanged cloudflare/wrangler.toml chrome-extension/routes.json');
}

console.log(`successfully ${REVERSE_REPLACE ? 'removed' : 'wrote'} env variables!`);