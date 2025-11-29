'use client'

import { useState, useEffect } from 'react'
import { MenuItem } from '@/types'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Plats Principaux',
    image_url: '',
    is_available: true,
    stock_quantity: 999,
  })

  const categories = ['Plats Principaux', 'Entrées', 'Desserts', 'Boissons', 'Accompagnements']

  useEffect(() => {
    fetchMenuItems()
  }, [])

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/admin/menu')
      const data = await response.json()
      if (data.success) {
        setMenuItems(data.data || [])
      } else {
        toast.error('Erreur lors du chargement')
      }
    } catch (error) {
      console.error('Error fetching menu items:', error)
      toast.error('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingItem ? '/api/admin/menu' : '/api/admin/menu'
      const method = editingItem ? 'PUT' : 'POST'
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
        toast.success(editingItem ? 'Article mis à jour!' : 'Article ajouté!')
        setShowModal(false)
        resetForm()
        fetchMenuItems()
      } else {
        toast.error(data.error || 'Erreur')
      }
    } catch (error) {
      console.error('Error saving menu item:', error)
      toast.error('Erreur de connexion')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article?')) return

    try {
      const response = await fetch(`/api/admin/menu?id=${id}`, { method: 'DELETE' })
      const data = await response.json()
      if (data.success) {
        toast.success('Article supprimé!')
        fetchMenuItems()
      } else {
        toast.error('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Error deleting menu item:', error)
      toast.error('Erreur de connexion')
    }
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category,
      image_url: item.image_url || '',
      is_available: item.is_available,
      stock_quantity: item.stock_quantity,
    })
    setShowModal(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (data.success) {
        setFormData(prev => ({ ...prev, image_url: data.url }))
        toast.success('Image téléchargée!')
      } else {
        toast.error(data.error || 'Erreur lors du téléchargement')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Erreur lors du téléchargement')
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Plats Principaux',
      image_url: '',
      is_available: true,
      stock_quantity: 999,
    })
  }

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion du Menu</h1>
          <p className="text-gray-600 mt-1">Gérez tous les articles de votre menu</p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600"
        >
          <span className="text-xl mr-2">+</span> Ajouter un Article
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      ) : menuItems.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <span className="text-6xl mb-4 block">📋</span>
          <p className="text-xl text-gray-600 mb-4">Aucun article dans le menu</p>
          <Button onClick={() => setShowModal(true)}>
            Ajouter le premier article
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.keys(groupedItems).map((category) => {
            const items = groupedItems[category]
            if (!items || items.length === 0) return null

            const categoryEmojis: Record<string, string> = {
              'Plats Principaux': '🍽️',
              'Entrées': '🥗',
              'Desserts': '🍰',
              'Boissons': '🥤',
              'Accompagnements': '🥘',
              'Burgers': '🍔',
              'Chicken': '🍗',
              'Drinks': '🥤',
              'Sandwiches': '🥪',
              'Sides': '🍟',
            }

            return (
              <div key={category} className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-3xl">
                    {categoryEmojis[category] || '🍽️'}
                  </span>
                  {category} ({items.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="border-2 border-gray-200 rounded-xl p-4 hover:border-orange-300 transition-all"
                    >
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                      )}
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                          item.is_available 
                            ? 'bg-orange-100 text-orange-500' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.is_available ? 'Disponible' : 'Indisponible'}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-orange-500">
                          {item.price.toLocaleString()} FCFA
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingItem ? 'Modifier l\'Article' : 'Nouvel Article'}
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
                  placeholder="Ex: Thiéboudienne"
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
                    placeholder="2500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Image
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="image-upload"
                      className={`flex-1 px-4 py-2 border-2 border-orange-300 rounded-xl text-center cursor-pointer hover:bg-orange-50 transition-colors text-gray-900 font-medium ${
                        uploading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {uploading ? '📤 Téléchargement...' : '📷 Choisir une image'}
                    </label>
                  </div>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                    placeholder="Ou entrez une URL d'image"
                  />
                  {formData.image_url && (
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_available"
                  checked={formData.is_available}
                  onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                  className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="is_available" className="text-sm font-bold text-gray-700">
                  Article disponible
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
