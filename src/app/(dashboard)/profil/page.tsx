'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { User, Calendar, MessageSquare, HeartHandshake, Edit3, Check, Sparkles, AlertCircle } from 'lucide-react'

interface Session {
  id: string
  titre: string
  date: string
}

interface Inscription {
  id: string
  session: Session
}

interface UserProfile {
  id: string
  nom: string
  prenom: string
  email: string
  bio: string | null
  role: string
  inscriptions: Inscription[]
}

export default function ProfilPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editBio, setEditBio] = useState(false)
  const [bio, setBio] = useState('')

  useEffect(() => {
    fetchProfil()
  }, [])

  function fetchProfil() {
    setLoading(true)
    fetch('/api/profil')
      .then(res => res.json())
      .then(data => {
        setUser(data)
        setBio(data.bio || '')
        setLoading(false)
      })
  }

  async function sauvegarderBio() {
    await fetch('/api/profil', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bio }),
    })
    setEditBio(false)
    fetchProfil()
    toast.success('Votre bio a été mise à jour !')
  }

  if (loading) return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-slate-100" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-100 rounded w-1/3" />
            <div className="h-3 bg-slate-100 rounded w-1/2" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-100 rounded w-full" />
          <div className="h-4 bg-slate-100 rounded w-3/4" />
        </div>
      </div>
    </div>
  )

  if (!user) return <p className="text-red-500 font-semibold">Utilisateur introuvable</p>

  const initiales = `${user.prenom[0]}${user.nom[0]}`.toUpperCase()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-purple-100/40">
        <h2 className="text-2xl font-bold font-serif text-slate-900 tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-purple-600" />
          Mon Profil
        </h2>
      </div>

      {/* Profil Card */}
      <div className="bg-white rounded-2xl border border-purple-100/50 p-6 shadow-sm hover:shadow-md transition-all duration-300">
        
        {/* Header Profile */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-650 flex items-center justify-center shadow-md text-white text-2xl font-bold font-serif">
            {initiales}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              {user.prenom} {user.nom}
            </h3>
            <p className="text-xs text-slate-400 mt-1">{user.email}</p>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full mt-2.5 inline-block font-bold uppercase tracking-wider ${
              user.role === 'ADMIN'
                ? 'bg-amber-50 text-amber-700 border border-amber-100'
                : 'bg-purple-50 text-purple-700 border border-purple-100/50'
            }`}>
              {user.role}
            </span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="text-center bg-slate-50/50 border border-slate-100 rounded-xl p-3">
            <div className="flex justify-center mb-1">
              <Calendar className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-xl font-bold text-slate-900 leading-none">
              {user.inscriptions.length}
            </p>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1.5">Sessions</p>
          </div>
          <div className="text-center bg-slate-50/50 border border-slate-100 rounded-xl p-3">
            <div className="flex justify-center mb-1">
              <MessageSquare className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-xl font-bold text-slate-900 leading-none">
              0
            </p>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1.5">Questions</p>
          </div>
          <div className="text-center bg-slate-50/50 border border-slate-100 rounded-xl p-3">
            <div className="flex justify-center mb-1">
              <HeartHandshake className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-xl font-bold text-slate-900 leading-none">
              0
            </p>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1.5">Mentorats</p>
          </div>
        </div>

        {/* Bio Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              Ma Biographie
            </h4>
            <button
              onClick={() => setEditBio(!editBio)}
              className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              {editBio ? 'Annuler' : 'Modifier'}
            </button>
          </div>
          {editBio ? (
            <div className="space-y-3">
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="border border-slate-200 focus:border-purple-400 rounded-xl px-4 py-3 text-sm w-full outline-none transition-all duration-200 bg-slate-50 focus:bg-white resize-none"
                rows={3}
                placeholder="Parle-nous de ton parcours, de tes passions tech et de ce que tu recherches..."
              />
              <div className="flex justify-end">
                <button
                  onClick={sauvegarderBio}
                  className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-purple-50 transition-all flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  Sauvegarder
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-600 leading-relaxed italic bg-slate-50/50 p-4 border border-slate-100 rounded-xl">
              {user.bio || 'Aucune biographie pour le moment. Clique sur Modifier pour te présenter à la communauté !'}
            </p>
          )}
        </div>
      </div>

      {/* Registered Sessions Card */}
      <div className="bg-white rounded-2xl border border-purple-100/50 p-6 shadow-sm">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-500" />
          Mes sessions enregistrées
        </h4>
        {user.inscriptions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-slate-450 text-sm">
              Tu ne t'es inscrite à aucune session pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {user.inscriptions.map(inscription => {
              const isPast = new Date(inscription.session.date) < new Date()
              return (
                <div
                  key={inscription.id}
                  className="flex items-center justify-between bg-slate-50/50 hover:bg-purple-50/30 border border-slate-100 hover:border-purple-100/50 rounded-xl p-3.5 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${isPast ? 'bg-slate-350' : 'bg-emerald-500 animate-pulse'}`} />
                    <p className="text-sm font-bold text-slate-800">
                      {inscription.session.titre}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold shrink-0">
                    {new Date(inscription.session.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}