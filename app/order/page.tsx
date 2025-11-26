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
      <main className="flex-1 bg-neutral-50 flex items-center justify-center py-16">
        <Toaster position="top-right" />
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✓</span>
          </div>
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">
            Commande confirmée !
          </h2>
          <p className="text-neutral-600 mb-6">
            Nous avons bien reçu votre commande. Vous serez contacté prochainement.
          </p>
          <Link href="/">
            <Button>Retour à l'accueil</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-neutral-50">
      <Toaster position="top-right" />
      
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Commander</h1>
          <p className="text-xl opacity-90">Choisissez vos plats et passez commande</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Section */}
          <div className="lg:col-span-2">
            {/* Daily Specials */}
            {dailySpecials.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <h2 className="text-3xl font-bold text-neutral-800">Menu du Jour</h2>
                  <span className="bg-secondary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Spécial
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dailySpecials.map((special) => (
                    <MenuItem key={special.id} item={special} type="daily_special" />
                  ))}
                </div>
              </section>
            )}

            {/* Regular Menu */}
            <section>
              <h2 className="text-3xl font-bold text-neutral-800 mb-6">Menu Fast Food</h2>
              
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedCategory === category
                        ? 'bg-primary-500 text-white'
                        : 'bg-white text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {category === 'all' ? 'Tout' : category}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-neutral-600">Chargement du menu...</p>
                </div>
              ) : filteredMenuItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-neutral-600">Aucun article disponible</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <h2 className="text-3xl font-bold text-neutral-800 mb-6">Informations de commande</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Votre nom"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="+221 XX XXX XX XX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Email (optionnel)
                  </label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
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
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Adresse de livraison *
                    </label>
                    <textarea
                      required={formData.orderType === 'delivery'}
                      value={formData.deliveryAddress}
                      onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Votre adresse complète"
                      rows={3}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Notes (optionnel)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Instructions spéciales, allergies, etc."
                    rows={3}
                  />
                </div>

                <div className="bg-primary-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Total à payer:</span>
                    <span className="text-2xl font-bold text-primary-500">
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
