import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

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

  const [seciliBoyut, setSeciliBoyut] = useState({ id: 's', isim: 'Standart', ekUcret: 0 });
  const [seciliRenk, setSeciliRenk] = useState({ id: 'taba', isim: 'Taba', ekUcret: 0, hex: '#8B5A2B' });
  const [seciliEkstralar, setSeciliEkstralar] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!urun) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-10 text-stone-500">
        <h2 className="text-xl font-medium mb-4">Ürün yüklenemedi.</h2>
        <button onClick={() => window.history.back()} className="underline hover:text-stone-800">
          Geri Dön
        </button>
      </div>
    );
  }

  const tumGorseller =
    urun.gorseller && urun.gorseller.length > 0
      ? urun.gorseller
      : urun.gorsel
      ? [urun.gorsel]
      : [];

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
    if (seciliEkstralar.some((e) => e.id === ekstra.id)) {
      setSeciliEkstralar(seciliEkstralar.filter((e) => e.id !== ekstra.id));
    } else {
      setSeciliEkstralar([...seciliEkstralar, ekstra]);
    }
  };

  const toplamFiyat =
    tabanFiyat +
    (seciliBoyut?.ekUcret || 0) +
    (seciliRenk?.ekUcret || 0) +
    seciliEkstralar.reduce((toplam, ekstra) => toplam + ekstra.ekUcret, 0);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setMousePos({ x, y });
  };

  // kazimaMetni ve ozelOlcu artık ozellikler objesine dahil ediliyor
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
        ekstralar: seciliEkstralar.map((e) => e.isim),
        ...(seciliEkstralar.some((e) => e.id === 'isim') && kazimaMetni ? { kazimaMetni } : {}),
        ...(seciliEkstralar.some((e) => e.id === 'hediye_paket') && hediyeNotu ? { hediyeNotu } : {}),
      },
    };

    dispatch(addToCart(sepeteUygunUrun));
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
        border: '1px solid rgba(255,255,255,0.1)',
      },
      iconTheme: { primary: '#d97706', secondary: '#fff' },
    });
  };

  const favoriToggle = () => {
    if (isFavorited) {
      dispatch(removeFromFavorites(urun.id));
      toast.success('Favorilerden çıkarıldı.');
    } else {
      dispatch(
        addToFavorites({
          id: urun.id,
          name: urun.isim,
          price: parseInt(urun.fiyat.replace(/\D/g, '')),
          image: tumGorseller[0],
          category: urun.kategori || 'Özel Tasarım',
        })
      );
      toast.success('Favorilere eklendi!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 bg-white relative">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center text-[10px] uppercase tracking-[0.2em] text-stone-400">
        <button onClick={() => window.history.back()} className="hover:text-stone-800 transition-colors">
          ← Atölye
        </button>
        <span className="mx-3">/</span>
        <span>{urun.kategori || 'Ürün'}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

        {/* ── SOL: GÖRSELLER & AÇIKLAMA ── */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="flex flex-col-reverse md:flex-row gap-4">

            {/* Küçük Görsel Listesi */}
            {tumGorseller.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar pb-2 md:pb-0">
                {tumGorseller.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSeciliGorsel(idx)}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${
                      seciliGorsel === idx
                        ? 'border-amber-500'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Ana Görsel (Zoom) */}
            <div
              className="relative flex-1 aspect-square bg-stone-50 rounded-lg overflow-hidden cursor-zoom-in group"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={tumGorseller[seciliGorsel]}
                alt={urun.isim}
                className={`w-full h-full object-cover transition-transform duration-200 ${
                  isZoomed ? 'scale-[2.5]' : 'scale-100'
                }`}
                style={
                  isZoomed
                    ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` }
                    : { transformOrigin: 'center' }
                }
              />
            </div>
          </div>

          {/* Ürün Hikayesi */}
          <div className="px-2 md:px-0 mt-4 border-t border-stone-100 pt-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-800 mb-4">
              Ürün Hikayesi & Detaylar
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed max-w-2xl">
              {urun.aciklama ||
                'Atölyemizin ustaları tarafından özenle hazırlanan bu tasarım, birinci sınıf malzemelerle tamamen el işçiliğiyle üretilmektedir.'}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-8 text-[11px] uppercase tracking-widest text-stone-500 underline underline-offset-4 hover:text-stone-900 transition-colors flex items-center gap-2"
            >
              Bakım Kılavuzunu İncele
            </button>
          </div>
        </div>

        {/* ── SAĞ: SİPARİŞ PANELİ ── */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="lg:sticky lg:top-24 h-fit pb-8">
            <div className="mb-6">
              <span className="text-[10px] font-bold text-amber-600/80 tracking-[0.3em] uppercase mb-2 block">
                {urun.altKategori || urun.kategori || 'Atölye Tasarımı'}
              </span>

              {/* Başlık + Favori */}
              <div className="flex justify-between items-start gap-4 mb-4">
                <h1 className="text-3xl md:text-4xl font-serif text-stone-800 leading-tight">
                  {urun.isim}
                </h1>
                <button
                  onClick={favoriToggle}
                  className={`p-3 rounded-full flex-shrink-0 transition-all ${
                    isFavorited
                      ? 'bg-rose-50 text-rose-500'
                      : 'bg-stone-50 text-stone-400 hover:text-rose-500 hover:bg-rose-50'
                  }`}
                  title={isFavorited ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={isFavorited ? 'currentColor' : 'none'}
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                </button>
              </div>

              {urun.minOlcu && urun.maxOlcu && (
                <div className="flex items-center gap-2 text-[11px] font-semibold text-stone-700 bg-stone-50 p-3 rounded-md border border-stone-200 shadow-sm mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 text-amber-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.412 15.655L9.75 21.75l3.745-4.012M9.257 13.5H3.75l2.659-2.849m2.048-2.194L14.25 2.25 12 8.25m0 0l5.668-6.073L21.75 6l-6.852 7.34"
                    />
                  </svg>
                  Atölye Üretim Limitleri: {urun.minOlcu}cm — {urun.maxOlcu}cm
                </div>
              )}

              <div className="flex items-end gap-3">
                <span className="text-4xl font-light text-stone-900">
                  {toplamFiyat.toLocaleString('tr-TR')} ₺
                </span>
              </div>
            </div>

            <div className="h-px w-full bg-stone-100 mb-8" />

            {/* Boyut Seçimi */}
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-800 mb-3">
                Boyut Seçimi
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {BOYUTLAR.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSeciliBoyut(b)}
                    className={`py-3 px-2 rounded-md border text-center transition-all ${
                      seciliBoyut?.id === b.id
                        ? 'border-amber-500 bg-amber-500 text-white shadow-md'
                        : 'border-stone-200 text-stone-500 hover:border-stone-400 hover:bg-stone-50'
                    }`}
                  >
                    <span className="block text-xs font-semibold mb-1">{b.isim}</span>
                    <span
                      className={`text-[10px] ${
                        seciliBoyut?.id === b.id ? 'text-amber-50' : 'text-stone-400'
                      }`}
                    >
                      {b.ekUcret > 0 ? `+${b.ekUcret} ₺` : 'Ücretsiz'}
                    </span>
                  </button>
                ))}
              </div>

              {/* ozelOlcu — sepete gönderiliyor */}
              {seciliBoyut?.id === 'xl' && (
                <div className="mt-3 p-4 bg-stone-50 border border-stone-200 rounded-md">
                  <input
                    type="text"
                    value={ozelOlcu}
                    onChange={(e) => setOzelOlcu(e.target.value)}
                    placeholder="İstediğiniz ölçüleri giriniz (Örn: 45x90cm)"
                    className="w-full p-2.5 border border-stone-300 rounded-md text-sm focus:outline-none focus:border-amber-500 bg-white"
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
                    <div
                      className={`w-8 h-8 rounded-full p-0.5 border-2 transition-colors ${
                        seciliRenk?.id === r.id
                          ? 'border-amber-500'
                          : 'border-transparent group-hover:border-stone-300'
                      }`}
                    >
                      <div className="w-full h-full rounded-full shadow-inner" style={{ background: r.hex }} />
                    </div>
                    <span
                      className={`text-[10px] font-medium ${
                        seciliRenk?.id === r.id ? 'text-stone-800' : 'text-stone-400'
                      }`}
                    >
                      {r.isim}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Kişiselleştirme */}
            <div className="mb-10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-800 mb-3">
                Kişiselleştirme
              </h3>
              <div className="flex flex-col gap-3">
                {EKSTRALAR.map((e) => {
                  const isSelected = seciliEkstralar.some((item) => item.id === e.id);
                  return (
                    <div key={e.id} className="flex flex-col gap-2">
                      <button
                        onClick={() => toggleEkstra(e)}
                        className={`flex items-center justify-between p-4 rounded-md border transition-all text-left ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/50'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <span className={`text-sm ${isSelected ? 'text-stone-900 font-medium' : 'text-stone-600'}`}>
                          {e.isim}
                        </span>
                        <span className="text-xs text-stone-500 font-medium">+ {e.ekUcret} ₺</span>
                      </button>

                      {/*  kazimaMetni — sepete gönderiliyor */}
                      {isSelected && e.id === 'isim' && (
                        <input
                          type="text"
                          value={kazimaMetni}
                          onChange={(ev) => setKazimaMetni(ev.target.value)}
                          placeholder="Kazınacak isim veya harfler..."
                          className="w-full p-2 border border-amber-200 bg-amber-50/20 rounded-md text-sm focus:outline-none focus:border-amber-400"
                        />
                      )}

                      {isSelected && e.id === 'hediye_paket' && (
                        <textarea
                          value={hediyeNotu}
                          onChange={(ev) => setHediyeNotu(ev.target.value)}
                          placeholder="Hediye notunuzu buraya yazabilirsiniz..."
                          rows="2"
                          className="w-full p-2 border border-amber-200 bg-amber-50/20 rounded-md text-sm resize-none focus:outline-none focus:border-amber-400"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sepete Ekle Butonu */}
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

      {/* Bakım Kılavuzu Modalı */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-md max-w-md w-full relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-xl font-serif text-stone-800 mb-4">Bakım Kılavuzu</h3>
            <div className="h-px w-full bg-stone-100 mb-4" />
            <p className="text-sm text-stone-600 leading-relaxed">
              Ürünün doğal yapısını koruması için kimyasal temizleyicilerden uzak tutun. Tozunu almak
              veya temizlemek için sadece hafif nemli, yumuşak pamuklu bir bez ile nazikçe silmeniz
              yeterlidir.
            </p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-6 w-full bg-stone-100 text-stone-800 font-bold py-3 rounded-md hover:bg-stone-200 transition-colors uppercase tracking-widest text-xs"
            >
              Anladım
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AtolyeUrunDetay;
