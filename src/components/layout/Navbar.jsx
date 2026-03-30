import { ShoppingCart, Heart, Search, User, Menu, X, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header>

      {/* Üst Şerit */}
      <div className="bg-stone-900 text-white text-xs py-2 px-6 flex items-center justify-between">
        <div></div>
        <p className="tracking-widest font-semibold">
          <span className="ml-4 underline cursor-pointer hover:text-amber-400 transition font-bold"></span>
        </p>
        <p className="text-stone-400 cursor-pointer hover:text-white transition">TÜRKÇE ▾</p>
      </div>

      {/* Ana Navbar */}
      <div className="bg-white text-stone-900 border-b border-stone-200">
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
            <li className="hover:text-amber-500 cursor-pointer transition">ÜRÜNLER</li>
            <li className="hover:text-red-500 cursor-pointer transition">KAMPANYALAR</li>
          </ul>

          {/* Sağ: Arama + İkonlar + Auth */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-stone-300 rounded px-3 py-1 gap-2">
              <input
                type="text"
                placeholder="Aradığınız şey nedir?"
                className="text-sm outline-none w-48 text-stone-600"
              />
              <Search size={16} className="text-stone-400" />
            </div>
            <Heart size={20} className="cursor-pointer hover:text-red-500 transition" />
            <ShoppingCart size={20} className="cursor-pointer hover:text-amber-500 transition" />
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
      <div className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>

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
            { label: 'Yeni Gelenler', to: '/yeni-gelenler' },
            { label: 'Çantalar', to: '/cantalar' },
            { label: 'Cüzdanlar & Kartlıklar', to: '/cuzdanlar' },
            { label: 'Kemerler', to: '/kemerler' },
            { label: 'Ayakkabılar', to: '/ayakkabilar' },
            { label: 'Aksesuarlar', to: '/aksesuarlar' },
            { label: 'Ev & Yaşam', to: '/ev-yasam' },
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
              className="flex items-center justify-between px-6 py-3 hover:bg-red-50 transition text-red-500 font-semibold"
            >
              Kampanyalar
              <ChevronRight size={14} className="text-red-400" />
            </Link>
          </li>
        </ul>
      </div>

    </header>
  )
}

export default Navbar