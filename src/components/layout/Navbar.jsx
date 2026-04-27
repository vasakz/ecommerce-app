import {
  ShoppingCart, Heart, Search, User, Menu, X,
  ChevronRight, Settings, TrendingUp, ShoppingBag,
} from 'lucide-react'
import { orders } from '../../data/orders'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import ThemeToggle from './ThemeToggle'
import { MOCK_PRODUCTS } from '../../data/products'

const POPULER_ARAMALAR = ['Deri Çanta', 'Makrome', 'Seramik', 'Ahşap Tabak', 'El Yapımı']

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [aramaMetni, setAramaMetni] = useState('')
  const [aramaBos, setAramaBos] = useState(false)
  const [oneriler, setOneriler] = useState([])
  const aramaRef = useRef(null)
  const navigate = useNavigate()

  const cartItems = useSelector(state => state.cart.items)
  const favoritesItems = useSelector(state => state.favorites.items)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const favoritesCount = favoritesItems.length
  const ordersCount = orders.length

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (aramaRef.current && !aramaRef.current.contains(e.target)) {
        setAramaBos(false)
        setOneriler([])
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAramaChange = (e) => {
    const val = e.target.value
    setAramaMetni(val)
    if (val.trim() === '') {
      setOneriler([])
      setAramaBos(true)
    } else {
      setAramaBos(false)
      const eslesme = MOCK_PRODUCTS
        .filter(p =>
          p.name.toLowerCase().includes(val.toLowerCase()) ||
          (p.brand && p.brand.toLowerCase().includes(val.toLowerCase())) ||
          (p.category && p.category.toLowerCase().includes(val.toLowerCase()))
        )
        .slice(0, 6)
      setOneriler(eslesme)
    }
  }

  const handleAramaFocus = () => {
    if (aramaMetni.trim() === '') setAramaBos(true)
  }

  const handleAramaSubmit = (e) => {
    if (e) e.preventDefault()
    if (aramaMetni.trim()) {
      navigate(`/urunler?q=${encodeURIComponent(aramaMetni)}`)
      setOneriler([])
      setAramaBos(false)
    }
  }

  const handleOneriTikla = (urun) => {
    navigate(`/urunler/${urun.id}`)
    setAramaMetni('')
    setOneriler([])
    setAramaBos(false)
  }

  const handlePopulerTikla = (kelime) => {
    navigate(`/urunler?q=${encodeURIComponent(kelime)}`)
    setAramaMetni(kelime)
    setAramaBos(false)
    setOneriler([])
  }

  const dropdownAcik = aramaBos || oneriler.length > 0

  return (
    <header className="sticky top-0 z-30">
      <div className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white border-b border-stone-200 dark:border-stone-800 transition-colors duration-300">
        <div className="px-6 py-3 flex items-center gap-4">

          {/* Sol: Hamburger + Brand */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <button onClick={() => setMenuOpen(true)} className="hover:text-amber-500 transition">
              <Menu size={22} />
            </button>
            <Link to="/" className="text-xl font-bold tracking-widest hover:text-amber-500 transition">BRAND</Link>
          </div>

          {/* Nav linkleri */}
          <div className="flex items-center gap-6 flex-shrink-0">
            <Link to="/" className="text-sm font-medium hover:text-amber-500 transition whitespace-nowrap">ANASAYFA</Link>
            <Link to="/atolye" className="text-sm font-medium hover:text-amber-500 transition whitespace-nowrap">ATÖLYEDEN</Link>
            <Link to="/urunler" className="text-sm font-medium hover:text-amber-500 transition whitespace-nowrap">ÜRÜNLER</Link>
          </div>

          {/* Arama — flex-1 ile uzun */}
          <div ref={aramaRef} className="relative flex-1">
            <form onSubmit={handleAramaSubmit}>
              <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded px-3 py-1.5 gap-2 focus-within:border-stone-500 transition w-full">
                <Search size={15} className="text-stone-400 flex-shrink-0" />
                <input
                  type="text"
                  value={aramaMetni}
                  onChange={handleAramaChange}
                  onFocus={handleAramaFocus}
                  placeholder="Aradığınız şey nedir?"
                  className="text-sm outline-none flex-1 bg-transparent text-stone-600 dark:text-stone-300 placeholder:text-stone-400"
                />
                {aramaMetni && (
                  <button type="button" onClick={() => { setAramaMetni(''); setOneriler([]); setAramaBos(true) }}>
                    <X size={14} className="text-stone-400 hover:text-stone-600" />
                  </button>
                )}
              </div>
            </form>

            {dropdownAcik && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl shadow-xl z-50 overflow-hidden">
                {aramaBos && oneriler.length === 0 && (
                  <div className="p-3">
                    <p className="text-[10px] font-bold tracking-widest text-stone-400 uppercase mb-2 flex items-center gap-1.5">
                      <TrendingUp size={11} /> Popüler Aramalar
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {POPULER_ARAMALAR.map(k => (
                        <button key={k} onClick={() => handlePopulerTikla(k)}
                          className="px-3 py-1 rounded-full border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-300 hover:border-stone-800 hover:text-stone-800 dark:hover:text-white transition">
                          {k}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {oneriler.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-stone-400 uppercase px-3 pt-3 pb-1">Ürünler</p>
                    {oneriler.map(urun => (
                      <button key={urun.id} onClick={() => handleOneriTikla(urun)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-stone-50 dark:hover:bg-stone-800 transition text-left">
                        <div className="w-9 h-9 rounded-md bg-stone-100 dark:bg-stone-700 overflow-hidden flex-shrink-0">
                          {urun.image && <img src={urun.image} alt={urun.name} className="w-full h-full object-cover" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-stone-800 dark:text-stone-100 truncate">{urun.name}</p>
                          <p className="text-xs text-stone-400">{urun.category}</p>
                        </div>
                        <span className="text-sm font-semibold text-stone-700 dark:text-stone-200 flex-shrink-0">
                          {typeof urun.price === 'number' ? urun.price.toLocaleString('tr-TR') : urun.price} ₺
                        </span>
                      </button>
                    ))}
                    <div className="border-t border-stone-100 dark:border-stone-700 px-3 py-2">
                      <button onClick={() => handleAramaSubmit()}
                        className="text-xs text-amber-500 hover:text-amber-600 font-medium">
                        "{aramaMetni}" için tüm sonuçları gör →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sağ: Kampanyalar + İkonlar + Auth */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link to="/kampanyalar" className="text-sm font-medium hover:text-red-500 transition whitespace-nowrap">KAMPANYALAR</Link>

            <Link to="/begendiklerim" className="relative">
              <Heart className="hover:text-red-500" size={20} />
              {favoritesCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Link>

            <Link to="/sepet" className="relative">
              <ShoppingCart className="hover:text-amber-500" size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link to="/siparislerim" title="Siparişlerim" className="relative">
              <ShoppingBag className="hover:text-amber-500 transition" size={20} />
              {ordersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white dark:border-stone-900">
                  {ordersCount}
                </span>
              )}
            </Link>

            <Link to="/profil">
              <User className="hover:text-amber-500" size={20} />
            </Link>

            <div className="h-6 w-[1px] bg-stone-200 dark:bg-stone-800"></div>

            <div className="flex items-center gap-3 text-xs font-bold">
              <Link to="/giris-yap" className="hover:text-amber-500 whitespace-nowrap">GİRİŞ YAP</Link>
              <Link to="/kayit-ol" className="hover:text-amber-500 whitespace-nowrap">KAYIT OL</Link>
            </div>
          </div>

        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-stone-900 dark:text-white z-50 shadow-2xl transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 dark:border-stone-700">
          <h2 className="text-base font-bold tracking-widest">KATEGORİLER</h2>
          <button onClick={() => setMenuOpen(false)}><X size={20} /></button>
        </div>
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
            { label: 'İadelerim', to: '/iadelerim' },
          ].map(item => (
            <li key={item.to}>
              <Link to={item.to} onClick={() => setMenuOpen(false)}
                className="flex justify-between px-6 py-3 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-amber-500">
                {item.label}
                <ChevronRight size={14} />
              </Link>
            </li>
          ))}
          <li className="border-t my-3" />
          <li className="px-6 mb-2">
             <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mt-4 mb-2">SATICI MENÜSÜ</h3>
          </li>
          <li>
            <Link to="/satici/istatistikler" onClick={() => setMenuOpen(false)}
              className="flex justify-between px-6 py-3 hover:bg-amber-50 dark:hover:bg-amber-900/10 text-amber-600 font-bold">
              Satıcı Paneli
              <ChevronRight size={14} />
            </Link>
          </li>
          <li>
            <Link to="/satici/urunler" onClick={() => setMenuOpen(false)}
              className="flex justify-between px-6 py-3 hover:bg-stone-50 dark:hover:bg-stone-800">
              Ürün Yönetimi
              <ChevronRight size={14} />
            </Link>
          </li>
          <li>
            <Link to="/satici/siparisler" onClick={() => setMenuOpen(false)}
              className="flex justify-between px-6 py-3 hover:bg-stone-50 dark:hover:bg-stone-800">
              Siparişler
              <ChevronRight size={14} />
            </Link>
          </li>
          <li>
            <Link to="/satici/iadeler" onClick={() => setMenuOpen(false)}
              className="flex justify-between px-6 py-3 hover:bg-stone-50 dark:hover:bg-stone-800">
              İade Talepleri
              <ChevronRight size={14} />
            </Link>
          </li>
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