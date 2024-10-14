/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */


export default {
  async fetch(request, env) {
    if (request.method === 'GET') {
      if (url(request).pathname === '/') {
        return new Response(instruction)
      } else {
        return handleGet(request, env)
      }
    }
    if (request.method === 'POST') return handlePost(request, env)
  },
}

function error(text, code = 400) {
  return new Response(text, {status: code})
}

const instruction = `
POST endpoint: https://api.oh.dddddddddzzzz.org/<domain>/<uid>
<uid> must not contain a forward slash.
<domain> must match request domain. In local environment, test with example.com.
`

async function handleGet(request, env) {
  const requrl = url(request)
  const origin = requrl.host
  const [domain, ...uidParts] = requrl.pathname.slice(1).split('/')
  const testing = domain === 'example.com'
  if (!testing && domain !== origin) return error('domain does not match request origin')
  const list = {}
  const uid = uidParts.join('')
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
  return new Response(JSON.stringify(list))
}

function url(request) {
  return new URL(request.url)
}

async function handlePost(request, env) {
  const requrl = url(request)
  const path = requrl.pathname.slice(1)
  if (path === '') return error('pathname missing')

  const [domain, ...uidParts] = path.split('/')
  const testing = domain === 'example.com'
  const uid = uidParts.join('')
  
  if (uid.length < 1) return error('uid required.')
  
  if (!testing && domain !== requrl.host) return error('domain does not match request origin')

  const id = [encodeURI(domain), testing ? 'uid' : uid].join(':')
  const emoji = ensureEmoji(await request.text())
  
  if (!emoji) return error('request body should contain an emoji')

  const key = `${id}:${emoji}`

  // https://developers.cloudflare.com/workers/runtime-apis/kv/
  const currentCount = Number(await(env.KV.get(key)) || 0)
  await env.KV.put(key, currentCount + 1)

  return new Response('recorded')
}

function ensureEmoji(emoji) {
  const segments = Array.from(new Intl.Segmenter({ granularity: 'grapheme' }).segment(emoji.trim()))
  const parsedEmoji = segments.length > 0 ? segments[0].segment : null
  
  if (/\p{Emoji}/u.test(parsedEmoji)) return parsedEmoji
}