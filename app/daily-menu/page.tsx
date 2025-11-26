'use client';

import { useEffect, useState } from 'react';
import { DailySpecial } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function DailyMenuPage() {
  const [dailySpecials, setDailySpecials] = useState<DailySpecial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyMenu();
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
    <main className="flex-1 bg-neutral-50">
      <div className="bg-gradient-to-r from-secondary-500 to-primary-500 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Menu du Jour</h1>
          <p className="text-xl opacity-90">
            Plats traditionnels sénégalais préparés frais chaque jour
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500"></div>
            <p className="mt-4 text-neutral-600">Chargement du menu du jour...</p>
          </div>
        ) : dailySpecials.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md p-8">
            <span className="text-6xl mb-4 block">🍽️</span>
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">
              Pas de menu du jour aujourd'hui
            </h2>
            <p className="text-neutral-600 mb-6">
              Consultez notre menu fast food pour découvrir nos autres plats délicieux.
            </p>
            <Link href="/menu">
              <Button>Voir le menu fast food</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-neutral-800">
                  Menu du {new Date().toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h2>
                <span className="bg-secondary-100 text-secondary-700 px-4 py-2 rounded-full font-semibold">
                  Spécial du jour
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dailySpecials.map((item) => (
                  <div
                    key={item.id}
                    className="border border-neutral-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="h-32 bg-gradient-to-br from-secondary-100 to-primary-100 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-5xl">🍲</span>
                    </div>
                    <h3 className="text-xl font-bold text-neutral-800 mb-2">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-neutral-600 mb-4 text-sm">
                        {item.description}
                      </p>
                    )}
                    <div className="text-lg font-bold text-secondary-500">
                      {item.price.toLocaleString()} FCFA
                    </div>
                    {item.stock_quantity <= 10 && item.stock_quantity > 0 && (
                      <p className="text-xs text-orange-600 mt-2">
                        Plus que {item.stock_quantity} portion(s)!
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Link href="/order">
                <Button size="lg">
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
