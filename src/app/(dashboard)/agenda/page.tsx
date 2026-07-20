'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Calendar, Clock, User, Plus, CheckCircle2, AlertCircle, Video, Sparkles, CalendarDays } from 'lucide-react'

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
    if (!form.titre || !form.intervenante || !form.date) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }
    await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setShowForm(false)
    setForm({ titre: '', description: '', date: '', duree: 60, intervenante: '' })
    fetchSessions()
    toast.success('Session créée avec succès !')
  }

  async function sInscrire(sessionId: string) {
    const res = await fetch('/api/inscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
    if (res.ok) {
      toast.success('Inscription réussie !')
    } else {
      toast.error('Vous êtes déjà inscrite à cette session')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-purple-100/40">
        <div>
          <h2 className="text-2xl font-bold font-serif text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-purple-600" />
            Agenda des Sessions
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Découvre et inscris-toi aux prochaines sessions d'apprentissage.
          </p>
        </div>
        {role === 'ADMIN' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-purple-100 hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouvelle session
          </button>
        )}
      </div>

      {/* Admin Form Card */}
      {role === 'ADMIN' && showForm && (
        <div className="bg-white rounded-2xl border border-purple-100/50 p-6 mb-8 shadow-md shadow-purple-50/50 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-bold text-slate-955 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Créer une session
          </h3>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Titre</label>
                <input
                  placeholder="Ex: Réussir son premier entretien Tech"
                  value={form.titre}
                  onChange={e => setForm({ ...form, titre: e.target.value })}
                  className="border border-slate-200 focus:border-purple-400 rounded-xl px-4 py-2.5 text-sm w-full outline-none transition-all duration-200 bg-slate-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Intervenante</label>
                <input
                  placeholder="Nom & Poste de l'intervenante"
                  value={form.intervenante}
                  onChange={e => setForm({ ...form, intervenante: e.target.value })}
                  className="border border-slate-200 focus:border-purple-400 rounded-xl px-4 py-2.5 text-sm w-full outline-none transition-all duration-200 bg-slate-50 focus:bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
              <textarea
                placeholder="Décrivez les objectifs et les sujets abordés lors de cette session..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="border border-slate-200 focus:border-purple-400 rounded-xl px-4 py-2.5 text-sm w-full outline-none transition-all duration-200 bg-slate-50 focus:bg-white"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Date & Heure</label>
                <input
                  type="datetime-local"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  className="border border-slate-200 focus:border-purple-400 rounded-xl px-4 py-2.5 text-sm w-full outline-none transition-all duration-200 bg-slate-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Durée (minutes)</label>
                <input
                  type="number"
                  placeholder="Duree (min)"
                  value={form.duree}
                  onChange={e => setForm({ ...form, duree: Number(e.target.value) })}
                  className="border border-slate-200 focus:border-purple-400 rounded-xl px-4 py-2.5 text-sm w-full outline-none transition-all duration-200 bg-slate-50 focus:bg-white"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-2 justify-end">
              <button
                onClick={() => setShowForm(false)}
                className="border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={createSession}
                className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-purple-100 hover:shadow-lg transition-all duration-300"
              >
                Créer la session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sessions Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-slate-100 rounded-lg w-1/3" />
                  <div className="h-4 bg-slate-100 rounded-lg w-1/4" />
                  <div className="h-4 bg-slate-100 rounded-lg w-3/4" />
                </div>
                <div className="h-20 w-24 bg-slate-100 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-purple-100/40 p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-purple-400" />
          </div>
          <p className="text-slate-655 text-lg font-bold">Aucune session prévue</p>
          <p className="text-slate-400 text-sm mt-1">
            Les sessions à venir apparaîtront bientôt ici. Restez connectée !
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {sessions.map(session => {
            const isPast = new Date(session.date) < new Date()
            const sessionDate = new Date(session.date)

            return (
              <div
                key={session.id}
                className={`bg-white rounded-2xl border p-6 hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${
                  isPast 
                    ? 'border-slate-100 bg-slate-50/50 opacity-80' 
                    : 'border-purple-100 hover:border-purple-250'
                }`}
              >
                {/* Left accent bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${isPast ? 'bg-slate-300' : 'bg-purple-600'}`} />

                <div className="flex-1 pl-2">
                  <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
                    <h3 className="text-lg font-bold text-slate-800">
                      {session.titre}
                    </h3>
                    {isPast ? (
                      <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Terminée
                      </span>
                    ) : (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        À venir
                      </span>
                    )}
                    {session.replayUrl && (
                      <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        Replay
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-purple-700 font-semibold text-sm mb-3">
                    <User className="w-4 h-4 text-purple-500 shrink-0" />
                    <span>{session.intervenante}</span>
                  </div>

                  <p className="text-slate-550 text-sm leading-relaxed max-w-xl">
                    {session.description}
                  </p>
                </div>

                {/* Right side styling with modern date badge */}
                <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto shrink-0 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0 pl-2 md:pl-0">
                  <div className="flex items-center md:items-end gap-4 md:flex-col mb-0 md:mb-4">
                    {/* Date capsule card */}
                    <div className={`flex flex-col items-center justify-center rounded-xl p-2.5 border w-24 shadow-sm ${
                      isPast 
                        ? 'bg-slate-50/80 border-slate-200' 
                        : 'bg-purple-50/40 border-purple-100/50'
                    }`}>
                      <span className={`text-[10px] uppercase font-bold tracking-wider ${isPast ? 'text-slate-400' : 'text-purple-600'}`}>
                        {sessionDate.toLocaleDateString('fr-FR', { month: 'short' })}
                      </span>
                      <span className={`text-2xl font-black tracking-tight mt-0.5 leading-none ${isPast ? 'text-slate-500' : 'text-purple-900'}`}>
                        {sessionDate.toLocaleDateString('fr-FR', { day: 'numeric' })}
                      </span>
                      <span className="text-[9px] text-slate-400 mt-1 font-semibold">
                        {sessionDate.toLocaleDateString('fr-FR', { year: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex flex-col md:items-end text-left md:text-right">
                      <span className="text-xs text-slate-550 font-semibold flex items-center gap-1 mt-1 justify-start md:justify-end">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {sessionDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5 font-medium">
                        Durée : {session.duree} min
                      </span>
                    </div>
                  </div>

                  {!isPast && (
                    <button
                      onClick={() => sInscrire(session.id)}
                      className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-purple-50 hover:shadow-lg transition-all duration-300 flex items-center gap-1.5 self-end md:self-stretch justify-center"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      S'inscrire
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}