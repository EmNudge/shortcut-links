# Shortcut Links

This is a combination of both a chrome extension and a cloudflare worker

## Chrome Extension:
Forward any request from `go/<NAME>` to `<YOUR_SITE>/<NAME>` using a `declaritiveNetRequest`. 

## Cloudflare Worker:
Use KV to store any `POST` at `/set/<NAME>` with a body of `{ "name": "<NAME>", "url": "<URL>" }`.
The same endpoint is used to both create new links and update old ones. If the URL doesn't contain a name or the name is the same between body and URL, this is a create request. If the URL name differs, this is an update request.
`PUT` might be better to make the distinction clearer, but eh.

Redirect to new URL on `GET` to `/get/<NAME>`.

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