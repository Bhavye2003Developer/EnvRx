'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-center">
      <div className="mb-6 rounded-full border border-red-900/40 bg-red-950/30 p-5">
        <svg className="h-8 w-8 text-red-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>

      <h1 className="text-lg font-semibold text-zinc-300">Something went wrong</h1>
      <p className="mt-2 max-w-xs text-sm text-zinc-600">
        An unexpected error occurred. Your pasted data was never sent anywhere.
      </p>

      <div className="mt-8 flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 ring-1 ring-red-500/20 transition-colors hover:bg-red-500/20 hover:text-red-300"
        >
          Try again
        </button>
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-700/60 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-100"
        >
          Go home
        </a>
      </div>
    </div>
  )
}
