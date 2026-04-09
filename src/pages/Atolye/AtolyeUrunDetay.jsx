import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

// Redux Actions 
import { addToCart } from '../../store/slices/cartSlice';
import { addToFavorites, removeFromFavorites } from '../../store/slices/favoritesSlice';

function AtolyeUrunDetay() {
  const location = useLocation();
  const urun = location.state?.urun;

  // -- REDUX BAĞLANTILARI --
  const dispatch = useDispatch();
  const favoriler = useSelector((state) => state.favorites.items);
  // Bu ürün favorilerde var mı kontrolü
  const isFavorited = favoriler.some((item) => item.id === urun?.id);

  // -- 1. TEMEL STATELER (Galeri ve Zoom) --
  const [seciliGorsel, setSeciliGorsel] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // -- 2. DİNAMİK FİYAT VE ÖZELLEŞTİRME STATELERİ --
  const [seciliBoyut, setSeciliBoyut] = useState(null);
  const [seciliRenk, setSeciliRenk] = useState(null);
  const [seciliEkstralar, setSeciliEkstralar] = useState([]);
  
  // -- 3. MODAL STATE'İ --
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (urun) {
      setSeciliBoyut(BOYUTLAR[0]);
      setSeciliRenk(RENKLER[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urun]);

  if (!urun) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-10 text-stone-500">
        <h2 className="text-xl font-medium mb-4">Ürün yüklenemedi.</h2>
        <button onClick={() => window.history.back()} className="underline hover:text-stone-800">Geri Dön</button>
      </div>
    );
  }

  const tumGorseller = urun.gorseller && urun.gorseller.length > 0 ? urun.gorseller : (urun.gorsel ? [urun.gorsel] : []);

  // Fiyatı sayıya çevir (Örn: "1200 TL" -> 1200)
  const tabanFiyat = parseInt(urun.fiyat?.replace(/\D/g, '') || 1200);

  const BOYUTLAR = [
    { id: 's', isim: 'Standart', ekUcret: 0 },
    { id: 'm', isim: 'Büyük Boy', ekUcret: 300 },
    { id: 'xl', isim: 'Özel Ölçü', ekUcret: 500 },
  ];

  const RENKLER = [
    { id: 'taba', isim: 'Taba', ekUcret: 0, hex: '#8B5A2B' },
    { id: 'siyah', isim: 'Gece Siyahı', ekUcret: 0, hex: '#1C1C1C' },
    { id: 'ozel', isim: 'Çift Renk', ekUcret: 150, hex: 'linear-gradient(to right, #8B5A2B, #1C1C1C)' },
  ];

  const EKSTRALAR = [
    { id: 'isim', isim: 'İsim/Baş Harf Kazıma', ekUcret: 100 },
    { id: 'hediye', isim: 'Premium Hediye Paketi', ekUcret: 50 },
  ];

  const toplamFiyat = tabanFiyat 
    + (seciliBoyut?.ekUcret || 0) 
    + (seciliRenk?.ekUcret || 0) 
    + seciliEkstralar.reduce((toplam, ekstra) => toplam + ekstra.ekUcret, 0);

  const toggleEkstra = (ekstra) => {
    if (seciliEkstralar.some(e => e.id === ekstra.id)) {
      setSeciliEkstralar(seciliEkstralar.filter(e => e.id !== ekstra.id));
    } else {
      setSeciliEkstralar([...seciliEkstralar, ekstra]);
    }
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setMousePos({ x, y });
  };

  // -- FONKSİYON 1: SEPETE EKLE --
  const sepeteEkle = () => {
    const sepeteUygunUrun = {
      id: urun.id, // Varsa ekstra seçeneğe göre id benzersizleştirilebilir
      isim: urun.isim,
      fiyat: `${toplamFiyat} TL`, // Dinamik hesaplanan fiyatı gönderiyoruz
      image: tumGorseller[0],
      // Sepette görünmesi için özellikleri de ekliyoruz
      ozellikler: {
        boyut: seciliBoyut.isim,
        renk: seciliRenk.isim,
        ekstralar: seciliEkstralar.map(e => e.isim)
      }
    };

    dispatch(addToCart(sepeteUygunUrun));
    
    // bildirim tasarımın
    toast.success(`${urun.isim} sepete eklendi!`, {
      style: {
        background: 'rgba(41, 37, 36, 0.95)',
        color: '#f5f5f4',
        backdropFilter: 'blur(8px)',
        padding: '16px 24px',
        fontSize: '13px',
        fontWeight: '500',
        letterSpacing: '0.05em',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      iconTheme: { primary: '#d97706', secondary: '#fff' },
    });
  };

  // -- FONKSİYON 2: FAVORİLERE EKLE / ÇIKAR --
  const favoriToggle = () => {
    const arkadasinFormatindaUrun = {
      id: urun.id,
      name: urun.isim,
      price: parseInt(urun.fiyat.replace(/\D/g, '')), 
      image: tumGorseller[0],
      category: urun.kategori || urun.altKategori || 'Özel Tasarım'
    };

    if (isFavorited) {
      dispatch(removeFromFavorites(urun.id));
    } else {
      dispatch(addToFavorites(arkadasinFormatindaUrun));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 bg-white relative">
      
      {/* Üst Navigasyon */}
      <nav className="mb-8 flex items-center text-[10px] uppercase tracking-[0.2em] text-stone-400">
        <button onClick={() => window.history.back()} className="hover:text-stone-800 transition-colors">
          ← Atölye
        </button>
        <span className="mx-3">/</span>
        <span>{urun.kategori || 'Ürün'}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* -- SOL TARAF: GÖRSELLER -- */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4 h-fit sticky top-24">
          {tumGorseller.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar pb-2 md:pb-0">
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

          <div 
            className="relative flex-1 aspect-square bg-stone-50 rounded-lg overflow-hidden cursor-zoom-in group"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={tumGorseller[seciliGorsel]}
              alt={urun.isim}
              className={`w-full h-full object-cover transition-transform duration-200 ${isZoomed ? 'scale-[2.5]' : 'scale-100'}`}
              style={isZoomed ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : { transformOrigin: 'center' }}
            />
            {!isZoomed && (
               <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/70 backdrop-blur-md px-4 py-2 rounded-full text-[9px] uppercase tracking-[0.2em] text-stone-600 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity hidden md:block border border-white/50 shadow-sm">
                 Yakınlaştırmak için kaydırın
               </div>
            )}
          </div>
        </div>

        {/* -- SAĞ TARAF: ÖZELLEŞTİRME VE DETAYLAR -- */}
        <div className="lg:col-span-5 flex flex-col">
          
          <div className="pb-8">
            <span className="text-[10px] font-bold text-amber-600/80 tracking-[0.3em] uppercase mb-3 block">
              {urun.altKategori || urun.kategori || 'Atölye Tasarımı'}
            </span>
            <h1 className="text-3xl md:text-4xl font-serif text-stone-800 mb-4 leading-tight">{urun.isim}</h1>
            
            {/* Dinamik Fiyat */}
            <div className="flex items-end gap-3 mb-4">
              <span className="text-3xl font-light text-stone-900">{toplamFiyat.toLocaleString('tr-TR')} ₺</span>
              {toplamFiyat > tabanFiyat && (
                <span className="text-xs text-stone-400 line-through mb-1.5">{tabanFiyat.toLocaleString('tr-TR')} ₺</span>
              )}
            </div>

            {/* Modal Açma Butonu */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-[11px] uppercase tracking-widest text-stone-500 underline underline-offset-4 hover:text-stone-900 transition-colors flex items-center gap-2"
            >
              Ürün Detayları ve Bakım İçin İncele
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </button>
          </div>

          <div className="h-px w-full bg-stone-100 mb-8" />

          {/* 1. Boyut Seçimi */}
          <div className="mb-8">
            <div className="flex justify-between items-end mb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-800">Boyut Seçimi</h3>
              <span className="text-[10px] text-stone-400">{seciliBoyut?.isim || 'Seçiniz'}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {BOYUTLAR.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSeciliBoyut(b)}
                  className={`py-3 px-2 rounded-md border text-center transition-all ${
                    seciliBoyut?.id === b.id 
                      ? 'border-stone-800 bg-stone-900 text-white shadow-md' 
                      : 'border-stone-200 text-stone-500 hover:border-stone-400 hover:bg-stone-50'
                  }`}
                >
                  <span className="block text-xs font-semibold mb-1">{b.isim}</span>
                  <span className={`text-[10px] ${seciliBoyut?.id === b.id ? 'text-white/70' : 'text-stone-400'}`}>
                    {b.ekUcret > 0 ? `+${b.ekUcret} ₺` : 'Ücretsiz'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Renk Seçimi */}
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-800 mb-3">Renk</h3>
            <div className="flex gap-4">
              {RENKLER.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSeciliRenk(r)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`w-8 h-8 rounded-full p-0.5 border-2 transition-colors ${seciliRenk?.id === r.id ? 'border-stone-800' : 'border-transparent group-hover:border-stone-300'}`}>
                    <div className="w-full h-full rounded-full shadow-inner" style={{ background: r.hex }} />
                  </div>
                  <span className={`text-[10px] font-medium transition-colors ${seciliRenk?.id === r.id ? 'text-stone-800' : 'text-stone-400'}`}>
                    {r.isim} {r.ekUcret > 0 && `(+${r.ekUcret})`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Ultra Kişiselleştirme (Ekstralar) */}
          <div className="mb-10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-800 mb-3">Kişiselleştirme</h3>
            <div className="flex flex-col gap-3">
              {EKSTRALAR.map((e) => {
                const isSelected = seciliEkstralar.some(item => item.id === e.id);
                return (
                  <button
                    key={e.id}
                    onClick={() => toggleEkstra(e)}
                    className={`flex items-center justify-between p-4 rounded-md border transition-all text-left ${
                      isSelected 
                        ? 'border-amber-600/50 bg-amber-50/30' 
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Özel Checkbox Tasarımı */}
                      <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${isSelected ? 'bg-amber-600 border-amber-600' : 'border-stone-300'}`}>
                        {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className={`text-sm ${isSelected ? 'text-stone-900 font-medium' : 'text-stone-600'}`}>{e.isim}</span>
                    </div>
                    <span className="text-xs text-stone-500 font-medium">+ {e.ekUcret} ₺</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Eylem Butonları */}
          <div className="mt-auto pt-6 border-t border-stone-100 flex gap-4 bg-white/90 backdrop-blur sticky bottom-0 py-4">
            <button 
              onClick={sepeteEkle}
              className="flex-1 bg-stone-900 text-white font-bold py-4 px-6 rounded-md hover:bg-stone-800 transition-all uppercase tracking-widest text-xs shadow-xl shadow-stone-900/10 active:scale-[0.98] flex justify-between items-center"
            >
              <span>Sepete Ekle</span>
              <span className="font-light">{toplamFiyat.toLocaleString('tr-TR')} ₺</span>
            </button>
            <button 
              onClick={favoriToggle}
              className={`w-14 h-14 flex items-center justify-center border rounded-md transition-all duration-300 group ${
                isFavorited ? 'border-red-200 bg-red-50' : 'border-stone-200 hover:bg-stone-50'
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill={isFavorited ? "#b91c1c" : "none"} 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke={isFavorited ? "#b91c1c" : "currentColor"} 
                className={`w-6 h-6 transition-all duration-300 ${isFavorited ? 'scale-110' : 'text-stone-400 group-hover:text-red-600'}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
          </div>
          
        </div>
      </div>

      {/* --- ŞEFFAF (GLASSMORPHISM) ÜRÜN BİLGİ MODALI --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Arkaplan Bulanıklığı (Backdrop Blur) */}
          <div 
            className="absolute inset-0 bg-stone-900/30 backdrop-blur-md transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Modal İçeriği */}
          <div className="relative w-full max-w-xl bg-white/95 backdrop-blur-xl border border-white/40 shadow-2xl rounded-xl p-8 md:p-12 z-10 animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-stone-400 hover:text-stone-800 transition-colors rounded-full hover:bg-stone-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-2xl font-serif text-stone-800 mb-6">Tasarım & Zanaat Detayları</h2>
            
            <div className="space-y-6 text-sm text-stone-600 leading-relaxed">
              <div>
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-widest mb-2">Malzeme Serüveni</h4>
                <p>Ürünlerimiz, yalnızca zamanla daha da güzelleşen premium malzemelerden, atölyemizin ustaları tarafından elde şekillendirilir. {urun.aciklama}</p>
              </div>
              
              <div>
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-widest mb-2">Bakım Önerisi</h4>
                <p>Doğal yapısını koruması için kimyasal temizleyicilerden uzak tutun. Hafif nemli pamuklu bir bez ile nazikçe silebilirsiniz.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-stone-200/60 mt-4">
                <div>
                  <span className="block text-[10px] text-stone-400 uppercase tracking-widest mb-1">Üretim Süresi</span>
                  <span className="font-medium text-stone-800">3-5 İş Günü</span>
                </div>
                <div>
                  <span className="block text-[10px] text-stone-400 uppercase tracking-widest mb-1">Kargo</span>
                  <span className="font-medium text-stone-800">Ücretsiz Teslimat</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="mt-10 w-full bg-stone-100 text-stone-800 font-bold py-3 rounded-md hover:bg-stone-200 transition-colors uppercase tracking-widest text-xs"
            >
              İncelemeye Geri Dön
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AtolyeUrunDetay;