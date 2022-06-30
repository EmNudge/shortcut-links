# Shortcut Links

This is a combination of both a chrome extension and a cloudflare worker

### Chrome Extension:
Forward any request from `go/<NAME>` to `<YOUR_SITE>/<NAME>` using a `declaritiveNetRequest`. 

### Cloudflare Worker:
Use KV to store any `POST` at `/set/<NAME>` with a body of `{ "url": "<URL>" }`.

Redirect to new URL on `GET` to `/get/<NAME>`.

## Link Viewer:
Sveltekit app to view links, edit, and delete them.

## Setup
Either edit places with `ENV.<NAME>` to your own values or:

Rename `.EXAMPLE.env` to `.env` and fill in values. Then execute
```sh
deno run --allow-write --allow-read ./setup.ts
```