'use client';

import { useEffect, useState } from 'react';
import { MenuItem } from '@/types';
import { MenuCard } from '@/components/menu/MenuCard';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/lib/store/cart';
import toast, { Toaster } from 'react-hot-toast';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      type: 'menu_item',
      image_url: item.image_url,
    });
    toast.success(`${item.name} ajouté au panier!`);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch('/api/menu');
      const data = await response.json();
      if (data.success) {
        setMenuItems(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 bg-gradient-to-b from-sand-50 to-white min-h-screen">
      <Toaster position="top-right" />
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-orange-500 py-16 overflow-hidden">
        <div className="absolute inset-0 african-pattern opacity-20"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400 rounded-full blur-3xl opacity-30"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block mb-4 text-5xl animate-float">🍔</span>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight text-orange-400">
              Menu Fast Food
            </h1>
            <p className="text-xl md:text-2xl text-gray-900 font-medium bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl inline-block shadow-lg">
              Découvrez notre sélection de plats rapides et délicieux, préparés avec des ingrédients frais
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600"></div>
            <p className="mt-6 text-xl text-orange-700 font-semibold">Chargement du menu...</p>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-xl p-12 border-2 border-orange-100">
            <span className="text-7xl mb-6 block">🍴</span>
            <p className="text-2xl font-bold text-gray-800 mb-4">Aucun plat disponible pour le moment</p>
            <p className="text-gray-600 mb-8">Revenez bientôt pour découvrir nos délicieuses spécialités !</p>
            <Link href="/daily-menu">
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600">
                Voir le menu du jour
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Nos Délicieux <span className="gradient-text">Plats</span>
              </h2>
              <p className="text-gray-600 text-lg">Commandez vos favoris en quelques clics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {menuItems.map((item) => (
                <MenuCard key={item.id} item={item} onAddToCart={handleAddToCart} />
              ))}
            </div>

            <div className="text-center bg-gradient-to-r from-orange-50 to-orange-50 rounded-2xl p-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Prêt à commander ?</h3>
              <p className="text-gray-700 mb-6 font-medium">Ajoutez vos plats préférés au panier</p>
              <Link href="/order">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-xl transform hover:scale-105 text-white">
                  <span className="flex items-center gap-2 text-white">
                    <span className="text-2xl">🛒</span>
                    Passer une commande
                  </span>
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
