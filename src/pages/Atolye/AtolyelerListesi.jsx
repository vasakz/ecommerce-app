import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

// --- Senin Projendeki Görseller ---
import deri1 from '../../assets/deri-1.jpeg'
import deri5 from '../../assets/deri-5.jpeg'
import deri8 from '../../assets/deri-8.jpeg'
import deri11 from '../../assets/deri-11.jpeg'
import deriCuzdan from '../../assets/deri-cuzdan.jpg'

import deriAtolye1 from '../../assets/deri-atolye1.jpg'
import terzi from '../../assets/terzi.jpeg'
import oyuncak1 from '../../assets/oyuncak1.jpg'

import oyuncakTavsan from '../../assets/oyuncak-tavsan.jpg'
import kumasCanta from '../../assets/kumas-canta.jpg'
import ketenYastik from '../../assets/keten-yastik.jpg'
import makromeSusu from '../../assets/makrome-susu.jpg'

// ─── Veri: Senin Görsellerinle Hazırlandı ───
const atolyelerVerisi = [
  {
    id: 'mila-deri',
    isim: 'Mila Vintage Deri',
    kategori: 'Deri',
    lokasyon: 'İstanbul',
    puan: '4.9',
    degerlendirmeSayisi: 128,
    avatar: deriAtolye1,
    aciklama: 'Derinin yaşanmışlığını ve karakterini yansıtan koleksiyonlarımız, ustamızın yıllara dayanan tecrübesiyle şekilleniyor. Arkasındaki devasa renk paletinden özenle seçilen her bir deri parçası, zamana meydan okuyan tasarımlara dönüşüyor.',
    urunler: [
      { isim: 'DERİ ÇANTA NO.1', fiyat: '1200TL', gorsel: deri1 },
      { isim: 'DERİ ÇANTA NO.2', fiyat: '950TL', gorsel: deri5 },
      { isim: 'DERİ ÇANTA NO.3', fiyat: '1100TL', gorsel: deri8 },
      { isim: 'DERİ ÇANTA NO.4', fiyat: '850TL', gorsel: deri11 },
      { isim: 'VINTAGE DERİ CÜZDAN', fiyat: '600TL', gorsel: deriCuzdan },
    ]
  },
  {
    id: 'ozel-dikim',
    isim: 'Özel Dikim Terzihanesi',
    kategori: 'Tekstil & Giyim',
    lokasyon: 'İzmir',
    puan: '4.7',
    degerlendirmeSayisi: 85,
    avatar: terzi,
    aciklama: 'Milimetrik hesaplamalar, usta işi tebeşir çizgileri ve birinci sınıf kumaşların kusursuz buluşma noktası. Standart kalıpların ötesine geçerek bedeninize ve karakterinize tam oturan tasarımlar.',
    urunler: [
      { isim: 'ÖZEL DİKİM KUMAŞ ÇANTA', fiyat: '750TL', gorsel: kumasCanta },
      { isim: 'KETEN YASTIK KILIFI', fiyat: '300TL', gorsel: ketenYastik },
      { isim: 'MAKROME DUVAR SÜSÜ', fiyat: '550TL', gorsel: makromeSusu },
    ]
  },
  {
    id: 'amigurumi',
    isim: 'Amigurumi Tales',
    kategori: 'Oyuncak & Çocuk',
    lokasyon: 'Ankara',
    puan: '5.0',
    degerlendirmeSayisi: 240,
    avatar: oyuncak1,
    aciklama: 'Çocuklar ve ruhu çocuk kalanlar için, organik pamuk iplerle örülmüş uyku arkadaşları. Hiçbir zararlı madde içermeyen, tamamen doğal amigurumi oyuncaklarımız sevgiyle ilmek ilmek işleniyor.',
    urunler: [
      { isim: 'AMİGURUMİ TAVŞAN', fiyat: '350TL', gorsel: oyuncakTavsan },
    ]
  }
];

// ─── Atölye İçin Özel Slider Bileşeni ───
function AtolyeVitrin({ atolye }) {
  const sliderRef = useRef(null);

  const manuelKaydir = (yon) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: yon * 280, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-20 bg-white p-8 md:p-10 rounded-xl shadow-sm border border-stone-100 relative">
      
      {/* Üst Kısım: Avatar ve Açıklama */}
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-10 border-b border-stone-100 pb-8">
        
        {/* Avatar */}
        <div className="w-28 h-28 flex-shrink-0 relative">
          <img 
            src={atolye.avatar} 
            alt={atolye.isim} 
            className="w-full h-full object-cover rounded-full shadow-md border-4 border-white"
          />
          {/* Çevrimiçi/Onaylı Rozeti */}
          <div className="absolute bottom-1 right-1 w-5 h-5 bg-stone-800 rounded-full border-2 border-white flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-white">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Detaylar */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-3xl font-serif text-stone-800">{atolye.isim}</h2>
            <span className="px-2.5 py-0.5 bg-stone-100 text-stone-600 text-[10px] uppercase tracking-widest rounded-full">{atolye.kategori}</span>
          </div>
          
          {/* Ekstra Detaylar (Lokasyon & Puan) */}
          <div className="flex items-center gap-4 text-xs text-stone-500 font-medium mb-4">
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-stone-400"><path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" /></svg>
              {atolye.lokasyon}
            </span>
            <span className="flex items-center gap-1 text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" /></svg>
              {atolye.puan} <span className="text-stone-400">({atolye.degerlendirmeSayisi})</span>
            </span>
          </div>

          <p className="text-stone-600 text-sm leading-relaxed max-w-3xl">
            {atolye.aciklama}
          </p>
        </div>

        {/* Aksiyon Butonları */}
        <div className="flex flex-col gap-3 flex-shrink-0 w-full md:w-auto">
          <Link to={`/atolyeler/${atolye.id}`} className="text-center text-xs font-semibold tracking-widest text-white uppercase bg-stone-800 px-8 py-3.5 rounded-full hover:bg-stone-900 transition-colors shadow-md">
            Atölyeyi Ziyaret Et
          </Link>
          <button className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest text-stone-600 uppercase bg-white border border-stone-200 px-8 py-3.5 rounded-full hover:bg-stone-50 hover:border-stone-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            Takip Et
          </button>
        </div>
      </div>

      {/* Alt Kısım: Ürünler Slider */}
      <div className="relative group">
        
        {/* Sol Ok */}
        <button onClick={() => manuelKaydir(-1)} className="absolute left-0 top-[110px] -translate-y-1/2 -ml-5 z-10 bg-white/90 shadow-lg border border-stone-100 text-stone-600 rounded-full w-10 h-10 flex items-center justify-center hover:bg-stone-800 hover:text-white transition-all opacity-0 group-hover:opacity-100">
          ‹
        </button>

        {/* Sağ Ok */}
        <button onClick={() => manuelKaydir(1)} className="absolute right-0 top-[110px] -translate-y-1/2 -mr-5 z-10 bg-white/90 shadow-lg border border-stone-100 text-stone-600 rounded-full w-10 h-10 flex items-center justify-center hover:bg-stone-800 hover:text-white transition-all opacity-0 group-hover:opacity-100">
          ›
        </button>

        <div ref={sliderRef} className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth snap-x snap-mandatory hide-scroll">
          <style>{`.hide-scroll::-webkit-scrollbar { display: none; } .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
          
          {atolye.urunler.map((urun, index) => (
            <div key={index} className="snap-start shrink-0 w-[220px] cursor-pointer group/card">
              <div className="w-full h-[220px] bg-stone-100 mb-3 overflow-hidden rounded-md relative shadow-sm">
                <img 
                  src={urun.gorsel} 
                  alt={urun.isim} 
                  className="w-full h-full object-cover transition duration-700 group-hover/card:scale-110"
                />
              </div>
              <p className="font-medium tracking-wide text-xs text-stone-800 line-clamp-1">{urun.isim}</p>
              <p className="font-bold text-stone-600 mt-1 text-sm">{urun.fiyat}</p>
            </div>
          ))}

          {/* Tümünü Gör Kartı */}
          <div className="snap-start shrink-0 w-[220px] cursor-pointer flex items-center justify-center">
            <Link to={`/atolyeler/${atolye.id}`} className="flex flex-col items-center justify-center h-[220px] w-full border border-dashed border-stone-300 bg-stone-50 rounded-md text-stone-500 hover:border-stone-800 hover:text-stone-800 hover:bg-stone-100 transition-colors">
               <span className="text-3xl font-light mb-1">›</span>
               <span className="text-[9px] uppercase tracking-widest font-bold">Tümünü Gör</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Ana Sayfa Bileşeni ───
function AtolyelerListesi() {
  const [seciliKategori, setSeciliKategori] = useState('Tümü');
  const kategoriler = ['Tümü', 'Deri', 'Tekstil & Giyim', 'Oyuncak & Çocuk', 'Seramik', 'Ahşap'];

  const filtrelenmisAtolyeler = seciliKategori === 'Tümü' 
    ? atolyelerVerisi 
    : atolyelerVerisi.filter(a => a.kategori === seciliKategori);

  return (
    <div className="bg-stone-50 min-h-screen pt-24 pb-20">
      
      {/* Zarif Tipografik Başlık (Kocaman görsel yerine) */}
      <div className="max-w-4xl mx-auto text-center px-6 mb-12">
        <span className="text-[10px] tracking-[0.4em] text-stone-400 mb-4 block uppercase font-bold">Zanaatkarlarımız</span>
        <h1 className="text-4xl md:text-5xl font-serif text-stone-800 mb-6">Atölyeleri Keşfet</h1>
        <p className="text-sm text-stone-500 max-w-2xl mx-auto leading-relaxed">
          Her biri kendi alanında usta zanaatkarlarımızın atölyelerine konuk olun. Hikayelerini okuyun, özenle hazırladıkları eşsiz koleksiyonları inceleyin ve favori zanaatkarlarınızı takip edin.
        </p>
      </div>

      {/* Şık Kategori Filtreleri (Hap Butonlar) */}
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
  );
}

export default AtolyelerListesi;