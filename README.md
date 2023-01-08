# Shortcut Links

Shortcut links using Cloudflare, Svelte, & Auth.js!

## Chrome Extension

Edit `localhost:3000` in the routes.json file to the hosted website. Load extension unpacked in chrome://extensions.

## Svelte App

* Miniflare is used for local development.
* Cloudflare does not send `User-Agent` in fetch requests so we need to add one manually, overriding the Github provider in Auth.js