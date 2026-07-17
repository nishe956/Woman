'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface Session {
  id: string
  titre: string
  description: string
  date: string
  duree: number
  intervenante: string
  replayUrl: string | null
}

export default function AgendaPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [role, setRole] = useState<string>('')
  const [form, setForm] = useState({
    titre: '',
    description: '',
    date: '',
    duree: 60,
    intervenante: '',
  })

  useEffect(() => {
    fetch('/api/users', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.role) setRole(data.role)
      })
    fetchSessions()
  }, [])

  function fetchSessions() {
    setLoading(true)
    fetch('/api/sessions')
      .then(res => res.json())
      .then(data => {
        setSessions(data)
        setLoading(false)
      })
  }

  async function createSession() {
    await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setShowForm(false)
    setForm({ titre: '', description: '', date: '', duree: 60, intervenante: '' })
    fetchSessions()
    toast.success('Session creee !')
  }

  async function sInscrire(sessionId: string) {
    await fetch('/api/inscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
    toast.success('Inscription reussie !')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Sessions a venir</h2>
        {role === 'ADMIN' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-800 transition"
          >
            + Nouvelle session
          </button>
        )}
      </div>

      {role === 'ADMIN' && showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Creer une session</h3>
          <div className="grid gap-4">
            <input
              placeholder="Titre de la session"
              value={form.titre}
              onChange={e => setForm({ ...form, titre: e.target.value })}
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-full"
            />
            <input
              placeholder="Nom de l'intervenante"
              value={form.intervenante}
              onChange={e => setForm({ ...form, intervenante: e.target.value })}
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-full"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-full"
              rows={3}
            />
            <div className="flex gap-4">
              <input
                type="datetime-local"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm flex-1"
              />
              <input
                type="number"
                placeholder="Duree (min)"
                value={form.duree}
                onChange={e => setForm({ ...form, duree: Number(e.target.value) })}
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-32"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={createSession}
                className="bg-purple-700 text-white px-6 py-2 rounded-lg text-sm hover:bg-purple-800 transition"
              >
                Creer
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="border border-gray-200 px-6 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Chargement...</p>
      ) : sessions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-lg">Aucune session pour le moment</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sessions.map(session => {
            const isPast = new Date(session.date) < new Date()
            return (
              <div
                key={session.id}
                className={`bg-white rounded-xl border p-6 hover:shadow-md transition ${
                  isPast ? 'border-gray-100 opacity-75' : 'border-purple-100 hover:border-purple-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {session.titre}
                      </h3>
                      {isPast ? (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                          Terminee
                        </span>
                      ) : (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          A venir
                        </span>
                      )}
                      {session.replayUrl && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                          Replay dispo
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-purple-600 font-medium">
                      {session.intervenante}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      {session.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-6">
                    <div className={`rounded-xl p-4 mb-3 ${isPast ? 'bg-gray-50' : 'bg-purple-50'}`}>
                      <p className={`text-sm font-semibold ${isPast ? 'text-gray-500' : 'text-purple-700'}`}>
                        {new Date(session.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(session.date).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {session.duree} min
                      </p>
                    </div>
                    {!isPast && (
                      <button
                        onClick={() => sInscrire(session.id)}
                        className="w-full bg-purple-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-800 transition"
                      >
                        S'inscrire
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}