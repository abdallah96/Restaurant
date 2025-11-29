'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import { Analytics } from "@vercel/analytics/next"
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  // Don't show layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' })
      toast.success('Déconnexion réussie')
      setTimeout(() => {
        window.location.href = '/admin/login'
      }, 500)
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Erreur de déconnexion')
    }
  }

  const navItems = [
    { href: '/admin', label: 'Commandes', icon: '📦' },
    { href: '/admin/menu', label: 'Menu', icon: '🍽️' },
    { href: '/admin/daily-specials', label: 'Plats du Jour', icon: '⭐' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl">👨‍💼</span>
              <div>
                <h1 className="text-2xl font-bold text-orange-400">Administration</h1>
                <p className="text-sm text-gray-900 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg inline-block mt-1">
                  Keur Gui Restaurant
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/90 hover:bg-white text-orange-600 rounded-xl font-bold hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-md border-b-2 border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    px-6 py-4 font-bold text-base transition-all flex items-center gap-2 border-b-4
                    ${isActive 
                      ? 'text-orange-600 border-orange-500 bg-orange-50' 
                      : 'text-gray-600 border-transparent hover:text-orange-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="text-2xl">{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
