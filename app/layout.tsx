import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'EnvRx — Leaked .env Triage',
  description: 'Paste a leaked .env file. Get rotation links and git history purge commands instantly. Everything runs client-side.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <style>{`
          *,html,body{scrollbar-width:none!important;-ms-overflow-style:none!important}
          *::-webkit-scrollbar,html::-webkit-scrollbar,body::-webkit-scrollbar{display:none!important;width:0!important;height:0!important}
        `}</style>
      </head>
      <body className="min-h-full bg-zinc-950">{children}</body>
    </html>
  )
}
