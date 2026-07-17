'use client'

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/agenda', label: 'Agenda' },
  { href: '/replays', label: 'Replays' },
  { href: '/forum', label: 'Forum' },
  { href: '/mentorat', label: 'Mentorat' },
  { href: '/profil', label: 'Profil' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link href="/agenda" className="text-lg font-bold text-purple-700">
            Woman Empowerment BIT
          </Link>
          <div className="flex gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  pathname === link.href
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="text-xs text-gray-400 hover:text-purple-700 transition"
          >
            Admin
          </Link>
          <UserButton />
        </div>
      </nav>

      <main className="p-8 max-w-5xl mx-auto">
        {children}
      </main>
    </div>
  )
}