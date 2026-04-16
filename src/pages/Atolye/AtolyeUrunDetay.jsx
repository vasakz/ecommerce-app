import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import { addToCart } from '../../store/slices/cartSlice';
import { addToFavorites, removeFromFavorites } from '../../store/slices/favoritesSlice';

/* ── Yıldız bileşeni (reusable) ── */
function Yildizlar({ puan = 5, boyut = 'w-4 h-4', renk = 'text-amber-400' }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
          fill={i < puan ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth={i < puan ? 0 : 1.5}
          className={`${boyut} ${i < puan ? renk : 'text-stone-300'}`}>
          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
        </svg>
      ))}
    </div>
  );
}

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

  const [seciliBoyut, setSeciliBoyut] = useState({ id: 's', isim: 'Standart', ekUcret: 0 });
  const [seciliRenk, setSeciliRenk] = useState({ id: 'taba', isim: 'Taba', ekUcret: 0, hex: '#8B5A2B' });
  const [seciliEkstralar, setSeciliEkstralar] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (!urun) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-10 text-stone-400">
        <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-lg font-medium text-stone-700 mb-2">Ürün yüklenemedi</h2>
        <p className="text-sm text-stone-400 mb-5">Bu ürün bulunamadı veya kaldırılmış olabilir.</p>
        <button onClick={() => window.history.back()} className="text-xs uppercase tracking-widest font-semibold text-amber-700 hover:text-amber-900 border-b border-amber-300 pb-0.5 transition-colors">
          ← Atölyeye Dön
        </button>
      </div>
    );
  }

  const tumGorseller = urun.gorseller?.length > 0 ? urun.gorseller : urun.gorsel ? [urun.gorsel] : [];
  const tabanFiyat = parseInt(urun.fiyat?.replace(/\D/g, '') || 1200);

  const BOYUTLAR = [
    { id: 's', isim: 'Standart', ekUcret: 0 },
    { id: 'm', isim: 'Büyük Boy', ekUcret: 300 },
    { id: 'xl', isim: 'Özel Ölçü', ekUcret: 500 },
  ];

  const RENKLER = [
    { id: 'taba', isim: 'Taba', ekUcret: 0, hex: '#8B5A2B' },
    { id: 'siyah', isim: 'Gece Siyahı', ekUcret: 0, hex: '#1C1C1C' },
    { id: 'ozel', isim: 'Çift Renk', ekUcret: 150, hex: 'linear-gradient(135deg, #8B5A2B 50%, #1C1C1C 50%)' },
  ];

  const EKSTRALAR = [
    { id: 'isim', isim: 'İsim / Baş Harf Kazıma', ekUcret: 100, ikon: '✦' },
    { id: 'hediye_paket', isim: 'Premium Hediye Paketi', ekUcret: 50, ikon: '◈' },
  ];

  const toggleEkstra = (ekstra) => {
    setSeciliEkstralar(prev =>
      prev.some(e => e.id === ekstra.id)
        ? prev.filter(e => e.id !== ekstra.id)
        : [...prev, ekstra]
    );
  };

  const toplamFiyat = tabanFiyat
    + (seciliBoyut?.ekUcret || 0)
    + (seciliRenk?.ekUcret || 0)
    + seciliEkstralar.reduce((t, e) => t + e.ekUcret, 0);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: ((e.pageX - left) / width) * 100, y: ((e.pageY - top) / height) * 100 });
  };

  const sepeteEkle = () => {
    const sepeteUygunUrun = {
      id: `atolye-${urun.id}`,
      gercekId: urun.id,
      isim: urun.isim,
      fiyat: `${toplamFiyat} TL`,
      image: tumGorseller[0],
      type: 'atolye',
      orijinalUrun: urun,
      ozellikler: {
        boyut: seciliBoyut?.isim,
        ...(seciliBoyut?.id === 'xl' && ozelOlcu ? { ozelOlcu } : {}),
        renk: seciliRenk?.isim,
        ekstralar: seciliEkstralar.map(e => e.isim),
        ...(seciliEkstralar.some(e => e.id === 'isim') && kazimaMetni ? { kazimaMetni } : {}),
        ...(seciliEkstralar.some(e => e.id === 'hediye_paket') && hediyeNotu ? { hediyeNotu } : {}),
      },
    };
    dispatch(addToCart(sepeteUygunUrun));
    toast.success(`${urun.isim} sepete eklendi!`, {
      style: {
        background: 'rgba(28, 25, 23, 0.96)',
        color: '#f5f0eb',
        backdropFilter: 'blur(12px)',
        padding: '14px 20px',
        fontSize: '12px',
        fontWeight: '500',
        letterSpacing: '0.06em',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.08)',
      },
      iconTheme: { primary: '#d97706', secondary: '#1c1917' },
    });
  };

  const favoriToggle = () => {
    if (isFavorited) {
      dispatch(removeFromFavorites(urun.id));
      toast.success('Favorilerden çıkarıldı.');
    } else {
      dispatch(addToFavorites({
        id: urun.id,
        name: urun.isim,
        price: parseInt(urun.fiyat.replace(/\D/g, '')),
        image: tumGorseller[0],
        category: urun.kategori || 'Özel Tasarım',
      }));
      toast.success('Favorilere eklendi!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 bg-white relative">

      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-stone-400">
        <button onClick={() => window.history.back()} className="hover:text-stone-700 transition-colors flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Atölye
        </button>
        <span className="text-stone-200">›</span>
        <span className="text-stone-500">{urun.kategori || 'Ürün'}</span>
        <span className="text-stone-200">›</span>
        <span className="text-stone-700 font-medium truncate max-w-[200px]">{urun.isim}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

        {/* ── SOL: GÖRSELLER & AÇIKLAMA ── */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="flex flex-col-reverse md:flex-row gap-4">

            {/* Thumbnail listesi */}
            {tumGorseller.length > 1 && (
              <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto no-scrollbar pb-2 md:pb-0">
                {tumGorseller.map((img, idx) => (
                  <button key={idx} onClick={() => setSeciliGorsel(idx)}
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      seciliGorsel === idx ? 'border-amber-500 shadow-md shadow-amber-200' : 'border-stone-100 opacity-55 hover:opacity-90 hover:border-stone-300'
                    }`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Ana görsel + zoom */}
            <div
              className="relative flex-1 aspect-square bg-stone-50 rounded-2xl overflow-hidden cursor-zoom-in group shadow-sm"
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
              {/* Zoom ipucu */}
              <div className={`absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm text-white text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full transition-opacity duration-300 ${isZoomed ? 'opacity-0' : 'opacity-100'}`}>
                Yakınlaştır
              </div>
            </div>
          </div>

          {/* Ürün Hikayesi */}
          <div className="px-1 md:px-0 mt-2 border-t border-stone-100 pt-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-5 h-px bg-amber-400" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">Ürün Hikayesi & Detaylar</h3>
            </div>
            <p className="text-sm text-stone-500 leading-loose max-w-2xl">
              {urun.aciklama || 'Atölyemizin ustaları tarafından özenle hazırlanan bu tasarım, birinci sınıf malzemelerle tamamen el işçiliğiyle üretilmektedir. Her bir ürün, sizi temsil eden eşsiz bir parçadır.'}
            </p>

            {/* İkon satırı — güven işaretleri */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { ikon: '◈', baslik: 'El Yapımı', alt: 'Her parça özel üretim' },
                { ikon: '◎', baslik: 'Özgün Tasarım', alt: 'Benzersiz koleksiyon' },
                { ikon: '✦', baslik: 'Kişiselleştir', alt: 'Sana özel detaylar' },
              ].map((item) => (
                <div key={item.baslik} className="flex flex-col items-center text-center p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="text-amber-600 text-base mb-1.5">{item.ikon}</span>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-700">{item.baslik}</p>
                  <p className="text-[9px] text-stone-400 mt-0.5">{item.alt}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-8 text-[10px] uppercase tracking-widest text-stone-400 hover:text-stone-800 transition-colors flex items-center gap-2 group"
            >
              <span className="w-4 h-px bg-stone-300 group-hover:bg-stone-700 transition-colors" />
              Bakım Kılavuzunu İncele
              <span className="w-4 h-px bg-stone-300 group-hover:bg-stone-700 transition-colors" />
            </button>
          </div>
        </div>

        {/* ── SAĞ: SİPARİŞ PANELİ ── */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="lg:sticky lg:top-24 h-fit pb-8">

            {/* Başlık Bloğu */}
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[9px] font-bold text-amber-600 tracking-[0.35em] uppercase bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                  {urun.altKategori || urun.kategori || 'Atölye Tasarımı'}
                </span>
                {urun.yeni && (
                  <span className="text-[9px] font-bold text-teal-700 tracking-[0.2em] uppercase bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-full">Yeni</span>
                )}
              </div>

              <div className="flex justify-between items-start gap-4 mb-4">
                <h1 className="text-3xl md:text-4xl font-serif text-stone-800 leading-tight">{urun.isim}</h1>
                <button
                  onClick={favoriToggle}
                  className={`p-2.5 rounded-full flex-shrink-0 transition-all duration-300 ${
                    isFavorited ? 'bg-rose-50 text-rose-500 shadow-sm' : 'bg-stone-50 text-stone-300 hover:text-rose-400 hover:bg-rose-50'
                  }`}
                  title={isFavorited ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill={isFavorited ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>
              </div>

              {/* Puan satırı */}
              <div className="flex items-center gap-2 mb-4">
                <Yildizlar puan={4} boyut="w-3.5 h-3.5" />
                <span className="text-xs font-semibold text-stone-700">4.8</span>
                <span className="text-xs text-stone-400">(24 değerlendirme)</span>
                <span className="text-stone-200 mx-1">|</span>
                <span className="text-xs text-stone-400">142 sipariş</span>
              </div>

              {urun.minOlcu && urun.maxOlcu && (
                <div className="flex items-center gap-2 text-[11px] font-medium text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-100 mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-amber-500 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.412 15.655L9.75 21.75l3.745-4.012M9.257 13.5H3.75l2.659-2.849m2.048-2.194L14.25 2.25 12 8.25m0 0l5.668-6.073L21.75 6l-6.852 7.34" />
                  </svg>
                  <span>Üretim Limitleri: <strong>{urun.minOlcu}cm — {urun.maxOlcu}cm</strong></span>
                </div>
              )}

              {/* Fiyat */}
              <div className="flex items-end gap-2">
                <span className="text-4xl font-light tracking-tight text-stone-900">{toplamFiyat.toLocaleString('tr-TR')}</span>
                <span className="text-xl font-light text-stone-500 mb-0.5">₺</span>
                {(seciliBoyut?.ekUcret > 0 || seciliRenk?.ekUcret > 0 || seciliEkstralar.length > 0) && (
                  <span className="text-[10px] text-stone-400 mb-1 ml-1">
                    (baz: {tabanFiyat.toLocaleString('tr-TR')} ₺ + seçenekler)
                  </span>
                )}
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-stone-200 via-stone-100 to-transparent mb-7" />

            {/* Boyut Seçimi */}
            <div className="mb-7">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-700">Boyut</h3>
                {seciliBoyut && <span className="text-[10px] text-stone-400">{seciliBoyut.isim} seçildi</span>}
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {BOYUTLAR.map((b) => (
                  <button key={b.id} onClick={() => setSeciliBoyut(b)}
                    className={`py-2.5 px-2 rounded-lg border text-center transition-all duration-200 ${
                      seciliBoyut?.id === b.id
                        ? 'border-amber-400 bg-amber-500 text-white shadow-md shadow-amber-200'
                        : 'border-stone-200 text-stone-500 hover:border-amber-200 hover:bg-amber-50/40'
                    }`}
                  >
                    <span className="block text-[11px] font-semibold">{b.isim}</span>
                    <span className={`text-[9px] mt-0.5 block ${seciliBoyut?.id === b.id ? 'text-amber-100' : 'text-stone-400'}`}>
                      {b.ekUcret > 0 ? `+${b.ekUcret} ₺` : 'Ücretsiz'}
                    </span>
                  </button>
                ))}
              </div>

              {/* ✅ DÜZELTME: Kompakt, inline açılan özel ölçü alanı */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${seciliBoyut?.id === 'xl' ? 'max-h-16 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                <div className="flex items-center gap-2 bg-amber-50/60 border border-amber-100 rounded-lg px-3 py-2">
                  <span className="text-amber-500 text-xs flex-shrink-0">✦</span>
                  <input
                    type="text"
                    value={ozelOlcu}
                    onChange={(e) => setOzelOlcu(e.target.value)}
                    placeholder="Ölçü girin (Örn: 45×90 cm)"
                    className="flex-1 bg-transparent text-xs text-stone-700 placeholder-stone-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Renk Seçimi */}
            <div className="mb-7">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-700">Renk</h3>
                {seciliRenk && <span className="text-[10px] text-stone-400">{seciliRenk.isim}{seciliRenk.ekUcret > 0 ? ` (+${seciliRenk.ekUcret} ₺)` : ''}</span>}
              </div>
              <div className="flex gap-3">
                {RENKLER.map((r) => (
                  <button key={r.id} onClick={() => setSeciliRenk(r)} className="flex flex-col items-center gap-1.5 group">
                    <div className={`w-7 h-7 rounded-full p-[2px] border-2 transition-all duration-200 ${seciliRenk?.id === r.id ? 'border-amber-500 scale-110' : 'border-transparent group-hover:border-stone-300'}`}>
                      <div className="w-full h-full rounded-full shadow-inner" style={{ background: r.hex }} />
                    </div>
                    <span className={`text-[9px] font-medium leading-tight text-center ${seciliRenk?.id === r.id ? 'text-stone-800' : 'text-stone-400'}`}>{r.isim}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Kişiselleştirme */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-700">Kişiselleştirme</h3>
                <div className="flex-1 h-px bg-stone-100" />
                <span className="text-[9px] text-stone-400">isteğe bağlı</span>
              </div>
              <div className="flex flex-col gap-2">
                {EKSTRALAR.map((e) => {
                  const isSelected = seciliEkstralar.some(item => item.id === e.id);
                  return (
                    <div key={e.id}>
                      {/* ✅ DÜZELTME: Daha kompakt ekstra satırı */}
                      <button
                        onClick={() => toggleEkstra(e)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border transition-all duration-200 ${
                          isSelected ? 'border-amber-400 bg-amber-50/70' : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-xs transition-colors ${isSelected ? 'text-amber-500' : 'text-stone-300'}`}>{e.ikon}</span>
                          <span className={`text-xs font-medium ${isSelected ? 'text-stone-800' : 'text-stone-500'}`}>{e.isim}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-stone-400">+{e.ekUcret} ₺</span>
                          {/* Checkbox görseli */}
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${isSelected ? 'border-amber-500 bg-amber-500' : 'border-stone-300'}`}>
                            {isSelected && (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5 text-white">
                                <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </button>

                      {/* ✅ DÜZELTME: Kompakt, animasyonlu inline açılış */}
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isSelected ? 'max-h-14 opacity-100 mt-1.5' : 'max-h-0 opacity-0'}`}>
                        {e.id === 'isim' && (
                          <div className="flex items-center gap-2 bg-amber-50/50 border border-amber-100 rounded-lg px-3 py-2 ml-1">
                            <span className="text-amber-400 text-[10px] flex-shrink-0 font-bold">A</span>
                            <input
                              type="text"
                              value={kazimaMetni}
                              onChange={(ev) => setKazimaMetni(ev.target.value)}
                              placeholder="Kazınacak isim veya harfler…"
                              className="flex-1 bg-transparent text-xs text-stone-700 placeholder-stone-400 focus:outline-none"
                            />
                            {kazimaMetni && (
                              <button onClick={() => setKazimaMetni('')} className="text-stone-300 hover:text-stone-500 text-xs">✕</button>
                            )}
                          </div>
                        )}
                        {e.id === 'hediye_paket' && (
                          <div className="flex items-start gap-2 bg-rose-50/30 border border-rose-100 rounded-lg px-3 py-2 ml-1">
                            <span className="text-rose-400 text-[10px] flex-shrink-0 mt-0.5">♡</span>
                            <textarea
                              value={hediyeNotu}
                              onChange={(ev) => setHediyeNotu(ev.target.value)}
                              placeholder="Hediye notunuzu buraya yazabilirsiniz…"
                              rows="2"
                              className="flex-1 bg-transparent text-xs text-stone-700 placeholder-stone-400 focus:outline-none resize-none leading-relaxed"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sepete Ekle */}
            <div className="sticky bottom-0 py-4 bg-white/95 backdrop-blur-md border-t border-stone-100 -mx-4 px-4 z-10">
              <button
                onClick={sepeteEkle}
                className="w-full bg-amber-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-amber-700 active:scale-[0.99] transition-all duration-200 uppercase tracking-widest text-[11px] shadow-xl shadow-amber-600/10 flex justify-between items-center group"
              >
                <span className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:scale-110 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                  </svg>
                  Sepete Ekle
                </span>
                <span className="text-sm font-light tracking-normal">{toplamFiyat.toLocaleString('tr-TR')} ₺</span>
              </button>
              <p className="text-center text-[10px] text-stone-400 mt-2"> Güvenli ödeme </p>
            </div>

          </div>
        </div>
      </div>

      {/* Bakım Kılavuzu Modalı */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-0.5">Atölye Rehberi</p>
                <h3 className="text-lg font-serif text-stone-800">Bakım Kılavuzu</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { ikon: '◎', baslik: 'Temizlik', aciklama: 'Hafif nemli, yumuşak pamuklu bez ile silin. Kimyasal temizleyicilerden kaçının.' },
                { ikon: '◈', baslik: 'Saklama', aciklama: 'Doğrudan güneş ışığından uzak, serin ve kuru bir ortamda saklayın.' },
                { ikon: '✦', baslik: 'Uzun Ömür', aciklama: 'Düzenli bakım ile ürününüz yıllarca ilk günkü tazeliğini korur.' },
              ].map(item => (
                <div key={item.baslik} className="flex items-start gap-3">
                  <span className="text-amber-500 text-sm mt-0.5 flex-shrink-0">{item.ikon}</span>
                  <div>
                    <p className="text-xs font-semibold text-stone-700 mb-0.5">{item.baslik}</p>
                    <p className="text-xs text-stone-500 leading-relaxed">{item.aciklama}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5 pt-0">
              <button onClick={() => setIsModalOpen(false)} className="w-full bg-stone-900 text-white text-[11px] uppercase tracking-widest font-semibold py-3 rounded-xl hover:bg-stone-800 transition-colors">
                Anladım
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export { Yildizlar };
export default AtolyeUrunDetay;
