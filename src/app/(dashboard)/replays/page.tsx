'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Tv, PlayCircle, Plus, Trash2, ExternalLink, Calendar, Clock, Sparkles, AlertCircle } from 'lucide-react'

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
    if (!form.sessionId || !form.replayUrl) {
      toast.error('Veuillez remplir tous les champs')
      return
    }
    await fetch('/api/replays', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setShowForm(false)
    setForm({ sessionId: '', replayUrl: '' })
    fetchReplays()
    toast.success('Replay ajouté avec succès !')
  }

  async function supprimerReplay(sessionId: string) {
    if (!confirm('Voulez-vous vraiment supprimer ce replay ?')) return
    await fetch('/api/replays', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
    fetchReplays()
    toast.success('Replay supprimé !')
  }

  function getYoutubeId(url: string) {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    )
    return match ? match[1] : null
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-purple-100/40">
        <div>
          <h2 className="text-2xl font-bold font-serif text-slate-900 tracking-tight flex items-center gap-2">
            <Tv className="w-6 h-6 text-purple-600" />
            Vidéothèque Replays
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {replays.length} replay{replays.length > 1 ? 's' : ''} accessible{replays.length > 1 ? 's' : ''} à tout moment.
          </p>
        </div>
        {role === 'ADMIN' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-purple-100 hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter un replay
          </button>
        )}
      </div>

      {/* Admin Form Card */}
      {role === 'ADMIN' && showForm && (
        <div className="bg-white rounded-2xl border border-purple-100/50 p-6 mb-8 shadow-md shadow-purple-50/50 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-bold text-slate-955 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Ajouter le replay d'une session
          </h3>
          <div className="grid gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Session concernée</label>
              <select
                value={form.sessionId}
                onChange={e => setForm({ ...form, sessionId: e.target.value })}
                className="border border-slate-200 focus:border-purple-400 rounded-xl px-4 py-2.5 text-sm w-full outline-none transition-all duration-200 bg-slate-50 focus:bg-white"
              >
                <option value="">Choisir une session dans la liste...</option>
                {sessions.map(s => (
                  <option key={s.id} value={s.id}>{s.titre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">URL YouTube de la vidéo</label>
              <input
                placeholder="Ex: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                value={form.replayUrl}
                onChange={e => setForm({ ...form, replayUrl: e.target.value })}
                className="border border-slate-200 focus:border-purple-400 rounded-xl px-4 py-2.5 text-sm w-full outline-none transition-all duration-200 bg-slate-50 focus:bg-white"
              />
            </div>
            <div className="flex gap-3 justify-end mt-2">
              <button
                onClick={() => setShowForm(false)}
                className="border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={ajouterReplay}
                className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-purple-100 hover:shadow-lg transition-all duration-300"
              >
                Associer le replay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Replays list content */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-2/3 mb-3" />
              <div className="h-4 bg-slate-100 rounded w-1/3 mb-4" />
              <div className="h-48 bg-slate-100 rounded-xl w-full" />
            </div>
          ))}
        </div>
      ) : replays.length === 0 ? (
        <div className="bg-white rounded-2xl border border-purple-100/40 p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tv className="w-8 h-8 text-purple-400 animate-pulse" />
          </div>
          <p className="text-slate-655 text-lg font-bold">Aucun replay disponible</p>
          <p className="text-slate-400 text-sm mt-1">
            Les replays des sessions passées apparaîtront ici dès qu'ils seront en ligne.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {replays.map(replay => {
            const youtubeId = getYoutubeId(replay.replayUrl)
            return (
              <div
                key={replay.id}
                className="bg-white rounded-2xl border border-purple-100/40 p-5 hover:shadow-md transition-all duration-350 flex flex-col group relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-800 line-clamp-1 group-hover:text-purple-700 transition-colors">
                      {replay.titre}
                    </h3>
                    <p className="text-xs text-purple-700 font-semibold mt-1">
                      {replay.intervenante}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(replay.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {replay.duree} min
                      </span>
                    </div>
                  </div>
                  {role === 'ADMIN' && (
                    <button
                      onClick={() => supprimerReplay(replay.id)}
                      className="text-slate-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-all"
                      title="Supprimer le replay"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {youtubeId ? (
                  <div className="rounded-xl overflow-hidden aspect-video shadow-sm border border-slate-100 relative bg-slate-900 group/video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                      title={replay.titre}
                      allowFullScreen
                      className="border-none"
                    />
                  </div>
                ) : (
                  <div className="mt-auto pt-4 border-t border-slate-50 flex justify-end">
                    <a
                      href={replay.replayUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-700 text-xs font-bold hover:text-purple-800 transition-colors flex items-center gap-1.5"
                    >
                      Voir la vidéo
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}