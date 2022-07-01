# Shortcut Links

This is a combination of both a cloudflare worker, frontend app, and a chrome extension

## Chrome Extension:
Forward any request from `go/<NAME>` to `<YOUR_SITE>/<NAME>` using a `declaritiveNetRequest`. 

## Cloudflare Worker:
Use KV store to manage links.

## Link Viewer:
Sveltekit app to view links, edit, and delete them.

## Setup
Either edit places with `ENV.<NAME>` to your own values or:

Rename `.EXAMPLE.env` to `.env` and fill in values. Then execute
```sh
deno run --allow-write --allow-read ./setup.ts
```

### Optional Setup
The script above exists because specific IDs and URLs need to be added to non-env files, such as `routes.json` and `wrangler.toml`. The script will modify these files, which will be added to your commits if you're not careful. 

The fix is to edit the `.git/info/exclude` file to git ignore these files
```
# add these
chrome-extension/routes.json
cloudflare/wrangler.toml
```
And then have git stop looking at these files
```
git update-index --assume-unchanged chrome-extension/routes.json
git update-index --assume-unchanged cloudflare/wrangler.toml
```