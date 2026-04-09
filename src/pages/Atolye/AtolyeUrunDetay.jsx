import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function AtolyeUrunDetay() {
  const location = useLocation();
  const urun = location.state?.urun;

  // Ana görseli değiştirmek için state (Galeri için)
  const [seciliGorsel, setSeciliGorsel] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  if (!urun) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-10 text-stone-500">
        <h2 className="text-xl font-medium mb-4">Ürün yüklenemedi.</h2>
        <button onClick={() => window.history.back()} className="underline">Geri Dön</button>
      </div>
    );
  }

 
  const tumGorseller = urun.gorseller || (urun.gorsel ? [urun.gorsel] : []);

  // Zoom işlevi
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
      {/* Üst Navigasyon / Geri Dön */}
      <nav className="mb-8 flex items-center text-[10px] uppercase tracking-[0.2em] text-stone-400">
        <button onClick={() => window.history.back()} className="hover:text-stone-800 transition-colors">
          ← Atölye
        </button>
        <span className="mx-3">/</span>
        <span>{urun.kategori || 'Ürün'}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* SOL TARAF: GÖRSEL ALANI (Galeri + Ana Görsel) */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          
          {/* Küçük Önizleme Görselleri (Thumbnail List) */}
          {tumGorseller.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto">
              {tumGorseller.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSeciliGorsel(idx)}
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${
                    seciliGorsel === idx ? 'border-stone-800' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Ana Görsel & Zoom Alanı */}
          <div 
            className="relative flex-1 aspect-square bg-stone-50 rounded-xl overflow-hidden cursor-zoom-in"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={tumGorseller[seciliGorsel]}
              alt={urun.isim}
              className={`w-full h-full object-cover transition-transform duration-200 ${
                isZoomed ? 'scale-[2]' : 'scale-100'
              }`}
              style={
                isZoomed 
                  ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } 
                  : { transformOrigin: 'center' }
              }
            />
            {/* Zoom Uyarısı (Mobil olmayanlarda görünür) */}
            {!isZoomed && (
               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-[9px] uppercase tracking-widest text-stone-500 pointer-events-none hidden md:block">
                 Yakınlaştırmak için üzerine gelin
               </div>
            )}
          </div>
        </div>

        {/* SAĞ TARAF: ÜRÜN BİLGİLERİ */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="border-b border-stone-100 pb-8">
            <span className="text-[10px] font-bold text-amber-600 tracking-[0.3em] uppercase mb-3 block">
              {urun.altKategori || urun.kategori || 'Özel Tasarım'}
            </span>
            <h1 className="text-3xl md:text-4xl font-serif text-stone-800 mb-4 leading-tight">
              {urun.isim}
            </h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold text-stone-900">{urun.fiyat}</span>
              <span className="px-2.5 py-1 bg-stone-100 text-stone-500 text-[10px] font-bold rounded-sm uppercase tracking-wider">
                Ücretsiz Kargo
              </span>
            </div>
            <p className="text-stone-600 text-sm leading-relaxed">
              {urun.aciklama || "Zanaatkarlarımız tarafından özenle hazırlanan bu parça, atölye ruhunu evinize taşıyor."}
            </p>
          </div>

          {/* Ürün Özellikleri Özeti (Örn: Malzeme, Boyut) */}
          <div className="py-8 grid grid-cols-2 gap-6 border-b border-stone-100">
            <div>
              <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Materyal</h4>
              <p className="text-xs font-medium text-stone-800">Doğal Malzeme / El Yapımı</p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Hazırlanma Süresi</h4>
              <p className="text-xs font-medium text-stone-800">3-5 İş Günü</p>
            </div>
          </div>

          {/* EYLEM BUTONLARI */}
          <div className="pt-8 flex flex-col gap-4 mt-auto">
            <div className="flex gap-3">
              <button className="flex-1 bg-stone-800 text-white font-bold py-4 rounded-lg hover:bg-stone-900 transition-all uppercase tracking-widest text-xs shadow-lg active:scale-95">
                Sepete Ekle
              </button>
              <button className="w-14 h-14 flex items-center justify-center border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors group">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-stone-400 group-hover:text-red-600 transition-colors">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>
            </div>
            
            <p className="text-[9px] text-center text-stone-400 uppercase tracking-widest">
              Güvenli Ödeme & %100 Orijinal Tasarım
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AtolyeUrunDetay;