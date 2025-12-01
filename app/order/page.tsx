'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { MenuItem } from '@/components/menu/MenuItem';
import { Cart } from '@/components/order/Cart';
import { useCartStore } from '@/lib/store/cart';
import { MenuItem as MenuItemType, DailySpecial } from '@/types';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { 
  trackPageView, 
  trackCategoryFilter, 
  trackCheckoutInitiated, 
  trackOrderPlaced, 
  trackOrderTypeSelected 
} from '@/lib/analytics';

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
    paymentMethod: 'pay_at_arrival' as 'pay_now' | 'pay_at_arrival',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const { items: cartItems, clearCart, getTotalAmount, deliveryZone, setDeliveryZone, getDeliveryFee } = useCartStore();

  useEffect(() => {
    fetchMenuData();
    trackPageView('order');
    
    // Scroll to menu section if hash is present
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash === '#menu-fast-food' || hash === '#menu-du-jour') {
        setTimeout(() => {
          const element = document.getElementById(hash.substring(1));
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300); // Small delay to ensure page is loaded
      }
    }
  }, []);
  
  // Track when user scrolls to checkout section
  useEffect(() => {
    if (cartItems.length > 0) {
      const checkoutElement = document.getElementById('checkout');
      if (!checkoutElement) return;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              trackCheckoutInitiated(getTotalAmount(), cartItems.length);
              observer.disconnect(); // Only track once per session
            }
          });
        },
        { threshold: 0.5 }
      );
      
      observer.observe(checkoutElement);
      return () => observer.disconnect();
    }
  }, [cartItems, getTotalAmount]);

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

  const validateForm = (): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};
    
    // Validate name
    if (!formData.customerName.trim()) {
      errors.customerName = 'Le nom est requis';
    } else if (formData.customerName.trim().length < 2) {
      errors.customerName = 'Le nom doit contenir au moins 2 caractères';
    }
    
    // Validate phone
    if (!formData.customerPhone.trim()) {
      errors.customerPhone = 'Le numéro de téléphone est requis';
    } else {
      const cleanPhone = formData.customerPhone.replace(/[\s\-\(\)]/g, '');
      if (!/^\+?[0-9]{8,15}$/.test(cleanPhone)) {
        errors.customerPhone = 'Numéro de téléphone invalide (8-15 chiffres requis)';
      }
    }
    
    // Validate email if provided
    if (formData.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      errors.customerEmail = 'Format d\'email invalide';
    }
    
    // Validate delivery address if delivery
    if (formData.orderType === 'delivery') {
      if (!formData.deliveryAddress.trim()) {
        errors.deliveryAddress = 'L\'adresse de livraison est requise';
      } else if (formData.deliveryAddress.trim().length < 10) {
        errors.deliveryAddress = 'Veuillez fournir une adresse complète (au moins 10 caractères)';
      }
      
      if (!deliveryZone) {
        errors.deliveryZone = 'Veuillez sélectionner une zone de livraison';
      }
    }
    
    setFieldErrors(errors);
    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setFieldErrors({});
    
    if (cartItems.length === 0) {
      toast.error('Votre panier est vide!');
      return;
    }
    
    // Validate form
    const validation = validateForm();
    if (!validation.isValid) {
      // Scroll to first error after state update
      setTimeout(() => {
        const firstErrorField = Object.keys(validation.errors)[0];
        if (firstErrorField) {
          const element = document.querySelector(`[name="${firstErrorField}"]`) || 
                         document.getElementById(firstErrorField);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            (element as HTMLElement).focus();
          }
        }
      }, 100);
      toast.error('Veuillez corriger les erreurs dans le formulaire', {
        duration: 4000,
      });
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
          deliveryZone: formData.orderType === 'delivery' ? deliveryZone : null,
          paymentMethod: formData.paymentMethod,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Track successful order
        trackOrderPlaced({
          items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          totalAmount: getTotalAmount(),
          orderType: formData.orderType,
          itemCount: cartItems.length,
        });
        
        setSuccess(true);
        clearCart();
        setFieldErrors({});
        toast.success('Commande envoyée avec succès!');
      } else {
        // Parse API error response
        const apiErrors: Record<string, string> = {};
        const errorMessage = data.error || 'Erreur lors de la commande';
        
        // Check for specific field errors and map to field names
        if (errorMessage.includes('nom') || errorMessage.toLowerCase().includes('name')) {
          apiErrors.customerName = errorMessage.includes('nom') ? errorMessage : 'Vérifiez votre nom';
        }
        if (errorMessage.includes('téléphone') || errorMessage.includes('phone') || errorMessage.includes('numéro')) {
          apiErrors.customerPhone = errorMessage.includes('téléphone') || errorMessage.includes('numéro') ? errorMessage : 'Vérifiez votre numéro de téléphone';
        }
        if (errorMessage.includes('email')) {
          apiErrors.customerEmail = errorMessage;
        }
        if (errorMessage.includes('adresse') || errorMessage.toLowerCase().includes('address')) {
          apiErrors.deliveryAddress = errorMessage.includes('adresse') ? errorMessage : 'Vérifiez votre adresse';
        }
        if (errorMessage.includes('zone')) {
          apiErrors.deliveryZone = errorMessage;
        }
        
        if (Object.keys(apiErrors).length > 0) {
          setFieldErrors(apiErrors);
          // Scroll to first error
          setTimeout(() => {
            const firstErrorField = Object.keys(apiErrors)[0];
            if (firstErrorField) {
              const element = document.querySelector(`[name="${firstErrorField}"]`) || 
                             document.getElementById(firstErrorField);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                (element as HTMLElement).focus();
              }
            }
          }, 100);
        }
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Erreur de connexion. Vérifiez votre connexion internet et réessayez.', {
        duration: 5000,
      });
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
              <section id="menu-du-jour" className="mb-12">
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

            <section id="menu-fast-food">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Menu Fast Food</h2>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      trackCategoryFilter(category);
                    }}
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
                      name="customerName"
                      required
                      value={formData.customerName}
                      onChange={(e) => {
                        setFormData({ ...formData, customerName: e.target.value });
                        if (fieldErrors.customerName) {
                          setFieldErrors({ ...fieldErrors, customerName: '' });
                        }
                      }}
                      className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 transition-all ${
                        fieldErrors.customerName 
                          ? 'border-red-500 bg-red-50 shadow-lg shadow-red-200 animate-pulse' 
                          : 'border-gray-300'
                      }`}
                      placeholder="Votre nom"
                    />
                    {fieldErrors.customerName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <span>⚠️</span>
                        {fieldErrors.customerName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      required
                      value={formData.customerPhone}
                      onChange={(e) => {
                        setFormData({ ...formData, customerPhone: e.target.value });
                        if (fieldErrors.customerPhone) {
                          setFieldErrors({ ...fieldErrors, customerPhone: '' });
                        }
                      }}
                      className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 transition-all ${
                        fieldErrors.customerPhone 
                          ? 'border-red-500 bg-red-50 shadow-lg shadow-red-200 animate-pulse' 
                          : 'border-gray-300'
                      }`}
                      placeholder="+221 XX XXX XX XX"
                    />
                    {fieldErrors.customerPhone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <span>⚠️</span>
                        {fieldErrors.customerPhone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email (optionnel)
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={(e) => {
                      setFormData({ ...formData, customerEmail: e.target.value });
                      if (fieldErrors.customerEmail) {
                        setFieldErrors({ ...fieldErrors, customerEmail: '' });
                      }
                    }}
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 transition-all ${
                      fieldErrors.customerEmail 
                        ? 'border-red-500 bg-red-50 shadow-lg shadow-red-200 animate-pulse' 
                        : 'border-gray-300'
                    }`}
                    placeholder="email@example.com"
                  />
                  {fieldErrors.customerEmail && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span>
                      {fieldErrors.customerEmail}
                    </p>
                  )}
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
                        onChange={(e) => {
                          setFormData({ ...formData, orderType: e.target.value as 'pickup' });
                          setDeliveryZone(null);
                          trackOrderTypeSelected('pickup');
                        }}
                        className="mr-2"
                      />
                      <span>À emporter</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value="delivery"
                        checked={formData.orderType === 'delivery'}
                        onChange={(e) => {
                          setFormData({ ...formData, orderType: e.target.value as 'delivery' });
                          trackOrderTypeSelected('delivery');
                        }}
                        className="mr-2"
                      />
                      <span>Livraison</span>
                    </label>
                  </div>
                </div>

                {formData.orderType === 'delivery' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Zone de livraison *
                      </label>
                      <select
                        name="deliveryZone"
                        id="deliveryZone"
                        required={formData.orderType === 'delivery'}
                        value={deliveryZone || ''}
                        onChange={(e) => {
                          setDeliveryZone(e.target.value as 'ouakam' | 'yoff' | 'ville' | 'almadie' | null);
                          if (fieldErrors.deliveryZone) {
                            setFieldErrors({ ...fieldErrors, deliveryZone: '' });
                          }
                        }}
                        className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white transition-all ${
                          fieldErrors.deliveryZone 
                            ? 'border-red-500 bg-red-50 shadow-lg shadow-red-200 animate-pulse' 
                            : 'border-gray-300'
                        }`}
                      >
                        <option value="">Sélectionnez une zone</option>
                        <option value="ouakam">Ouakam - 1,000 FCFA</option>
                        <option value="yoff">Yoff - 2,000 FCFA</option>
                        <option value="ville">Ville - 2,000 FCFA</option>
                        <option value="almadie">Almadie - 1,500 FCFA</option>
                      </select>
                      {fieldErrors.deliveryZone && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <span>⚠️</span>
                          {fieldErrors.deliveryZone}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Adresse de livraison *
                      </label>
                      <textarea
                        name="deliveryAddress"
                        required={formData.orderType === 'delivery'}
                        value={formData.deliveryAddress}
                        onChange={(e) => {
                          setFormData({ ...formData, deliveryAddress: e.target.value });
                          if (fieldErrors.deliveryAddress) {
                            setFieldErrors({ ...fieldErrors, deliveryAddress: '' });
                          }
                        }}
                        className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 transition-all ${
                          fieldErrors.deliveryAddress 
                            ? 'border-red-500 bg-red-50 shadow-lg shadow-red-200 animate-pulse' 
                            : 'border-gray-300'
                        }`}
                        placeholder="Votre adresse complète"
                        rows={3}
                      />
                      {fieldErrors.deliveryAddress && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <span>⚠️</span>
                          {fieldErrors.deliveryAddress}
                        </p>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notes (optionnel)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                    placeholder="Instructions spéciales, allergies, etc."
                    rows={3}
                  />
                </div>

                {/* Payment Method Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Méthode de paiement *
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-orange-50 hover:border-orange-300"
                      style={{
                        borderColor: formData.paymentMethod === 'pay_at_arrival' ? '#f97316' : '#e5e7eb',
                        backgroundColor: formData.paymentMethod === 'pay_at_arrival' ? '#fff7ed' : 'transparent'
                      }}>
                      <input
                        type="radio"
                        value="pay_at_arrival"
                        checked={formData.paymentMethod === 'pay_at_arrival'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as 'pay_now' | 'pay_at_arrival' })}
                        className="mt-1 mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 flex items-center gap-2">
                          <span>💵</span>
                          Payer à la réception
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Vous paierez lorsque vous recevrez votre commande
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-orange-50 hover:border-orange-300"
                      style={{
                        borderColor: formData.paymentMethod === 'pay_now' ? '#f97316' : '#e5e7eb',
                        backgroundColor: formData.paymentMethod === 'pay_now' ? '#fff7ed' : 'transparent'
                      }}>
                      <input
                        type="radio"
                        value="pay_now"
                        checked={formData.paymentMethod === 'pay_now'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as 'pay_now' | 'pay_at_arrival' })}
                        className="mt-1 mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 flex items-center gap-2">
                          <span>📱</span>
                          Payer maintenant (Orange Money)
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Payez en ligne via Orange Money avant la livraison
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Orange Money Payment Instructions */}
                {formData.paymentMethod === 'pay_now' && (
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">📱</span>
                      <h3 className="text-xl font-bold">Paiement Orange Money</h3>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
                      <p className="text-sm font-semibold mb-2 opacity-90">Instructions de paiement:</p>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>Composez <span className="font-bold">#144#</span> sur votre téléphone</li>
                        <li>Sélectionnez <span className="font-bold">"Paiement marchand"</span></li>
                        <li>Entrez le code marchand: <span className="font-bold text-2xl bg-white/20 px-3 py-1 rounded font-mono">543643</span></li>
                        <li>Entrez le montant: <span className="font-bold text-lg">{getTotalAmount().toLocaleString()} FCFA</span></li>
                        <li>Confirmez le paiement avec votre code PIN</li>
                      </ol>
                    </div>

                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border-2 border-white/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm opacity-90 mb-1">Code Marchand:</p>
                          <p className="text-3xl font-bold font-mono tracking-wider">543643</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm opacity-90 mb-1">Montant à payer:</p>
                          <p className="text-2xl font-bold">{getTotalAmount().toLocaleString()} FCFA</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-yellow-400/20 rounded-lg border border-yellow-300/50">
                      <p className="text-sm flex items-start gap-2">
                        <span className="text-yellow-200">⚠️</span>
                        <span className="opacity-95">
                          <strong>Important:</strong> Après le paiement, vous recevrez un SMS de confirmation. 
                          Gardez ce SMS jusqu'à la livraison. Ne partagez jamais votre code PIN Orange Money.
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                <div className="bg-orange-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Sous-total:</span>
                    <span className="text-lg font-semibold text-gray-700">
                      {(getTotalAmount() - getDeliveryFee()).toLocaleString()} FCFA
                    </span>
                  </div>
                  {formData.orderType === 'delivery' && deliveryZone && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Frais de livraison ({deliveryZone}):</span>
                      <span className="font-semibold text-gray-700">
                        {getDeliveryFee().toLocaleString()} FCFA
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-orange-200">
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
