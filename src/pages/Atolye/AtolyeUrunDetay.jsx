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

  const dispatch = useDispatch();
  const favoriler = useSelector((state) => state.favorites.items);
  const isFavorited = favoriler.some((item) => item.id === urun?.id);

  const [seciliGorsel, setSeciliGorsel] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [kazimaMetni, setKazimaMetni] = useState('');
  const [hediyeNotu, setHediyeNotu] = useState('');
  const [ozelOlcu, setOzelOlcu] = useState('');

  const [seciliBoyut, setSeciliBoyut] = useState(null);
  const [seciliRenk, setSeciliRenk] = useState(null);
  const [seciliEkstralar, setSeciliEkstralar] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (urun) {
      setSeciliBoyut(BOYUTLAR[0]);
      setSeciliRenk(RENKLER[0]);
    }
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
    { id: 'hediye_paket', isim: 'Premium Hediye Paketi', ekUcret: 50 },
  ];

  const toggleEkstra = (ekstra) => {
    if (seciliEkstralar.some(e => e.id === ekstra.id)) {
      setSeciliEkstralar(seciliEkstralar.filter(e => e.id !== ekstra.id));
    } else {
      setSeciliEkstralar([...seciliEkstralar, ekstra]);
    }
  };

  const toplamFiyat = tabanFiyat 
    + (seciliBoyut?.ekUcret || 0) 
    + (seciliRenk?.ekUcret || 0) 
    + seciliEkstralar.reduce((toplam, ekstra) => toplam + ekstra.ekUcret, 0);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const sepeteEkle = () => {
    const sepeteUygunUrun = {
      id: urun.id,
      isim: urun.isim,
      fiyat: `${toplamFiyat} TL`,
      image: tumGorseller[0],
      ozellikler: {
        boyut: seciliBoyut.isim,
        renk: seciliRenk.isim,
        ekstralar: seciliEkstralar.map(e => e.isim),
        hediyeNotu: hediyeNotu
      }
    };
    dispatch(addToCart(sepeteUygunUrun));
    toast.success(`${urun.isim} sepete eklendi!`);
  };

  const favoriToggle = () => {
    if (isFavorited) {
      dispatch(removeFromFavorites(urun.id));
    } else {
      dispatch(addToFavorites({
        id: urun.id,
        name: urun.isim,
        price: parseInt(urun.fiyat.replace(/\D/g, '')), 
        image: tumGorseller[0],
        category: urun.kategori || 'Özel Tasarım'
      }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 bg-white relative">
      
      <nav className="mb-8 flex items-center text-[10px] uppercase tracking-[0.2em] text-stone-400">
        <button onClick={() => window.history.back()} className="hover:text-stone-800 transition-colors">
          ← Atölye
        </button>
        <span className="mx-3">/</span>
        <span>{urun.kategori || 'Ürün'}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* -- SOL TARAF: GÖRSELLER VE AÇIKLAMA -- */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="flex flex-col-reverse md:flex-row gap-4">
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
            </div>
          </div>

          {/* Sadece Açıklama Fotoğrafın Altında */}
          <div className="px-2 md:px-0 mt-4 border-t border-stone-100 pt-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-800 mb-4">Ürün Hikayesi & Detaylar</h3>
            <p className="text-sm text-stone-600 leading-relaxed max-w-2xl">
              {urun.aciklama || "Atölyemizin ustaları tarafından özenle hazırlanan bu tasarım, birinci sınıf malzemelerle tamamen el işçiliğiyle üretilmektedir."}
            </p>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-8 text-[11px] uppercase tracking-widest text-stone-500 underline underline-offset-4 hover:text-stone-900 transition-colors flex items-center gap-2"
            >
              Bakım Kılavuzunu İncele
            </button>
          </div>
        </div>

        {/* -- SAĞ TARAF: BAŞLIK, ÖLÇÜLER VE SİPARİŞ PANELİ -- */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="lg:sticky lg:top-24 h-fit pb-8">
            
            {/* Ürün İsmi ve Kategori Sağ Üstte */}
            <div className="mb-6">
              <span className="text-[10px] font-bold text-amber-600/80 tracking-[0.3em] uppercase mb-2 block">
                {urun.altKategori || urun.kategori || 'Atölye Tasarımı'}
              </span>
              <h1 className="text-3xl md:text-4xl font-serif text-stone-800 leading-tight mb-4">{urun.isim}</h1>
              
              {/* Üretim Limitleri (Özel Ölçüler) Sağ Üstte */}
              {urun.minOlcu && urun.maxOlcu && (
                <div className="flex items-center gap-2 text-[11px] font-semibold text-stone-700 bg-stone-50 p-3 rounded-md border border-stone-200 shadow-sm mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-amber-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.412 15.655L9.75 21.75l3.745-4.012M9.257 13.5H3.75l2.659-2.849m2.048-2.194L14.25 2.25 12 8.25m0 0l5.668-6.073L21.75 6l-6.852 7.34" />
                  </svg>
                  Atölye Üretim Limitleri: {urun.minOlcu}cm — {urun.maxOlcu}cm
                </div>
              )}

              <div className="flex items-end gap-3">
                <span className="text-4xl font-light text-stone-900">{toplamFiyat.toLocaleString('tr-TR')} ₺</span>
              </div>
            </div>

            <div className="h-px w-full bg-stone-100 mb-8" />

            {/* Boyut Seçimi */}
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-800 mb-3">Boyut Seçimi</h3>
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
              {seciliBoyut?.id === 'xl' && (
                <div className="mt-3 p-4 bg-stone-50 border border-stone-200 rounded-md animate-in fade-in slide-in-from-top-2 duration-300">
                  <input 
                    type="text" 
                    value={ozelOlcu}
                    onChange={(e) => setOzelOlcu(e.target.value)}
                    placeholder="İstediğiniz ölçüleri giriniz (Örn: 45x90cm)" 
                    className="w-full p-2.5 border border-stone-300 rounded-md text-sm focus:outline-none focus:border-stone-500 bg-white" 
                  />
                </div>
              )}
            </div>

            {/* Renk Seçimi */}
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-800 mb-3">Renk</h3>
              <div className="flex gap-4">
                {RENKLER.map((r) => (
                  <button key={r.id} onClick={() => setSeciliRenk(r)} className="flex flex-col items-center gap-2 group">
                    <div className={`w-8 h-8 rounded-full p-0.5 border-2 transition-colors ${seciliRenk?.id === r.id ? 'border-stone-800' : 'border-transparent group-hover:border-stone-300'}`}>
                      <div className="w-full h-full rounded-full shadow-inner" style={{ background: r.hex }} />
                    </div>
                    <span className={`text-[10px] font-medium ${seciliRenk?.id === r.id ? 'text-stone-800' : 'text-stone-400'}`}>{r.isim}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Kişiselleştirme ve Hediye Notu */}
            <div className="mb-10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-800 mb-3">Kişiselleştirme</h3>
              <div className="flex flex-col gap-3">
                {EKSTRALAR.map((e) => {
                  const isSelected = seciliEkstralar.some(item => item.id === e.id);
                  return (
                    <div key={e.id} className="flex flex-col gap-2">
                      <button
                        onClick={() => toggleEkstra(e)}
                        className={`flex items-center justify-between p-4 rounded-md border transition-all text-left ${
                          isSelected ? 'border-amber-600/50 bg-amber-50/30' : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <span className={`text-sm ${isSelected ? 'text-stone-900 font-medium' : 'text-stone-600'}`}>{e.isim}</span>
                        <span className="text-xs text-stone-500 font-medium">+ {e.ekUcret} ₺</span>
                      </button>

                      {isSelected && e.id === 'isim' && (
                        <div className="animate-in fade-in duration-300">
                          <input 
                            type="text" 
                            value={kazimaMetni}
                            onChange={(ev) => setKazimaMetni(ev.target.value)}
                            placeholder="Kazınacak isim veya harfler..." 
                            className="w-full p-2 border border-amber-200 bg-amber-50/20 rounded-md text-sm focus:outline-none focus:border-amber-400" 
                          />
                        </div>
                      )}

                      {/* Premium Hediye Seçilince Açılan Not Kısmı */}
                      {isSelected && e.id === 'hediye_paket' && (
                        <div className="animate-in fade-in duration-300">
                          <textarea 
                            value={hediyeNotu}
                            onChange={(ev) => setHediyeNotu(ev.target.value)}
                            placeholder="Hediye notunuzu buraya yazabilirsiniz..." 
                            rows="2"
                            className="w-full p-2 border border-amber-200 bg-amber-50/20 rounded-md text-sm resize-none focus:outline-none focus:border-amber-400" 
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Satın Alma Butonu */}
            <div className="flex gap-4 bg-white/90 backdrop-blur sticky bottom-0 py-4 z-10">
              <button 
                onClick={sepeteEkle}
                className="flex-1 bg-amber-600 text-white font-bold py-4 px-6 rounded-md hover:bg-amber-700 transition-all uppercase tracking-widest text-xs shadow-xl shadow-amber-600/20 flex justify-between items-center"
              >
                <span>Sepete Ekle</span>
                <span>{toplamFiyat.toLocaleString('tr-TR')} ₺</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default AtolyeUrunDetay;