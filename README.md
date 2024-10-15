# Public API for OpenHeart

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

## Usage notice

- `<uid>` must not contain a forward slash.
- `<domain>` must match request origin.
- This is a **public** API, none of the stored count should be expected to be private.
- It is advised that you own this data yourself. This API exist purely for convenience. We do not gurantee uptime and data persistence in the long run.
