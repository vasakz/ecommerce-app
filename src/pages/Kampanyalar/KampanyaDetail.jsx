import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Clock, 
  Tag, 
  ChevronRight, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  Zap,
  Package,
  TrendingUp,
  Ticket
} from 'lucide-react'
import { OFFERS } from '../../data/offers'
import { MOCK_PRODUCTS } from '../../data/products'

function KampanyaDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tick, setTick] = useState(0)
  
  const offer = OFFERS.find((item) => String(item.id) === String(id))

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!offer) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 px-6">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-stone-900 dark:text-white mb-4 tracking-tight">Kampanya Bulunamadı</h1>
          <p className="text-stone-500 dark:text-stone-400 mb-8 font-medium">Aradığınız kampanya yayından kaldırılmış veya süresi dolmuş olabilir.</p>
          <Link
            to="/kampanyalar"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-amber-500 text-white font-black hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/25 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
            Tüm Kampaniyalara Dön
          </Link>
        </div>
      </main>
    )
  }

  const formatTime = (endsAt) => {
    const ms = new Date(endsAt).getTime() - Date.now()
    if (ms <= 0) return 'SÜRE DOLDU'
    const totalSeconds = Math.floor(ms / 1000)
    const d = Math.floor(totalSeconds / 86400)
    const h = Math.floor((totalSeconds % 86400) / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    return `${d > 0 ? d + 'g ' : ''}${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const matchedProducts = offer.category === 'Genel'
    ? MOCK_PRODUCTS.slice(0, 8)
    : MOCK_PRODUCTS.filter((product) => product.category === offer.category).slice(0, 8)

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 pb-20">
      
      {/* Dynamic Header / Hero */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img 
          src={offer.image} 
          className="absolute inset-0 w-full h-full object-cover"
          alt={offer.title}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-stone-950/60 to-stone-50 dark:to-stone-950"></div>
        
        <div className="absolute inset-x-0 bottom-0 max-w-7xl mx-auto px-6 pb-12">
           <button 
             onClick={() => navigate(-1)}
             className="mb-8 p-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl hover:bg-white/20 transition-all active:scale-95"
           >
             <ArrowLeft className="w-6 h-6" />
           </button>

           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-2xl">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg mb-4 shadow-lg shadow-amber-500/30 animate-bounce-slow">
                    <Zap className="w-3 h-3" />
                    {offer.badge}
                 </div>
                 <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 tracking-tighter">
                   {offer.title}
                 </h1>
                 <p className="text-stone-300 md:text-xl font-medium leading-relaxed">
                   {offer.description}
                 </p>
              </div>

              <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-6 md:p-8 min-w-[240px] text-center shadow-2xl">
                 <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-2">Kalan Süre</p>
                 <div className="flex items-center justify-center gap-3 text-4xl md:text-5xl font-black text-white font-mono">
                    <Clock className="w-8 h-8 text-amber-500" />
                    {formatTime(offer.endsAt)}
                 </div>
              </div>
           </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Campaign Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-10 relative z-10 mb-20">
           {[
             { label: 'İndirim Oranı', value: offer.discount > 0 ? `%${offer.discount}` : 'Kargo Bedava', icon: <Tag className="text-blue-500" /> },
             { label: 'Kategori', value: offer.category, icon: <Package className="text-purple-500" /> },
             { label: 'Popülarite', value: 'Çok Yüksek', icon: <TrendingUp className="text-emerald-500" /> },
             { label: 'Güvenli Ödeme', value: '256-bit SSL', icon: <ShieldCheck className="text-amber-500" /> },
           ].map((stat, i) => (
             <div key={i} className="bg-white dark:bg-stone-900 p-6 rounded-3xl shadow-xl shadow-stone-950/5 border border-gray-100 dark:border-stone-800 flex flex-col items-center text-center gap-2 group hover:border-amber-500/50 transition-all">
                <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-2xl group-hover:bg-amber-50 dark:group-hover:bg-amber-900/20 transition-colors">
                  {React.cloneElement(stat.icon, { className: 'w-6 h-6' })}
                </div>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{stat.label}</p>
                <p className="font-bold text-stone-900 dark:text-white">{stat.value}</p>
             </div>
           ))}
        </div>

        {/* Featured Products Section */}
        <section>
          <div className="flex items-center justify-between mb-10">
             <div>
                <h2 className="text-3xl font-black text-stone-900 dark:text-white tracking-tight">Kampanyalı Ürünler</h2>
                <p className="text-stone-500 mt-1 font-medium">Bu kampanyaya dahil olan seçkin koleksiyonumuz.</p>
             </div>
             <Link to="/urunler" className="p-4 bg-stone-100 dark:bg-stone-900 rounded-full text-stone-900 dark:text-white hover:bg-amber-500 hover:text-white transition-all shadow-sm">
                <ChevronRight className="w-6 h-6" />
             </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {matchedProducts.map((product) => {
               const discountedPrice = offer.discount > 0 
                ? Math.round(product.price * (1 - offer.discount / 100))
                : product.price;

               return (
                <Link
                  key={product.id}
                  to={`/urunler/${product.id}`}
                  className="group bg-white dark:bg-stone-900 rounded-[2.5rem] border border-gray-100 dark:border-stone-800 overflow-hidden shadow-xl shadow-stone-950/5 hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="relative aspect-square overflow-hidden bg-stone-100 dark:bg-stone-800">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-2xl text-stone-900 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-4 group-hover:translate-y-0">
                       <ShoppingBag className="w-5 h-5" />
                    </div>
                    {offer.discount > 0 && (
                      <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-amber-500 text-white text-xs font-black rounded-xl shadow-lg">
                        % {offer.discount} İndirim
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                       <div>
                          <h3 className="font-bold text-stone-900 dark:text-white leading-tight mb-1">{product.name}</h3>
                          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{product.brand}</p>
                       </div>
                       <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-xs font-black">{product.rating || '4.8'}</span>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-4">
                      <p className="text-xl font-black text-stone-900 dark:text-white">{discountedPrice.toLocaleString('tr-TR')} ₺</p>
                      {offer.discount > 0 && (
                        <p className="text-xs text-stone-400 line-through font-bold">{product.price.toLocaleString('tr-TR')} ₺</p>
                      )}
                    </div>
                  </div>
                </Link>
               )
            })}
          </div>
        </section>

        {/* Promo Bar */}
        <section className="mt-24 p-8 rounded-[2.5rem] bg-gradient-to-r from-amber-500 to-orange-600 text-white flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative shadow-2xl shadow-amber-500/20">
           <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
           <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-black/20 rounded-full blur-3xl"></div>
           
           <div className="flex items-center gap-6 relative z-10">
              <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20">
                 <Ticket className="w-8 h-8 rotate-12" />
              </div>
              <div>
                 <h4 className="text-2xl font-black mb-1">Bu Fırsat Kaçmaz!</h4>
                 <p className="text-white/80 font-medium tracking-tight">Kupon kodu ile ekstra %10 indirim kazanın: <span className="font-mono bg-black/20 px-2 py-0.5 rounded font-black text-white whitespace-nowrap">SEZON10</span></p>
              </div>
           </div>

           <button 
            onClick={() => {
              navigator.clipboard.writeText('SEZON10');
              toast.success('Kod kopyalandı!');
            }}
            className="px-10 py-4 bg-white text-stone-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-stone-50 transition-all shadow-xl active:scale-95 relative z-10"
           >
              Kodu Kopyala
           </button>
        </section>

      </div>
    </main>
  )
}

export default KampanyaDetail
