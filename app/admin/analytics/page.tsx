'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'

interface PopularItem {
  item_name: string
  item_id: string
  item_type: string
  total_quantity: number
  total_revenue: number
  order_count: number
  pickup_count: number
  delivery_count: number
  avg_price: number
}

interface AnalyticsData {
  popularItems: PopularItem[]
  totals: {
    total_items_sold: number
    total_revenue: number
    unique_items: number
  }
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics')
      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
      } else {
        console.error('Failed to fetch analytics')
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Chargement des statistiques...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">Aucune donnée disponible</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📊 Statistiques des Produits
          </h1>
          <p className="text-gray-600">
            Analysez les produits les plus commandés
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-600">Total vendu</div>
              <span className="text-3xl">📦</span>
            </div>
            <div className="text-4xl font-bold text-orange-500">
              {data.totals.total_items_sold}
            </div>
            <div className="text-sm text-gray-500 mt-2">articles</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-600">Revenus totaux</div>
              <span className="text-3xl">💰</span>
            </div>
            <div className="text-4xl font-bold text-orange-600">
              {data.totals.total_revenue.toLocaleString()} FCFA
            </div>
            <div className="text-sm text-gray-500 mt-2">tous produits</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-600">Produits uniques</div>
              <span className="text-3xl">🍽️</span>
            </div>
            <div className="text-4xl font-bold text-orange-500">
              {data.totals.unique_items}
            </div>
            <div className="text-sm text-gray-500 mt-2">différents produits</div>
          </div>
        </div>

        {/* Popular Items Table */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🏆 Produits les Plus Populaires
          </h2>

          {data.popularItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Aucune commande encore</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-bold text-gray-900">Rang</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-900">Produit</th>
                    <th className="text-center py-4 px-4 font-bold text-gray-900">Type</th>
                    <th className="text-center py-4 px-4 font-bold text-gray-900">Quantité</th>
                    <th className="text-center py-4 px-4 font-bold text-gray-900">Commandes</th>
                    <th className="text-center py-4 px-4 font-bold text-gray-900">Revenus</th>
                    <th className="text-center py-4 px-4 font-bold text-gray-900">À emporter</th>
                    <th className="text-center py-4 px-4 font-bold text-gray-900">Livraison</th>
                  </tr>
                </thead>
                <tbody>
                  {data.popularItems.map((item, index) => (
                    <tr
                      key={item.item_id}
                      className="border-b border-gray-100 hover:bg-orange-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                          index === 0 ? 'bg-yellow-400 text-yellow-900' :
                          index === 1 ? 'bg-gray-300 text-gray-700' :
                          index === 2 ? 'bg-orange-300 text-orange-900' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-900">{item.item_name}</div>
                        <div className="text-sm text-gray-500">
                          {item.avg_price.toLocaleString()} FCFA
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.item_type === 'menu_item'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {item.item_type === 'menu_item' ? 'Menu' : 'Spécial'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="font-bold text-lg text-orange-600">
                          {item.total_quantity}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center text-gray-700">
                        {item.order_count}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="font-semibold text-green-600">
                          {item.total_revenue.toLocaleString()} FCFA
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center text-gray-600">
                        {item.pickup_count}
                      </td>
                      <td className="py-4 px-4 text-center text-gray-600">
                        {item.delivery_count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

