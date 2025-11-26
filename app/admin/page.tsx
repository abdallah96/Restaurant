'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { OrderWithItems } from '@/types'
import { Button } from '@/components/ui/Button'
import toast, { Toaster } from 'react-hot-toast'
import { format } from 'date-fns'

export default function AdminPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchOrders()
    // Refresh orders every 30 seconds
    const interval = setInterval(fetchOrders, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      const data = await response.json()
      
      if (data.success) {
        setOrders(data.data || [])
      } else {
        toast.error('Erreur lors du chargement des commandes')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Statut mis à jour!')
        fetchOrders()
      } else {
        toast.error('Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Error updating order:', error)
      toast.error('Erreur de connexion')
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' })
      toast.success('Déconnexion réussie')
      setTimeout(() => {
        router.push('/admin/login')
        router.refresh()
      }, 500)
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Erreur de déconnexion')
    }
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter)

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-purple-100 text-purple-800',
    ready: 'bg-green-100 text-green-800',
    delivered: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  const statusLabels = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    preparing: 'En préparation',
    ready: 'Prête',
    delivered: 'Livrée',
    cancelled: 'Annulée',
  }

  const statusOptions = [
    { value: 'confirmed', label: 'Confirmer' },
    { value: 'preparing', label: 'En préparation' },
    { value: 'ready', label: 'Prête' },
    { value: 'delivered', label: 'Livrée' },
    { value: 'cancelled', label: 'Annuler' },
  ]

  return (
    <main className="flex-1 bg-neutral-50 min-h-screen">
      <Toaster position="top-right" />
      
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Tableau de bord</h1>
              <p className="text-xl opacity-90">Gestion des commandes</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-neutral-100 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-neutral-600 mb-1">Total commandes</div>
            <div className="text-3xl font-bold text-neutral-800">{orders.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-neutral-600 mb-1">En attente</div>
            <div className="text-3xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'pending').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-neutral-600 mb-1">En cours</div>
            <div className="text-3xl font-bold text-blue-600">
              {orders.filter(o => ['confirmed', 'preparing', 'ready'].includes(o.status)).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-neutral-600 mb-1">Livrées</div>
            <div className="text-3xl font-bold text-green-600">
              {orders.filter(o => o.status === 'delivered').length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Toutes ({orders.length})
            </button>
            {Object.entries(statusLabels).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === value
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {label} ({orders.filter(o => o.status === value).length})
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-neutral-600">Chargement...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-neutral-600">Aucune commande</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-wrap items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-neutral-800">
                        Commande #{order.id.slice(0, 8)}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.status as keyof typeof statusColors]}`}>
                        {statusLabels[order.status as keyof typeof statusLabels]}
                      </span>
                    </div>
                    <div className="text-sm text-neutral-600 space-y-1">
                      <p>📅 {format(new Date(order.created_at), 'dd/MM/yyyy HH:mm')}</p>
                      <p>👤 {order.customer_name}</p>
                      <p>📞 {order.customer_phone}</p>
                      {order.customer_email && <p>✉️ {order.customer_email}</p>}
                      <p>📦 {order.order_type === 'delivery' ? 'Livraison' : 'À emporter'}</p>
                      {order.delivery_address && <p>📍 {order.delivery_address}</p>}
                      {order.notes && <p>📝 {order.notes}</p>}
                    </div>
                  </div>

                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                      {statusOptions.map((option) => {
                        if (option.value === order.status) return null
                        return (
                          <Button
                            key={option.value}
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, option.value)}
                            variant={option.value === 'cancelled' ? 'danger' : 'primary'}
                          >
                            {option.label}
                          </Button>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div className="border-t border-neutral-200 pt-4">
                  <h4 className="font-semibold text-neutral-800 mb-3">Articles:</h4>
                  <div className="space-y-2">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <span className="text-neutral-700">
                          {item.item_name} x{item.quantity}
                        </span>
                        <span className="font-semibold text-neutral-800">
                          {item.subtotal.toLocaleString()} FCFA
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-neutral-200 mt-3 pt-3 flex justify-between items-center">
                    <span className="font-bold text-lg">Total:</span>
                    <span className="font-bold text-2xl text-primary-500">
                      {order.total_amount.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
