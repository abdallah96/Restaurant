'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="glass sticky top-0 z-50 shadow-lg border-b border-orange-100/50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-14 h-14 flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <Image
                src="/images/logo.svg"
                alt="Keur Gui Logo"
                width={56}
                height={56}
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold gradient-text block leading-tight">Keur Gui</span>
              <span className="text-xs text-gray-600 font-medium">🇸🇳 Restaurant Sénégalais</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-orange-600 font-semibold transition-all hover:scale-105 relative group">
              <span>Accueil</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/menu" className="text-gray-700 hover:text-orange-600 font-semibold transition-all hover:scale-105 relative group">
              <span>Menu Fast Food</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/daily-menu" className="text-gray-700 hover:text-orange-600 font-semibold transition-all hover:scale-105 relative group">
              <span>Menu du Jour</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/order" className="bg-white border-2 border-orange-500 text-orange-600 px-6 py-2.5 rounded-full hover:bg-gray-100 font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
              🛒 Commander
            </Link>
          </div>

          <button
            className="md:hidden text-gray-700 hover:text-orange-500 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 border-t border-gray-100 pt-4">
            <Link
              href="/"
              className="block text-gray-700 hover:text-orange-500 font-medium transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              href="/menu"
              className="block text-gray-700 hover:text-orange-500 font-medium transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Menu Fast Food
            </Link>
            <Link
              href="/daily-menu"
              className="block text-gray-700 hover:text-orange-500 font-medium transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Menu du Jour
            </Link>
            <Link
              href="/admin"
              className="block text-gray-700 hover:text-orange-500 font-medium transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin
            </Link>
            <Link
              href="/order"
              className="block bg-white border-2 border-orange-500 text-orange-600 px-6 py-2 rounded-lg hover:bg-gray-100 font-semibold transition-colors text-center mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Commander
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
