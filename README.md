# Shortcut Links

This migration is a work in progress...

## Chrome Extension

Edit `chrome-extension/links.csv` with new redirects.
Left column is the abbreviation to be used in the redirect (`![ABBREVIATION]`), the right column is the URL.
abbreviations in the format of `[LETTERS] ?` will take an input parameter to be stuck onto the end of the url.

Run `deno run --allow-read --allow-write ./chrome-extension/index.ts` to generate a `routes.json` file which is needed for the manifest to work.