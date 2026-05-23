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
      className="absolute right-2.5 top-2.5 rounded-md bg-zinc-800 px-2.5 py-1 text-[11px] font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative mt-2.5">
      <pre className="overflow-x-auto rounded-lg border border-zinc-800/60 bg-zinc-950 px-3 py-3 pr-16 font-mono text-[11px] leading-relaxed text-zinc-400 sm:px-4 sm:py-3.5 sm:pr-20 sm:text-[12px]">
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

const STEPS = [
  {
    number: '1',
    label: 'Rotate first',
    warning: true,
    description: "Do not clean git history before rotating. If you clean first and bots already have the key, you'll have removed your audit trail.",
  },
  {
    number: '2',
    label: 'Remove from history (BFG, recommended)',
    code: BFG_CMD,
    env: true,
  },
  {
    number: '3',
    label: 'Alternative: git filter-repo',
    code: FILTER_REPO_CMD,
    env: true,
  },
  {
    number: '4',
    label: 'Add to .gitignore',
    code: GITIGNORE_CMD,
    env: false,
  },
]

export default function GitCommands({ filename = '.env' }: { filename?: string }) {
  const [open, setOpen] = useState(true)

  return (
    <section className="mt-6 rounded-xl border border-zinc-800/70 bg-zinc-900/30 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls="git-commands-body"
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-zinc-900/40"
      >
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-semibold text-zinc-200">Git History Purge</h2>
          <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-500">4 steps</span>
        </div>
        <span className="text-zinc-600 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div id="git-commands-body" className="border-t border-zinc-800/60 px-5 pb-5">
          <div className="mt-5 space-y-5">
            {STEPS.map((step) => (
              <div key={step.number} className="flex gap-3.5">
                <div className="flex flex-col items-center">
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                    step.warning
                      ? 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30'
                      : 'bg-zinc-800 text-zinc-400 ring-1 ring-zinc-700/60'
                  }`}>
                    {step.warning ? '!' : step.number}
                  </div>
                  {step.number !== '4' && <div className="mt-1.5 w-px flex-1 bg-zinc-800/80" />}
                </div>
                <div className="flex-1 min-w-0 pb-1">
                  <p className={`text-[13px] font-medium ${step.warning ? 'text-amber-400' : 'text-zinc-300'}`}>
                    {step.label}
                  </p>
                  {step.warning && step.description && (
                    <p className="mt-1 text-[12px] leading-relaxed text-zinc-500">{step.description}</p>
                  )}
                  {step.code && (
                    <CodeBlock
                      code={step.env
                        ? step.code.replace(/\.env/g, filename)
                        : step.code}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
