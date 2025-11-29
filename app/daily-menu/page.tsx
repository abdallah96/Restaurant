'use client';

import { useEffect, useState } from 'react';
import { DailySpecial } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { trackPageView, trackDailySpecialView } from '@/lib/analytics';

export default function DailyMenuPage() {
  const [dailySpecials, setDailySpecials] = useState<DailySpecial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyMenu();
    trackPageView('daily_menu');
  }, []);

  const fetchDailyMenu = async () => {
    try {
      const response = await fetch('/api/menu/daily');
      const data = await response.json();
      if (data.success) {
        setDailySpecials(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching daily menu:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 bg-gradient-to-b from-sand-50 to-white min-h-screen">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-orange-500 py-16 overflow-hidden">
        <div className="absolute inset-0 african-pattern opacity-20"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400 rounded-full blur-3xl opacity-30"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block mb-4 text-5xl animate-float">🍲</span>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight text-orange-400">
              Menu du Jour
            </h1>
            <p className="text-xl md:text-2xl text-gray-900 font-medium bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl inline-block shadow-lg">
              Savourez nos plats traditionnels sénégalais préparés frais chaque jour avec amour
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500"></div>
            <p className="mt-6 text-xl text-orange-700 font-semibold">Chargement du menu du jour...</p>
          </div>
        ) : dailySpecials.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-xl p-10 border-2 border-orange-100">
            <span className="text-7xl mb-6 block">🍽️</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pas de menu du jour aujourd'hui
            </h2>
            <p className="text-gray-700 mb-8 text-lg font-medium">
              Consultez notre menu fast food pour découvrir nos autres plats délicieux.
            </p>
            <Link href="/menu">
              <Button className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500">
                Voir le menu fast food
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Menu du {new Date().toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </h2>
              <span className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                ⭐ Spécial du jour
              </span>
            </div>

            {/* Dynamic Layout based on number of items */}
            {dailySpecials.length === 1 ? (
              /* Single Item - Hero Layout */
              <div className="max-w-5xl mx-auto mb-12">
                <div 
                  className="group bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all border-2 border-orange-200 hover:border-orange-400"
                  onClick={() => trackDailySpecialView(dailySpecials[0].id, dailySpecials[0].name)}
                >
                  <div className="grid md:grid-cols-5 gap-0">
                    {/* Image Side - Takes 3 columns */}
                    <div className="md:col-span-3 relative h-96 md:h-[600px] overflow-hidden bg-white">
                      {dailySpecials[0].image_url ? (
                        <div className="relative w-full h-full p-8">
                          <Image
                            src={dailySpecials[0].image_url}
                            alt={dailySpecials[0].name}
                            fill
                            className="object-contain p-4"
                            sizes="(max-width: 768px) 100vw, 60vw"
                            priority
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
                          <span className="text-9xl group-hover:scale-110 transition-transform">🍲</span>
                        </div>
                      )}
                      <div className="absolute top-6 left-6">
                        <span className="bg-orange-500 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-xl">
                          ⭐ PLAT DU JOUR
                        </span>
                      </div>
                    </div>
                    
                    {/* Content Side - Takes 2 columns */}
                    <div className="md:col-span-2 p-8 md:p-10 flex flex-col justify-center bg-gradient-to-br from-orange-50/50 to-white">
                      <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-orange-600 transition-colors">
                        {dailySpecials[0].name}
                      </h3>
                      {dailySpecials[0].description && (
                        <p className="text-gray-700 text-base md:text-lg mb-6 leading-relaxed">
                          {dailySpecials[0].description}
                        </p>
                      )}
                      <div className="mb-6">
                        <div className="inline-block">
                          <div className="text-5xl font-bold text-orange-600">
                            {dailySpecials[0].price.toLocaleString()}
                          </div>
                          <div className="text-lg text-gray-600 font-semibold">FCFA</div>
                        </div>
                      </div>
                      {dailySpecials[0].stock_quantity <= 10 && dailySpecials[0].stock_quantity > 0 && (
                        <div className="mb-6">
                          <span className="inline-block text-sm text-orange-600 font-bold bg-orange-100 px-4 py-2 rounded-full">
                            ⚡ Plus que {dailySpecials[0].stock_quantity} portions!
                          </span>
                        </div>
                      )}
                      <Link href="/order">
                        <Button size="lg" className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl transform hover:scale-105 transition-all font-bold px-10 py-4 text-lg">
                          🛒 Commander maintenant
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Multiple Items - Grid Layout */
              <div className={`grid gap-8 mb-12 ${
                dailySpecials.length === 2 
                  ? 'grid-cols-1 lg:grid-cols-2 max-w-6xl mx-auto' 
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}>
                {dailySpecials.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-orange-100 hover:border-orange-300"
                    onClick={() => trackDailySpecialView(item.id, item.name)}
                  >
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden bg-white">
                      {item.image_url ? (
                        <div className="relative w-full h-full p-6">
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-contain p-2"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
                          <span className="text-7xl group-hover:scale-110 transition-transform">🍲</span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span className="bg-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                          ⭐ SPÉCIAL
                        </span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 bg-gradient-to-b from-orange-50/30 to-white">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-baseline gap-2 mb-3">
                        <div className="text-3xl font-bold text-orange-600">
                          {item.price.toLocaleString()}
                        </div>
                        <span className="text-sm text-gray-600 font-semibold">FCFA</span>
                      </div>
                      {item.stock_quantity <= 10 && item.stock_quantity > 0 && (
                        <p className="text-xs text-orange-600 font-bold bg-orange-100 px-3 py-1 rounded-full inline-block">
                          ⚡ Plus que {item.stock_quantity} portions!
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Button */}
            {dailySpecials.length > 1 && (
              <div className="text-center">
                <Link href="/order">
                  <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-2xl transform hover:scale-105 transition-all font-bold px-12 py-4 text-xl">
                    Commander maintenant
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
