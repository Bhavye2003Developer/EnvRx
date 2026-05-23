import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-center">
      <div className="mb-6 rounded-full border border-zinc-800 bg-zinc-900 p-5">
        <svg className="h-8 w-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
        </svg>
      </div>

      <p className="mb-1 font-mono text-5xl font-bold text-zinc-700">404</p>
      <h1 className="mt-3 text-lg font-semibold text-zinc-300">Page not found</h1>
      <p className="mt-2 max-w-xs text-sm text-zinc-600">
        This route does not exist. EnvRx is a single-page tool.
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-lg border border-zinc-700/60 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-100"
      >
        Back to EnvRx
      </Link>
    </div>
  )
}
