import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Women Empowerment BIT',
  description: 'Plateforme des sessions Women in Tech de BIT',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="fr" className={`${plusJakartaSans.variable} ${playfairDisplay.variable}`}>
        <body className="antialiased min-h-screen bg-slate-50/50">
          <Toaster
            position="top-right"
            toastOptions={{
              success: {
                style: {
                  background: '#6D28D9',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '14px',
                },
              },
              error: {
                style: {
                  background: '#EF4444',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '14px',
                },
              },
            }}
          />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}