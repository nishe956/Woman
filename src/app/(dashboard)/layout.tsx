'use client'

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, Video, MessageSquare, HeartHandshake, User, Sparkles, ShieldCheck } from 'lucide-react'

const navLinks = [
  { href: '/agenda', label: 'Agenda', icon: Calendar },
  { href: '/replays', label: 'Replays', icon: Video },
  { href: '/forum', label: 'Forum', icon: MessageSquare },
  { href: '/mentorat', label: 'Mentorat', icon: HeartHandshake },
  { href: '/profil', label: 'Profil', icon: User },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-slate-50/40 font-sans antialiased">
      {/* Navbar with chic glassmorphism */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-purple-100/40 px-8 py-3.5 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-8">
          <Link href="/agenda" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-100 group-hover:scale-105 transition-all duration-300">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight text-slate-900">
              Women Empowerment <span className="text-purple-600">BIT</span>
            </span>
          </Link>
          
          <div className="hidden md:flex gap-1.5">
            {navLinks.map(link => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 border ${
                    isActive
                      ? 'bg-purple-50 border-purple-100 text-purple-700 shadow-sm shadow-purple-100/50'
                      : 'text-slate-600 hover:bg-slate-50 border-transparent hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-700' : 'text-slate-500 group-hover:text-slate-700'}`} />
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-purple-700 hover:bg-purple-50 border border-transparent hover:border-purple-100 transition-all duration-200"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin
          </Link>
          <div className="h-6 w-px bg-slate-200" />
          <UserButton />
        </div>
      </nav>

      {/* Mobile nav for better user experience */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-purple-100/60 py-2.5 px-4 flex justify-around items-center z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
        {navLinks.map(link => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 p-1 rounded-lg text-[10px] font-medium transition-all ${
                isActive
                  ? 'text-purple-700 font-semibold'
                  : 'text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          )
        })}
      </div>

      <main className="p-8 max-w-5xl mx-auto pb-24 md:pb-8">
        {children}
      </main>
    </div>
  )
}