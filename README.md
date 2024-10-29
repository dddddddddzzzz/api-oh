# Public API for OpenHeart

This is a **public** API for the [OpenHeart portocol](https://github.com/dddddddddzzzz/OpenHeart), none of the stored count should be expected to be private.

It is advised that you own this data yourself. This API exist purely for convenience. We do not gurantee uptime and data persistence in the long run.

## Get started

Test now or locally with `example.com` as `<domain>`. 
Note, with `example.com`, `<uid>` for example.com will always be `uid`.

Send emoji:

`curl -d '<emoji>' -X POST 'https://api.oh.dddddddddzzzz.org/example.com/uid'`

Get all emoji counts for /example.com/uid:

`curl 'https://api.oh.dddddddddzzzz.org/example.com/uid'`

## Usage

https://api.oh.dddddddddzzzz.org

### In spec

GET /`<domain>`/`<uid>` to look up reactions for `<uid>` under `<domain>`

POST /`<domain>`/`<uid>` to send an emoji

### Not in spec:

GET /`<domain>` to look up reactions for everything under `<domain>`

POST /`<domain>`/`<uid>?redirect=<url>` to send users either back `request.referrer` with blank `<url>`, or a destination `<url>`.

## Usage notice

- `<uid>` must not contain a forward slash.
- `<domain>` owner has the right to remove data under its domain scope.
