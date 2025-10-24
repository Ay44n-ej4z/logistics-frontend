import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/Providers'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LogiFlow - Logistics & Freight Forwarding',
  description: 'Modern, minimal logistics & freight forwarding workspace',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster 
            position="top-right"
            expand={false}
            richColors
            closeButton
            toastOptions={{
              style: {
                background: 'white',
              },
              className: 'toast',
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
