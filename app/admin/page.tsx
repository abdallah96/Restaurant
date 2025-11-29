'use client'

import { useState, useEffect, useRef } from 'react'
import { OrderWithItems } from '@/types'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function AdminPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [lastOrderCount, setLastOrderCount] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIHGm98OShUBELTqXh8LVeGwY2jdTyy3krBSh+zPLaizsIHGS57OihUREMTKPh8LJcHAU2jdTyzHksBSuCzvLaiTYIGGO58OahUhILTKHg8LFaGwU2i9Pyy3krBi2DzvLbiTcIGWK48OafUxMKTKDf8LBZGgU1idLyyXgrBi+FzvLdiTgIG2O68OWhUxMLSp/f8K9XGQU1h9Dyx3cqBjGGzvLeiTkIG2S78OajVBIMSZzc8K1VGAU0hc/yx3YpBjKHzvLeiToIG2a98OGgVRINSJnb8KtTFwU0hM7yxXQoBjOIzvLfizsIG2e+8OCfVhIOSJfa8KhSFgU0g8zyxHMnBjSJzvLfizsIGmi/8N+eVxIOSJXZ8KdQFQU0gs3yxHInBjSKzvLgizsIG2nA8N6cWBIOSJTY8KVPFQQzgcvyxHEnBjSLzvLhijwIG2vB8NybWhIOSJPX8KRNFAQzgMnyxHAnBjSMzvLhijwIG2zC8NuaWxIPSJLV8KNMEwQzfsryw+8mBjONzvLhizwIG23D8NqYXBIPSJHU8KJKEgMzfsfxwu4lBTOOzvLhjDwIG27E8NiXXhIPSJDT8KBJEQMyfcbxwu0kBTOPzvLhjTwIG2/F8NeWXxIPSI/S8J9HEAMyesbywe0jBTOQzvLijTwIG3DG8NaUYRIPSI7R8J1FDwMxeMXxwe0iBTORzvLijjwIG3HH8NOTYBMPSM7Q8JtEDgMwd8Txwe0hBTOSzvLijzwIG3HI8NOSYRMPSI3Q8JpBDQMwdcPxwe0gBTOTzvLikDwIG3DJ8NKRYRMPSM3P8JhADAMvccLxwe0fBTOUzvLikTwIG3HK8NGQZBMPSI3O8JZADAIucsHxwe0fBTOVzvLikTwIG3HJ8NDQZBMPSI3O8JZADAIucsHxwe0fBTOVzvLikTwIG3HJ8NDQZBMPSDzO8JZADAIucsHxwe0fBTOVzvLikTwIG3HJ8NDQZBMPSDzO8JZADAIucsHxwe0fBTOVzvLikTwIG3HJ8NDQZBMPSDzO8JZADAIucsHxwe0fBTOVzvLikTwIG3HJ8NDQZBMPSDzO8JZADAIucsHxwe0fBTOVzvLikTwIG3HJ8NDQZBMPSDzO8JZADAIucsHxwe0fBTOVzvLikTwIG3HJ8NDQZBMPSDzO8JZADAIucsHxwe0fBTOVzvLikTwIG3HJ8NDQZBMPSDzO8JZADAIucsHxwe0fBTOVzvLikTwIG3HJ8NDQZBMPSDzO8JZADAIucsHxwe0fBTOVzvLikTwIG3HJ8NDQZBMPSDzO8JZADAIucsHxwe0fBTOVzvLikTwIG3HJ8NDQZBMPSDzO8JZADAIucsHxwe0fBTOVzvLikTwIG3HJ8A==')
    
    fetchOrders()
    // Refresh orders every 10 seconds
    const interval = setInterval(fetchOrders, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      const data = await response.json()
      
      if (data.success) {
        const newOrders = data.data || []
        
        // Check for new orders and play notification sound
        if (lastOrderCount > 0 && newOrders.length > lastOrderCount) {
          // New order detected!
          if (audioRef.current) {
          }
          toast.success('🔔 Nouvelle commande re\u00e7ue!', {
            duration: 5000,
            icon: '🎉',
          })
        }
        
        setOrders(newOrders)
        setLastOrderCount(newOrders.length)
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
    <div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:border-orange-300 transition-all card-hover">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-600">Total commandes</div>
              <span className="text-3xl">📊</span>
            </div>
            <div className="text-4xl font-bold gradient-text">{orders.length}</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100 hover:border-orange-300 transition-all card-hover">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-600">En attente</div>
              <span className="text-3xl">⌛</span>
            </div>
            <div className="text-4xl font-bold text-orange-500">
              {orders.filter(o => o.status === 'pending').length}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100 hover:border-orange-300 transition-all card-hover">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-600">En cours</div>
              <span className="text-3xl">👨‍🍳</span>
            </div>
            <div className="text-4xl font-bold text-orange-500">
              {orders.filter(o => ['confirmed', 'preparing', 'ready'].includes(o.status)).length}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100 hover:border-orange-300 transition-all card-hover">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-600">Livrées</div>
              <span className="text-3xl">✅</span>
            </div>
            <div className="text-4xl font-bold text-orange-600">
              {orders.filter(o => o.status === 'delivered').length}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📋</span> Filtrer les commandes
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-5 py-2.5 rounded-xl font-bold transition-all transform hover:scale-105 ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Toutes ({orders.length})
            </button>
            {Object.entries(statusLabels).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === value
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label} ({orders.filter(o => o.status === value).length})
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">Aucune commande</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-wrap items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        Commande #{order.id.slice(0, 8)}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.status as keyof typeof statusColors]}`}>
                        {statusLabels[order.status as keyof typeof statusLabels]}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
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

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Articles:</h4>
                  <div className="space-y-2">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <span className="text-gray-700">
                          {item.item_name} x{item.quantity}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {item.subtotal.toLocaleString()} FCFA
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
                    <span className="font-bold text-lg text-gray-900">Total:</span>
                    <span className="font-bold text-2xl text-orange-500">
                      {order.total_amount.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}
