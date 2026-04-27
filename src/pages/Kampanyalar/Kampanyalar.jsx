import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { 
  Sparkles, 
  Search, 
  Filter, 
  Clock, 
  ShoppingBag, 
  ArrowUpRight, 
  Tag, 
  Navigation,
  ChevronRight,
  Zap,
  Ticket
} from 'lucide-react'
import { OFFERS } from '../../data/offers'
import { MOCK_PRODUCTS } from '../../data/products'
import { addToCart } from '../../store/slices/cartSlice'
import { toast } from 'react-toastify'

const formatRemaining = (endsAt) => {
  const ms = new Date(endsAt).getTime() - Date.now()
  if (ms <= 0) return 'Süre Doldu'

  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (days > 0) return `${days} gün kaldı`
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

function Kampanyalar() {
  const dispatch = useDispatch()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Tümü')
  const [tick, setTick] = useState(0)
  const [offers, setOffers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOffers = async () => {
      setIsLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setOffers(OFFERS)
      } catch (error) {
        console.error("Kampanyalar yüklenemedi", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOffers()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  const addOfferToCart = (offer) => {
    const product = MOCK_PRODUCTS.find((p) => p.id === offer.productId)
    if (product) {
      const discountedPrice = Math.round(product.price * (1 - offer.discount / 100))
      dispatch(
        addToCart({
          id: product.id,
          isim: product.name,
          fiyat: `${discountedPrice}TL`,
          image: product.image,
        })
      )
      toast.success(`${product.name} sepete eklendi!`, {
        icon: <ShoppingBag className="text-amber-500" />,
        className: "dark:bg-stone-900 border border-stone-800"
      })
      return
    }
    toast.error("Ürün bulunamadı.")
  }

  const categories = useMemo(() => ['Tümü', ...new Set(OFFERS.map((o) => o.category))], [])

  const filtered = useMemo(
    () =>
      offers.filter((offer) => {
        const matchesCategory = activeCategory === 'Tümü' || offer.category === activeCategory
        const matchesSearch =
          offer.title.toLowerCase().includes(search.toLowerCase()) ||
          offer.description.toLowerCase().includes(search.toLowerCase())
        return matchesCategory && matchesSearch
      }),
    [activeCategory, search, offers]
  )

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      
      {/* Cinematic Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover scale-110 animate-pulse-slow"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-stone-50 dark:to-stone-950"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-6 shadow-2xl">
            <Sparkles className="w-4 h-4" />
            Özel Fırsatlar Keşfedilmeyi Bekliyor
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            Sezonun En <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Şık</span> Kampanyaları
          </h1>
          <p className="text-stone-300 md:text-xl font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            Stiliniz için küratörlüğünü yaptığımız benzersiz teklifleri ve sınırlı süreli indirimleri keşfedin.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#firsatlar" className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black transition-all shadow-xl shadow-amber-500/30 active:scale-95">
              Kampanyaları Gör
            </a>
            <Link to="/urunler" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-2xl font-black transition-all active:scale-95">
              Yeni Gelenler
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16" id="firsatlar">
        
        {/* Modern Filter & Search Bar */}
        <div className="sticky top-24 z-30 mb-20">
          <div className="bg-white/70 dark:bg-stone-900/70 backdrop-blur-2xl p-4 md:p-6 rounded-[2.5rem] border border-white/20 dark:border-stone-800/50 shadow-2xl flex flex-col lg:flex-row items-center gap-6">
            
            {/* Search Input */}
            <div className="relative flex-1 group w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-amber-500 transition-colors" />
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Örn: Hafta Sonu, İndirim, Kargo..."
                className="w-full pl-14 pr-6 py-4 bg-stone-100/50 dark:bg-stone-800/50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 transition-all font-bold text-sm"
              />
            </div>

            {/* Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none w-full lg:w-auto px-2">
              <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-xl mr-2">
                <Filter className="w-4 h-4 text-stone-500" />
              </div>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border
                    ${activeCategory === cat 
                      ? 'bg-stone-900 dark:bg-amber-500 text-white border-stone-900 dark:border-amber-400 shadow-lg shadow-amber-500/20' 
                      : 'bg-white dark:bg-stone-800 text-stone-500 border-gray-100 dark:border-stone-700 hover:border-amber-500/50 hover:bg-amber-50 dark:hover:bg-amber-900/20'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Campaign Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
             Array.from({ length: 6 }).map((_, i) => (
               <div key={i} className="aspect-[4/5] rounded-[2.5rem] bg-stone-200 dark:bg-stone-900 animate-pulse"></div>
             ))
          ) : filtered.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <div className="w-24 h-24 bg-stone-100 dark:bg-stone-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-stone-300" />
              </div>
              <h3 className="text-2xl font-black text-stone-900 dark:text-white">Hiçbir fırsat bulunamadı</h3>
              <p className="text-stone-500 dark:text-stone-400 mt-2">Arama kriterlerinizi değiştirmeyi deneyin.</p>
            </div>
          ) : (
            filtered.map((offer) => (
              <article 
                key={offer.id} 
                className="group relative h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-stone-900/20 transition-all duration-700 hover:scale-[1.02] hover:-translate-y-2"
              >
                {/* Image Background */}
                <img 
                  src={offer.image} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  alt={offer.title}
                />
                
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-amber-600/10 transition-opacity duration-700"></div>

                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                   <div className="px-4 py-2 rounded-xl bg-white/90 backdrop-blur-md text-stone-900 text-[10px] font-black uppercase tracking-widest shadow-xl">
                      {offer.badge}
                   </div>
                   <div className="px-4 py-2 rounded-xl bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-1.5 animate-pulse">
                      <Zap className="w-3 h-3" />
                      {offer.category}
                   </div>
                </div>

                {/* Countdown Floating Card */}
                <div className="absolute top-6 right-6 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 text-white text-[10px] font-black flex items-center gap-2">
                   <Clock className="w-3.5 h-3.5 text-amber-500" />
                   {formatRemaining(offer.endsAt)}
                </div>

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-8 pt-20">
                   <div className="mb-4 translate-y-4 transition-transform group-hover:translate-y-0 duration-700">
                      <h2 className="text-3xl font-black text-white leading-tight mb-2 group-hover:text-amber-400 transition-colors">
                        {offer.title}
                      </h2>
                      <p className="text-stone-300 text-sm font-medium line-clamp-2">
                        {offer.description}
                      </p>
                   </div>

                   <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0 transition-all duration-700 delay-100">
                      <button 
                        onClick={() => addOfferToCart(offer)}
                        className="flex-1 px-6 py-4 bg-white hover:bg-amber-500 hover:text-white text-stone-900 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 active:scale-95"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Sepete Ekle
                      </button>
                      <Link 
                        to={`/kampanyalar/${offer.id}`}
                        className="p-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/25 text-white rounded-2xl transition-all active:scale-95"
                      >
                         <ChevronRight className="w-6 h-6" />
                      </Link>
                   </div>
                   
                   {/* Discount Tag */}
                   <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-6">
                      <Tag className="w-5 h-5 text-amber-500" />
                      <span className="text-2xl font-black text-white">
                        {offer.discount > 0 ? `%${offer.discount} İndirim` : 'Ücretsiz Kargo'}
                      </span>
                   </div>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Promo Banner */}
        <section className="mt-32 relative rounded-[3rem] overflow-hidden p-12 md:p-20 bg-stone-900">
           <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=2000" 
                className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000"
                alt="Promo Banner"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/60 to-transparent"></div>
           </div>
           
           <div className="relative z-10 max-w-2xl">
              <div className="p-3 bg-amber-500 w-fit rounded-2xl text-white shadow-2xl mb-8">
                 <Ticket className="w-8 h-8" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Özel Kupon Kodlarını Kaçırmayın
              </h2>
              <p className="text-stone-400 text-lg font-medium mb-10">
                E-bültenimize abone olun, haftalık gizli indirim kodları ve özel koleksiyon duyurularını ilk siz alın.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                 <input 
                  type="email" 
                  placeholder="E-posta adresiniz..."
                  className="flex-1 px-8 py-4 bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                 />
                 <button className="px-10 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black transition-all shadow-xl shadow-amber-500/30 active:scale-95 whitespace-nowrap">
                   Abone Ol
                 </button>
              </div>
           </div>
        </section>

        {/* Floating Call to Action */}
        <div className="mt-20 text-center">
           <div className="inline-flex items-center gap-6 p-2 pr-8 bg-stone-100 dark:bg-stone-900 rounded-full border border-stone-200 dark:border-stone-800 animate-bounce-slow">
              <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-lg">
                 <Navigation className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-sm font-black text-stone-900 dark:text-white tracking-tight">Hala ne bekliyorsun?</p>
                 <Link to="/urunler" className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1 uppercase tracking-widest">
                    Koleksiyonu Keşfet <ArrowUpRight className="w-3 h-3" />
                 </Link>
              </div>
           </div>
        </div>

      </div>
    </main>
  )
}

export default Kampanyalar
