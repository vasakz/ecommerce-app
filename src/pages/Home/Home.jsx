import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { MOCK_PRODUCTS } from '../../data/products'
import { Star, ShoppingBag, ChevronRight, Zap, Truck, ChevronLeft, Heart } from 'lucide-react'

// Redux
import { addToCart } from '../../store/slices/cartSlice'
import { addToFavorites, removeFromFavorites } from '../../store/slices/favoritesSlice'

const heroContent = [
  {
    img: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2600",
    tag: "DERİ SANATI",
    title: <>Zamana Meydan Okuyan<br /><span className="font-bold">Klasik Dokunuş.</span></>,
    desc: "Usta ellerden çıkan gerçek deri aksesuarlarla tarzınızı ölümsüzleştirin."
  },
  {
    img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=2600",
    tag: "ZARİF İZLER",
    title: <>İmzanız Olacak<br /><span className="font-bold">Kusursuz Seçimler.</span></>,
    desc: "Girdiğiniz her ortamda dikkatleri üzerinize çekecek özel koleksiyon."
  },
  {
    img: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=2600",
    tag: "ZAMANSIZ KLASİK",
    title: <>Anı Yaşatan<br /><span className="font-bold">Estetik Detaylar.</span></>,
    desc: "İnce işçilik ve premium kalitenin buluştuğu yüksek standartlar."
  },
  {
    img: "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?q=80&w=2600",
    tag: "LÜKS GİYİM",
    title: <>Sadeliğin İçindeki<br /><span className="font-bold">Gücü Keşfet.</span></>,
    desc: "Gardırobunuzu baştan yaratacak minimal ve güçlü parçalar."
  }
];

const techProducts   = MOCK_PRODUCTS.filter(p => [201, 202, 203, 204].includes(p.id));
const cosmeticProducts = MOCK_PRODUCTS.filter(p => [211, 212, 213, 214].includes(p.id));
const accessoryProducts = MOCK_PRODUCTS.filter(p => [221, 222, 223, 224].includes(p.id));

/* ─── ÜRÜN KARTI (Atölye Stili) ───────────────────────── */
function ProductCard({ product }) {
  const [aktifIndex, setAktifIndex] = useState(0)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const favoriler = useSelector((state) => state.favorites?.items || [])
  const isFavorited = favoriler.some((item) => item.id === product.id)

  const images = product.images?.length > 0 ? product.images : [product.image]
  const tekGorselMi = images.length <= 1

  const gosterGorsel = (index) => setAktifIndex((index + images.length) % images.length)

  const okTikla = (yon, e) => {
    e.stopPropagation()
    e.preventDefault()
    gosterGorsel(aktifIndex + yon)
  }

  const favoriToggle = (e) => {
    e.stopPropagation()
    e.preventDefault()
    if (isFavorited) {
      dispatch(removeFromFavorites(product.id))
      toast.error('Favorilerden çıkarıldı.', { style: { background: '#292524', color: '#fff' } })
    } else {
      dispatch(addToFavorites({
        id: product.id,
        name: product.name,
        price: product.price,
        image: images[0],
        category: product.category,
      }))
      toast.success('Favorilere eklendi!', { style: { background: '#292524', color: '#fff', iconTheme: { primary: '#f59e0b', secondary: '#fff' } } })
    }
  }

  const sepeteEkle = (e) => {
    e.stopPropagation()
    e.preventDefault()
    dispatch(addToCart({
      id: product.id,
      isim: product.name,
      fiyat: `${product.price} ₺`,
      image: images[0],
    }))
    toast.success(`${product.name} sepete eklendi!`, { style: { background: '#292524', color: '#fff', iconTheme: { primary: '#f59e0b', secondary: '#fff' } } })
  }

  const kartaTikla = () => {
    navigate(`/urunler/${product.id}`)
  }

  const renderYildizlar = () =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-amber-500 text-amber-500' : 'text-stone-300 dark:text-stone-600'}`} />
    ))

  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  return (
    <div onClick={kartaTikla} className="w-[260px] flex-shrink-0 cursor-pointer group">
      <div className="relative bg-stone-100 dark:bg-stone-800/80 w-[260px] h-[320px] mb-3 overflow-hidden rounded-md border border-stone-200/50 dark:border-stone-700/30">
        <img src={images[aktifIndex]} alt={product.name} className="object-cover w-full h-full transition duration-500 group-hover:scale-105" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-20">
          {product.isNew && (
            <span className="bg-stone-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm tracking-wide">YENİ</span>
          )}
          {discount > 0 && (
            <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">-%{discount}</span>
          )}
        </div>

        {/* Favori Butonu */}
        <button onClick={favoriToggle} className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/50 dark:bg-black/40 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-black/80 transition-all duration-300 shadow-sm border border-white/20">
          <Heart className={`w-4 h-4 transition-transform duration-300 ${isFavorited ? 'fill-rose-600 text-rose-600 scale-110' : 'text-stone-800 dark:text-stone-200 hover:text-rose-500 dark:hover:text-rose-400'}`} />
        </button>

        {/* Yön Okları */}
        {!tekGorselMi && (
          <>
            <button onClick={(e) => okTikla(-1, e)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/60 dark:bg-black/50 hover:bg-white dark:hover:bg-black rounded-full w-7 h-7 flex items-center justify-center text-stone-800 dark:text-white shadow transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm">‹</button>
            <button onClick={(e) => okTikla(1, e)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/60 dark:bg-black/50 hover:bg-white dark:hover:bg-black rounded-full w-7 h-7 flex items-center justify-center text-stone-800 dark:text-white shadow transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm">›</button>
          </>
        )}
      </div>

      <div className="flex flex-col px-1">
        <p className="font-semibold tracking-wide text-sm text-stone-800 dark:text-stone-100 line-clamp-1">{product.name}</p>
        <p className="text-[10px] text-stone-500 dark:text-stone-400 font-bold uppercase tracking-widest mt-0.5 mb-1.5">{product.brand}</p>
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">{renderYildizlar()}</div>
          <span className="text-[10px] text-stone-500 font-medium">({product.reviews})</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <div className="flex flex-col justify-center">
            <p className="font-bold text-stone-900 dark:text-white text-base tracking-tight">
              {product.price.toLocaleString('tr-TR')} <span className="text-[10px] font-semibold text-stone-500">₺</span>
            </p>
            {product.oldPrice > 0 && (
              <span className="text-[9px] text-stone-400 line-through decoration-red-400/40 mt-[-2px]">
                {product.oldPrice.toLocaleString('tr-TR')} ₺
              </span>
            )}
          </div>
          <button
            onClick={sepeteEkle}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-md shadow-amber-500/20"
            title="Sepete Ekle"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold tracking-widest uppercase">Ekle</span>
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── VİTRİN SLİDER (Atölye Stili) ───────────────────────── */
function VitrinSlider({ baslik, urunlerListesi, filterCategory }) {
  const sliderRef = useRef(null)

  useEffect(() => {
    const randomSure = Math.floor(Math.random() * 1000) + 3500
    const otoKaydir = setInterval(() => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
        // Only auto-scroll if user hasn't hovered recently (optional enhancement)
        if (scrollLeft + clientWidth >= scrollWidth - 5)
          sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        else
          sliderRef.current.scrollBy({ left: 284, behavior: 'smooth' })
      }
    }, randomSure)
    return () => clearInterval(otoKaydir)
  }, [])

  const manuelKaydir = (yon) => {
    if (sliderRef.current) sliderRef.current.scrollBy({ left: yon * 284, behavior: 'smooth' })
  }

  const vitrinGosterimi = [
    ...urunlerListesi.map((u) => ({ ...u, _key: `${u.id}-0` })),
    ...urunlerListesi.map((u) => ({ ...u, _key: `${u.id}-1` })),
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 mb-8 relative">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-sm font-bold tracking-widest uppercase border-l-2 border-amber-500 pl-3 py-0.5 text-stone-900 dark:text-stone-100">{baslik}</h2>
        <Link
          to={`/urunler${filterCategory ? `?category=${encodeURIComponent(filterCategory)}` : ''}`}
          className="text-[11px] font-bold text-amber-600 hover:text-stone-900 dark:hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors"
        >
          Tümünü Gör <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="relative group">
        <button onClick={() => manuelKaydir(-1)} className="absolute left-0 top-[160px] -translate-y-1/2 -ml-5 z-10 bg-white/90 dark:bg-stone-800/90 shadow-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-200 rounded-full w-10 h-10 flex items-center justify-center hover:bg-stone-900 hover:text-white dark:hover:bg-amber-500 transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm">‹</button>
        <button onClick={() => manuelKaydir(1)} className="absolute right-0 top-[160px] -translate-y-1/2 -mr-5 z-10 bg-white/90 dark:bg-stone-800/90 shadow-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-200 rounded-full w-10 h-10 flex items-center justify-center hover:bg-stone-900 hover:text-white dark:hover:bg-amber-500 transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm">›</button>
        <div ref={sliderRef} className="flex gap-8 overflow-x-auto custom-scrollbar pb-4 scroll-smooth snap-x snap-mandatory">
          {vitrinGosterimi.map((urun) => (
            <div key={urun._key} className="snap-start shrink-0">
              <ProductCard product={urun} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Home() {
  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHero(prev => (prev + 1) % heroContent.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextHero = () => setCurrentHero(prev => (prev + 1) % heroContent.length);
  const prevHero = () => setCurrentHero(prev => (prev - 1 + heroContent.length) % heroContent.length);

  return (
    <div className="bg-stone-50 dark:bg-stone-900 min-h-screen transition-colors duration-500 overflow-x-hidden">
      
      {/* Cinematic High-End Hero */}
      <div className="relative w-full h-[65vh] md:h-[80vh] min-h-[500px] overflow-hidden bg-stone-900 group shadow-2xl">
        {heroContent.map((hero, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
              idx === currentHero ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Dramatic Ken Burns Effect */}
            <div className={`absolute inset-0 w-full h-full transform transition-all duration-[12000ms] ease-out origin-center ${idx === currentHero ? 'scale-100 translate-y-0 rotate-0' : 'scale-110 -translate-y-4 rotate-1'}`}>
              <img
                src={hero.img}
                alt="hero"
                className="object-cover w-full h-full brightness-[0.6] saturate-[0.8] contrast-[1.1] transition-all duration-1000"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-stone-900 via-stone-900/50 to-transparent" />
            
            {/* Cinematic Overlay */}
            <div className="relative h-full max-w-7xl mx-auto px-8 md:px-16 flex flex-col justify-end pb-24 md:pb-32 text-stone-100">
              <div className="max-w-2xl">
                {/* Tag */}
                <div className="overflow-hidden mb-5">
                  <span className={`inline-block px-4 py-1.5 bg-amber-500/20 text-amber-400 backdrop-blur-md border border-amber-500/30 rounded-full text-[10px] font-black tracking-[0.3em] uppercase transition-all duration-[1200ms] ease-out ${idx === currentHero ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                    {hero.tag}
                  </span>
                </div>
                
                {/* Title */}
                <div className="overflow-hidden mb-6">
                  <h1 className={`text-4xl md:text-7xl font-serif font-light tracking-tight leading-[1.1] transition-all duration-[1500ms] ease-out delay-200 ${idx === currentHero ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                    {hero.title}
                  </h1>
                </div>

                {/* Description */}
                <div className="overflow-hidden mb-10">
                  <p className={`text-stone-300 text-sm md:text-lg font-medium tracking-wide max-w-md transition-all duration-[1500ms] ease-out delay-400 ${idx === currentHero ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                    {hero.desc}
                  </p>
                </div>

                {/* Button */}
                <div className={`overflow-hidden transition-all duration-[1500ms] ease-out delay-500 ${idx === currentHero ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                  <Link
                    to="/urunler"
                    className="inline-flex h-14 px-10 bg-amber-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-full items-center justify-center hover:bg-white hover:text-stone-900 transition-all duration-500 shadow-2xl shadow-amber-600/20"
                  >
                    Koleksiyonu Keşfet
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Cinematic Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/10 z-30 overflow-hidden">
          <div 
            key={currentHero}
            className="h-full bg-amber-500 origin-left animate-[progress_5s_linear_forwards]"
          />
        </div>
        <style>{`@keyframes progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>

        {/* Cinematic Controls */}
        <div className="absolute bottom-10 right-10 md:right-24 flex items-center gap-3 z-30">
          <button 
            onClick={prevHero}
            className="w-10 h-10 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-amber-500 hover:border-transparent transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="text-[10px] font-black text-white px-3 py-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full tracking-widest">
            0{currentHero + 1} / 04
          </div>
          <button 
            onClick={nextHero}
            className="w-10 h-10 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-amber-500 hover:border-transparent transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Kayan Yazı (Marquee Banner - Atölye'den Adapte) */}
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { display: flex; white-space: nowrap; animation: marquee 35s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e7e5e4; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #44403c; }
      `}</style>
      <div className="w-full bg-stone-100/80 dark:bg-stone-800/80 border-y border-stone-200 dark:border-stone-800 py-2.5 overflow-hidden flex items-center mb-8">
        <div className="animate-marquee text-[11px] tracking-[0.25em] text-stone-600 dark:text-stone-300 font-medium uppercase">
          <span className="mx-12">✧ Ürünlerimiz özenle hazırlanıyor, tüm siparişlerinizde en yüksek kalite garantisi ✧</span>
          <span className="mx-12 text-amber-600 dark:text-amber-400">🏷 YAZ KAMPANYASI: Seçili ürünlerde anında indirim — EKSTRA %15 İNDİRİM FIRSATINI YAKALA ✧</span>
          <span className="mx-12">✧ Bu haftaki tüm siparişlerde ücretsiz kargo ve iade imkanı ✧</span>
          <span className="mx-12 text-teal-600 dark:text-teal-400">🎁 Stoklar tükenmeden en sevilen modelleri sepete ekle ✧</span>
        </div>
      </div>

      {/* Category Quick Links (Pills with Amber hover) */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
          {['Giyim', 'Elektronik', 'Çantalar', 'Ayakkabılar', 'Aksesuarlar', 'Ev & Yaşam', 'Kampanyalar'].map(cat => (
            <Link
              key={cat}
              to={`/urunler?category=${encodeURIComponent(cat)}`}
              className="flex-shrink-0 px-6 py-2.5 rounded-full border border-stone-200 dark:border-stone-700 text-xs font-bold tracking-widest uppercase text-stone-600 dark:text-stone-300 hover:bg-amber-500 hover:border-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white transition-all shadow-sm"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Vitrin Sliders (Replacing old SectionRows) */}
      <VitrinSlider baslik="ELEKTRONİK ÜRÜNLER" urunlerListesi={techProducts} filterCategory="Elektronik" />
      <VitrinSlider baslik="GİYİM & KOZMETİK" urunlerListesi={cosmeticProducts} filterCategory="Giyim" />
      <VitrinSlider baslik="AKSESUARLAR" urunlerListesi={accessoryProducts} filterCategory="Aksesuarlar" />

    </div>
  );
}

export default Home;