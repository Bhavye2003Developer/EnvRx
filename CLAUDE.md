# CLAUDE.md — EnvRx

This file gives Claude Code full context on the project so it can work without repeated explanation.

> **Multi-agent workflows:** See [`agents.md`](./agents.md) for agent role definitions, per-component specs, task handoff format, and QA checklist.

---

## What this project is

**EnvRx** (`envrx.dev`) is a single-page browser tool. Developers paste a leaked `.env` file and immediately get:

1. A card per detected service with its rotation URL and a direct link
2. Risk level per key (high/medium/low)
3. Git history purge commands pre-filled with the `.env` filename

**Everything runs client-side. No server. No API calls out. No data stored anywhere.**

---

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS (styling)
- Deployed on Vercel (zero config, no env vars needed)
- No API routes, no server components, no SSR — every component is `'use client'`
- No backend, no database, no external fetches

---

## Project structure

```
envrx/
├── app/
│   ├── layout.tsx             # Root layout — sets font, dark bg, metadata
│   ├── page.tsx               # Home page — renders <EnvRx /> client component
│   └── globals.css            # Tailwind base styles
├── components/
│   ├── EnvRx.tsx              # Root client component, holds paste state
│   ├── Paste.tsx              # Textarea input
│   ├── ResultCard.tsx         # One card per detected service
│   ├── GitCommands.tsx        # Always-shown git purge section
│   └── RiskBadge.tsx          # High / Medium / Low badge
├── lib/
│   ├── parser.ts              # Parses raw .env text → [{key, value, lineNumber}]
│   └── matcher.ts             # Matches parsed keys against services DB
├── data/
│   └── services.ts            # THE CORE FILE — service patterns + rotation URLs
├── public/
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

`app/page.tsx` is a server component that just renders the client root:

```tsx
import EnvRx from '@/components/EnvRx'

export default function Home() {
  return <EnvRx />
}
```

Every component under `components/` starts with `'use client'`. There is no server-side logic anywhere.

---

## Core data structure — `src/data/services.ts`

This is the most important file. Each entry maps a pattern to a service.

```ts
export type Risk = 'high' | 'medium' | 'low'

export interface ServiceDef {
  name: string           // Display name, e.g. "Stripe"
  patterns: RegExp[]     // Match against .env KEY names (not values)
  rotationUrl: string    // Direct link to rotation/revocation page
  rotationLabel: string  // Button label, e.g. "Revoke in Stripe Dashboard"
  risk: Risk             // high = can cause financial loss or data breach
  note?: string          // Optional short warning shown in the card
  docs?: string          // Link to security docs for this service
}

export const SERVICES: ServiceDef[] = [
  {
    name: 'OpenAI',
    patterns: [/^OPENAI_API_KEY$/i],
    rotationUrl: 'https://platform.openai.com/api-keys',
    rotationLabel: 'Revoke in OpenAI Platform',
    risk: 'high',
    note: 'Bots scan GitHub for these within seconds of a push.',
    docs: 'https://platform.openai.com/docs/api-reference/authentication',
  },
  {
    name: 'Anthropic',
    patterns: [/^ANTHROPIC_API_KEY$/i],
    rotationUrl: 'https://console.anthropic.com/settings/keys',
    rotationLabel: 'Revoke in Anthropic Console',
    risk: 'high',
  },
  {
    name: 'Stripe',
    patterns: [/^STRIPE_SECRET_KEY$/i, /^STRIPE_WEBHOOK_SECRET$/i],
    rotationUrl: 'https://dashboard.stripe.com/apikeys',
    rotationLabel: 'Revoke in Stripe Dashboard',
    risk: 'high',
    note: 'A live secret key can process real charges. Revoke immediately.',
  },
  {
    name: 'AWS',
    patterns: [/^AWS_ACCESS_KEY_ID$/i, /^AWS_SECRET_ACCESS_KEY$/i, /^AWS_SESSION_TOKEN$/i],
    rotationUrl: 'https://console.aws.amazon.com/iam/home#/security_credentials',
    rotationLabel: 'Deactivate in AWS IAM',
    risk: 'high',
    note: 'Exposed AWS keys can rack up thousands in charges within hours.',
    docs: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html',
  },
  {
    name: 'GitHub',
    patterns: [/^GITHUB_TOKEN$/i, /^GH_TOKEN$/i, /^GITHUB_CLIENT_SECRET$/i, /^GITHUB_ACCESS_TOKEN$/i],
    rotationUrl: 'https://github.com/settings/tokens',
    rotationLabel: 'Revoke in GitHub Settings',
    risk: 'high',
    note: 'A token with write access can push code to all your repos.',
  },
  {
    name: 'Supabase',
    patterns: [/^SUPABASE_SERVICE_ROLE_KEY$/i, /^SUPABASE_ANON_KEY$/i, /^NEXT_PUBLIC_SUPABASE_ANON_KEY$/i],
    rotationUrl: 'https://supabase.com/dashboard/project/_/settings/api',
    rotationLabel: 'Reset in Supabase Project Settings',
    risk: 'high',
    note: 'The service_role key bypasses Row Level Security entirely.',
  },
  {
    name: 'Google / GCP',
    patterns: [/^GOOGLE_API_KEY$/i, /^GOOGLE_CLIENT_SECRET$/i, /^GOOGLE_PRIVATE_KEY$/i, /^GCP_SERVICE_ACCOUNT_KEY$/i],
    rotationUrl: 'https://console.cloud.google.com/apis/credentials',
    rotationLabel: 'Rotate in Google Cloud Console',
    risk: 'high',
  },
  {
    name: 'Firebase',
    patterns: [/^FIREBASE_PRIVATE_KEY$/i, /^FIREBASE_API_KEY$/i, /^FIREBASE_CLIENT_EMAIL$/i],
    rotationUrl: 'https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk',
    rotationLabel: 'Regenerate in Firebase Console',
    risk: 'high',
  },
  {
    name: 'Twilio',
    patterns: [/^TWILIO_AUTH_TOKEN$/i, /^TWILIO_ACCOUNT_SID$/i],
    rotationUrl: 'https://console.twilio.com/us1/account/keys-credentials/api-keys',
    rotationLabel: 'Rotate in Twilio Console',
    risk: 'high',
  },
  {
    name: 'SendGrid',
    patterns: [/^SENDGRID_API_KEY$/i],
    rotationUrl: 'https://app.sendgrid.com/settings/api_keys',
    rotationLabel: 'Revoke in SendGrid',
    risk: 'medium',
  },
  {
    name: 'Slack',
    patterns: [/^SLACK_BOT_TOKEN$/i, /^SLACK_SIGNING_SECRET$/i, /^SLACK_CLIENT_SECRET$/i],
    rotationUrl: 'https://api.slack.com/apps',
    rotationLabel: 'Rotate in Slack App Settings',
    risk: 'high',
    note: 'A bot token can read all channel history your bot has access to.',
  },
  {
    name: 'Vercel',
    patterns: [/^VERCEL_TOKEN$/i],
    rotationUrl: 'https://vercel.com/account/tokens',
    rotationLabel: 'Revoke in Vercel Account Settings',
    risk: 'high',
  },
  {
    name: 'Cloudflare',
    patterns: [/^CLOUDFLARE_API_TOKEN$/i, /^CF_API_TOKEN$/i],
    rotationUrl: 'https://dash.cloudflare.com/profile/api-tokens',
    rotationLabel: 'Revoke in Cloudflare Dashboard',
    risk: 'high',
  },
  {
    name: 'Resend',
    patterns: [/^RESEND_API_KEY$/i],
    rotationUrl: 'https://resend.com/api-keys',
    rotationLabel: 'Revoke in Resend Dashboard',
    risk: 'medium',
  },
  {
    name: 'Clerk',
    patterns: [/^CLERK_SECRET_KEY$/i],
    rotationUrl: 'https://dashboard.clerk.com',
    rotationLabel: 'Rotate in Clerk Dashboard',
    risk: 'high',
    note: 'Secret key controls your entire auth system.',
  },
  {
    name: 'Auth0',
    patterns: [/^AUTH0_SECRET$/i, /^AUTH0_CLIENT_SECRET$/i],
    rotationUrl: 'https://manage.auth0.com',
    rotationLabel: 'Rotate in Auth0 Dashboard',
    risk: 'high',
  },
  {
    name: 'Upstash',
    patterns: [/^UPSTASH_REDIS_REST_TOKEN$/i, /^UPSTASH_VECTOR_REST_TOKEN$/i],
    rotationUrl: 'https://console.upstash.com',
    rotationLabel: 'Reset token in Upstash Console',
    risk: 'medium',
  },
  {
    name: 'HuggingFace',
    patterns: [/^HUGGING_FACE_HUB_TOKEN$/i, /^HF_TOKEN$/i, /^HUGGINGFACE_API_KEY$/i],
    rotationUrl: 'https://huggingface.co/settings/tokens',
    rotationLabel: 'Revoke in HuggingFace Settings',
    risk: 'medium',
  },
  {
    name: 'Replicate',
    patterns: [/^REPLICATE_API_TOKEN$/i],
    rotationUrl: 'https://replicate.com/account/api-tokens',
    rotationLabel: 'Revoke in Replicate Account',
    risk: 'medium',
  },
  {
    name: 'Pinecone',
    patterns: [/^PINECONE_API_KEY$/i],
    rotationUrl: 'https://app.pinecone.io',
    rotationLabel: 'Rotate in Pinecone Console',
    risk: 'medium',
  },
  {
    name: 'Shopify',
    patterns: [/^SHOPIFY_ACCESS_TOKEN$/i, /^SHOPIFY_API_SECRET$/i],
    rotationUrl: 'https://partners.shopify.com',
    rotationLabel: 'Rotate in Shopify Partners',
    risk: 'high',
  },
  {
    name: 'Plaid',
    patterns: [/^PLAID_SECRET$/i, /^PLAID_CLIENT_ID$/i],
    rotationUrl: 'https://dashboard.plaid.com/developers/keys',
    rotationLabel: 'Rotate in Plaid Dashboard',
    risk: 'high',
  },
  {
    name: 'DigitalOcean',
    patterns: [/^DIGITALOCEAN_TOKEN$/i, /^DO_TOKEN$/i],
    rotationUrl: 'https://cloud.digitalocean.com/account/api/tokens',
    rotationLabel: 'Revoke in DigitalOcean API Settings',
    risk: 'high',
  },
  {
    name: 'Notion',
    patterns: [/^NOTION_API_KEY$/i, /^NOTION_TOKEN$/i],
    rotationUrl: 'https://www.notion.so/my-integrations',
    rotationLabel: 'Rotate in Notion Integrations',
    risk: 'medium',
  },
  {
    name: 'Mailgun',
    patterns: [/^MAILGUN_API_KEY$/i],
    rotationUrl: 'https://app.mailgun.com/settings/api_security',
    rotationLabel: 'Rotate in Mailgun Settings',
    risk: 'medium',
  },
  {
    name: 'Pusher',
    patterns: [/^PUSHER_APP_SECRET$/i, /^PUSHER_APP_KEY$/i],
    rotationUrl: 'https://dashboard.pusher.com',
    rotationLabel: 'Rotate in Pusher Dashboard',
    risk: 'medium',
  },
  // Generic fallbacks — catch unknown keys that look like secrets
  {
    name: 'Unknown API Key',
    patterns: [/^(?!NEXT_PUBLIC_).*_API_KEY$/i],
    rotationUrl: '',  // No rotation URL — prompt user to check the service manually
    rotationLabel: 'Find and revoke manually',
    risk: 'medium',
    note: 'Unrecognized API key — treat it as compromised and revoke it in whatever service issued it.',
  },
  {
    name: 'Unknown Secret',
    patterns: [/^(?!NEXTAUTH_URL$).*_SECRET$/i, /^(?!NEXT_PUBLIC_).*SECRET_KEY$/i],
    rotationUrl: '',
    rotationLabel: 'Find and revoke manually',
    risk: 'medium',
    note: 'Unrecognized secret — treat it as compromised.',
  },
  {
    name: 'Auth / Session Secret',
    patterns: [/^NEXTAUTH_SECRET$/i, /^JWT_SECRET$/i, /^SESSION_SECRET$/i, /^APP_SECRET$/i],
    rotationUrl: '',
    rotationLabel: 'Regenerate and redeploy',
    risk: 'high',
    note: 'Rotating this secret invalidates all active sessions.',
  },
  {
    name: 'Database URL',
    patterns: [/^DATABASE_URL$/i, /^DB_URL$/i, /^MONGO_URI$/i, /^MONGODB_URI$/i, /^POSTGRES_URL$/i],
    rotationUrl: '',
    rotationLabel: 'Rotate credentials in your DB provider',
    risk: 'high',
    note: 'Contains connection credentials. Rotate the DB password and update all environments.',
  },
]
```

---

## Parser spec — `src/lib/parser.ts`

Input: raw string (the .env file content)
Output: `Array<{ key: string; value: string; lineNumber: number }>`

Rules:
- Skip lines starting with `#` (comments)
- Skip empty lines
- Handle `KEY=VALUE`, `KEY="VALUE"`, `KEY='VALUE'`
- Strip surrounding quotes from values
- If a line has `KEY=` with no value, include it with `value: ''`
- Do not throw on malformed lines — skip silently

---

## Matcher spec — `src/lib/matcher.ts`

Input: parsed key-value pairs
Output: `Array<{ service: ServiceDef; key: string; value: string }>`

Rules:
- For each parsed key, test against every ServiceDef's `patterns` array
- First match wins (more specific patterns are listed before generic fallbacks)
- Keys with empty values are still matched and shown (with a note that the value is empty)
- Keys matching `NEXT_PUBLIC_*` are public by design — skip them or show at low risk with a note "this key is intentionally public"
- Sort output: high risk first, then medium, then low

---

## Git commands spec — `src/components/GitCommands.tsx`

Always shown regardless of what was detected. Uses the filename from the paste if detectable, otherwise defaults to `.env`.

Show three sections:

**Step 1 — Rotate first** (warning callout, not a command)
> "Do not clean git history before rotating. If you clean first and bots already have the key, you'll have removed your audit trail."

**Step 2 — Remove from history (BFG, recommended)**
```bash
# Install BFG (requires Java)
brew install bfg

# Remove the file from all history
bfg --delete-files .env
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push --force
```

**Step 3 — Alternative: git filter-repo**
```bash
pip install git-filter-repo
git filter-repo --path .env --invert-paths
git push --force
```

**Step 4 — Add to .gitignore**
```bash
echo ".env" >> .gitignore
echo ".env.*" >> .gitignore
echo "!.env.example" >> .gitignore
git add .gitignore && git commit -m "chore: add .env to gitignore"
```

---

## UI guidelines

- Dark theme by default (devs expect it)
- Monospace font for the textarea and key names
- Risk badges: red = high, orange = medium, grey = low
- Each service card has: service logo/icon (emoji fallback ok), key name, risk badge, rotation button (links out), optional note
- The git commands section is collapsible but open by default
- Copy button on each command block
- No marketing, no upsells, no email capture
- Mobile-friendly but optimised for desktop (this is a dev tool)

---

## What NOT to do

- Do not add analytics (no GA, no Plausible, no Mixpanel)
- Do not store the pasted .env content anywhere (no localStorage, no sessionStorage)
- Do not make any network requests — the app must work fully offline after load
- Do not add a backend or serverless function
- Do not add user accounts or auth
- Do not show ads or sponsored rotation links
- Do not pre-fill or cache the textarea between sessions

---

## Roadmap (future ideas, not in v1)

- [ ] Detect service from value patterns too (e.g. `sk-...` → OpenAI, `xoxb-...` → Slack)
- [ ] Show whether the key value looks like a test/dev key vs production key
- [ ] "Check if key is still active" badge (would require a small proxy — evaluate carefully)
- [ ] CSV/JSON export of the triage report
- [ ] Browser extension that intercepts .env file uploads to GitHub

---

## Commands

```bash
npm run dev        # Start dev server at localhost:3000
npm run build      # Build for production
npm run start      # Run production build locally
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

Deploy: push to main → Vercel auto-deploys. No env vars needed on Vercel side either.

---

## Related files

- [`agents.md`](./agents.md) — agent role specs, component build instructions, QA checklist, task handoff format
