import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-neutral-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-primary-400">Restaurant Sénégalais</h3>
            <p className="text-neutral-300 text-sm">
              Découvrez les saveurs authentiques du Sénégal avec notre fast food et notre menu du jour.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-primary-400">Liens Rapides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/menu" className="text-neutral-300 hover:text-primary-400 transition-colors">
                  Menu Fast Food
                </Link>
              </li>
              <li>
                <Link href="/daily-menu" className="text-neutral-300 hover:text-primary-400 transition-colors">
                  Menu du Jour
                </Link>
              </li>
              <li>
                <Link href="/order" className="text-neutral-300 hover:text-primary-400 transition-colors">
                  Commander
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-neutral-300 hover:text-primary-400 transition-colors">
                  Administration
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-primary-400">Contact</h3>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>📍 Dakar, Sénégal</li>
              <li>📞 +221 XX XXX XX XX</li>
              <li>🕒 Lun-Dim: 10h00 - 22h00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-700 mt-8 pt-6 text-center text-sm text-neutral-400">
          <p>&copy; {new Date().getFullYear()} Restaurant Sénégalais. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
