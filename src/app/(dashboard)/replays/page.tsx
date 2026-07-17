'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface Replay {
  id: string
  titre: string
  description: string
  date: string
  duree: number
  intervenante: string
  replayUrl: string
}

export default function ReplaysPage() {
  const [replays, setReplays] = useState<Replay[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ sessionId: '', replayUrl: '' })
  const [sessions, setSessions] = useState<{ id: string; titre: string }[]>([])
  const [role, setRole] = useState<string>('')

 useEffect(() => {
  fetch('/api/users', { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      if (data.role) setRole(data.role)
    })
  fetchReplays()
  fetchSessions()
}, [])

  function fetchReplays() {
    setLoading(true)
    fetch('/api/replays')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setReplays(data)
        else setReplays([])
        setLoading(false)
      })
  }

  function fetchSessions() {
    fetch('/api/sessions')
      .then(res => res.json())
      .then(data => setSessions(data))
  }

  async function ajouterReplay() {
    if (!form.sessionId || !form.replayUrl) return
    await fetch('/api/replays', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setShowForm(false)
    setForm({ sessionId: '', replayUrl: '' })
    fetchReplays()
    toast.success('Replay ajoute !')
  }

  async function supprimerReplay(sessionId: string) {
    await fetch('/api/replays', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
    fetchReplays()
    toast.success('Replay supprime !')
  }

  function getYoutubeId(url: string) {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    )
    return match ? match[1] : null
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Replays</h2>
          <p className="text-sm text-gray-400 mt-1">
            {replays.length} replay(s) disponible(s)
          </p>
        </div>
        {role === 'ADMIN' && (
  <button
    onClick={() => setShowForm(!showForm)}
    className="bg-purple-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-800 transition"
  >
    + Ajouter un replay
  </button>
)}
      </div>

       {role === 'ADMIN' && showForm && (
  // ... formulaire
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Ajouter un replay
          </h3>
          <div className="grid gap-4">
            <select
              value={form.sessionId}
              onChange={e => setForm({ ...form, sessionId: e.target.value })}
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-purple-300"
            >
              <option value="">Choisir une session</option>
              {sessions.map(s => (
                <option key={s.id} value={s.id}>{s.titre}</option>
              ))}
            </select>
            <input
              placeholder="URL YouTube (ex: https://youtube.com/watch?v=xxx)"
              value={form.replayUrl}
              onChange={e => setForm({ ...form, replayUrl: e.target.value })}
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-purple-300"
            />
            <div className="flex gap-3">
              <button
                onClick={ajouterReplay}
                className="bg-purple-700 text-white px-6 py-2 rounded-lg text-sm hover:bg-purple-800 transition"
              >
                Ajouter
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
        <div className="grid gap-6">
          {[1, 2].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/2 mb-3" />
              <div className="h-48 bg-gray-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : replays.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-4xl mb-4">🎥</p>
          <p className="text-gray-400 text-lg">Aucun replay disponible</p>
          <p className="text-gray-400 text-sm mt-1">
            Les replays des sessions apparaitront ici.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {replays.map(replay => {
            const youtubeId = getYoutubeId(replay.replayUrl)
            return (
              <div
                key={replay.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {replay.titre}
                    </h3>
                    <p className="text-sm text-purple-600 font-medium mt-1">
                      {replay.intervenante}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(replay.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })} · {replay.duree} min
                    </p>
                  </div>
                  {role === 'ADMIN' && (
  <button
    onClick={() => supprimerReplay(replay.id)}
    className="text-xs text-red-400 hover:text-red-600 hover:underline transition"
  >
    Supprimer
  </button>
)}
                </div>
                {youtubeId ? (
                  <div className="rounded-xl overflow-hidden aspect-video shadow-sm">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      title={replay.titre}
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <a
                    href={replay.replayUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-700 text-sm hover:underline"
                  >
                    Voir le replay →
                  </a>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}