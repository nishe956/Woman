import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

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
      <html lang="fr">
        <body>
          <Toaster
            position="top-right"
            toastOptions={{
              success: {
                style: {
                  background: '#7C3AED',
                  color: 'white',
                },
              },
              error: {
                style: {
                  background: '#EF4444',
                  color: 'white',
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