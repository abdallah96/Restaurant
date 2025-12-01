import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-orange-700 via-orange-600 to-orange-600 mt-auto overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 african-pattern opacity-10"></div>
      
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src="/images/logo.svg"
                alt="Keur Gui Logo"
                width={48}
                height={48}
                className="object-contain"
              />
              <div>
                <h3 className="text-2xl font-bold text-orange-400">Keur Gui</h3>
                <p className="text-sm text-gray-900 font-medium bg-white/90 px-3 py-1 rounded-full inline-block">🇸🇳 Restaurant Sénégalais</p>
              </div>
            </div>
            <p className="text-gray-900 text-sm leading-relaxed mb-4 font-medium bg-white/90 backdrop-blur-sm px-4 py-3 rounded-xl">
              Découvrez les saveurs authentiques du Sénégal. Fast food moderne et plats traditionnels préparés avec amour et passion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-orange-400">
              <span>🔗</span> Liens Rapides
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/menu" className="text-gray-900 font-medium bg-white/80 px-3 py-1 rounded-lg inline-block hover:bg-white transition-all hover:translate-x-1 transform">
                  ➜ Menu Fast Food
                </Link>
              </li>
              <li>
                <Link href="/daily-menu" className="text-gray-900 font-medium bg-white/80 px-3 py-1 rounded-lg inline-block hover:bg-white transition-all hover:translate-x-1 transform">
                  ➜ Menu du Jour
                </Link>
              </li>
              <li>
                <Link href="/order" className="text-gray-900 font-medium bg-white/80 px-3 py-1 rounded-lg inline-block hover:bg-white transition-all hover:translate-x-1 transform">
                  ➜ Commander
                </Link>
              </li>
            </ul>
          </div>

          {/* Delivery Zones */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-orange-400">
              <span>🚴</span> Zones de Livraison
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-900 font-medium bg-white/80 px-3 py-2 rounded-lg">
                Ouakam
              </li>
              <li className="text-gray-900 font-medium bg-white/80 px-3 py-2 rounded-lg">
                Yoff
              </li>
              <li className="text-gray-900 font-medium bg-white/80 px-3 py-2 rounded-lg">
                Ville
              </li>
              <li className="text-gray-900 font-medium bg-white/80 px-3 py-2 rounded-lg">
                Almadie
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-orange-400">
              <span>📞</span> Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-gray-900 font-medium bg-white/80 px-3 py-2 rounded-lg">
                <span>📍</span>
                <span>Ouakam, en face du Lycée Jean Mermoz</span>
              </li>
              <li className="flex items-start gap-2 text-gray-900 font-medium bg-white/80 px-3 py-2 rounded-lg">
                <span>📞</span>
                <span>+221 77 612 83 50 / +221 77 410 52 70</span>
              </li>
              {/* <li className="flex items-start gap-2 text-gray-900 font-medium bg-white/80 px-3 py-2 rounded-lg">
                <span>✉️</span>
                <span>contact@keurgui.sn</span>
              </li> */}
              <li className="flex items-start gap-2 text-gray-900 font-medium bg-white/80 px-3 py-2 rounded-lg">
                <span>🕒</span>
                <div>
                  <div>Lun-Sam</div>
                  <div className="text-xs">07:30 - 22:30</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-900 text-sm font-medium bg-white/80 px-4 py-2 rounded-lg">
              &copy; {new Date().getFullYear()} Keur Gui. Tous droits réservés.
            </p>
            <Link href="https://g-tech.dev" className="text-gray-900 text-xs font-medium bg-white/80 px-4 py-2 rounded-lg">
              By G-Tech
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
