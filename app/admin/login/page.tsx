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
        setTimeout(() => {
          router.push('/admin')
          router.refresh()
        }, 500)
      } else {
        toast.error(data.error || 'Erreur de connexion')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex-1 bg-gradient-to-br from-primary-50 via-white to-secondary-50 min-h-screen flex items-center justify-center px-4 py-12">
      <Toaster position="top-right" />
      
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl items-center justify-center mb-4 shadow-lg">
            <span className="text-white font-bold text-3xl">RS</span>
          </div>
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">
            Espace Administrateur
          </h1>
          <p className="text-neutral-600">
            Connectez-vous pour gérer votre restaurant
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-neutral-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-semibold text-neutral-700 mb-2"
              >
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-neutral-800 bg-white"
                placeholder="admin@restaurant.sn"
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-semibold text-neutral-700 mb-2"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-neutral-800 bg-white"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
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
                'Se connecter'
              )}
            </Button>
          </form>

          {/* Info Message */}
          <div className="mt-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <p className="text-sm text-neutral-600 text-center">
              🔒 Connexion sécurisée pour les administrateurs uniquement
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-neutral-600">
          <p>Restaurant Sénégalais &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </main>
  )
}
