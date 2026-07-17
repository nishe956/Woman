'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">Chargement...</p>
    </div>
  )

  if (!data) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">Erreur de chargement</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-purple-700">
          Dashboard Admin — Women Empowerment BIT
        </h1>
        <Link
          href="/agenda"
          className="text-sm text-gray-600 hover:text-purple-700 transition"
        >
          Retour a la plateforme
        </Link>
      </div>

      <div className="p-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {(['stats', 'users', 'sessions'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                tab === t
                  ? 'bg-purple-700 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300'
              }`}
            >
              {t === 'stats' ? 'Statistiques' : t === 'users' ? 'Utilisatrices' : 'Sessions'}
            </button>
          ))}
        </div>

        {/* Stats */}
        {tab === 'stats' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <p className="text-4xl font-bold text-purple-700">
                {data.stats.totalUsers}
              </p>
              <p className="text-sm text-gray-500 mt-2">Utilisatrices</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <p className="text-4xl font-bold text-purple-700">
                {data.stats.totalSessions}
              </p>
              <p className="text-sm text-gray-500 mt-2">Sessions</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <p className="text-4xl font-bold text-purple-700">
                {data.stats.totalQuestions}
              </p>
              <p className="text-sm text-gray-500 mt-2">Questions forum</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <p className="text-4xl font-bold text-purple-700">
                {data.stats.totalMentorals}
              </p>
              <p className="text-sm text-gray-500 mt-2">Pairs mentorat</p>
            </div>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Nom</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Role</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Sessions</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Inscrite le</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map(user => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {user.prenom} {user.nom}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.inscriptions.length} session(s)
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Sessions */}
        {tab === 'sessions' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Titre</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Intervenante</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Inscriptions</th>
                </tr>
              </thead>
              <tbody>
                {data.sessions.map(session => (
                  <tr key={session.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {session.titre}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {session.intervenante}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(session.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {session.inscriptions.length} inscrite(s)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}