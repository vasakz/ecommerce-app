import {
  ShoppingCart,
  Heart,
  Search,
  User,
  Menu,
  X,
  ChevronRight,
  Settings,
  ShoppingBag,
} from 'lucide-react'
import { orders } from '../../data/orders'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import ThemeToggle from './ThemeToggle'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const cartItems = useSelector(state => state.cart.items)
  const favoritesItems = useSelector(state => state.favorites.items)

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const favoritesCount = favoritesItems.length
  const ordersCount = orders.length

  return (
    <header>
      {/* Top Bar */}
      <div className="bg-black text-white text-xs font-semibold py-1 flex justify-end px-4">
        Türkçe
      </div>

      {/* Main Navbar */}
      <div className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white border-b border-stone-200 dark:border-stone-800 transition-colors duration-300">
        <div className="px-6 py-4 flex items-center gap-8">

          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              className="hover:text-amber-500 transition"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-xl font-bold tracking-widest">BRAND</h1>
          </div>

          {/* Center */}
          <nav className="flex gap-8 text-sm font-medium flex-1 justify-center">
            <Link to="/" className="hover:text-amber-500">ANASAYFA</Link>
            <Link to="/atolye" className="hover:text-amber-500">ATÖLYEDEN</Link>
            <Link to="/urunler" className="hover:text-amber-500">ÜRÜNLER</Link>
            <Link to="/kampanyalar" className="hover:text-red-500">KAMPANYALAR</Link>
          </nav>

          {/* Right */}
          <div className="flex items-center gap-4">

            {/* Search */}
            <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded px-3 py-1 gap-2">
              <input
                type="text"
                placeholder="Aradığınız şey nedir?"
                className="text-sm outline-none w-40 bg-transparent text-stone-600 dark:text-stone-300"
              />
              <Search size={16} className="text-stone-400" />
            </div>
            {/* Favorites */}
            <Link to="/begendiklerim" className="relative">
              <Heart className="hover:text-red-500" size={20} />
              {favoritesCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/sepet" className="relative">
              <ShoppingCart className="hover:text-amber-500" size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Orders */}
            <Link to="/siparislerim" title="Siparişlerim" className="relative">
              <ShoppingBag className="hover:text-amber-500 transition" size={20} />
              {ordersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white dark:border-stone-900">
                  {ordersCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            <Link to="/profil">
              <User className="hover:text-amber-500" size={20} />
            </Link>

            {/* Divider */}
            <div className="h-6 w-[1px] bg-stone-200 dark:bg-stone-800"></div>

            {/* Auth */}
            <div className="flex items-center gap-3 text-xs font-bold">
              <Link to="/giris-yap" className="hover:text-amber-500">
                GİRİŞ YAP
              </Link>
              <Link to="/kayit-ol" className="hover:text-amber-500">
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
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-stone-900 dark:text-white z-50 shadow-2xl transform transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 dark:border-stone-700">
          <h2 className="text-base font-bold tracking-widest">KATEGORİLER</h2>
          <button onClick={() => setMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <ul className="py-4 text-sm font-medium">
          {[
            { label: 'Tüm Ürünler', to: '/urunler' },
            { label: 'Yeni Gelenler', to: '/urunler?category=Yeni Gelenler' },
            { label: 'Çantalar', to: '/urunler?category=Çantalar' },
            { label: 'Ayakkabılar', to: '/urunler?category=Ayakkabılar' },
            { label: 'Giyim', to: '/urunler?category=Giyim' },
            { label: 'Elektronik', to: '/urunler?category=Elektronik' },
            { label: 'Aksesuarlar', to: '/urunler?category=Aksesuarlar' },
            { label: 'Ev & Yaşam', to: '/urunler?category=Ev %26 Yaşam' },
            { label: 'Siparişlerim', to: '/siparislerim' },
          ].map(item => (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="flex justify-between px-6 py-3 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-amber-500"
              >
                {item.label}
                <ChevronRight size={14} />
              </Link>
            </li>
          ))}

          <li className="border-t my-3" />

          {/* Campaign */}
          <li>
            <Link
              to="/kampanyalar"
              onClick={() => setMenuOpen(false)}
              className="flex justify-between px-6 py-3 text-red-500 font-semibold hover:bg-red-50"
            >
              Kampanyalar
              <ChevronRight size={14} />
            </Link>
          </li>

          {/* Settings */}
          <li className="mt-8 px-6">
            <h3 className="text-xs text-stone-400 mb-4">AYARLAR</h3>

            <div className="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800 rounded-xl">
              <div className="flex items-center gap-3">
                <Settings size={18} />
                <span className="text-sm">Görünüm</span>
              </div>

              <ThemeToggle />
            </div>
          </li>
        </ul>
      </aside>
    </header>
  )
}

export default Navbar