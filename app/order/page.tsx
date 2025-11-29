'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { MenuItem } from '@/components/menu/MenuItem';
import { Cart } from '@/components/order/Cart';
import { useCartStore } from '@/lib/store/cart';
import { MenuItem as MenuItemType, DailySpecial } from '@/types';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

export default function OrderPage() {
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [dailySpecials, setDailySpecials] = useState<DailySpecial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    orderType: 'pickup' as 'pickup' | 'delivery',
    deliveryAddress: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { items: cartItems, clearCart, getTotalAmount } = useCartStore();

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      const [menuRes, dailyRes] = await Promise.all([
        fetch('/api/menu'),
        fetch('/api/menu/daily'),
      ]);

      const menuData = await menuRes.json();
      const dailyData = await dailyRes.json();

      if (menuData.success) {
        setMenuItems(menuData.data || []);
      }
      if (dailyData.success) {
        setDailySpecials(dailyData.data || []);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
      toast.error('Erreur lors du chargement du menu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast.error('Votre panier est vide!');
      return;
    }
    
    setSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: cartItems,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        clearCart();
        toast.success('Commande envoyée avec succès!');
      } else {
        toast.error('Erreur lors de la commande');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Erreur lors de la commande. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const categories = ['all', ...Array.from(new Set(menuItems.map(item => item.category)))];

  const filteredMenuItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  if (success) {
    return (
      <main className="flex-1 bg-white flex items-center justify-center py-16 min-h-screen">
        <Toaster position="top-right" />
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md text-center border-2 border-orange-200">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-5xl text-white">✓</span>
          </div>
          <h2 className="text-4xl font-bold text-orange-500 mb-4">
            Commande confirmée !
          </h2>
          <p className="text-orange-700 mb-8 text-lg">
            Nous avons bien reçu votre commande. Vous serez contacté prochainement.
          </p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500">
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
      <main className="flex-1 bg-white min-h-screen">
      <Toaster position="top-right" />
      
      <div className="relative bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-300 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-3 text-orange-400">Commander</h1>
          <p className="text-2xl text-gray-900 font-medium bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl inline-block shadow-lg">Choisissez vos plats et passez commande</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {dailySpecials.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Menu du Jour</h2>
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Spécial
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dailySpecials.map((special) => (
                    <MenuItem key={special.id} item={special} type="daily_special" />
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Menu Fast Food</h2>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      selectedCategory === category
                        ? 'bg-orange-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {category === 'all' ? 'Tout' : category}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Chargement du menu...</p>
                </div>
              ) : filteredMenuItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Aucun article disponible</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredMenuItems.map((item) => (
                    <MenuItem key={item.id} item={item} type="menu_item" />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <Cart />
          </div>
        </div>

        {/* Checkout Form */}
        {cartItems.length > 0 && (
          <div id="checkout" className="mt-12 max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations de commande</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                      placeholder="Votre nom"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                      placeholder="+221 XX XXX XX XX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email (optionnel)
                  </label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type de commande *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value="pickup"
                        checked={formData.orderType === 'pickup'}
                        onChange={(e) => setFormData({ ...formData, orderType: e.target.value as 'pickup' })}
                        className="mr-2"
                      />
                      <span>À emporter</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value="delivery"
                        checked={formData.orderType === 'delivery'}
                        onChange={(e) => setFormData({ ...formData, orderType: e.target.value as 'delivery' })}
                        className="mr-2"
                      />
                      <span>Livraison</span>
                    </label>
                  </div>
                </div>

                {formData.orderType === 'delivery' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Adresse de livraison *
                    </label>
                    <textarea
                      required={formData.orderType === 'delivery'}
                      value={formData.deliveryAddress}
                      onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                      placeholder="Votre adresse complète"
                      rows={3}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notes (optionnel)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                    placeholder="Instructions spéciales, allergies, etc."
                    rows={3}
                  />
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total à payer:</span>
                    <span className="text-2xl font-bold text-orange-500">
                      {getTotalAmount().toLocaleString()} FCFA
                    </span>
                  </div>
                </div>

                <Button type="submit" fullWidth size="lg" loading={submitting}>
                  Confirmer la commande
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
