import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-neutral-800 mb-6">
              Bienvenue au{" "}
              <span className="text-primary-500">Restaurant Sénégalais</span>
            </h1>
            <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
              Découvrez les saveurs authentiques du Sénégal avec notre fast food et
              notre menu du jour préparé avec amour et passion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/order">
                <Button size="lg" className="w-full sm:w-auto">
                  Commander Maintenant
                </Button>
              </Link>
              <Link href="/menu">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Voir le Menu
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fast Food */}
            <div className="bg-neutral-50 rounded-xl p-8 card-hover border border-neutral-100">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <span className="text-3xl">🍔</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-800 mb-3">
                Fast Food
              </h3>
              <p className="text-neutral-600 mb-4">
                Burgers, sandwichs, poulet frit et bien plus encore. Des plats
                délicieux prêts en quelques minutes.
              </p>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 text-primary-500 font-semibold hover:text-primary-600 hover:gap-3 transition-all"
              >
                Voir le menu 
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Daily Menu */}
            <div className="bg-neutral-50 rounded-xl p-8 card-hover border border-neutral-100">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <span className="text-3xl">🍲</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-800 mb-3">
                Menu du Jour
              </h3>
              <p className="text-neutral-600 mb-4">
                Plats traditionnels sénégalais changés quotidiennement. Thiéboudienne,
                Yassa, Mafé et plus.
              </p>
              <Link
                href="/daily-menu"
                className="inline-flex items-center gap-2 text-secondary-500 font-semibold hover:text-secondary-600 hover:gap-3 transition-all"
              >
                Voir aujourd'hui
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Delivery */}
            <div className="bg-neutral-50 rounded-xl p-8 card-hover border border-neutral-100">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <span className="text-3xl">🚴</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-800 mb-3">
                Livraison Rapide
              </h3>
              <p className="text-neutral-600 mb-4">
                Commandez en ligne et recevez votre repas rapidement. Livraison ou
                emporter.
              </p>
              <Link
                href="/order"
                className="inline-flex items-center gap-2 text-accent-500 font-semibold hover:text-accent-600 hover:gap-3 transition-all"
              >
                Commander
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Prêt à goûter le Sénégal ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Commandez maintenant et découvrez nos spécialités authentiques
          </p>
          <Link href="/order">
            <Button
              variant="outline"
              size="lg"
              className="bg-white text-primary-500 border-white hover:bg-neutral-50"
            >
              Commander Maintenant
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
