import { ShoppingCart, Heart, Search, User, Menu, X, ChevronRight, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header>
      <div className="bg-black text-white text-xs font-semibold py-1 flex justify-end px-4">
        Türkçe
      </div>

      <div className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white border-b border-stone-200 dark:border-stone-800 transition-colors duration-300">
        <div className="px-6 py-4 flex items-center gap-8">

          <div className="flex items-center gap-3">
            <button onClick={() => setMenuOpen(true)}>
              <Menu size={22} />
            </button>
            <h1 className="text-xl font-bold tracking-widest">BRAND</h1>
          </div>

          <ul className="flex gap-8 text-sm font-medium flex-1 justify-center">
            <Link to="/">ANASAYFA</Link>
            <Link to="/atolye">ATÖLYEDEN</Link>
            <Link to="/urunler">ÜRÜNLER</Link>
            <Link to="/kampanyalar">KAMPANYALAR</Link>
          </ul>

          <div className="flex items-center gap-4">

            <div className="flex items-center border rounded px-3 py-1 gap-2">
              <input
                type="text"
                placeholder="Aradığınız şey nedir?"
                className="text-sm outline-none w-40 bg-transparent"
              />
              <Search size={16} />
            </div>

            <Link to="/begendiklerim">
              <Heart size={20} />
            </Link>

            <Link to="/sepet">
              <ShoppingCart size={20} />
            </Link>

            <Link to="/profil">
              <User size={20} />
            </Link>

            <div className="h-6 w-[1px] bg-stone-300"></div>

            <Link to="/giris-yap" className="text-xs font-bold">
              GİRİŞ YAP
            </Link>

            <Link to="/kayit-ol" className="text-xs font-bold">
              KAYIT OL
            </Link>

          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setMenuOpen(false)} />
      )}

      <div className={`fixed top-0 left-0 h-full w-72 bg-white z-50 transform ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h2 className="text-base font-bold">KATEGORİLER</h2>
          <button onClick={() => setMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <ul className="py-4 text-sm">
          {[
            { label: 'Tüm Ürünler', to: '/urunler' },
            { label: 'Yeni Gelenler', to: '/urunler?category=Yeni Gelenler' }
          ].map((item) => (
            <li key={item.to}>
              <Link to={item.to} onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            </li>
          ))}

          <li className="mt-6 px-6">
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </header>
  )
}

export default Navbar