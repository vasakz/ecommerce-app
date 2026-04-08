import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'

// Redux bağlantıları
import { addToCart } from '../../store/slices/cartSlice' 
import { addToFavorites, removeFromFavorites } from '../../store/slices/favoritesSlice'

// Verilerimiz
import { urunler, cokSatanlar, yeniTasarimlar, kampanyalar, kategoriler } from '../../data/atolyeData'

// Görsellerimiz
import atolyeden from '../../assets/atolyeden.jpeg'
import deriAtolye1 from '../../assets/deri-atolye1.jpg'
import terzi from '../../assets/terzi.jpeg'
import oyuncak1 from '../../assets/oyuncak1.jpg'

/* ─── ÜRÜN KARTI ────────────────────────────────────────── */
function UrunKarti({ urun }) {
  const [aktifIndex, setAktifIndex] = useState(0)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const favoriler = useSelector((state) => state.favorites.items)
  const isFavorited = favoriler.some((item) => item.id === urun.id)

  const tekGorselMi = urun.gorseller.length <= 1

  const gosterGorsel = (index) => setAktifIndex((index + urun.gorseller.length) % urun.gorseller.length)
  
  const okTikla = (yon, e) => {
    e.stopPropagation()
    e.preventDefault()
    gosterGorsel(aktifIndex + yon)
  }

  const favoriToggle = (e) => {
    e.stopPropagation()
    e.preventDefault()

    // ÇEVİRMEN: Arkadaşının Favoriler sistemine uygun format
    const arkadasinFormatindaUrun = {
      id: urun.id,
      name: urun.isim,
      price: parseInt(urun.fiyat.replace(/\D/g, '')), // "1200TL" yazısını 1200 sayısına çevirir
      image: urun.gorseller[0],
      category: urun.kategori || urun.altKategori
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
      image: urun.gorseller[0]
    }

    dispatch(addToCart(sepeteUygunUrun))
    
    // Şık bildirim
    toast.success(`${urun.isim} sepete eklendi!`, {
      style: {
        background: '#292524',
        color: '#f5f5f4',
        border: '1px solid #44403c',
        borderRadius: '8px',
      },
      iconTheme: { primary: '#d97706', secondary: '#fff' }
    })
  }

  const kartaTikla = () => {
    navigate(`/urun/${urun.id}`, { state: { urun } })
  }

  const renderYildizlar = () =>
    Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-amber-500">
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
      </svg>
    ))

  return (
    <div onClick={kartaTikla} className="w-[260px] flex-shrink-0 cursor-pointer group">
      <div className="relative bg-stone-100 w-[260px] h-[260px] mb-3 overflow-hidden rounded-md">
        <img src={urun.gorseller[aktifIndex]} alt={urun.isim} className="object-cover w-full h-full transition duration-500 group-hover:scale-105" />
        
        <button onClick={favoriToggle} className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/40 backdrop-blur-sm hover:bg-white/70 transition-all duration-300 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill={isFavorited ? "#b91c1c" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke={isFavorited ? "#b91c1c" : "currentColor"} className={`w-5 h-5 transition-transform duration-300 ${isFavorited ? 'scale-110' : 'text-stone-800'}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        {!tekGorselMi && (
          <>
            <button onClick={(e) => okTikla(-1, e)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/90 rounded-full w-7 h-7 flex items-center justify-center text-stone-800 shadow transition-all duration-300 opacity-0 group-hover:opacity-100">‹</button>
            <button onClick={(e) => okTikla(1, e)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/90 rounded-full w-7 h-7 flex items-center justify-center text-stone-800 shadow transition-all duration-300 opacity-0 group-hover:opacity-100">›</button>
          </>
        )}
      </div>
      
      <div className="flex flex-col px-1">
        <p className="font-medium tracking-wide text-sm text-stone-800 line-clamp-1">{urun.isim}</p>
        <div className="flex items-center gap-1 mt-1 mb-2">
          <div className="flex">{renderYildizlar()}</div>
          <span className="text-[10px] text-stone-500 font-medium">(12 Yorum)</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="font-semibold text-stone-900">{urun.fiyat}</p>
          <button onClick={sepeteEkle} className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors" title="Sepete Ekle">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── SIDEBAR ───────────────────────────────────────── */
function Sidebar({ aktifFiltre, setAktifFiltre, seciliKategori, setSeciliKategori, setSeciliAltKategori }) {
  const [acik, setAcik] = useState(null)

  const kategoriTikla = (i, kat) => {
    setAcik(acik === i ? null : i)
    if (acik !== i) {
      setSeciliKategori(kat.baslik)
      setSeciliAltKategori(null)
    } else {
      setSeciliKategori(null)
      setSeciliAltKategori(null)
    }
  }

  return (
    <aside className="hidden lg:block w-52 flex-shrink-0 sticky top-20 self-start h-fit">
      <Link to="/atolyeler" className="flex items-center gap-2 w-full mb-6 px-3 py-2.5 rounded-md bg-stone-800 text-white text-xs font-bold tracking-widest uppercase hover:bg-stone-900 transition-colors group">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 flex-shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
        </svg>
        Atölyeleri Gör
        <span className="ml-auto text-stone-300 group-hover:translate-x-0.5 transition-transform">›</span>
      </Link>
      <p className="text-[9px] font-bold tracking-[0.3em] text-stone-400 uppercase mb-4">Kategoriler</p>
      <nav className="flex flex-col gap-1">
        {kategoriler.map((kat, i) => (
          <div key={i} onMouseEnter={() => setAcik(i)} onMouseLeave={() => setAcik(null)} className="relative">
            <button onClick={() => kategoriTikla(i, kat)} className={`w-full flex justify-between items-center text-left py-2 px-3 rounded-md text-sm font-semibold tracking-wide transition-colors ${seciliKategori === kat.baslik ? 'bg-stone-200 ' + kat.renk : (acik === i ? 'bg-stone-100 ' + kat.renk : 'text-stone-700 hover:bg-stone-50')}`}>
              {kat.baslik}
              <span className={`transition-transform duration-200 text-xs ${acik === i ? 'rotate-90' : ''}`}>›</span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${acik === i ? 'max-h-48 opacity-100 mt-1 mb-1' : 'max-h-0 opacity-0'}`}>
              <div className="ml-3 flex flex-col gap-0.5 pb-1">
                {kat.alt.map((alt, j) => (
                  <button key={j} onClick={() => { setSeciliKategori(kat.baslik); setSeciliAltKategori(alt) }} className="text-left text-[11px] text-stone-500 hover:text-stone-800 py-1 px-2 rounded hover:bg-stone-100 transition-colors">
                    {alt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </nav>
      <div className="mt-8 border-t border-stone-200 pt-5">
        <p className="text-[9px] font-bold tracking-[0.3em] text-stone-400 uppercase mb-3">Filtrele</p>
        <div className="flex flex-col gap-2">
          {['En Yeniler', 'En Çok Satanlar', 'Fiyat: Artan', 'Fiyat: Azalan'].map((f) => (
            <button key={f} onClick={() => setAktifFiltre(aktifFiltre === f ? null : f)} className={`text-left text-[11px] py-1 px-2 rounded transition-colors ${aktifFiltre === f ? 'bg-stone-800 text-white font-semibold' : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'}`}>
              {aktifFiltre === f ? '✓ ' : ''}{f}
            </button>
          ))}
        </div>
        {aktifFiltre && (
          <button onClick={() => setAktifFiltre(null)} className="mt-3 text-[10px] text-stone-400 hover:text-stone-600 underline transition-colors">Filtreyi Kaldır</button>
        )}
      </div>
    </aside>
  )
}

/* ─── KAMPANYALAR & VİTRİN SLIDER ────────────────────────────────────────── */
function KampanyaSlider() {
  const [aktif, setAktif] = useState(0)
  const sliderRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => setAktif((prev) => (prev + 1) % kampanyalar.length), 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (sliderRef.current) sliderRef.current.scrollTo({ left: aktif * sliderRef.current.offsetWidth, behavior: 'smooth' })
  }, [aktif])

  return (
    <div className="mb-14" id="kampanyalar">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold tracking-widest uppercase">KAMPANYALAR & FIRSATLAR :</h2>
        <div className="flex gap-1.5">
          {kampanyalar.map((_, i) => (
            <button key={i} onClick={() => setAktif(i)} className={`rounded-full transition-all duration-300 ${i === aktif ? 'w-5 h-2 bg-stone-800' : 'w-2 h-2 bg-stone-300 hover:bg-stone-500'}`} />
          ))}
        </div>
      </div>
      <div ref={sliderRef} className="flex overflow-x-hidden snap-x snap-mandatory rounded-xl" style={{ scrollSnapType: 'x mandatory' }}>
        {kampanyalar.map((k, i) => (
          <div key={i} className={`snap-start shrink-0 w-full relative overflow-hidden rounded-xl bg-gradient-to-br ${k.renk} min-h-[200px] flex`} style={{ minWidth: '100%' }}>
            <img src={k.gorsel} alt={k.baslik} className="absolute inset-0 w-full h-full object-cover opacity-20" />
            <div className="relative z-10 flex flex-col justify-between p-8 w-full">
              <div>
                <span className={`inline-block text-[9px] font-bold tracking-widest text-white px-3 py-1 rounded-full mb-4 ${k.rozetRenk}`}>{k.rozet}</span>
                <h3 className="text-2xl font-bold text-white tracking-wider mb-1">{k.baslik}</h3>
                <p className="text-white/80 font-semibold text-lg mb-3">{k.altBaslik}</p>
                <p className="text-white/60 text-sm max-w-md">{k.aciklama}</p>
              </div>
              <div className="flex items-center justify-between mt-6">
                <Link to="/kampanyalar" className="bg-white text-stone-800 text-xs font-bold tracking-widest uppercase px-6 py-2.5 rounded-full hover:bg-stone-100 transition-colors">Kampanyayı Keşfet →</Link>
                <span className="text-white/40 text-xs">{i + 1} / {kampanyalar.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function VitrinSlider({ baslik, urunlerListesi, id, aktifFiltre }) {
  const sliderRef = useRef(null)

  const siraliUrunler = [...urunlerListesi].sort((a, b) => {
    if (!aktifFiltre) return 0;
    const fiyatA = parseInt(a.fiyat.replace(/\D/g, ''));
    const fiyatB = parseInt(b.fiyat.replace(/\D/g, ''));
    if (aktifFiltre === 'Fiyat: Artan') return fiyatA - fiyatB;
    if (aktifFiltre === 'Fiyat: Azalan') return fiyatB - fiyatA;
    if (aktifFiltre === 'En Yeniler') return -1; 
    if (aktifFiltre === 'En Çok Satanlar') return a.isim.localeCompare(b.isim);
    return 0;
  })

  useEffect(() => {
    const randomSure = Math.floor(Math.random() * 1000) + 3500
    const otoKaydir = setInterval(() => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
        if (scrollLeft + clientWidth >= scrollWidth - 5) sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        else sliderRef.current.scrollBy({ left: 284, behavior: 'smooth' })
      }
    }, randomSure)
    return () => clearInterval(otoKaydir)
  }, [])

  const manuelKaydir = (yon) => {
    if (sliderRef.current) sliderRef.current.scrollBy({ left: yon * 284, behavior: 'smooth' })
  }

  const vitrinGosterimi = [...siraliUrunler, ...siraliUrunler]

  return (
    <div className="mb-14" id={id}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold tracking-widest uppercase">{baslik}</h2>
        {aktifFiltre && <span className="text-[10px] bg-stone-200 text-stone-600 px-2.5 py-1 rounded-full font-medium">{aktifFiltre}</span>}
      </div>
      <div className="relative group">
        <button onClick={() => manuelKaydir(-1)} className="absolute left-0 top-[130px] -translate-y-1/2 -ml-5 z-10 bg-white/90 shadow-md border border-stone-200 text-stone-600 rounded-full w-10 h-10 flex items-center justify-center hover:bg-stone-800 hover:text-white transition-colors opacity-0 group-hover:opacity-100">‹</button>
        <button onClick={() => manuelKaydir(1)} className="absolute right-0 top-[130px] -translate-y-1/2 -mr-5 z-10 bg-white/90 shadow-md border border-stone-200 text-stone-600 rounded-full w-10 h-10 flex items-center justify-center hover:bg-stone-800 hover:text-white transition-colors opacity-0 group-hover:opacity-100">›</button>
        <div ref={sliderRef} className="flex gap-6 overflow-x-auto scrollbar-hide hide-scroll pb-4 scroll-smooth snap-x snap-mandatory">
          {vitrinGosterimi.map((urun, index) => (
            <div key={index} className="snap-start shrink-0">
              <UrunKarti urun={urun} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── ANA BİLEŞEN ───────────────────────────────────── */
function Atolye() {
  const [aktifFiltre, setAktifFiltre] = useState(null)
  const [seciliKategori, setSeciliKategori] = useState(null)
  const [seciliAltKategori, setSeciliAltKategori] = useState(null)

  const tumUrunler = [...urunler, ...cokSatanlar, ...yeniTasarimlar]

  const filtrelenmisKategoriUrunleri = tumUrunler.filter(urun => {
    let kategoriUyuyor = true; let altKategoriUyuyor = true;
    if (seciliKategori) kategoriUyuyor = urun.kategori === seciliKategori;
    if (seciliAltKategori) altKategoriUyuyor = urun.altKategori === seciliAltKategori;
    return kategoriUyuyor && altKategoriUyuyor;
  })

  if (aktifFiltre) {
    filtrelenmisKategoriUrunleri.sort((a, b) => {
      const fiyatA = parseInt(a.fiyat.replace(/\D/g, ''));
      const fiyatB = parseInt(b.fiyat.replace(/\D/g, ''));
      if (aktifFiltre === 'Fiyat: Artan') return fiyatA - fiyatB;
      if (aktifFiltre === 'Fiyat: Azalan') return fiyatB - fiyatA;
      return 0;
    })
  }

  return (
    <div className="bg-stone-50">
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { display: flex; white-space: nowrap; animation: marquee 35s linear infinite; }
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Hero Banner */}
      <div className="relative w-full h-96 overflow-hidden">
        <img src={atolyeden} alt="atolye" className="object-cover w-full h-full" />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center px-4">
          <p className="text-xs tracking-widest mb-2">ZEVKLİ TASARIMLAR</p>
          <h1 className="text-4xl font-bold mb-4">Atölyeden Evinize, Hikayesi Olan Tasarımlar.</h1>
          <p className="text-sm max-w-xl text-stone-200">
            Her bir detayında alın teri, her bir kıvrımında mükemmellik tutkusu var. Atölyemizin tozunda doğan özel koleksiyonları keşfedin.
          </p>
        </div>
      </div>

      {/* Kayan Yazı */}
      <div className="w-full bg-stone-100/80 border-y border-stone-200 py-2.5 overflow-hidden flex items-center">
        <div className="animate-marquee text-[11px] tracking-[0.25em] text-stone-600 font-medium uppercase">
          <span className="mx-12">✧ Ürünlerimiz özenle el emeği ile hazırlandığından, kişiselleştirme süresi, teslimat ve stok durumu değişiklik gösterebilir ✧</span>
          <span className="mx-12 text-amber-700">🏷 YAZ KAMPANYASI: Deri ürünlerde %30'a kadar indirim — ATOLYE15 kodu ile ek %15 ✧</span>
          <span className="mx-12">✧ Bu hafta özel dikim siparişlerinde ücretsiz kargo ve hediye paketleme ✧</span>
          <span className="mx-12 text-teal-700">🎁 İlk siparişine özel ATOLYE15 kodunu kullanmayı unutma ✧</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 flex gap-10 items-start">
        <Sidebar aktifFiltre={aktifFiltre} setAktifFiltre={setAktifFiltre} seciliKategori={seciliKategori} setSeciliKategori={setSeciliKategori} setSeciliAltKategori={setSeciliAltKategori} />
        
        <div className="flex-1 min-w-0">
          <KampanyaSlider />

          {seciliKategori ? (
            <div className="mb-14 min-h-[400px]">
              <div className="flex items-center justify-between mb-8 border-b border-stone-200 pb-4">
                <h2 className="text-sm font-bold tracking-widest uppercase text-stone-800">
                  {seciliAltKategori ? `${seciliKategori} > ${seciliAltKategori}` : seciliKategori}
                </h2>
                <button onClick={() => {setSeciliKategori(null); setSeciliAltKategori(null)}} className="text-[11px] font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1 transition-colors">
                  ✕ Temizle ve Tümüne Dön
                </button>
              </div>
              
              {filtrelenmisKategoriUrunleri.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6">
                  {filtrelenmisKategoriUrunleri.map((urun, idx) => (
                    <UrunKarti key={idx} urun={urun} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-lg border border-stone-100">
                  <p className="text-stone-400 text-lg mb-2">Bu kategoride henüz ürün bulunmuyor.</p>
                </div>
              )}
            </div>
          ) : (
            <>
              <VitrinSlider id="bu-hafta" baslik="BU HAFTA ÖNE ÇIKANLAR :" urunlerListesi={urunler} aktifFiltre={aktifFiltre} />
              <VitrinSlider id="cok-satanlar" baslik="EN ÇOK SATANLAR :" urunlerListesi={cokSatanlar} aktifFiltre={aktifFiltre} />
              <VitrinSlider id="yeni-tasarimlar" baslik="YENİ TASARIMLAR :" urunlerListesi={yeniTasarimlar} aktifFiltre={aktifFiltre} />
            </>
          )}

          {/* ─── ÖNE ÇIKAN ATÖLYELER ─── */}
          <div className="py-20 border-t border-stone-200/60 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <span className="text-[10px] tracking-[0.35em] text-stone-500 mb-3 block uppercase">Zanaatın Hikayesi</span>
                <h2 className="text-3xl font-serif text-stone-800">Öne Çıkan Atölyeler</h2>
              </div>
              <Link to="/atolyeler" className="text-xs font-semibold tracking-widest text-stone-700 uppercase flex items-center gap-2 border-b border-stone-400 pb-1.5 hover:border-stone-800 transition-colors group">
                Tüm Atölyeleri Gör <span className="text-lg font-light leading-none group-hover:translate-x-1 transition-transform">›</span>
              </Link>
            </div>

            <div className="flex flex-col gap-16 md:gap-24">

              {/* 1. Deri Atölyesi */}
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
                <div className="w-full md:w-5/12">
                  <div className="aspect-[4/3] overflow-hidden rounded-md bg-stone-100 shadow-sm relative group cursor-pointer">
                    <img src={deriAtolye1} alt="Mila Vintage Deri" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/50 transition-colors duration-500 flex items-center justify-center">
                      <Link to="/atolyeler" className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75 text-white border border-white/60 px-6 py-2.5 rounded-sm text-[10px] tracking-[0.2em] uppercase font-medium backdrop-blur-sm">Atölyeyi Keşfet</Link>
                    </div>
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[9px] font-bold tracking-widest px-3 py-1.5 rounded-sm uppercase text-stone-800 transition-opacity duration-300 group-hover:opacity-0">Mila Vintage</div>
                  </div>
                </div>
                <div className="w-full md:w-7/12 flex flex-col justify-center">
                  <h3 className="text-2xl font-serif text-stone-800 mb-3">Mila DERİ ÇANTA & CÜZDAN</h3>
                  <p className="text-[10px] font-bold text-amber-600 tracking-wider mb-4 uppercase">El Yapımı Çanta & Zanaat</p>
                  <p className="text-stone-600 text-sm leading-relaxed mb-5">
                    Derinin yaşanmışlığını ve karakterini yansıtan koleksiyonlarımız, ustamızın yıllara dayanan tecrübesiyle şekilleniyor. Arkasındaki devasa renk paletinden özenle seçilen her bir deri parçası, zamana meydan okuyan tasarımlara dönüşerek sadece size özel bir hikaye anlatır.
                  </p>
                  <div className="bg-stone-50 border-l-2 border-amber-400 p-4 rounded-r-md">
                    <p className="text-stone-700 text-xs italic mb-2">"Yıllardır aradığım o kusursuz vintage görünümlü çantayı sonunda burada buldum. İşçilik tek kelimeyle muazzam."</p>
                    <span className="text-[10px] font-bold text-stone-500 uppercase">— Aylin S.</span>
                  </div>
                </div>
              </div>

              {/* 2. Özel Dikim */}
              <div className="flex flex-col md:flex-row-reverse gap-8 md:gap-12 items-center">
                <div className="w-full md:w-5/12">
                  <div className="aspect-[4/3] overflow-hidden rounded-md bg-stone-100 shadow-sm relative group cursor-pointer">
                    <img src={terzi} alt="Özel Dikim Terzihanesi" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/50 transition-colors duration-500 flex items-center justify-center">
                      <Link to="/atolyeler" className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75 text-white border border-white/60 px-6 py-2.5 rounded-sm text-[10px] tracking-[0.2em] uppercase font-medium backdrop-blur-sm">Atölyeyi Keşfet</Link>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[9px] font-bold tracking-widest px-3 py-1.5 rounded-sm uppercase text-stone-800 transition-opacity duration-300 group-hover:opacity-0">Özel Dikim</div>
                  </div>
                </div>
                <div className="w-full md:w-7/12 flex flex-col justify-center md:text-right">
                  <h3 className="text-2xl font-serif text-stone-800 mb-3">Özel Dikim Terzihanesi</h3>
                  <p className="text-[10px] font-bold text-sky-600 tracking-wider mb-4 uppercase">Ismarlama & Klasik Kesim</p>
                  <p className="text-stone-600 text-sm leading-relaxed mb-5">
                    Milimetrik hesaplamalar, usta işi tebeşir çizgileri ve birinci sınıf kumaşların kusursuz buluşma noktası. Standart kalıpların ötesine geçerek; sadece bedeninize değil, karakterinize ve duruşunuza da tam oturan kişiye özel tasarımlar hazırlıyoruz.
                  </p>
                  <div className="bg-stone-50 border-r-2 border-sky-400 p-4 rounded-l-md md:text-left">
                    <p className="text-stone-700 text-xs italic mb-2">"Kumaşın kalitesi ve ustanın özeni inanılmazdı. Kesimi o kadar kusursuz ki, üzerimde taşıdığım en iyi ceket oldu."</p>
                    <span className="text-[10px] font-bold text-stone-500 uppercase">Burak Y. —</span>
                  </div>
                </div>
              </div>

              {/* 3. Oyuncak */}
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
                <div className="w-full md:w-5/12">
                  <div className="aspect-[4/3] overflow-hidden rounded-md bg-stone-100 shadow-sm relative group cursor-pointer">
                    <img src={oyuncak1} alt="Amigurumi Tales" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/50 transition-colors duration-500 flex items-center justify-center">
                      <Link to="/atolyeler" className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75 text-white border border-white/60 px-6 py-2.5 rounded-sm text-[10px] tracking-[0.2em] uppercase font-medium backdrop-blur-sm">Atölyeyi Keşfet</Link>
                    </div>
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[9px] font-bold tracking-widest px-3 py-1.5 rounded-sm uppercase text-stone-800 transition-opacity duration-300 group-hover:opacity-0">Amigurumi Tales</div>
                  </div>
                </div>
                <div className="w-full md:w-7/12 flex flex-col justify-center">
                  <h3 className="text-2xl font-serif text-stone-800 mb-3">Amigurumi OYUNCAK</h3>
                  <p className="text-[10px] font-bold text-rose-500 tracking-wider mb-4 uppercase">İlmek İlmek: Oyuncak</p>
                  <p className="text-stone-600 text-sm leading-relaxed mb-5">
                    Çocuklar ve ruhu çocuk kalanlar için, organik pamuk iplerle örülmüş uyku arkadaşları. Hiçbir zararlı madde içermeyen, tamamen doğal amigurumi oyuncaklarımız sevgiyle ilmek ilmek işleniyor.
                  </p>
                  <div className="bg-stone-50 border-l-2 border-rose-400 p-4 rounded-r-md">
                    <p className="text-stone-700 text-xs italic mb-2">"Kızım tavşanını elinden düşürmüyor, dokusu o kadar yumuşak ve güvenli ki içim çok rahat."</p>
                    <span className="text-[10px] font-bold text-stone-500 uppercase">— Zeynep K.</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Atolye