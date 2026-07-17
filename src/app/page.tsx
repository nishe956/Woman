import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'

export default async function HomePage() {
  const { userId } = await auth()

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <h1 className="text-lg font-bold text-purple-700">
          Women Empowerment BIT
        </h1>
        <div className="flex gap-4">
          {userId ? (
            <Link
              href="/agenda"
              className="bg-purple-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-800 transition"
            >
              Acceder a la plateforme
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm text-gray-600 hover:text-purple-700 transition"
              >
                Connexion
              </Link>
              <Link
                href="/sign-up"
                className="bg-purple-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-800 transition"
              >
                Rejoindre
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="relative">
        {/* Image de fond */}
        <div
          className="w-full h-[600px] bg-cover bg-center relative"
          style={{
            backgroundImage: "url('/session.png')",
          }}
        >
          {/* Overlay violet */}
          <div className="absolute inset-0 bg-purple-900 opacity-60" />

          {/* Contenu hero */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8">
            <span className="bg-purple-500 text-white text-xs px-4 py-1 rounded-full mb-6 uppercase tracking-widest">
              Women in Tech — BIT
            </span>
            <h2 className="text-5xl font-bold text-white leading-tight max-w-3xl">
              Rejoins nos sessions
              <br />
              Women Empowerment
            </h2>
            <p className="text-purple-200 mt-6 text-lg max-w-xl">
              Un espace pour apprendre, partager et grandir ensemble.
              Des sessions every wednesday, des mentors, une communaute.
            </p>
            <div className="flex gap-4 mt-10">
              <Link
                href="/sign-up"
                className="bg-white text-purple-700 font-semibold px-8 py-3 rounded-xl hover:bg-purple-50 transition"
              >
                Rejoindre maintenant
              </Link>
              <Link
                href="/sign-in"
                className="border border-white text-white px-8 py-3 rounded-xl hover:bg-white hover:text-purple-700 transition"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 px-8 max-w-5xl mx-auto">
        <h3 className="text-3xl font-bold text-gray-800 text-center mb-4">
          Tout ce dont tu as besoin
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-purple-50 rounded-2xl p-6">
            <div className="w-12 h-12 bg-purple-700 rounded-xl flex items-center justify-center mb-4">
              <span className="text-white text-xl">📅</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Sessions en direct
            </h4>
            <p className="text-sm text-gray-500">
              Participe aux sessions du mercredi avec des intervenantes inspirantes du monde tech.
            </p>
          </div>
          <div className="bg-purple-50 rounded-2xl p-6">
            <div className="w-12 h-12 bg-purple-700 rounded-xl flex items-center justify-center mb-4">
              <span className="text-white text-xl">🎥</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Replays disponibles
            </h4>
            <p className="text-sm text-gray-500">
              Rate pas une session — acces aux replays de toutes les sessions passees.
            </p>
          </div>
          <div className="bg-purple-50 rounded-2xl p-6">
            <div className="w-12 h-12 bg-purple-700 rounded-xl flex items-center justify-center mb-4">
              <span className="text-white text-xl">🤝</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Mentorat
            </h4>
            <p className="text-sm text-gray-500">
              Trouve un mentor ou deviens mentor. Grandis avec le soutien de ta communaute.
            </p>
          </div>
        </div>
      </div>

      {/* CTA final */}
      <div className="bg-purple-700 py-16 px-8 text-center">
        <h3 className="text-3xl font-bold text-white mb-4">
          Prete a rejoindre la communaute ?
        </h3>
        <p className="text-purple-200 mb-8">
          Des centaines d'etudiantes de BIT t'attendent deja.
        </p>
        <Link
          href="/sign-up"
          className="bg-white text-purple-700 font-semibold px-8 py-3 rounded-xl hover:bg-purple-50 transition"
        >
          Creer mon compte gratuitement
        </Link>
      </div>

      {/* Footer */}
      <footer className="py-8 px-8 text-center border-t border-gray-100">
        <p className="text-sm text-gray-400">
          © 2026 Women Empowerment BIT — Burkina Institute of Technology
        </p>
      </footer>

    </div>
  )
}