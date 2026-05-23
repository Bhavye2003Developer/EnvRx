# EnvRx 💊

**Emergency triage for leaked `.env` files.**

You committed your `.env`. Bots are already scanning GitHub for it. Stop Googling — paste it here and get direct rotation links for every exposed key in under 30 seconds.

→ **[envrx.dev](https://envrx.dev)**

---

## What it does

Paste your leaked `.env` file. EnvRx:

1. **Detects** every service from key name patterns — OpenAI, Stripe, AWS, GitHub, Supabase, Twilio, and 25+ more
2. **Links you directly** to each service's API key rotation page — no Googling, no navigating dashboards
3. **Gives you the exact git commands** to purge the secret from your commit history

Everything runs in your browser. Your secrets never leave your machine.

---

## Why this exists

Committing a `.env` file is the single most common developer security mistake. When it happens, you're panicking, Googling rotation instructions for five different services at once, while bots are already harvesting your keys.

There was no tool for the moment *after* the leak. EnvRx is that tool.

---

## Features

- **30+ service patterns** — detects keys for OpenAI, Anthropic, Stripe, AWS, GitHub, Supabase, Twilio, SendGrid, Slack, Firebase, Google, Vercel, Cloudflare, Resend, Upstash, Clerk, Auth0, Plaid, HuggingFace, Replicate, Pinecone, Shopify, Notion, MongoDB, Neon, Turso, PlanetScale, DigitalOcean, Pusher, Mailgun, and more
- **Direct rotation links** — one click to each service's revocation page, no dashboard hunting
- **Git purge commands** — copy-paste BFG and `git filter-repo` commands with your actual filename pre-filled
- **Triage order** — highest-risk keys (cloud credentials, payment keys) flagged first
- **100% client-side** — zero server, zero logging, zero data sent anywhere
- **No account, no install** — open and paste

---

## How it works

```
Paste .env  →  parse KEY=VALUE pairs  →  match key names against service patterns
           →  for each match: show service name + rotation URL + risk level
           →  always show: git history purge commands
```

The parser handles:
- Standard `KEY=VALUE` format
- Quoted values (`KEY="value"` and `KEY='value'`)
- Comments (lines starting with `#` are ignored)
- Empty lines
- Keys with no value (flagged as empty, not linked)

---

## Supported services

| Service | Detected keys |
|---|---|
| OpenAI | `OPENAI_API_KEY` |
| Anthropic | `ANTHROPIC_API_KEY` |
| Stripe | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| AWS | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN` |
| GitHub | `GITHUB_TOKEN`, `GH_TOKEN`, `GITHUB_CLIENT_SECRET` |
| Supabase | `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY` |
| Google / GCP | `GOOGLE_API_KEY`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_PRIVATE_KEY` |
| Firebase | `FIREBASE_PRIVATE_KEY`, `FIREBASE_API_KEY` |
| Twilio | `TWILIO_AUTH_TOKEN`, `TWILIO_ACCOUNT_SID` |
| SendGrid | `SENDGRID_API_KEY` |
| Slack | `SLACK_BOT_TOKEN`, `SLACK_SIGNING_SECRET` |
| Vercel | `VERCEL_TOKEN` |
| Cloudflare | `CLOUDFLARE_API_TOKEN` |
| Resend | `RESEND_API_KEY` |
| Clerk | `CLERK_SECRET_KEY` |
| Auth0 | `AUTH0_SECRET`, `AUTH0_CLIENT_SECRET` |
| Upstash | `UPSTASH_REDIS_REST_TOKEN` |
| HuggingFace | `HUGGING_FACE_HUB_TOKEN`, `HF_TOKEN` |
| Replicate | `REPLICATE_API_TOKEN` |
| Pinecone | `PINECONE_API_KEY` |
| Shopify | `SHOPIFY_ACCESS_TOKEN`, `SHOPIFY_API_SECRET` |
| Plaid | `PLAID_SECRET` |
| DigitalOcean | `DIGITALOCEAN_TOKEN` |
| Notion | `NOTION_API_KEY` |
| Mailgun | `MAILGUN_API_KEY` |
| Pusher | `PUSHER_APP_SECRET` |
| + more | `DATABASE_URL`, `JWT_SECRET`, `NEXTAUTH_SECRET`, generic `*_API_KEY`, `*_SECRET`, `*_TOKEN` |

Don't see your service? [Open an issue](https://github.com/Bhavye2003Developer/envrx/issues) or submit a PR — adding a pattern takes 5 minutes.

---

## Running locally

```bash
git clone https://github.com/Bhavye2003Developer/envrx
cd envrx
npm install
npm run dev
```

Requires Node 18+. No `.env` file needed — there are no environment variables.

---

## Tech stack

- **Next.js + TypeScript** — framework
- **Tailwind CSS** — styling
- **Deployed on Vercel** — zero config

No backend. No API routes used. No database. The entire service detection logic is a static map in the client — all components are `'use client'`.

---

## Contributing

### Adding a new service

Open `src/data/services.ts` and add an entry:

```ts
{
  name: 'MyService',
  patterns: [/^MYSERVICE_API_KEY$/i, /^MYSERVICE_SECRET$/i],
  rotationUrl: 'https://app.myservice.com/settings/api-keys',
  rotationLabel: 'Revoke in MyService dashboard',
  risk: 'high', // 'high' | 'medium' | 'low'
  docs: 'https://docs.myservice.com/security/rotate-keys',
}
```

Then open a PR. No tests to write — just verify the rotation URL is correct and still live.

### Improving the UI or parser

Standard flow: fork → branch → PR. Keep it fast and client-side.

---

## Security note

EnvRx is deliberately zero-trust:

- No analytics
- No error tracking
- No telemetry
- No CDN that logs requests
- The `.env` content you paste never leaves your browser tab

If you want to verify this, the source is fully open. Check `src/` — there are no API calls, no `fetch()` to any external service, no `localStorage` writes beyond dark mode preference.

---

## License

MIT — use it, fork it, deploy your own copy.

---

*Built by [@Bhavye2003Developer](https://github.com/Bhavye2003Developer)*
