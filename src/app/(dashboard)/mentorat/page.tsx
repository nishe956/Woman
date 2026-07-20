'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { HeartHandshake, UserCheck, UserPlus, Clock, Check, X, Search, Sparkles, Inbox, Users } from 'lucide-react'

interface User {
  id: string
  nom: string
  prenom: string
  email: string
  bio: string | null
  role: string
}

interface Mentorat {
  id: string
  statut: string
  mentor: User
  mentee: User
}

interface Data {
  user: User
  mentorals: Mentorat[]
  tousLesUsers: User[]
}

export default function MentoratPage() {
  const [data, setData] = useState<Data | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  function fetchData() {
    setLoading(true)
    fetch('/api/mentorat')
      .then(res => res.json())
      .then(d => {
        setData(d)
        setLoading(false)
      })
  }

  async function demanderMentorat(mentorId: string) {
    await fetch('/api/mentorat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mentorId }),
    })
    toast.success('Demande de mentorat envoyée !')
    fetchData()
  }

  async function repondreDemanande(mentoratId: string, statut: string) {
    await fetch('/api/mentorat', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mentoratId, statut }),
    })
    toast.success(statut === 'ACCEPTE' ? 'Demande acceptée !' : 'Demande refusée !')
    fetchData()
  }

  if (loading) return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
          <div className="h-4 bg-slate-100 rounded w-1/2 mb-3" />
          <div className="h-3 bg-slate-100 rounded w-1/4" />
        </div>
      ))}
    </div>
  )

  if (!data) return <p className="text-red-500 font-semibold">Erreur de chargement du profil</p>

  const { user, mentorals, tousLesUsers } = data

  const demandesRecues = mentorals.filter(
    m => m.mentor.id === user.id && m.statut === 'EN_ATTENTE'
  )
  const mesRelations = mentorals.filter(m => m.statut === 'ACCEPTE')
  const demandesEnvoyees = mentorals.filter(
    m => m.mentee.id === user.id && m.statut === 'EN_ATTENTE'
  )
  const usersDisponibles = tousLesUsers.filter(u => {
    const dejaEnRelation = mentorals.some(
      m => (m.mentor.id === u.id || m.mentee.id === u.id) && m.statut !== 'REFUSE'
    )
    return !dejaEnRelation
  })

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-purple-100/40">
        <div>
          <h2 className="text-2xl font-bold font-serif text-slate-900 tracking-tight flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-purple-600" />
            Programme de Mentorat
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Développe tes compétences grâce au mentorat individuel au sein de BIT.
          </p>
        </div>
      </div>

      {/* Demandes reçues */}
      {demandesRecues.length > 0 && (
        <div className="bg-amber-50/50 border border-amber-250/40 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Inbox className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-amber-800">
              Demandes de mentorat reçues ({demandesRecues.length})
            </h3>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse ml-1" />
          </div>
          <div className="grid gap-3">
            {demandesRecues.map(m => (
              <div
                key={m.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-amber-100 rounded-xl p-4 gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-sm text-white font-bold text-sm shrink-0">
                    {m.mentee.prenom[0]}{m.mentee.nom[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {m.mentee.prenom} {m.mentee.nom}
                    </p>
                    <p className="text-xs text-slate-400">{m.mentee.email}</p>
                  </div>
                </div>
                <div className="flex gap-2 self-end sm:self-center">
                  <button
                    onClick={() => repondreDemanande(m.id, 'ACCEPTE')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-50 transition flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Accepter
                  </button>
                  <button
                    onClick={() => repondreDemanande(m.id, 'REFUSE')}
                    className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    Refuser
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mes relations actives */}
      {mesRelations.length > 0 && (
        <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-emerald-800">
              Mes relations de mentorat actives ({mesRelations.length})
            </h3>
          </div>
          <div className="grid gap-3">
            {mesRelations.map(m => {
              const partenaire = m.mentor.id === user.id ? m.mentee : m.mentor
              const roleLabel = m.mentor.id === user.id ? 'Filleule (Mentee)' : 'Mentor'
              return (
                <div
                  key={m.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-emerald-100/50 rounded-xl p-4 gap-4"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-450 to-emerald-600 flex items-center justify-center shadow-sm text-white font-bold text-sm shrink-0">
                      {partenaire.prenom[0]}{partenaire.nom[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-800">
                          {partenaire.prenom} {partenaire.nom}
                        </p>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          {roleLabel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{partenaire.email}</p>
                      {partenaire.bio && (
                        <p className="text-xs text-slate-500 mt-1.5 italic border-l-2 border-emerald-200 pl-2">
                          "{partenaire.bio}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Demandes envoyées */}
      {demandesEnvoyees.length > 0 && (
        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-700">
              Demandes envoyées en attente ({demandesEnvoyees.length})
            </h3>
          </div>
          <div className="grid gap-3">
            {demandesEnvoyees.map(m => (
              <div
                key={m.id}
                className="flex items-center justify-between bg-white border border-slate-100 rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm shrink-0">
                    {m.mentor.prenom[0]}{m.mentor.nom[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {m.mentor.prenom} {m.mentor.nom}
                    </p>
                    <p className="text-xs text-slate-400">{m.mentor.email}</p>
                  </div>
                </div>
                <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  En attente
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trouver un mentor */}
      <div className="bg-white rounded-2xl border border-purple-100/50 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Search className="w-4 h-4 text-purple-600" />
          Membres disponibles pour le mentorat
        </h3>
        
        {usersDisponibles.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-slate-500 text-sm">
              Aucun nouveau membre disponible pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {usersDisponibles.map(u => (
              <div
                key={u.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50/50 hover:bg-purple-50/30 border border-slate-100 rounded-xl p-4 hover:border-purple-100/50 transition-all duration-300 gap-4"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-650 flex items-center justify-center shadow-sm text-white font-bold text-sm shrink-0">
                    {u.prenom[0]}{u.nom[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {u.prenom} {u.nom}
                    </p>
                    <p className="text-xs text-slate-400">
                      {u.bio || 'Aucune description disponible.'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => demanderMentorat(u.id)}
                  className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-purple-50 hover:shadow-lg transition-all duration-300 flex items-center gap-1 shrink-0 self-end sm:self-center"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Demander
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}