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
      className="absolute right-2 top-2 rounded-md bg-zinc-800 px-2 py-1 text-[11px] font-medium text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300 transition-colors"
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative mt-2">
      <pre className="overflow-x-auto rounded-lg bg-zinc-950 px-4 py-3.5 pr-20 text-[13px] text-zinc-400 font-mono leading-relaxed border border-zinc-800/60">
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
    <section className="mt-7 rounded-xl border border-zinc-800/80 bg-zinc-900/40">
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls="git-commands-body"
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <h2 className="text-sm font-semibold text-zinc-300">
          Git History Purge Commands
        </h2>
        <span className="text-zinc-600 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div id="git-commands-body" className="border-t border-zinc-800/60 px-5 pb-5 space-y-5">
          {/* Step 1 — warning */}
          <div className="mt-5 flex gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
            <span className="mt-0.5 shrink-0 text-amber-400 text-sm">⚠</span>
            <div>
              <p className="text-sm font-semibold text-amber-400">Rotate keys first</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-500">
                Do not clean git history before rotating. If you clean first and bots already have the key, you&apos;ll have removed your audit trail.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div>
            <p className="text-[13px] font-medium text-zinc-400">Remove from history — BFG <span className="text-zinc-600 font-normal">(recommended)</span></p>
            <CodeBlock code={bfg} />
          </div>

          {/* Step 3 */}
          <div>
            <p className="text-[13px] font-medium text-zinc-400">Alternative — git filter-repo</p>
            <CodeBlock code={filterRepo} />
          </div>

          {/* Step 4 */}
          <div>
            <p className="text-[13px] font-medium text-zinc-400">Add to .gitignore</p>
            <CodeBlock code={gitignore} />
          </div>
        </div>
      )}
    </section>
  )
}
