'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface Reponse {
  id: string
  contenu: string
  auteur: string
  createdAt: string
}

interface Question {
  id: string
  contenu: string
  createdAt: string
  reponses: Reponse[]
}

export default function ForumPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [newQuestion, setNewQuestion] = useState('')
  const [reponseMap, setReponseMap] = useState<Record<string, string>>({})
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)

  useEffect(() => {
    fetchQuestions()
  }, [])

  function fetchQuestions() {
    setLoading(true)
    fetch('/api/forum')
      .then(res => res.json())
      .then(data => {
        setQuestions(data)
        setLoading(false)
      })
  }

  async function poserQuestion() {
    if (!newQuestion.trim()) return
    await fetch('/api/forum', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contenu: newQuestion }),
    })
    setNewQuestion('')
    fetchQuestions()
    toast.success('Question envoyee !')
  }

  async function envoyerReponse(questionId: string) {
    const contenu = reponseMap[questionId]
    if (!contenu?.trim()) return
    await fetch('/api/forum/reponses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contenu, questionId }),
    })
    setReponseMap({ ...reponseMap, [questionId]: '' })
    fetchQuestions()
    toast.success('Reponse envoyee !')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Forum Q&A</h2>
        <span className="text-sm text-gray-400">
          {questions.length} question(s)
        </span>
      </div>

      {/* Poser une question */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 hover:shadow-sm transition">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Poser une question
        </h3>
        <textarea
          placeholder="Ta question pour la communaute..."
          value={newQuestion}
          onChange={e => setNewQuestion(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-3 text-sm w-full focus:outline-none focus:border-purple-300 transition"
          rows={3}
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={poserQuestion}
            className="bg-purple-700 text-white px-6 py-2 rounded-lg text-sm hover:bg-purple-800 transition"
          >
            Envoyer
          </button>
        </div>
      </div>

      {/* Liste des questions */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-4xl mb-4">💬</p>
          <p className="text-gray-400 text-lg">Aucune question pour le moment</p>
          <p className="text-gray-400 text-sm mt-1">Sois la premiere a poser une question !</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {questions.map(question => (
            <div
              key={question.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <span className="text-purple-700 text-sm font-bold">Q</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{question.contenu}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <p className="text-xs text-gray-400">
                        {new Date(question.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                        })}
                      </p>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
                        {question.reponses.length} reponse(s)
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setOpenQuestion(openQuestion === question.id ? null : question.id)}
                  className={`text-sm px-3 py-1 rounded-lg transition ml-4 ${
                    openQuestion === question.id
                      ? 'bg-gray-100 text-gray-600'
                      : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                  }`}
                >
                  {openQuestion === question.id ? 'Fermer' : 'Repondre'}
                </button>
              </div>

              {openQuestion === question.id && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  {question.reponses.length > 0 && (
                    <div className="grid gap-2 mb-4">
                      {question.reponses.map(rep => (
                        <div key={rep.id} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                          <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                            <span className="text-green-700 text-xs font-bold">R</span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-700">{rep.contenu}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {rep.auteur} · {new Date(rep.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      placeholder="Ta reponse..."
                      value={reponseMap[question.id] || ''}
                      onChange={e => setReponseMap({ ...reponseMap, [question.id]: e.target.value })}
                      className="border border-gray-200 rounded-lg px-4 py-2 text-sm flex-1 focus:outline-none focus:border-purple-300 transition"
                    />
                    <button
                      onClick={() => envoyerReponse(question.id)}
                      className="bg-purple-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-800 transition"
                    >
                      Envoyer
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}