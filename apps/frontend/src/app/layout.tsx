import type { Metadata } from 'next'
import './globals.css'
import { Navigation } from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'RapidPhotoFlow',
  description: 'Upload, process, and review your photos with a modern workflow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1 pt-20 pb-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
