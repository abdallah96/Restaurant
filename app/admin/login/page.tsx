'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import toast, { Toaster } from 'react-hot-toast'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Connexion réussie!')
        // Wait a bit for cookie to be set, then redirect
        setTimeout(() => {
          window.location.href = '/admin'
        }, 100)
      } else {
        toast.error(data.error || 'Erreur de connexion')
        setLoading(false)
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Erreur de connexion')
      setLoading(false)
    }
  }

  return (
    <main className="flex-1 relative bg-gradient-to-br from-orange-600 via-orange-500 to-orange-400 min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Background Elements */}
      <div className="absolute inset-0 african-pattern opacity-20"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex w-24 h-24 bg-white rounded-2xl items-center justify-center mb-6 shadow-2xl transform hover:scale-110 transition-transform">
              <span className="text-5xl">👨‍🍳</span>
            </div>
          <h1 className="text-4xl font-bold text-orange-400 mb-3">
            Espace Administrateur
          </h1>
          <p className="text-gray-900 text-lg font-medium bg-white/90 backdrop-blur-sm px-6 py-2 rounded-xl inline-block shadow-lg">
            Connectez-vous pour gérer votre restaurant
          </p>
        </div>

        <div className="glass rounded-2xl shadow-2xl p-8 border border-white/30 animate-scale-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/90 transition-all"
                placeholder="admin@restaurant.sn"
                disabled={loading}
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/90 transition-all"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

              <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 shadow-xl transform hover:scale-105"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span className="text-xl">🔓</span>
                  Se connecter
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-orange-50/80 rounded-xl border border-orange-200/50">
            <p className="text-sm text-gray-700 text-center font-medium">
              🔒 Connexion sécurisée réservée aux administrateurs
            </p>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-800 font-medium">
              Identifiants par défaut : <span className="font-mono bg-gray-200 px-2 py-1 rounded text-gray-900">admin@restaurant.sn</span> / <span className="font-mono bg-gray-200 px-2 py-1 rounded text-gray-900">admin123</span>
            </p>
          </div>
        </div>

        <div className="text-center mt-6 text-sm">
          <p className="text-gray-900 font-medium bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg inline-block">Keur Gui &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </main>
  )
}
