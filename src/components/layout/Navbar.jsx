import { ShoppingCart, Heart, Search, User } from 'lucide-react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <header>

      {/* Üst Şerit */}
      <div className="bg-stone-900 text-white text-xs py-2 px-6 flex items-center justify-between">
        <div></div>
        <p className="tracking-widest font-semibold">
          <span className="ml-4 underline cursor-pointer hover:text-amber-400 transition font-bold">
          </span>
        </p>
        <p className="text-stone-400 cursor-pointer hover:text-white transition">TÜRKÇE ▾</p>
      </div>

      {/* Ana Navbar */}
      <div className="bg-white text-stone-900 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <h1 className="text-xl font-bold tracking-widest">BRAND</h1>

          {/* Orta: Linkler */}
          <ul className="flex gap-8 text-sm font-medium">
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
                className="text-sm outline-none w-80 text-stone-600"
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

    </header>
  )
}

export default Navbar