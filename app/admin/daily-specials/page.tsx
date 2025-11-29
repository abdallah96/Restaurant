'use client'

import { useState, useEffect } from 'react'
import { DailySpecial } from '@/types'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function AdminDailySpecialsPage() {
  const [specials, setSpecials] = useState<DailySpecial[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<DailySpecial | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    is_active: true,
    active_date: new Date().toISOString().split('T')[0],
    stock_quantity: 50,
  })

  useEffect(() => {
    fetchSpecials()
  }, [])

  const fetchSpecials = async () => {
    try {
      const response = await fetch('/api/admin/daily-menu')
      const data = await response.json()
      if (data.success) {
        setSpecials(data.data || [])
      } else {
        toast.error('Erreur lors du chargement')
      }
    } catch (error) {
      console.error('Error fetching specials:', error)
      toast.error('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = '/api/admin/daily-menu'
      const method = editingItem ? 'PATCH' : 'POST'
      const body = editingItem 
        ? { ...formData, id: editingItem.id, price: parseFloat(formData.price) }
        : { ...formData, price: parseFloat(formData.price) }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()
      if (data.success) {
        toast.success(editingItem ? 'Plat mis à jour!' : 'Plat ajouté!')
        setShowModal(false)
        resetForm()
        fetchSpecials()
      } else {
        toast.error(data.error || 'Erreur')
      }
    } catch (error) {
      console.error('Error saving special:', error)
      toast.error('Erreur de connexion')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce plat?')) return

    try {
      const response = await fetch(`/api/admin/daily-menu?id=${id}`, { method: 'DELETE' })
      const data = await response.json()
      if (data.success) {
        toast.success('Plat supprimé!')
        fetchSpecials()
      } else {
        toast.error('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Error deleting special:', error)
      toast.error('Erreur de connexion')
    }
  }

  const handleEdit = (item: DailySpecial) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      image_url: item.image_url || '',
      is_active: item.is_active,
      active_date: item.active_date,
      stock_quantity: item.stock_quantity,
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      image_url: '',
      is_active: true,
      active_date: new Date().toISOString().split('T')[0],
      stock_quantity: 50,
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Plats du Jour</h1>
          <p className="text-gray-600 mt-1">Gérez les spécialités quotidiennes</p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600"
        >
          <span className="text-xl mr-2">+</span> Ajouter un Plat
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      ) : specials.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <span className="text-6xl mb-4 block">⭐</span>
          <p className="text-xl text-gray-600 mb-4">Aucun plat du jour</p>
          <Button onClick={() => setShowModal(true)} className="bg-orange-500">
            Ajouter le premier plat
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all"
            >
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-xl">{item.name}</h3>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    item.is_active 
                      ? 'bg-orange-100 text-orange-500' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.is_active ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                {item.description && (
                  <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                )}
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                  <span>📅</span>
                  <span className="font-medium">{format(new Date(item.active_date), 'dd/MM/yyyy')}</span>
                  <span className="ml-auto">Stock: {item.stock_quantity}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-2xl font-bold text-orange-600">
                    {item.price.toLocaleString()} FCFA
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingItem ? 'Modifier le Plat' : 'Nouveau Plat du Jour'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  placeholder="Ex: Mafé de poulet"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  placeholder="Description du plat..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Prix (FCFA) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                    placeholder="3000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                    placeholder="50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Date d'activation *
                </label>
                <input
                  type="date"
                  required
                  value={formData.active_date}
                  onChange={(e) => setFormData({ ...formData, active_date: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  URL de l'image
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="is_active" className="text-sm font-bold text-gray-700">
                  Actif (visible aux clients)
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500"
                >
                  {editingItem ? 'Mettre à jour' : 'Ajouter'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
