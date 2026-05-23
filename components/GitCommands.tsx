'use client'

import { useState } from 'react'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      })
      .catch(() => {})
  }

  return (
    <button
      onClick={copy}
      className="absolute right-2 top-2 rounded bg-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-600 transition-colors"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative mt-2">
      <pre className="overflow-x-auto rounded-md bg-zinc-900 p-4 pr-16 text-sm text-zinc-300 font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
      <CopyButton text={code} />
    </div>
  )
}

const BFG_CMD = `# Install BFG (requires Java)
brew install bfg

# Remove the file from all history
bfg --delete-files .env
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push --force`

const FILTER_REPO_CMD = `pip install git-filter-repo
git filter-repo --path .env --invert-paths
git push --force`

const GITIGNORE_CMD = `echo ".env" >> .gitignore
echo ".env.*" >> .gitignore
echo "!.env.example" >> .gitignore
git add .gitignore && git commit -m "chore: add .env to gitignore"`

export default function GitCommands({ filename = '.env' }: { filename?: string }) {
  const [open, setOpen] = useState(true)

  const bfg = BFG_CMD.replace(/\.env/g, filename)
  const filterRepo = FILTER_REPO_CMD.replace(/\.env/g, filename)
  const gitignore = GITIGNORE_CMD

  return (
    <section className="mt-8 rounded-xl border border-zinc-800 bg-zinc-950">
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls="git-commands-body"
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <h2 className="text-base font-semibold text-zinc-100">
          Git History Purge Commands
        </h2>
        <span className="text-zinc-500 text-sm">{open ? '▲ collapse' : '▼ expand'}</span>
      </button>

      {open && (
        <div id="git-commands-body" className="border-t border-zinc-800 px-5 pb-5 space-y-6">
          {/* Step 1 */}
          <div className="mt-5 rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-4 py-3">
            <p className="text-sm font-semibold text-yellow-400">⚠ Step 1 — Rotate keys first</p>
            <p className="mt-1 text-sm text-zinc-400">
              Do not clean git history before rotating. If you clean first and bots already have the key, you&apos;ll have removed your audit trail.
            </p>
          </div>

          {/* Step 2 */}
          <div>
            <p className="text-sm font-semibold text-zinc-300">Step 2 — Remove from history (BFG, recommended)</p>
            <CodeBlock code={bfg} />
          </div>

          {/* Step 3 */}
          <div>
            <p className="text-sm font-semibold text-zinc-300">Step 3 — Alternative: git filter-repo</p>
            <CodeBlock code={filterRepo} />
          </div>

          {/* Step 4 */}
          <div>
            <p className="text-sm font-semibold text-zinc-300">Step 4 — Add to .gitignore</p>
            <CodeBlock code={gitignore} />
          </div>
        </div>
      )}
    </section>
  )
}
