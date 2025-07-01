import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Learn2 - Parent Sharing Platform',
  description: 'Discover and share apps, toys, books, and tips that work for your kids',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-white`}>
        {children}
      </body>
    </html>
  )
}