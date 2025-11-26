'use client';

import Link from 'next/link';
import { useState } from 'react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">RS</span>
            </div>
            <span className="text-xl font-bold text-neutral-800 hidden sm:inline">Restaurant Sénégalais</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-neutral-700 hover:text-primary-500 font-medium transition-colors">
              Accueil
            </Link>
            <Link href="/menu" className="text-neutral-700 hover:text-primary-500 font-medium transition-colors">
              Menu Fast Food
            </Link>
            <Link href="/daily-menu" className="text-neutral-700 hover:text-primary-500 font-medium transition-colors">
              Menu du Jour
            </Link>
            <Link href="/admin" className="text-neutral-700 hover:text-secondary-500 font-medium transition-colors">
              Admin
            </Link>
            <Link href="/order" className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 font-semibold transition-colors">
              Commander
            </Link>
          </div>


          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-neutral-700 hover:text-primary-500"
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

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-neutral-200 pt-4">
            <Link
              href="/"
              className="block text-neutral-700 hover:text-primary-500 font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              href="/menu"
              className="block text-neutral-700 hover:text-primary-500 font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Menu Fast Food
            </Link>
            <Link
              href="/daily-menu"
              className="block text-neutral-700 hover:text-primary-500 font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Menu du Jour
            </Link>
            <Link
              href="/admin"
              className="block text-neutral-700 hover:text-secondary-500 font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin
            </Link>
            <Link
              href="/order"
              className="block bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 font-semibold transition-colors text-center"
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
