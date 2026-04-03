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

          {/* Sol: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            <button onClick={() => setMenuOpen(true)} className="hover:text-amber-500 transition">
              <Menu size={22} />
            </button>
            <h1 className="text-xl font-bold tracking-widest">BRAND</h1>
          </div>

          {/* Orta: Linkler */}
          <ul className="flex gap-8 text-sm font-medium flex-1 justify-center">
            <Link to="/" className="hover:text-amber-500 cursor-pointer transition">ANASAYFA</Link>
            <Link to="/atolye" className="hover:text-amber-500 cursor-pointer transition">ATÖLYEDEN</Link>
            <Link to="/urunler" className="hover:text-amber-500 cursor-pointer transition">ÜRÜNLER</Link>
            <Link to="/kampanyalar" className="hover:text-red-500 cursor-pointer transition">KAMPANYALAR</Link>
          </ul>

          {/* Sağ: Arama + İkonlar + Auth */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded px-3 py-1 gap-2">
              <input
                type="text"
                placeholder="Aradığınız şey nedir?"
                className="text-sm outline-none w-40 bg-transparent text-stone-600 dark:text-stone-300"
              />
              <Search size={16} className="text-stone-400" />
            </div>
            <Link to="/begendiklerim" aria-label="Beğendiklerim">
              <Heart size={20} className="cursor-pointer hover:text-red-500 transition" />
            </Link>
            <Link to="/sepet" aria-label="Sepet">
              <ShoppingCart size={20} className="cursor-pointer hover:text-amber-500 transition" />
            </Link>
            <User size={20} className="cursor-pointer hover:text-amber-500 transition" />
            <Link to="/giris-yap" className="text-sm font-medium hover:text-amber-500 transition">GİRİŞ YAP</Link>
            <Link to="/kayit-ol" className="text-sm font-medium hover:text-amber-500 transition">KAYIT OL</Link>
          </div>

        </div>
      </div>

      {/* Sidebar Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-stone-900 dark:text-white z-50 shadow-2xl transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Sidebar Başlık */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200">
          <h2 className="text-base font-bold tracking-widest">KATEGORİLER</h2>
          <button onClick={() => setMenuOpen(false)} className="hover:text-amber-500 transition">
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Menü */}
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

          {/* Ayraç */}
          <li className="border-t border-stone-200 my-3" />

          {/* Kampanyalar - kırmızı */}
          <li>
            <Link
              to="/kampanyalar"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between px-6 py-3 hover:bg-red-50 dark:hover:bg-red-950/20 transition text-red-500 font-semibold"
            >
              Kampanyalar
              <ChevronRight size={14} className="text-red-400" />
            </Link>
          </li>

          {/* Ayarlar Bölümü (Cyber/Sidebar Settings) */}
          <li className="mt-8 px-6">
            <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-4">AYARLAR</h3>
            <div className="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-stone-700 rounded-lg shadow-sm">
                  <Settings size={18} className="text-stone-600 dark:text-stone-300" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-800 dark:text-stone-100">Görünüm</p>
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