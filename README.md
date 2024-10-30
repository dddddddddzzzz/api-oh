# Public API for OpenHeart

This is a **public** API for the [OpenHeart portocol](https://github.com/dddddddddzzzz/OpenHeart), none of the stored count should be expected to be private.

It is advised that you own this data yourself. This API exist purely for convenience. We do not gurantee uptime and data persistence in the long run.

## Usage

https://api.oh.dddddddddzzzz.org

### In `OpenHeart` spec

GET /`<domain>`/`<uid>` to look up reactions for `<uid>` under `<domain>`

POST /`<domain>`/`<uid>` to send an emoji

### Not in `OpenHeart` spec:

GET /`<domain>` to look up reactions for everything under `<domain>`

POST /`<domain>`/`<uid>?redirect=<url>` to send users either back `Referer` header with blank `<url>`, or a destination `<url>`.

`<domain>` owner has the right to remove data under their domain scope.

## Try it out

Send emoji 💯 with `github.com` as `<domain>`, `dddddddddddzzzz/api-oh` as `<uid>`:

`curl -d '💯' -X POST 'https://api.oh.dddddddddzzzz.org/github.com/dddddddddddzzzz/api-oh'`

Get all emoji counts for `/github.com/dddddddddddzzzz/api-oh`:

`curl 'https://api.oh.dddddddddzzzz.org/github.com/dddddddddddzzzz/api-oh'`

### Put it on your website right now

Copy and past the following HTML snippet, and swap `example.com` with your domain. That's it!

```html
<form action="https://api.oh.dddddddddzzzz.org/example.com/index?redirect" method="POST" enctype="text/plain">
  <button name="👍">👍</button>
</form>
```

Alternatively, with JavaScript, you can use [`<open-heart>`](https://github.com/dddddddddzzzz/open-heart-element).

```html
<!-- Include `OpenHeartElement` once, on your page -->
<script src="https://unpkg.com/open-heart-element" type="module"></script>

<!-- Render `<open-heart>` -->
<open-heart href="https://api.oh.dddddddddzzzz.org/example.com/index" emoji="👍">👍</open-heart>
```
