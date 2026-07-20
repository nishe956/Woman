import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { Calendar, Video, HeartHandshake, Sparkles, ArrowRight } from 'lucide-react'

export default async function HomePage() {
  const { userId } = await auth()

  return (
    <div className="min-h-screen bg-slate-50/50">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-purple-100/50 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-200">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-base font-bold tracking-tight text-slate-900">
            Women Empowerment <span className="text-purple-600">BIT</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          {userId ? (
            <Link
              href="/agenda"
              className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-md shadow-purple-100 hover:shadow-lg transition-all duration-300 flex items-center gap-1.5"
            >
              Accéder à la plateforme
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-semibold text-slate-600 hover:text-purple-700 transition-colors duration-200"
              >
                Connexion
              </Link>
              <Link
                href="/sign-up"
                className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-purple-100 hover:shadow-lg transition-all duration-300"
              >
                Rejoindre
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden">
        {/* Background Image Container */}
        <div
          className="w-full h-[640px] bg-cover bg-center relative flex items-center"
          style={{
            backgroundImage: "url('/session.png')",
          }}
        >
          {/* Overlay Gradient for a professional, chic dark purple aesthetic */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-950/90 via-purple-900/80 to-indigo-950/70" />

          {/* Hero Content */}
          <div className="relative z-10 max-w-5xl mx-auto px-8 w-full">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider font-semibold backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                Women in Tech — BIT
              </span>
              <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight font-serif tracking-tight">
                Rejoins nos sessions
                <br />
                <span className="bg-gradient-to-r from-purple-200 via-pink-200 to-white bg-clip-text text-transparent">
                  Women Empowerment
                </span>
              </h2>
              <p className="text-purple-100/90 mt-6 text-lg md:text-xl max-w-xl leading-relaxed font-light">
                Un espace inspirant pour apprendre, partager et grandir ensemble.
                Des sessions hebdomadaires chaque mercredi, accompagnées de mentors dévouées et d'une communauté soudée.
              </p>
              <div className="flex flex-wrap gap-4 mt-10">
                <Link
                  href="/sign-up"
                  className="bg-white hover:bg-slate-55 text-purple-900 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  Rejoindre maintenant
                </Link>
                <Link
                  href="/sign-in"
                  className="border border-white/30 hover:border-white text-white font-semibold px-8 py-4 rounded-xl backdrop-blur-sm hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Se connecter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-24 px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 font-serif">
            Tout ce dont tu as besoin pour exceller
          </h3>
          <p className="text-slate-500 mt-3 text-base">
            Une plateforme conçue pour propulser ta carrière dans la technologie grâce au soutien collectif.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl border border-purple-100/50 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors duration-300">
              <Calendar className="w-6 h-6 text-purple-700 group-hover:text-white transition-colors duration-300" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-3 font-sans">
              Sessions en direct
            </h4>
            <p className="text-slate-500 leading-relaxed text-sm">
              Participe à nos sessions interactives chaque mercredi avec des intervenantes d'exception et leaders de l'industrie technologique.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl border border-purple-100/50 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors duration-300">
              <Video className="w-6 h-6 text-purple-700 group-hover:text-white transition-colors duration-300" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-3 font-sans">
              Replays disponibles
            </h4>
            <p className="text-slate-500 leading-relaxed text-sm">
              Ne manque aucun apprentissage. Accède librement aux enregistrements de toutes nos sessions passées à tout moment.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl border border-purple-100/50 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors duration-300">
              <HeartHandshake className="w-6 h-6 text-purple-700 group-hover:text-white transition-colors duration-300" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-3 font-sans">
              Mentorat & Réseau
            </h4>
            <p className="text-slate-500 leading-relaxed text-sm">
              Trouve un mentor guidant ou propose ton aide en tant que mentor. Développe ton réseau professionnel au sein de ta communauté.
            </p>
          </div>
        </div>
      </div>

      {/* CTA final */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-850 to-indigo-900 py-20 px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif">
            Prête à rejoindre la communauté ?
          </h3>
          <p className="text-purple-200/90 mb-10 text-base md:text-lg max-w-xl mx-auto font-light">
            Des dizaines d'étudiantes passionnées de BIT t'attendent déjà pour partager cette aventure.
          </p>
          <Link
            href="/sign-up"
            className="bg-white hover:bg-slate-50 text-purple-900 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 inline-block hover:-translate-y-0.5"
          >
            Créer mon compte gratuitement
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-8 text-center border-t border-purple-100/50 bg-white">
        <p className="text-sm text-slate-400">
          © 2026 Women Empowerment BIT — Burkina Institute of Technology. Tous droits réservés.
        </p>
      </footer>

    </div>
  )
}