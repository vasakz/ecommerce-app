import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MOCK_PRODUCTS } from '../../data/products'
import { Star, ShoppingBag, ChevronRight, Zap, Truck, ChevronLeft } from 'lucide-react'

import phone1 from '../../assets/phone-1.jpeg'
import phone2 from '../../assets/phone-2.jpeg'
import hphone1 from '../../assets/hphone-1.jpeg'
import clock1 from '../../assets/clock-1.jpeg'

const heroContent = [
  {
    img: phone1,
    tag: "ONLİNE ALIŞVERİŞTE",
    title: <>En Yeni Ürün,<br />En İyi Fiyat.</>,
    desc: "Hayatınızı kolaylaştıran ürünleri keşfedin. Binlerce ürün, güvenli alışveriş."
  },
  {
    img: phone2,
    tag: "PRO TEKNOLOJİ",
    title: <>Sınırları Zorlayan<br />Teknoloji Burada.</>,
    desc: "Geleceğin dünyasını bugünden yaşayın. En gelişmiş akıllı telefonlar."
  },
  {
    img: hphone1,
    tag: "ESTETİK & KONFOR",
    title: <>Tarzınızı<br />Yansıtın.</>,
    desc: "Hem şık hem kullanışlı aksesuarlar ile fark yaratın."
  },
  {
    img: clock1,
    tag: "ZAMANSIZ ŞIKLIK",
    title: <>Zamanı<br />Yakalayın.</>,
    desc: "Klasik ve modern tasarımların buluştuğu özel koleksiyonlar."
  }
];

const techProducts   = MOCK_PRODUCTS.filter(p => [201, 202, 203, 204].includes(p.id));
const cosmeticProducts = MOCK_PRODUCTS.filter(p => [211, 212, 213, 214].includes(p.id));
const accessoryProducts = MOCK_PRODUCTS.filter(p => [221, 222, 223, 224].includes(p.id));

function ProductCard({ product }) {
  const [imgIdx, setImgIdx] = useState(0);
  const images = product.images?.length > 0 ? product.images : [product.image];
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  return (
    <div className="w-64 flex-shrink-0 group flex flex-col h-full bg-white dark:bg-stone-800/50 rounded-2xl p-3 border border-stone-100 dark:border-stone-700/50 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300">
      <Link to={`/urunler/${product.id}`} className="flex-1 flex flex-col">
        {/* Image */}
        <div className="relative w-full h-64 bg-stone-50 dark:bg-stone-800 overflow-hidden rounded-xl mb-4">
          <img
            src={images[imgIdx]}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
          />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <span className="bg-stone-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">YENİ</span>
            )}
            {discount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">-%{discount}</span>
            )}
            {product.isFastDelivery && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-0.5 shadow-sm">
                <Zap className="w-2.5 h-2.5 fill-white" /> HIZLI
              </span>
            )}
          </div>

          {/* Thumbnail dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-white/20 backdrop-blur-md px-2 py-1 rounded-full">
              {images.map((_, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setImgIdx(i)}
                  onClick={e => { e.preventDefault(); setImgIdx(i); }}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === imgIdx ? 'bg-white w-3' : 'bg-white/50 hover:bg-white/80'}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info Area */}
        <div className="px-1 flex flex-col flex-1">
          <div className="mb-2">
            <p className="text-sm font-bold text-stone-800 dark:text-stone-100 line-clamp-1 leading-tight group-hover:text-amber-600 transition-colors uppercase tracking-tight">
              {product.name}
            </p>
            <p className="text-[11px] font-medium text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
              {product.brand} • {product.subcategory}
            </p>
          </div>

          <div className="mt-auto pt-2 border-t border-stone-50 dark:border-stone-800/50">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-baseline gap-1">
                <span className="text-base font-black text-stone-900 dark:text-white tracking-tighter">
                  {product.price.toLocaleString('tr-TR')} <span className="text-xs">₺</span>
                </span>
                {product.oldPrice > 0 && (
                  <span className="text-[10px] text-stone-400 line-through decoration-red-400/40">
                    {product.oldPrice.toLocaleString('tr-TR')} ₺
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 bg-stone-50 dark:bg-stone-800 px-1.5 py-0.5 rounded-lg border border-stone-100/50 dark:border-stone-700/50">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-[10px] font-bold text-stone-700 dark:text-stone-200">{product.rating}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="h-4">
                {product.isFreeShipping && (
                  <p className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5">
                    <Truck className="w-2.5 h-2.5" /> Ücretsiz
                  </p>
                )}
              </div>
              <span className="text-[9px] font-medium text-stone-400">({product.reviews} Yorum)</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Button */}
      <Link
        to={`/urunler/${product.id}`}
        className="mt-4 w-full flex items-center justify-center gap-2 bg-stone-900 dark:bg-amber-500 text-white dark:text-white text-xs font-black py-3 rounded-xl hover:bg-amber-500 dark:hover:bg-amber-600 transition-all duration-300 transform active:scale-[0.98] uppercase tracking-widest"
      >
        <ShoppingBag className="w-3.5 h-3.5" />
        İncele
      </Link>
    </div>
  );
}

function SectionRow({ title, products, filterCategory }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold tracking-widest uppercase text-stone-800 dark:text-stone-100">
          {title}
        </h2>
        <Link
          to={`/urunler${filterCategory ? `?category=${encodeURIComponent(filterCategory)}` : ''}`}
          className="text-xs font-semibold text-amber-600 hover:underline flex items-center gap-1"
        >
          Tümünü Gör <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
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
    <div className="bg-stone-50 dark:bg-stone-950 min-h-screen transition-colors duration-500">
      {/* Hero Banner Carousel */}
      <div className="relative w-full h-[500px] overflow-hidden">
        {heroContent.map((hero, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${idx === currentHero ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}
          >
            <img
              src={hero.img}
              alt="hero"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-12 md:px-24 text-white">
              <p className="text-xs tracking-[0.3em] mb-4 text-amber-400 font-black uppercase opacity-90">{hero.tag}</p>
              <h1 className="text-6xl font-black mb-6 leading-[1.1] tracking-tighter">{hero.title}</h1>
              <p className="text-base max-w-lg text-stone-300 mb-8 leading-relaxed font-medium">
                {hero.desc}
              </p>
              <div className="flex gap-4">
                <Link
                  to="/urunler"
                  className="inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-white font-black py-4 px-10 rounded-2xl transition-all text-sm shadow-2xl shadow-amber-500/40 w-fit active:scale-95"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Alışverişe Başla
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <div className="absolute bottom-10 left-12 md:left-24 flex items-center gap-4">
          <div className="flex gap-2">
            {heroContent.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentHero(idx)}
                className={`h-1 rounded-full transition-all duration-500 ${idx === currentHero ? 'bg-amber-400 w-12' : 'bg-white/30 w-4 hover:bg-white/50'}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={prevHero}
              className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all text-white active:scale-90"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextHero}
              className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all text-white active:scale-90"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Category Quick Links */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
          {['Çantalar','Elektronik','Giyim','Aksesuarlar','Ayakkabılar','Ev & Yaşam','Kampanyalar'].map(cat => (
            <Link
              key={cat}
              to={`/urunler?category=${encodeURIComponent(cat)}`}
              className="flex-shrink-0 px-5 py-2 rounded-full border border-stone-200 dark:border-stone-700 text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-900 hover:text-white dark:hover:bg-white dark:hover:text-stone-900 transition-all"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Product Rows */}
      <SectionRow title="Teknolojik Ürünler" products={techProducts} filterCategory="Elektronik" />
      <SectionRow title="Kozmetik Ürünler" products={cosmeticProducts} filterCategory="Giyim" />
      <SectionRow title="Aksesuar & Saat" products={accessoryProducts} filterCategory="Aksesuarlar" />
    </div>
  );
}

export default Home;