const instruction = `.^⋁^.
'. .'
  `

[dddddddddzzzz] OpenHeart protocol API

https://api.oh.dddddddddzzzz.org

Test with example.com as <domain>. Note <uid> for example.com will always be 'uid'.

GET /<domain>/<uid> to look up reactions for <uid> under <domain>
GET /<domain> to look up reactions for everything under <domain>

POST /<domain>/<uid> to send an emoji

<uid> must not contain a forward slash.
<domain> must match request domain.

----- Test in CLI -----
Send emoji:
curl -d '<emoji>' -X POST 'https://api.oh.dddddddddzzzz.org/example.com/uid'

Get all emoji counts for /example.com/uid:
curl 'https://api.oh.dddddddddzzzz.org/example.com/uid'
`

export default {
  async fetch(request, env) {
    if (request.method === 'GET') {
      if (url(request).pathname === '/') {
        return new Response(instruction, {headers})
      } else {
        return handleGet(request, env)
      }
    }
    if (request.method === 'POST') return handlePost(request, env)
  },
}

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST",
  "Access-Control-Max-Age": "86400",
}

function error(text, code = 400) {
  return new Response(text, {headers, status: code})
}


async function handleGet(request, env) {
  const origin = new URL(request.headers.get('origin')).host
  const [domain, ...uidParts] = url(request).pathname.slice(1).split('/')
  const testing = domain === 'example.com'
  if (!testing && domain !== origin) return error(`domain <${domain}> does not match origin <${origin}>`)
  const list = {}
  const uid = testing ? 'uid' : uidParts.join('')
  let prefix = domain
  if (uid) {
    prefix += `:${uid}`
  }

  const res = await env.KV.list({prefix})
  for (const key of res.keys) {
    const value = await env.KV.get(key.name)
    const [_, uid, emoji] = key.name.split(':')
    const obj = list[uid] || {}
    obj[emoji] = value
    list[uid] = obj
  }
  return new Response(
    JSON.stringify(uid ? list[uid] : list), 
    {headers: {...headers, 'Content-Type': 'application/json;charset=UTF-8'}})
}

function url(request) {
  return new URL(request.url)
}

async function handlePost(request, env) {
  const path = url(request).pathname.slice(1)
  if (path === '') return error('pathname missing')

  const [domain, ...uidParts] = path.split('/')
  const testing = domain === 'example.com'
  const uid = uidParts.join('')
  
  if (uid.length < 1) return error('uid required.')
  
  const origin = new URL(request.headers.get('origin')).host
  if (!testing && domain !== origin) return error(`domain <${domain}> does not match origin <${origin}>`)

  const id = [encodeURI(domain), testing ? 'uid' : uid].join(':')
  const emoji = ensureEmoji(await request.text())
  
  if (!emoji) return error('request body should contain an emoji')

  const key = `${id}:${emoji}`

  // https://developers.cloudflare.com/workers/runtime-apis/kv/
  const currentCount = Number(await(env.KV.get(key)) || 0)
  await env.KV.put(key, currentCount + 1)

  return new Response('recorded', {headers})
}

function ensureEmoji(emoji) {
  const segments = Array.from(new Intl.Segmenter({ granularity: 'grapheme' }).segment(emoji.trim()))
  const parsedEmoji = segments.length > 0 ? segments[0].segment : null
  
  if (/\p{Emoji}/u.test(parsedEmoji)) return parsedEmoji
}