'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface Session {
  id: string
  titre: string
  date: string
}

interface Inscription {
  id: string
  session: Session
}

interface User {
  id: string
  nom: string
  prenom: string
  email: string
  bio: string | null
  role: string
  inscriptions: Inscription[]
}

export default function ProfilPage() {
  const [user, setUser] = useState<User | null>(null)
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
    toast.success('Bio mise a jour !')
  }

  if (loading) return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6 animate-pulse">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-100" />
          <div>
            <div className="h-4 bg-gray-100 rounded w-32 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-48" />
          </div>
        </div>
      </div>
    </div>
  )

  if (!user) return <p className="text-gray-500">Utilisateur introuvable</p>

  const initiales = `${user.prenom[0]}${user.nom[0]}`.toUpperCase()

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Mon Profil</h2>

      {/* Carte profil */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 hover:shadow-sm transition">
        
        {/* Header profil */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-700 flex items-center justify-center shadow-md">
            <span className="text-2xl font-bold text-white">
              {initiales}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {user.prenom} {user.nom}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
            <span className={`text-xs px-3 py-1 rounded-full mt-2 inline-block font-medium ${
              user.role === 'ADMIN'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-purple-100 text-purple-700'
            }`}>
              {user.role}
            </span>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-700">
              {user.inscriptions.length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Sessions</p>
          </div>
          <div className="text-center border-x border-gray-100">
            <p className="text-2xl font-bold text-purple-700">0</p>
            <p className="text-xs text-gray-400 mt-1">Questions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-700">0</p>
            <p className="text-xs text-gray-400 mt-1">Mentorals</p>
          </div>
        </div>

        {/* Bio */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-700">Bio</h4>
            <button
              onClick={() => setEditBio(!editBio)}
              className="text-xs text-purple-700 hover:underline"
            >
              {editBio ? 'Annuler' : 'Modifier'}
            </button>
          </div>
          {editBio ? (
            <div>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm w-full focus:outline-none focus:border-purple-300 transition"
                rows={3}
                placeholder="Parle-nous de toi..."
              />
              <button
                onClick={sauvegarderBio}
                className="mt-2 bg-purple-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-800 transition"
              >
                Sauvegarder
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-600 leading-relaxed">
              {user.bio || 'Aucune bio pour le moment — clique sur Modifier pour en ajouter une !'}
            </p>
          )}
        </div>
      </div>

      {/* Sessions inscrites */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">
          Mes sessions inscrites
        </h4>
        {user.inscriptions.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-3xl mb-2">📅</p>
            <p className="text-sm text-gray-400">
              Tu n'es inscrite a aucune session pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {user.inscriptions.map(inscription => {
              const isPast = new Date(inscription.session.date) < new Date()
              return (
                <div
                  key={inscription.id}
                  className="flex items-center justify-between bg-gray-50 rounded-lg p-3 hover:bg-purple-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${isPast ? 'bg-gray-300' : 'bg-green-500'}`} />
                    <p className="text-sm text-gray-700 font-medium">
                      {inscription.session.titre}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
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