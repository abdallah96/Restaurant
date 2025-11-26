'use client';

import { useEffect, useState } from 'react';
import { MenuItem } from '@/types';
import { MenuCard } from '@/components/menu/MenuCard';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch('/api/menu?category=fast-food');
      const data = await response.json();
      if (data.success) {
        setMenuItems(data.data);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 bg-neutral-50">
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Menu Fast Food</h1>
          <p className="text-xl opacity-90">
            Découvrez notre sélection de plats rapides et délicieux
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            <p className="mt-4 text-neutral-600">Chargement du menu...</p>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-neutral-600">Aucun plat disponible pour le moment.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {menuItems.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/order">
                <Button size="lg">
                  Passer une commande
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
