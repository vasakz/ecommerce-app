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

      {/* Ana Navbar */}
      <div className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white border-b border-stone-200 dark:border-stone-800 transition-colors duration-300">
        <div className="px-6 py-4 flex items-center gap-8">

          {/* Sol */}
          <div className="flex items-center gap-3">
            <button onClick={() => setMenuOpen(true)} className="hover:text-amber-500 transition">
              <Menu size={22} />
            </button>
            <h1 className="text-xl font-bold tracking-widest">BRAND</h1>
          </div>

          {/* Orta */}
          <ul className="flex gap-8 text-sm font-medium flex-1 justify-center">
            <Link to="/" className="hover:text-amber-500 transition">ANASAYFA</Link>
            <Link to="/atolye" className="hover:text-amber-500 transition">ATÖLYEDEN</Link>
            <Link to="/urunler" className="hover:text-amber-500 transition">ÜRÜNLER</Link>
            <Link to="/kampanyalar" className="hover:text-red-500 transition">KAMPANYALAR</Link>
          </ul>

          {/* Sağ */}
          <div className="flex items-center gap-4">

            {/* Arama */}
            <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded px-3 py-1 gap-2">
              <input
                type="text"
                placeholder="Aradığınız şey nedir?"
                className="text-sm outline-none w-40 bg-transparent text-stone-600 dark:text-stone-300"
              />
              <Search size={16} className="text-stone-400" />
            </div>

            {/* İkonlar */}
            <div className="flex items-center gap-4">
              <Link to="/begendiklerim">
                <Heart size={20} className="cursor-pointer hover:text-red-500 transition" />
              </Link>

              <Link to="/sepet">
                <ShoppingCart size={20} className="cursor-pointer hover:text-amber-500 transition" />
              </Link>

              <User size={20} className="cursor-pointer hover:text-amber-500 transition" />
            </div>

            {/* Ayraç */}
            <div className="h-6 w-[1px] bg-stone-200 dark:bg-stone-800 mx-1"></div>

            {/* Auth */}
            <div className="flex items-center gap-3">
              <Link to="/giris-yap" className="text-xs font-bold hover:text-amber-500 transition">
                GİRİŞ YAP
              </Link>
              <Link to="/kayit-ol" className="text-xs font-bold hover:text-amber-500 transition">
                KAYIT OL
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-stone-900 dark:text-white z-50 shadow-2xl transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200">
          <h2 className="text-base font-bold tracking-widest">KATEGORİLER</h2>
          <button onClick={() => setMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <ul className="py-4 text-sm font-medium text-stone-800">
          {[
            { label: 'Tüm Ürünler', to: '/urunler' },
            { label: 'Yeni Gelenler', to: '/urunler?category=Yeni Gelenler' },
            { label: 'Çantalar', to: '/urunler?category=Çantalar' },
            { label: 'Ayakkabılar', to: '/urunler?category=Ayakkabılar' },
            { label: 'Giyim', to: '/urunler?category=Giyim' },
            { label: 'Elektronik', to: '/urunler?category=Elektronik' },
            { label: 'Aksesuarlar', to: '/urunler?category=Aksesuarlar' },
            { label: 'Ev & Yaşam', to: '/urunler?category=Ev %26 Yaşam' },
          ].map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-6 py-3 hover:bg-stone-100 hover:text-amber-500 transition"
              >
                {item.label}
                <ChevronRight size={14} className="text-stone-400" />
              </Link>
            </li>
          ))}

          <li className="border-t border-stone-200 my-3" />

          <li>
            <Link
              to="/kampanyalar"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between px-6 py-3 text-red-500 font-semibold"
            >
              Kampanyalar
              <ChevronRight size={14} className="text-red-400" />
            </Link>
          </li>

          <li className="mt-8 px-6">
            <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-4">AYARLAR</h3>
            <div className="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border">
              <div className="flex items-center gap-3">
                <Settings size={18} />
                <div>
                  <p className="text-xs font-bold">Görünüm</p>
                  <p className="text-[10px] text-stone-400">Koyu / Aydınlık</p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </li>
        </ul>
      </div>

    </header>
  )
}

export default Navbar