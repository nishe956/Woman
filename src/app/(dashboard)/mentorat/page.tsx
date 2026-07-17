'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

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
    toast.success('Demande envoyee !')
    fetchData()
  }

  async function repondreDemanande(mentoratId: string, statut: string) {
    await fetch('/api/mentorat', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mentoratId, statut }),
    })
    toast.success(statut === 'ACCEPTE' ? 'Demande acceptee !' : 'Demande refusee !')
    fetchData()
  }

  if (loading) return (
    <div className="grid gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
          <div className="h-4 bg-gray-100 rounded w-1/2 mb-3" />
          <div className="h-3 bg-gray-100 rounded w-1/4" />
        </div>
      ))}
    </div>
  )

  if (!data) return <p className="text-gray-500">Erreur de chargement</p>

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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Mentorat</h2>
          <p className="text-sm text-gray-400 mt-1">
            Trouve un mentor ou deviens mentor
          </p>
        </div>
      </div>

      {/* Demandes recues */}
      {demandesRecues.length > 0 && (
        <div className="bg-white rounded-xl border border-amber-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="text-sm font-semibold text-gray-700">
              Demandes recues ({demandesRecues.length})
            </h3>
          </div>
          <div className="grid gap-3">
            {demandesRecues.map(m => (
              <div
                key={m.id}
                className="flex items-center justify-between bg-amber-50 rounded-lg p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-amber-700 font-bold text-sm">
                      {m.mentee.prenom[0]}{m.mentee.nom[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {m.mentee.prenom} {m.mentee.nom}
                    </p>
                    <p className="text-xs text-gray-400">{m.mentee.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => repondreDemanande(m.id, 'ACCEPTE')}
                    className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs hover:bg-green-700 transition"
                  >
                    Accepter
                  </button>
                  <button
                    onClick={() => repondreDemanande(m.id, 'REFUSE')}
                    className="bg-red-100 text-red-600 px-4 py-1.5 rounded-lg text-xs hover:bg-red-200 transition"
                  >
                    Refuser
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mes relations */}
      {mesRelations.length > 0 && (
        <div className="bg-white rounded-xl border border-green-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <h3 className="text-sm font-semibold text-gray-700">
              Mes relations de mentorat ({mesRelations.length})
            </h3>
          </div>
          <div className="grid gap-3">
            {mesRelations.map(m => {
              const partenaire = m.mentor.id === user.id ? m.mentee : m.mentor
              const role = m.mentor.id === user.id ? 'Mentee' : 'Mentor'
              return (
                <div
                  key={m.id}
                  className="flex items-center justify-between bg-green-50 rounded-lg p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-700 font-bold text-sm">
                        {partenaire.prenom[0]}{partenaire.nom[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {partenaire.prenom} {partenaire.nom}
                      </p>
                      <p className="text-xs text-gray-400">{partenaire.email}</p>
                      {partenaire.bio && (
                        <p className="text-xs text-gray-500 mt-1 italic">
                          {partenaire.bio}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                    {role}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Demandes envoyees */}
      {demandesEnvoyees.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-gray-400" />
            <h3 className="text-sm font-semibold text-gray-700">
              Demandes envoyees ({demandesEnvoyees.length})
            </h3>
          </div>
          <div className="grid gap-3">
            {demandesEnvoyees.map(m => (
              <div
                key={m.id}
                className="flex items-center justify-between bg-gray-50 rounded-lg p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-600 font-bold text-sm">
                      {m.mentor.prenom[0]}{m.mentor.nom[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {m.mentor.prenom} {m.mentor.nom}
                    </p>
                    <p className="text-xs text-gray-400">{m.mentor.email}</p>
                  </div>
                </div>
                <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium">
                  En attente
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trouver un mentor */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Trouver un mentor
        </h3>
        {usersDisponibles.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-3xl mb-2">🤝</p>
            <p className="text-sm text-gray-400">
              Aucune personne disponible pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {usersDisponibles.map(u => (
              <div
                key={u.id}
                className="flex items-center justify-between bg-gray-50 rounded-lg p-4 hover:bg-purple-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-700 font-bold text-sm">
                      {u.prenom[0]}{u.nom[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {u.prenom} {u.nom}
                    </p>
                    <p className="text-xs text-gray-400">
                      {u.bio || 'Aucune bio'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => demanderMentorat(u.id)}
                  className="bg-purple-700 text-white px-4 py-1.5 rounded-lg text-xs hover:bg-purple-800 transition"
                >
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