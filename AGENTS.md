# agents.md — EnvRx

This file defines how AI agents should work on this codebase. Read `CLAUDE.md` first for full project context.

---

## Ground rules for all agents

1. **Never make network requests from the app.** EnvRx is fully client-side. If you're writing a component and reach for `fetch()` or `axios`, stop — that's wrong.
2. **Never touch `localStorage` or `sessionStorage`.** The pasted `.env` content must not persist anywhere.
3. **Never add analytics, tracking, or error reporting SDKs.**
4. **Every component file must start with `'use client'`.** There is no server-side rendering logic in this project.
5. **`data/services.ts` is the source of truth.** Don't hardcode service names or URLs inside components — always read from the services array.
6. **Rotation URLs must be verified before committing.** A dead link in a security emergency is worse than no link.

---

## Agent roles

### Agent 1 — Service Researcher

**Purpose:** Expand and maintain `data/services.ts`.

**Input:** A service name (e.g. "Databricks") or a batch of service names.

**Task:**
1. Find the most direct URL where a developer can revoke or rotate API keys for this service
2. Identify all common `.env` key name patterns for this service
3. Classify risk level: `high` if the key can cause financial loss, data breach, or full account takeover — `medium` otherwise
4. Write a one-sentence `note` if there's something non-obvious a panicking developer needs to know right now
5. Add the entry to `data/services.ts` following the `ServiceDef` interface exactly

**Acceptance criteria:**
- `rotationUrl` opens directly to the key management page, not the service homepage
- `patterns` use case-insensitive regex (`/^KEY_NAME$/i`)
- Entry is inserted in alphabetical order by `name`
- No duplicate patterns with existing entries

**Do not:**
- Add a service without verifying the rotation URL is live
- Set `risk: 'high'` for services that only have read access
- Write a `note` that's longer than one sentence

---

### Agent 2 — Parser Engineer

**Purpose:** Build and maintain `lib/parser.ts`.

**Spec to implement:**

```ts
export interface ParsedEntry {
  key: string
  value: string
  lineNumber: number
  isEmpty: boolean   // true if value is '' after stripping quotes
}

export function parseEnv(raw: string): ParsedEntry[]
```

**Rules:**
- Skip lines starting with `#`
- Skip blank lines
- Handle `KEY=VALUE`, `KEY="VALUE"`, `KEY='VALUE'`
- Strip surrounding quotes from values (single and double)
- Handle inline comments: `KEY=VALUE # comment` → value is `VALUE`, not `VALUE # comment`
- If a line has `KEY=` with no value, return `{ isEmpty: true, value: '' }`
- Malformed lines (no `=`) → skip silently, do not throw
- Return line numbers starting from 1

**Test cases to verify manually:**
```
OPENAI_API_KEY=sk-abc123          → key: OPENAI_API_KEY, value: sk-abc123
STRIPE_SECRET_KEY="sk_live_xyz"   → key: STRIPE_SECRET_KEY, value: sk_live_xyz
# This is a comment               → skipped
EMPTY_KEY=                         → key: EMPTY_KEY, value: '', isEmpty: true
DATABASE_URL=postgres://user:pass@host/db?ssl=true  → full value preserved
NEXT_PUBLIC_URL=https://example.com  → included, not filtered here (matcher handles it)
```

---

### Agent 3 — Matcher Engineer

**Purpose:** Build and maintain `lib/matcher.ts`.

**Spec to implement:**

```ts
export interface MatchResult {
  service: ServiceDef
  key: string
  value: string
  lineNumber: number
  isEmpty: boolean
}

export function matchServices(entries: ParsedEntry[]): MatchResult[]
```

**Rules:**
- For each `ParsedEntry`, test its `key` against every `ServiceDef.patterns` array in order
- First pattern match wins — stop testing further services for that key
- Keys starting with `NEXT_PUBLIC_` → mark as `risk: 'low'` with note `"This key is intentionally public"` — do not run through normal matching
- Deduplicate: if the same service is matched by multiple keys, return one result per key (not per service)
- Sort output: `high` risk first, then `medium`, then `low`
- Keys with no match → silently excluded from results (do not show "unknown" unless the generic fallback patterns in services.ts catch them)

---

### Agent 4 — UI Builder

**Purpose:** Build components from the specs in `CLAUDE.md`.

**Components to build:**

#### `components/Paste.tsx`
- Large `<textarea>` for pasting `.env` content
- Monospace font (`font-mono`)
- Placeholder: `"Paste your .env file here..."`
- On change: call `onPaste(value)` prop
- Show character count bottom-right in muted text
- Clear button appears once content is present
- No file upload input — paste only

#### `components/RiskBadge.tsx`
- Props: `risk: 'high' | 'medium' | 'low'`
- `high` → red background, white text, "HIGH RISK"
- `medium` → orange background, white text, "MEDIUM"
- `low` → slate background, muted text, "LOW"
- Small pill shape, uppercase, monospace font

#### `components/ResultCard.tsx`
- Props: `result: MatchResult`
- Shows: service name, detected key name (monospace), `RiskBadge`, rotation button, optional note
- Rotation button: if `rotationUrl` is empty → grey button "Find manually", disabled-looking, no link; if set → primary button opens in new tab
- Show a warning icon next to keys where `isEmpty: true`
- Card has a left border color matching risk level (red/orange/slate)

#### `components/GitCommands.tsx`
- Always rendered, regardless of paste content
- Collapsible — open by default
- Four sections as specified in CLAUDE.md (rotate first warning, BFG, git filter-repo, gitignore)
- Each command block has a copy-to-clipboard button
- Copy button shows "Copied!" for 2 seconds after click
- Warn at the top: "**Rotate your keys first.** Cleaning history before rotating means bots may already have your keys with no audit trail."

#### `components/EnvRx.tsx`
- Root `'use client'` component
- Holds `raw: string` state
- On paste change: runs `parseEnv()` then `matchServices()`, stores results in state
- Renders: header, `<Paste />`, results section (only if results exist), `<GitCommands />`
- If paste has content but zero matches: show "No known services detected — check the git commands below and rotate any secrets manually."

---

### Agent 5 — QA Agent

**Purpose:** Verify the app works correctly before a release.

**Checklist to run through before any merge to main:**

**Parser:**
- [ ] Pastes with Windows line endings (`\r\n`) parse correctly
- [ ] Quoted values with spaces parse correctly: `KEY="hello world"` → `hello world`
- [ ] Values with `=` in them parse correctly: `DATABASE_URL=postgres://user:pass=word@host`
- [ ] Comment-only `.env` returns empty array, no crash

**Matcher:**
- [ ] `OPENAI_API_KEY` → matched as OpenAI, risk high
- [ ] `NEXT_PUBLIC_SUPABASE_URL` → matched as low risk, note about being public
- [ ] `TOTALLY_UNKNOWN_TOKEN=abc` → matched by generic fallback or excluded (not crashed)
- [ ] Empty paste → zero results, no error state shown

**UI:**
- [ ] Rotation links all open in a new tab (`target="_blank" rel="noopener noreferrer"`)
- [ ] Copy buttons work in both Chrome and Safari
- [ ] High-risk cards appear before medium-risk cards in the results
- [ ] GitCommands section is visible without any paste content
- [ ] App renders correctly on mobile viewport (360px wide)
- [ ] No layout shift when results appear

**Security:**
- [ ] Open DevTools Network tab — paste a fake `.env` — confirm zero outbound requests
- [ ] Confirm nothing is written to `localStorage` or `sessionStorage` after paste
- [ ] Confirm textarea content clears on page refresh (no persistence)

---

## Task handoff format

When one agent finishes and another needs to continue, leave a handoff note in this format at the bottom of any work-in-progress file:

```
// AGENT HANDOFF
// Completed: parser.ts — all spec cases passing
// Remaining: matcher.ts needs the NEXT_PUBLIC_ exclusion logic (see agents.md Agent 3)
// Blocker: none
```

---

## Adding a new service (fast path)

Any agent can add a service. The minimum viable addition:

```ts
{
  name: 'ServiceName',
  patterns: [/^SERVICE_API_KEY$/i],
  rotationUrl: 'https://app.service.com/settings/api-keys',  // must be verified live
  rotationLabel: 'Revoke in ServiceName Dashboard',
  risk: 'high',
}
```

If you can't find a direct rotation URL, set `rotationUrl: ''` and `rotationLabel: 'Find and revoke manually'`. A blank URL is better than a wrong URL.
