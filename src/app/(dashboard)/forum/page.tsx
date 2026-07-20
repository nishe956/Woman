'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { MessageSquare, Send, CornerDownRight, MessageCircle, HelpCircle, AlertCircle, Calendar, MessageSquarePlus, Sparkles } from 'lucide-react'

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
    if (!newQuestion.trim()) {
      toast.error('La question ne peut pas être vide')
      return
    }
    await fetch('/api/forum', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contenu: newQuestion }),
    })
    setNewQuestion('')
    fetchQuestions()
    toast.success('Question publiée avec succès !')
  }

  async function envoyerReponse(questionId: string) {
    const contenu = reponseMap[questionId]
    if (!contenu?.trim()) {
      toast.error('La réponse ne peut pas être vide')
      return
    }
    await fetch('/api/forum/reponses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contenu, questionId }),
    })
    setReponseMap({ ...reponseMap, [questionId]: '' })
    fetchQuestions()
    toast.success('Réponse publiée !')
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-purple-100/40">
        <div>
          <h2 className="text-2xl font-bold font-serif text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-purple-600" />
            Forum de Discussion
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Pose tes questions et partage ton expérience avec la communauté.
          </p>
        </div>
        <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold border border-purple-100/50">
          {questions.length} question{questions.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Ask a Question Card */}
      <div className="bg-white rounded-2xl border border-purple-100/50 p-6 mb-8 shadow-sm hover:shadow-md transition-all duration-300">
        <h3 className="text-sm font-bold text-slate-800 mb-3.5 flex items-center gap-2">
          <MessageSquarePlus className="w-4 h-4 text-purple-600" />
          Poser une question à la communauté
        </h3>
        <textarea
          placeholder="Qu'aimerais-tu savoir aujourd'hui ? (Ex: des conseils sur un framework, des opportunités, du mentorat...)"
          value={newQuestion}
          onChange={e => setNewQuestion(e.target.value)}
          className="border border-slate-200 focus:border-purple-400 rounded-xl px-4 py-3 text-sm w-full outline-none transition-all duration-200 bg-slate-50 focus:bg-white resize-none"
          rows={3}
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={poserQuestion}
            className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-purple-100 hover:shadow-lg transition-all duration-300 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Publier
          </button>
        </div>
      </div>

      {/* Questions list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-100" />
                <div className="h-4 bg-slate-100 rounded w-1/3" />
              </div>
              <div className="h-5 bg-slate-100 rounded-lg w-full" />
              <div className="h-4 bg-slate-100 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-purple-100/40 p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-purple-400" />
          </div>
          <p className="text-slate-655 text-lg font-bold">Aucune question posée</p>
          <p className="text-slate-400 text-sm mt-1">
            Sois la première à lancer la discussion en posant une question !
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {questions.map(question => (
            <div
              key={question.id}
              className="bg-white rounded-2xl border border-purple-100/30 p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100">
                    <HelpCircle className="w-5 h-5 text-purple-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-800 font-semibold leading-relaxed text-sm md:text-base">
                      {question.contenu}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(question.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                        })}
                      </span>
                      <span className="text-slate-200">•</span>
                      <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 border border-purple-100/40">
                        <MessageCircle className="w-3 h-3" />
                        {question.reponses.length} réponse{question.reponses.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setOpenQuestion(openQuestion === question.id ? null : question.id)}
                  className={`text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 shrink-0 ${
                    openQuestion === question.id
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-100/40 shadow-sm'
                  }`}
                >
                  {openQuestion === question.id ? 'Masquer' : 'Répondre'}
                </button>
              </div>

              {/* Collapsible Answers Section */}
              {openQuestion === question.id && (
                <div className="mt-5 border-t border-slate-100 pt-5 space-y-4 animate-in fade-in duration-300">
                  {question.reponses.length > 0 && (
                    <div className="space-y-3">
                      {question.reponses.map(rep => (
                        <div key={rep.id} className="flex items-start gap-3 bg-slate-50/70 border border-slate-100 rounded-xl p-3.5">
                          <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                            <CornerDownRight className="w-4 h-4 text-emerald-700" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-700 leading-relaxed">{rep.contenu}</p>
                            <p className="text-[10px] text-slate-400 mt-2 font-medium">
                              Par <span className="text-slate-500 font-semibold">{rep.auteur}</span> · {new Date(rep.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Reply Input Form */}
                  <div className="flex gap-2">
                    <input
                      placeholder="Partage ton avis ou apporte une réponse..."
                      value={reponseMap[question.id] || ''}
                      onChange={e => setReponseMap({ ...reponseMap, [question.id]: e.target.value })}
                      className="border border-slate-200 focus:border-purple-400 rounded-xl px-4 py-2.5 text-sm flex-1 outline-none transition-all duration-200 bg-slate-50 focus:bg-white"
                      onKeyDown={e => {
                        if (e.key === 'Enter') envoyerReponse(question.id)
                      }}
                    />
                    <button
                      onClick={() => envoyerReponse(question.id)}
                      className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-purple-50 transition-colors flex items-center justify-center shrink-0"
                    >
                      <Send className="w-4 h-4" />
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