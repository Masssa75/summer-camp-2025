import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { GlobalGalleryProvider } from '@/components/GlobalImageGallery'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'The Waldorf Phuket Summer Camp 2025',
  description: 'Waldorf-inspired summer camp in Phuket for children ages 3-13. Nature-based activities, Thai culture, and holistic child development.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-text`}>
        <GlobalGalleryProvider>
          {children}
        </GlobalGalleryProvider>
      </body>
    </html>
  )
}