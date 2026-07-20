'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowLeft, BarChart3, Users, Calendar, ShieldCheck, Mail, CalendarRange, Award } from 'lucide-react'

interface Stats {
  totalUsers: number
  totalSessions: number
  totalQuestions: number
  totalMentorals: number
}

interface User {
  id: string
  nom: string
  prenom: string
  email: string
  role: string
  createdAt: string
  inscriptions: { session: { titre: string } }[]
}

interface Session {
  id: string
  titre: string
  date: string
  intervenante: string
  inscriptions: { id: string }[]
}

interface Data {
  stats: Stats
  users: User[]
  sessions: Session[]
}

export default function AdminPage() {
  const [data, setData] = useState<Data | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'stats' | 'users' | 'sessions'>('stats')

  useEffect(() => {
    fetch('/api/admin')
      .then(res => {
        if (res.status === 403) {
          window.location.href = '/agenda'
          return null
        }
        return res.json()
      })
      .then(d => {
        if (d) {
          setData(d)
          setLoading(false)
        }
      })
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-semibold">Chargement du dashboard admin...</p>
      </div>
    </div>
  )

  if (!data) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-red-500 font-semibold">Erreur de chargement des données d'administration.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-purple-100/40 px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-650 flex items-center justify-center shadow-md shadow-purple-100">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-base font-bold tracking-tight text-slate-900">
            Dashboard Admin <span className="text-purple-600">BIT</span>
          </h1>
        </div>
        
        <Link
          href="/agenda"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-all duration-200 border border-slate-100 hover:border-purple-100"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Retour à la plateforme
        </Link>
      </div>

      <div className="max-w-5xl mx-auto p-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white p-1 rounded-2xl border border-purple-100/30 w-fit shadow-sm">
          <button
            onClick={() => setTab('stats')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
              tab === 'stats'
                ? 'bg-purple-700 text-white shadow-md shadow-purple-150'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Statistiques
          </button>
          <button
            onClick={() => setTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
              tab === 'users'
                ? 'bg-purple-700 text-white shadow-md shadow-purple-150'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Utilisatrices
          </button>
          <button
            onClick={() => setTab('sessions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
              tab === 'sessions'
                ? 'bg-purple-700 text-white shadow-md shadow-purple-150'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Sessions
          </button>
        </div>

        {/* Tab 1: Stats */}
        {tab === 'stats' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 animate-in fade-in duration-300">
            {/* Metric 1 */}
            <div className="bg-white rounded-2xl border border-purple-100/40 p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100">
                <Users className="w-6 h-6 text-purple-700" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-800 tracking-tight">{data.stats.totalUsers}</p>
                <p className="text-[10px] uppercase font-bold text-slate-400 mt-1 tracking-wider">Utilisatrices</p>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white rounded-2xl border border-purple-100/40 p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100">
                <CalendarRange className="w-6 h-6 text-purple-700" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-800 tracking-tight">{data.stats.totalSessions}</p>
                <p className="text-[10px] uppercase font-bold text-slate-400 mt-1 tracking-wider">Sessions</p>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white rounded-2xl border border-purple-100/40 p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100">
                <Award className="w-6 h-6 text-purple-700" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-800 tracking-tight">{data.stats.totalQuestions}</p>
                <p className="text-[10px] uppercase font-bold text-slate-400 mt-1 tracking-wider">Questions Forum</p>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="bg-white rounded-2xl border border-purple-100/40 p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100">
                <Sparkles className="w-6 h-6 text-purple-700" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-800 tracking-tight">{data.stats.totalMentorals}</p>
                <p className="text-[10px] uppercase font-bold text-slate-400 mt-1 tracking-wider">Pairs Mentorat</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Users Table */}
        {tab === 'users' && (
          <div className="bg-white rounded-2xl border border-purple-100/40 overflow-hidden shadow-sm animate-in fade-in duration-300">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead className="bg-slate-50 border-b border-purple-100/20">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Nom</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Email</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Rôle</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Sessions</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Inscrite le</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.users.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-slate-800">
                        {user.prenom} {user.nom}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {user.email}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          user.role === 'ADMIN'
                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : 'bg-purple-50 text-purple-700 border border-purple-100/40'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                        {user.inscriptions.length} session{user.inscriptions.length > 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400 font-semibold">
                        {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Sessions Table */}
        {tab === 'sessions' && (
          <div className="bg-white rounded-2xl border border-purple-100/40 overflow-hidden shadow-sm animate-in fade-in duration-300">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead className="bg-slate-50 border-b border-purple-100/20">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Titre de la session</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Intervenante</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Date de l'événement</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Inscriptions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.sessions.map(session => (
                    <tr key={session.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-slate-800">
                        {session.titre}
                      </td>
                      <td className="px-6 py-4 text-sm text-purple-700 font-semibold">
                        {session.intervenante}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400 font-semibold">
                        {new Date(session.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-bold">
                          {session.inscriptions.length} inscrite{session.inscriptions.length > 1 ? 's' : ''}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}