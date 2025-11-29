'use client';

import { useEffect, useState } from 'react';
import { DailySpecial } from '@/types';
import Link from 'next/link';
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
            <div className="bg-white rounded-2xl shadow-xl p-10 mb-12 border-2 border-orange-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-4xl font-bold text-gray-900">
                  Menu du {new Date().toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h2>
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                  ⭐ Spécial du jour
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dailySpecials.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-gradient-to-br from-white to-orange-50 rounded-xl p-6 hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-orange-100 hover:border-orange-300"
                    onClick={() => trackDailySpecialView(item.id, item.name)}
                  >
                    <div className="h-40 bg-gradient-to-br from-orange-200 via-orange-200 to-orange-100 rounded-xl flex items-center justify-center mb-5 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-orange-400/30 to-transparent"></div>
                      <span className="text-6xl relative z-10 group-hover:scale-110 transition-transform">🍲</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-700 transition-colors">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-gray-700 mb-5 text-sm leading-relaxed font-medium">
                        {item.description}
                      </p>
                    )}
                    <div className="text-2xl font-bold text-orange-600 bg-orange-50 px-4 py-2 rounded-lg inline-block mb-3">
                      {item.price.toLocaleString()} FCFA
                    </div>
                    {item.stock_quantity <= 10 && item.stock_quantity > 0 && (
                      <p className="text-sm text-orange-600 mt-3 font-bold bg-orange-100 px-3 py-1 rounded-full inline-block">
                        ⚡ Plus que {item.stock_quantity} portion(s)!
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Link href="/order">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-2xl transform hover:scale-105 transition-all font-bold px-8 py-4 text-lg">
                  Commander maintenant
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
