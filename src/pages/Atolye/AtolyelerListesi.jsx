import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'

// Redux Actions 
import { addToCart } from '../../store/slices/cartSlice'
import { addToFavorites, removeFromFavorites } from '../../store/slices/favoritesSlice'

// Merkezi Veri Depomuz
import { atolyelerVerisi } from '../../data/atolyeData'

// Sadece bu sayfanın Hero banner'ında kullanılacak görsel
import deriAtolye1 from '../../assets/deri-atolye1.jpg'

// ─── Mini Ürün Kartı (Slider İçin) ───
function MiniUrunKarti({ urun, atolyeKategori }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Redux üzerinden favori kontrolü
  const favoriler = useSelector((state) => state.favorites.items)
  const isFavorited = favoriler.some((item) => item.id === urun.id)

  // Veri yapı görseli alınır 
  const gorsel = urun.gorseller ? urun.gorseller[0] : urun.gorsel

  const favoriToggle = (e) => {
    e.stopPropagation()
    e.preventDefault()

    // ÇEVİRMEN: Favoriler sistemine uygun format
    const arkadasinFormatindaUrun = {
      id: urun.id,
      name: urun.isim,
      price: parseInt(urun.fiyat.replace(/\D/g, '')), // "1200TL" -> 1200
      image: gorsel,
      category: urun.kategori || urun.altKategori || atolyeKategori
    }

    if (isFavorited) {
      dispatch(removeFromFavorites(urun.id))
    } else {
      dispatch(addToFavorites(arkadasinFormatindaUrun))
    }
  }

  const sepeteEkle = (e) => {
    e.stopPropagation()
    e.preventDefault()

    // ÇEVİRMEN: Sepet sistemine uygun format
    const sepeteUygunUrun = {
      id: urun.id,
      isim: urun.isim,
      fiyat: urun.fiyat,
      image: gorsel,
    }

    dispatch(addToCart(sepeteUygunUrun))

    // Şık bildirim
    toast.success(`${urun.isim} sepete eklendi!`, {
  style: {
    background: 'rgba(41, 37, 36, 0.95)', // Hafif transparan stone-800
    color: '#f5f5f4',
    backdropFilter: 'blur(8px)', // cam efekti
    padding: '16px 24px',
    fontSize: '13px',
    fontWeight: '500',
    letterSpacing: '0.05em',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  iconTheme: {
    primary: '#d97706', // Kehribar (Amber) tonu
    secondary: '#fff',
  },
});
  }

  const kartaTikla = () => {
    // Tutarlılık için slug yerine ID bazlı yönlendirme
    navigate(`/urun/${urun.id}`, { state: { urun } })
  }

  const renderYildizlar = () => (
    Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-amber-500">
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
      </svg>
    ))
  )

  return (
    <div onClick={kartaTikla} className="snap-start shrink-0 w-[200px] cursor-pointer group/card flex flex-col">
      <div className="w-full h-[200px] bg-stone-100 mb-3 overflow-hidden rounded-lg relative shadow-sm">
        <img src={gorsel} alt={urun.isim} className="w-full h-full object-cover transition duration-700 group-hover/card:scale-110" />

        {/* Favori Butonu */}
        <button
          onClick={favoriToggle}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/60 backdrop-blur-md hover:bg-white/90 transition-all shadow-sm z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill={isFavorited ? "#b91c1c" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke={isFavorited ? "#b91c1c" : "currentColor"} className="w-4 h-4 transition-colors">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col px-1 flex-grow">
        <p className="font-medium tracking-wide text-xs text-stone-800 line-clamp-1">{urun.isim}</p>
        
        {/* Yıldızlar ve Yorum Sayısı */}
        <div className="flex items-center gap-1 mt-1 mb-1.5">
          <div className="flex">{renderYildizlar()}</div>
          <span className="text-[9px] text-stone-400 font-medium">(12)</span>
        </div>

        {/* Fiyat ve Sepet Butonu */}
        <div className="flex items-center justify-between mt-auto">
          
          {/* YENİ FİYAT TASARIMI */}
          <div className="flex items-baseline gap-1">
            <p className="font-bold text-stone-700 text-sm">{urun.fiyat}</p>
            <span className="text-[9px] font-medium text-stone-400 tracking-wide">'den başlayan</span>
          </div>

          {/* BÜYÜTÜLMÜŞ SEPET BUTONU */}
          <button
            onClick={sepeteEkle}
            className="p-2.5 rounded-full bg-stone-100 hover:bg-stone-800 hover:text-white text-stone-700 transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Atölye Vitrin Bileşeni ───
function AtolyeVitrin({ atolye }) {
  const sliderRef = useRef(null)

  const manuelKaydir = (yon) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: yon * 280, behavior: 'smooth' })
    }
  }

  return (
    <div className="mb-10 bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
      {/* ── Hero Banner ── */}
      <div className="relative w-full h-52 overflow-hidden">
        {atolye.heroBanner ? (
          <img
            src={atolye.heroBanner}
            alt={atolye.heroBannerAlt}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-stone-300 to-stone-500 flex items-center justify-center">
            <p className="text-white/60 text-xs tracking-widest uppercase">Buraya fotoğraf ekle</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
          <div>
            <span className="text-white/60 text-[10px] uppercase tracking-widest">{atolye.kategori} · {atolye.lokasyon}</span>
            <h2 className="text-white text-2xl font-serif mt-0.5">{atolye.isim}</h2>
          </div>
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-amber-400">
              <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
            </svg>
            <span className="text-white text-xs font-bold">{atolye.puan}</span>
            <span className="text-white/60 text-[10px]">({atolye.degerlendirmeSayisi})</span>
          </div>
        </div>
      </div>

      {/* ── İçerik ── */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center px-8 pt-6 pb-4 border-b border-stone-100">
        <div className="w-16 h-16 flex-shrink-0 relative -mt-10 md:-mt-12 ml-0 ring-4 ring-white rounded-full shadow-md overflow-hidden bg-white">
          <img src={atolye.avatar} alt={atolye.isim} className="w-full h-full object-cover" />
        </div>
        <p className="text-stone-600 text-sm leading-relaxed flex-1 pt-2 md:pt-0">
          {atolye.aciklama}
        </p>
        <div className="flex flex-col gap-2.5 flex-shrink-0 w-full md:w-auto pt-0 md:pt-2">
          <Link
            to={`/atolyeler/${atolye.id}`}
            className="text-center text-xs font-semibold tracking-widest text-white uppercase bg-stone-800 px-7 py-3 rounded-full hover:bg-stone-900 transition-colors shadow-md"
          >
            Atölyeyi Ziyaret Et
          </Link>
          <button className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest text-stone-600 uppercase bg-white border border-stone-200 px-7 py-3 rounded-full hover:bg-stone-50 hover:border-stone-300 transition-colors">
            Takip Et
          </button>
        </div>
      </div>

      {/* ── Ürünler Slider ── */}
      <div className="px-8 py-6 relative group">
        <button onClick={() => manuelKaydir(-1)} className="absolute left-2 top-[40%] -translate-y-1/2 z-10 bg-white/90 shadow-lg border border-stone-100 text-stone-600 rounded-full w-9 h-9 flex items-center justify-center hover:bg-stone-800 hover:text-white transition-all opacity-0 group-hover:opacity-100">‹</button>
        <button onClick={() => manuelKaydir(1)} className="absolute right-2 top-[40%] -translate-y-1/2 z-10 bg-white/90 shadow-lg border border-stone-100 text-stone-600 rounded-full w-9 h-9 flex items-center justify-center hover:bg-stone-800 hover:text-white transition-all opacity-0 group-hover:opacity-100">›</button>

        <div ref={sliderRef} className="flex gap-5 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`.hide-scroll-inner::-webkit-scrollbar { display: none; }`}</style>

          {/* Mini Ürün Kartlarını Map Ediyoruz */}
          {atolye.urunler.map((urun, index) => (
            <MiniUrunKarti key={index} urun={urun} atolyeKategori={atolye.kategori} />
          ))}

          {/* Tümünü Gör */}
          <div className="snap-start shrink-0 w-[200px] flex items-center justify-center">
            <Link
              to={`/atolyeler/${atolye.id}`}
              className="flex flex-col items-center justify-center h-[200px] w-full border border-dashed border-stone-300 bg-stone-50 rounded-lg text-stone-500 hover:border-stone-800 hover:text-stone-800 hover:bg-stone-100 transition-colors"
            >
              <span className="text-3xl font-light mb-1">›</span>
              <span className="text-[9px] uppercase tracking-widest font-bold">Tümünü Gör</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Ana Sayfa Bileşeni ───
function AtolyelerListesi() {
  const [seciliKategori, setSeciliKategori] = useState('Tümü')
  const kategoriler = ['Tümü', 'Deri', 'Tekstil & Giyim', 'Oyuncak & Çocuk', 'Seramik', 'Ahşap']

  const filtrelenmisAtolyeler = seciliKategori === 'Tümü'
    ? atolyelerVerisi
    : atolyelerVerisi.filter(a => a.kategori === seciliKategori)

  return (
    <div className="bg-stone-50 min-h-screen pb-20">

      {/* ── Hero Banner Alanı ── */}
      <div className="relative w-full h-[350px] mb-12 overflow-hidden">
        <img src={deriAtolye1} alt="Atölyeleri Keşfet" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center px-6">
          <span className="text-[10px] tracking-[0.4em] text-amber-400 mb-4 block uppercase font-bold">Zanaatkarlarımız</span>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">Atölyeleri Keşfet</h1>
          <p className="text-sm text-stone-200 max-w-2xl mx-auto leading-relaxed">
            Her biri kendi alanında usta zanaatkarlarımızın atölyelerine konuk olun. Hikayelerini okuyun, özenle hazırladıkları eşsiz koleksiyonları inceleyin ve favori zanaatkarlarınızı takip edin.
          </p>
        </div>
      </div>

      {/* Kategori Filtreleri */}
      <div className="flex flex-wrap justify-center gap-3 px-6 mb-16 max-w-5xl mx-auto">
        {kategoriler.map(kat => (
          <button
            key={kat}
            onClick={() => setSeciliKategori(kat)}
            className={`px-5 py-2 rounded-full text-xs font-medium tracking-wide transition-all ${
              seciliKategori === kat
                ? 'bg-stone-800 text-white shadow-md'
                : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400 hover:bg-stone-100'
            }`}
          >
            {kat}
          </button>
        ))}
      </div>

      {/* Atölyeler Listesi */}
      <div className="max-w-6xl mx-auto px-6">
        {filtrelenmisAtolyeler.length > 0 ? (
          filtrelenmisAtolyeler.map((atolye) => (
            <AtolyeVitrin key={atolye.id} atolye={atolye} />
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-stone-400 text-sm">Bu kategoride henüz atölye bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AtolyelerListesi