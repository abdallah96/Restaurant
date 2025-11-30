'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useEffect } from 'react';
import { trackPageView } from '@/lib/analytics';

export default function Home() {
  useEffect(() => {
    trackPageView('home');
  }, []);
  
  return (
    <main className="flex-1">
      {/* Hero Section with Unique Asymmetric Design */}
      <section className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-orange-500 py-16 md:py-24 overflow-hidden">
        {/* Organic background shapes */}
        <div className="absolute inset-0 african-pattern opacity-30"></div>
        <div className="absolute top-10 right-20 w-72 h-72 blob-orange opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 blob-green opacity-15 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 blob-green opacity-10" style={{animationDelay: '0.5s'}}></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left Column - Text Content with Asymmetric Design */}
              <div className="animate-fade-in order-2 md:order-1">
                <div className="inline-block mb-4 sticker">
                  <span className="bg-white text-orange-600 px-5 py-2 rounded-2xl text-sm font-bold shadow-xl block">
                    🇸🇳 Authentique 100%
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight text-white-900">
                  Bienvenue chez
                  <span className="block mt-2 handwritten text-6xl md:text-8xl text-white-400 squiggle-underline">
                    Keur Gui
                  </span>
                </h1>
                <div className="relative inline-block mb-6">
                  <p className="text-lg md:text-xl text-white-500 mb-2 font-bold">
                  L'excellence culinaire sénégalaise
                  </p>
                </div>
                <p className="text-base md:text-lg text-gray-900 mb-8 leading-relaxed max-w-lg font-medium bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg">
                  Fast food moderne rencontre tradition sénégalaise. Des saveurs authentiques, des ingrédients frais, et beaucoup d'amour dans chaque plat.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/order">
                    <Button size="lg" className="w-full sm:w-auto bg-white hover:bg-gray-100 text-orange-600 shadow-2xl hover:shadow-xl transform hover:scale-105 border-2 border-orange-500">
                      <span className="flex items-center gap-2 text-orange-500">
                        <span className="text-2xl text-black">🍽️</span>
                        Commander Maintenant
                      </span>
                    </Button>
                  </Link>
                  <Link href="/menu">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white hover:bg-gray-100 border-2 border-gray-900 text-gray-900 hover:text-orange-600 shadow-xl">
                      <span className="flex items-center gap-2">
                        <span className="text-2xl">📖</span>
                        Voir le Menu
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Right Column - Logo with Organic Design */}
              <div className="flex justify-center md:justify-end animate-scale-in order-1 md:order-2">
                <div className="relative">
                  {/* Organic blob behind logo */}
                  <div className="absolute inset-0 blob-orange opacity-30 animate-pulse"></div>
                  <div className="relative bg-white p-8 rounded-3xl shadow-2xl" style={{transform: 'rotate(3deg)'}}>
                    <Image
                      src="/images/logo.svg"
                      alt="Keur Gui Logo"
                      width={280}
                      height={280}
                      className="object-contain drop-shadow-2xl animate-float"
                      priority
                    />
                  </div>
                  {/* Decorative sticker badges */}
                  <div className="absolute -top-4 -right-4 sticker bg-white border-2 border-orange-500 text-orange-600 px-4 py-2 rounded-full text-xs font-bold shadow-xl">
                    Fait avec amour! 💖

                  </div>
                  <div className="absolute -bottom-2 -left-2 sticker bg-white border-2 border-orange-500 text-orange-600 px-4 py-2 rounded-full text-xs font-bold shadow-xl">
                    Délicieux! 🍔
                  </div>
                  <div className="absolute -bottom-2 -left-2 sticker bg-white border-2 border-orange-500 text-orange-600 px-4 py-2 rounded-full text-xs font-bold shadow-xl">
                    Savoureux! 😋
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Organic wavy separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{transform: 'scaleX(-1)'}}>
            <path d="M0,100 Q240,60 360,70 T720,65 Q960,55 1200,75 T1440,60 L1440,100 Z" fill="#fdfcfb" opacity="0.5"/>
            <path d="M0,100 Q180,80 360,85 T720,75 Q960,70 1200,90 T1440,80 L1440,100 Z" fill="#fdfcfb"/>
          </svg>
        </div>
      </section>

      {/* Features Section with Unique Cards */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-sand-50 to-white relative">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 blob-green opacity-5"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 blob-orange opacity-5"></div>
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block handwritten text-orange-600 text-3xl md:text-4xl mb-2">Ce qui nous rend spécial</span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Pourquoi <span className="relative inline-block">
                <span className="gradient-text">Keur Gui</span>
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                  <path d="M0,4 Q50,1 100,4 T200,4" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round"/>
                </svg>
              </span> ?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Trois bonnes raisons de nous faire confiance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Fast Food Card - Tilted */}
            <div className="group bg-white p-6 md:p-8 card-hover border-2 border-orange-100 hover:border-orange-300 transition-all relative overflow-hidden" style={{borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%', transform: 'rotate(-1deg)'}}>
              {/* Torn paper effect at top */}
              <div className="absolute top-0 left-0 right-0 h-3 bg-orange-50"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 blob-green flex items-center justify-center mb-5 shadow-lg group-hover:shadow-glow-green transition-all mx-auto md:mx-0">
                  <span className="text-4xl">🍔</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  Fast Food Savoureux
                </h3>
                <p className="text-sm md:text-base text-gray-600 mb-5 leading-relaxed">
                  Burgers juteux, poulet frit croustillant, sandwichs généreux. Prêts en 10 minutes chrono !
                </p>
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 transition-colors group/link bg-orange-50 px-4 py-2 rounded-full"
                >
                  Découvrir
                  <svg className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Daily Menu Card - Straight with sticker */}
            <div className="group bg-white p-6 md:p-8 card-hover border-2 border-orange-100 hover:border-orange-300 transition-all relative" style={{borderRadius: '25px'}}>
              {/* Featured sticker */}
              <div className="absolute -top-3 -right-3 sticker bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-xl z-20">
                Populaire! ⭐
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 blob-orange flex items-center justify-center mb-5 shadow-lg group-hover:shadow-glow-orange transition-all mx-auto md:mx-0">
                  <span className="text-4xl">🍲</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  Menu du Jour Traditionnel
                </h3>
                <p className="text-sm md:text-base text-gray-600 mb-5 leading-relaxed">
                  Thiéboudienne, Yassa, Mafé... Nos spécialités sénégalaises changées quotidiennement.
                </p>
                <Link
                  href="/daily-menu"
                  className="inline-flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 transition-colors group/link bg-orange-50 px-4 py-2 rounded-full"
                >
                  Voir aujourd'hui
                  <svg className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Delivery Card - Tilted opposite */}
            <div className="group bg-white p-6 md:p-8 card-hover border-2 border-orange-100 hover:border-orange-300 transition-all relative" style={{borderRadius: '70% 30% 30% 70% / 60% 40% 60% 40%', transform: 'rotate(1deg)'}}>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-500 rounded-full flex items-center justify-center mb-5 shadow-lg group-hover:shadow-xl transition-all mx-auto md:mx-0">
                  <span className="text-4xl">🚴</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  Livraison Ultra-Rapide
                </h3>
                <p className="text-sm md:text-base text-gray-600 mb-5 leading-relaxed">
                  Commandez en ligne en quelques clics. Livraison express ou retrait sur place.
                </p>
                <Link
                  href="/order"
                  className="inline-flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 transition-colors group/link bg-gradient-to-r from-orange-50 to-orange-50 px-4 py-2 rounded-full"
                >
                  Commander
                  <svg className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Unique Asymmetric Design */}
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-600 text-white overflow-hidden">
        <div className="absolute inset-0 african-pattern opacity-20"></div>
        <div className="absolute top-0 left-0 w-80 h-80 blob-green opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 blob-orange opacity-15 animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left side - Text */}
              <div className="order-2 md:order-1">
                <span className="inline-block mb-4 handwritten text-7xl animate-float">🍽️</span>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-orange-400">
                  Prêt à <span className="handwritten text-orange-300 text-5xl md:text-7xl">goûter</span> le Sénégal ?
                </h2>
                <p className="text-lg md:text-xl mb-8 text-gray-900 leading-relaxed font-medium bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg">
                  Commandez dès maintenant et recevez vos plats préférés en quelques minutes seulement !
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/order">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-white text-orange-600 hover:bg-gray-100 shadow-2xl transform hover:scale-105 transition-all font-bold px-8 py-3 text-base border-2 border-orange-500"
                    >
                      <span className="flex items-center gap-2 text-orange-500">
                        <span className="text-xl text-orange-500">🛒</span>
                        Commander Maintenant
                      </span>
                    </Button>
                  </Link>
                  <Link href="/menu">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-2 border-white bg-white text-gray-900 hover:bg-gray-100 shadow-xl px-8 py-3 text-base"
                    >
                      Voir le menu
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Right side - Visual element */}
              <div className="order-1 md:order-2 flex justify-center md:justify-end">
                <div className="relative">
                  <div className="bg-white p-8 rounded-3xl sticker shadow-2xl" style={{transform: 'rotate(-3deg)'}}>
                    <div className="text-center">
                      <div className="text-6xl mb-4 text-black">🍔 🍲 🍟</div>
                      <div className="handwritten text-4xl text-black mb-2">Frais</div>
                      <div className="handwritten text-4xl text-black">Rapide</div>
                      <div className="handwritten text-4xl text-black">Délicieux</div>
                    </div>
                  </div>
                  {/* Decorative stickers */}
                  <div className="absolute -top-4 -left-4 sticker bg-white border-2 border-orange-500 text-black px-4 py-2 rounded-full text-sm font-bold shadow-xl">
                    100% Halal ✅
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
