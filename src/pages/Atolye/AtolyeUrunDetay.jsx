import React, { useState, useEffect, useReducer } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom'; // Link eklendi
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import { addToCart } from '../../store/slices/cartSlice';
import { addToFavorites, removeFromFavorites } from '../../store/slices/favoritesSlice';

/* ══════════════════════════════════════════
 Yıldız Bileşeni (interactive destekli)
══════════════════════════════════════════ */
export function Yildizlar({ puan = 5, boyut = 'w-4 h-4', renk = 'text-amber-400', interactive = false, onSelect }) {
  const [hovered, setHovered] = useState(null);
  const gosterilen = interactive && hovered !== null ? hovered : puan;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
          fill={i < gosterilen ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth={i < gosterilen ? 0 : 1.5}
          className={`${boyut} ${i < gosterilen ? renk : 'text-stone-300'} ${interactive ? 'cursor-pointer transition-transform hover:scale-110' : ''}`}
          onMouseEnter={() => interactive && setHovered(i + 1)}
          onMouseLeave={() => interactive && setHovered(null)}
          onClick={() => interactive && onSelect && onSelect(i + 1)}
        >
          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
        </svg>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   YORUM SİSTEMİ
══════════════════════════════════════════ */
const ORNEK_YORUMLAR = [
  {
    id: 1, yazar: 'Aylin S.', avatar: 'A', avatarRenk: 'bg-amber-100 text-amber-700',
    puan: 5, tarih: '12 Mart 2025', baslik: 'Beklentilerimin çok üzerinde',
    metin: 'Ürün fotoğraflarda göründüğünden çok daha güzel. İşçilik mükemmel, dikişler son derece özenli. Hediye paketi de ayrıca çok şıktı. Kesinlikle tekrar sipariş vereceğim.',
    begeni: 14, begendim: false, dogrulamaRozeti: true,
  },
  {
    id: 2, yazar: 'Burak Y.', avatar: 'B', avatarRenk: 'bg-sky-100 text-sky-700',
    puan: 5, tarih: '28 Şubat 2025', baslik: 'Kalite ve zarafet bir arada',
    metin: 'Deri kalitesi gerçekten üst düzey. Renk seçenekleri de çok geniş, tam istediğim tonu yakalayabildim. Kargo da beklediğimden hızlı geldi.',
    begeni: 9, begendim: false, dogrulamaRozeti: true,
  },
  {
    id: 3, yazar: 'Zeynep K.', avatar: 'Z', avatarRenk: 'bg-rose-100 text-rose-700',
    puan: 4, tarih: '5 Ocak 2025', baslik: 'Çok güzel ürün, küçük bir not',
    metin: 'Genel olarak çok memnunum. Tek dikkatimi çeken nokta kargodaki küçük gecikme oldu, ama ürün o kadar güzel ki önemsemiyorum. İsim kazıma da tam hayal ettiğim gibi çıktı.',
    begeni: 6, begendim: false, dogrulamaRozeti: false,
  },
];

function yorumReducer(state, action) {
  switch (action.type) {
    case 'YORUM_EKLE':
      return { ...state, yorumlar: [action.payload, ...state.yorumlar] };
    case 'BEGENI_TOGGLE':
      return {
        ...state,
        yorumlar: state.yorumlar.map(y =>
          y.id === action.id ? { ...y, begendim: !y.begendim, begeni: y.begendim ? y.begeni - 1 : y.begeni + 1 } : y
        ),
      };
    default:
      return state;
  }
}

/* Değerlendirme Özeti */
function DegerlendirmeOzeti({ yorumlar }) {
  const ortalama = yorumlar.length
    ? (yorumlar.reduce((t, y) => t + y.puan, 0) / yorumlar.length).toFixed(1) : 0;
  const dagilim = [5, 4, 3, 2, 1].map(p => ({
    puan: p,
    sayi: yorumlar.filter(y => y.puan === p).length,
    oran: yorumlar.length ? (yorumlar.filter(y => y.puan === p).length / yorumlar.length) * 100 : 0,
  }));

  return (
    <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 items-start sm:items-center p-6 bg-stone-50 rounded-2xl border border-stone-100 mb-8">
      <div className="flex flex-col items-center text-center flex-shrink-0">
        <span className="text-5xl font-light text-stone-900 tracking-tight">{ortalama}</span>
        <Yildizlar puan={Math.round(ortalama)} boyut="w-4 h-4" />
        <span className="text-xs text-stone-400 mt-1.5">{yorumlar.length} değerlendirme</span>
      </div>
      <div className="hidden sm:block w-px h-20 bg-stone-200" />
      <div className="flex-1 w-full space-y-1.5">
        {dagilim.map(({ puan, sayi, oran }) => (
          <div key={puan} className="flex items-center gap-3">
            <span className="text-[10px] font-medium text-stone-500 w-4 flex-shrink-0">{puan}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-amber-400 flex-shrink-0">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
            <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full transition-all duration-700" style={{ width: `${oran}%` }} />
            </div>
            <span className="text-[10px] text-stone-400 w-4 text-right flex-shrink-0">{sayi}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-row sm:flex-col gap-2 flex-shrink-0">
        {[{ etiket: 'İşçilik', puan: 5 }, { etiket: 'Teslimat', puan: 4 }, { etiket: 'Kalite', puan: 5 }].map(item => (
          <div key={item.etiket} className="flex flex-col items-center gap-1">
            <span className="text-[9px] uppercase tracking-wider text-stone-400">{item.etiket}</span>
            <Yildizlar puan={item.puan} boyut="w-2.5 h-2.5" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* Tek Yorum Kartı */
function YorumKarti({ yorum, dispatch }) {
  const [acik, setAcik] = useState(false);
  const uzunMu = yorum.metin.length > 160;
  return (
    <div className="py-6 border-b border-stone-100 last:border-0">
      <div className="flex items-start gap-4">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${yorum.avatarRenk}`}>{yorum.avatar}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-stone-800">{yorum.yazar}</span>
                {yorum.dogrulamaRozeti && (
                  <span className="text-[9px] bg-teal-50 text-teal-600 border border-teal-100 px-1.5 py-0.5 rounded-full font-medium tracking-wide">✓ Doğrulanmış Alıcı</span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Yildizlar puan={yorum.puan} boyut="w-3 h-3" />
                <span className="text-[10px] text-stone-400">{yorum.tarih}</span>
              </div>
            </div>
          </div>
          {yorum.baslik && <p className="text-xs font-semibold text-stone-700 mb-1.5">{yorum.baslik}</p>}
          <p className="text-sm text-stone-500 leading-relaxed">
            {uzunMu && !acik ? yorum.metin.slice(0, 160) + '…' : yorum.metin}
          </p>
          {uzunMu && (
            <button onClick={() => setAcik(!acik)} className="text-[10px] text-amber-600 hover:text-amber-800 font-medium mt-1 transition-colors">
              {acik ? 'Daha az göster' : 'Devamını oku'}
            </button>
          )}
          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={() => dispatch({ type: 'BEGENI_TOGGLE', id: yorum.id })}
              className={`flex items-center gap-1.5 text-[10px] font-medium transition-colors ${yorum.begendim ? 'text-amber-600' : 'text-stone-400 hover:text-stone-600'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill={yorum.begendim ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
              </svg>
              Faydalı ({yorum.begeni})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Yorum Yazma Formu */
function YorumFormu({ dispatch }) {
  const [acik, setAcik] = useState(false);
  const [puan, setPuan] = useState(0);
  const [baslik, setBaslik] = useState('');
  const [metin, setMetin] = useState('');
  const [yazar, setYazar] = useState('');
  const [gonderildi, setGonderildi] = useState(false);
  const puanEtiketleri = ['', 'Kötü', 'İdare eder', 'İyi', 'Çok iyi', 'Mükemmel'];

  const handleGonder = () => {
    if (!puan) return toast.error('Lütfen bir puan seçin.');
    if (!metin.trim()) return toast.error('Lütfen bir yorum yazın.');
    dispatch({
      type: 'YORUM_EKLE',
      payload: {
        id: Date.now(), yazar: yazar.trim() || 'Anonim',
        avatar: (yazar.trim() || 'A')[0].toUpperCase(),
        avatarRenk: 'bg-stone-100 text-stone-600', puan,
        tarih: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
        baslik: baslik.trim(), metin: metin.trim(), begeni: 0, begendim: false, dogrulamaRozeti: false,
      },
    });
    setGonderildi(true);
    toast.success('Yorumunuz eklendi, teşekkürler!', {
      style: { background: '#1c1917', color: '#f5f0eb', borderRadius: '10px' },
      iconTheme: { primary: '#d97706', secondary: '#1c1917' },
    });
  };

  if (gonderildi) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-teal-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-stone-700 mb-1">Yorumunuz alındı!</p>
        <p className="text-xs text-stone-400">Katkınız için teşekkür ederiz.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 border-t border-stone-100 pt-8">
      {!acik ? (
        <button onClick={() => setAcik(true)} className="w-full flex items-center justify-center gap-2 py-3.5 border border-dashed border-stone-300 rounded-xl text-xs font-semibold uppercase tracking-widest text-stone-500 hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50/30 transition-all duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Bu Ürünü Değerlendir
        </button>
      ) : (
        <div className="bg-stone-50/60 border border-stone-100 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-stone-700">Değerlendirmeni Yaz</p>
            <button onClick={() => setAcik(false)} className="text-stone-400 hover:text-stone-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div>
            <p className="text-[10px] text-stone-400 mb-2">Puanın <span className={`font-semibold ${puan ? 'text-amber-600' : 'text-stone-400'}`}>{puan ? puanEtiketleri[puan] : '(seç)'}</span></p>
            <Yildizlar puan={puan} boyut="w-7 h-7" interactive onSelect={setPuan} />
          </div>
          <input type="text" value={yazar} onChange={e => setYazar(e.target.value)} placeholder="İsminiz (opsiyonel)" className="w-full bg-white border border-stone-200 rounded-lg px-3.5 py-2.5 text-sm text-stone-700 placeholder-stone-400 focus:outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100 transition-all" />
          <input type="text" value={baslik} onChange={e => setBaslik(e.target.value)} placeholder="Kısa bir başlık" className="w-full bg-white border border-stone-200 rounded-lg px-3.5 py-2.5 text-sm text-stone-700 placeholder-stone-400 focus:outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100 transition-all" />
          <textarea value={metin} onChange={e => setMetin(e.target.value)} rows={4} placeholder="Deneyiminizi paylaşın…" className="w-full bg-white border border-stone-200 rounded-lg px-3.5 py-2.5 text-sm text-stone-700 placeholder-stone-400 focus:outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100 transition-all resize-none" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-stone-400">{metin.length}/500 karakter</span>
            <button onClick={handleGonder} disabled={!puan || !metin.trim()} className="bg-stone-900 text-white text-[11px] uppercase tracking-widest font-semibold px-6 py-2.5 rounded-lg hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              Gönder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


/* Değerlendirmeler Bölümü */
function DegerlendirmelerBolumu() {
  const [state, dispatch] = useReducer(yorumReducer, { yorumlar: ORNEK_YORUMLAR });
  const [siralama, setSiralama] = useState('en_yeni');
  const [filtre, setFiltre] = useState(0);

  const siralanmis = [...state.yorumlar]
    .filter(y => filtre === 0 || y.puan === filtre)
    .sort((a, b) => {
      if (siralama === 'en_yeni') return b.id - a.id;
      if (siralama === 'en_yuksek') return b.puan - a.puan;
      if (siralama === 'en_faydali') return b.begeni - a.begeni;
      return 0;
    });

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 border-t border-stone-100">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-6 h-px bg-amber-400" />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">Müşteri Değerlendirmeleri</h2>
        </div>
        <DegerlendirmeOzeti yorumlar={state.yorumlar} />
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button onClick={() => setFiltre(0)} className={`text-[10px] font-medium px-3 py-1.5 rounded-full border transition-all ${filtre === 0 ? 'bg-stone-800 text-white border-stone-800' : 'border-stone-200 text-stone-500 hover:border-stone-400'}`}>Tümü</button>
            {[5, 4, 3, 2, 1].map(p => (
              <button key={p} onClick={() => setFiltre(filtre === p ? 0 : p)} className={`flex items-center gap-1 text-[10px] font-medium px-2.5 py-1.5 rounded-full border transition-all ${filtre === p ? 'bg-amber-500 text-white border-amber-500' : 'border-stone-200 text-stone-500 hover:border-amber-300'}`}>
                {p}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
              </button>
            ))}
          </div>
          <select value={siralama} onChange={e => setSiralama(e.target.value)} className="text-[11px] text-stone-600 border border-stone-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-300 bg-white cursor-pointer">
            <option value="en_yeni">En Yeni</option>
            <option value="en_yuksek">En Yüksek Puan</option>
            <option value="en_faydali">En Faydalı</option>
          </select>
        </div>
        {siralanmis.length > 0
          ? siralanmis.map(yorum => <YorumKarti key={yorum.id} yorum={yorum} dispatch={dispatch} />)
          : <div className="text-center py-12 text-stone-400"><p className="text-sm">Bu filtre için yorum bulunamadı.</p></div>
        }
        <YorumFormu dispatch={dispatch} />
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   ANA SAYFA BİLEŞENİ
══════════════════════════════════════════ */

function AtolyeUrunDetay() {
  const location = useLocation();
  const { id } = useParams(); // URL'den ürün ID'sini yakalar
  const dispatch = useDispatch();
  
  // Ürünü state içinde tutuyoruz. Eğer başka sayfadan geldiysek oradan alır, 
  // yoksa (sayfa yenilendiyse) null başlar.
  const [urun, setUrun] = useState(location.state?.urun || null);
  const [yukleniyor, setYukleniyor] = useState(!urun);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Eğer 'urun' bilgisi yoksa (sayfa yenilendiyse), veriyi buradan çekmelisin
    if (!urun && id) {
      setYukleniyor(true);
      // Burası ileride backend'e (veritabanına) bağlanacak yer:
      // fetch(`/api/urunler/${id}`).then(...)
      setYukleniyor(false); 
    }
  }, [id, urun]);

  const favoriler = useSelector((state) => state.favorites.items);
  const isFavorited = favoriler.some((item) => item.id === urun?.id);

  // Atölye mesaj modalı için yeni statelerimiz:
  const [mesajModalAcik, setMesajModalAcik] = useState(false);
  const [atolyeMesaj, setAtolyeMesaj] = useState('');

  // Görsel ve seçim stateleri (bunlar aynı kalsın):
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
        <button onClick={() => window.history.back()} className="text-xs uppercase tracking-widest font-semibold text-amber-700 hover:text-amber-900 border-b border-amber-300 pb-0.5 transition-colors">← Atölyeye Dön</button>
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
      prev.some(e => e.id === ekstra.id) ? prev.filter(e => e.id !== ekstra.id) : [...prev, ekstra]
    );
  };

  const toplamFiyat = tabanFiyat + (seciliBoyut?.ekUcret || 0) + (seciliRenk?.ekUcret || 0) + seciliEkstralar.reduce((t, e) => t + e.ekUcret, 0);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: ((e.pageX - left) / width) * 100, y: ((e.pageY - top) / height) * 100 });
  };

  const sepeteEkle = () => {
    dispatch(addToCart({
      id: `atolye-${urun.id}`, gercekId: urun.id, isim: urun.isim,
      fiyat: `${toplamFiyat} TL`, image: tumGorseller[0], type: 'atolye', orijinalUrun: urun,
      ozellikler: {
        boyut: seciliBoyut?.isim,
        ...(seciliBoyut?.id === 'xl' && ozelOlcu ? { ozelOlcu } : {}),
        renk: seciliRenk?.isim,
        ekstralar: seciliEkstralar.map(e => e.isim),
        ...(seciliEkstralar.some(e => e.id === 'isim') && kazimaMetni ? { kazimaMetni } : {}),
        ...(seciliEkstralar.some(e => e.id === 'hediye_paket') && hediyeNotu ? { hediyeNotu } : {}),
      },
    }));
    toast.success(`${urun.isim} sepete eklendi!`, {
      style: { background: 'rgba(28,25,23,0.96)', color: '#f5f0eb', backdropFilter: 'blur(12px)', padding: '14px 20px', fontSize: '12px', fontWeight: '500', letterSpacing: '0.06em', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' },
      iconTheme: { primary: '#d97706', secondary: '#1c1917' },
    });
  };

  const favoriToggle = () => {
    if (isFavorited) {
      dispatch(removeFromFavorites(urun.id));
      toast.success('Favorilerden çıkarıldı.');
    } else {
      dispatch(addToFavorites({ id: urun.id, name: urun.isim, price: parseInt(urun.fiyat.replace(/\D/g, '')), image: tumGorseller[0], category: urun.kategori || 'Özel Tasarım' }));
      toast.success('Favorilere eklendi!');
    }
  };

  return (
    <>
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

          {/* ── SOL ── */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="flex flex-col-reverse md:flex-row gap-4">
              {tumGorseller.length > 1 && (
                <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto no-scrollbar pb-2 md:pb-0">
                  {tumGorseller.map((img, idx) => (
                    <button key={idx} onClick={() => setSeciliGorsel(idx)} className={`w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${seciliGorsel === idx ? 'border-amber-500 shadow-md shadow-amber-200' : 'border-stone-100 opacity-55 hover:opacity-90 hover:border-stone-300'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              <div className="relative flex-1 aspect-square bg-stone-50 rounded-2xl overflow-hidden cursor-zoom-in group shadow-sm"
                onMouseEnter={() => setIsZoomed(true)} onMouseLeave={() => setIsZoomed(false)} onMouseMove={handleMouseMove}>
                <img src={tumGorseller[seciliGorsel]} alt={urun.isim}
                  className={`w-full h-full object-cover transition-transform duration-200 ${isZoomed ? 'scale-[2.5]' : 'scale-100'}`}
                  style={isZoomed ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : { transformOrigin: 'center' }} />
                <div className={`absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm text-white text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full transition-opacity duration-300 ${isZoomed ? 'opacity-0' : 'opacity-100'}`}>Yakınlaştır</div>
              </div>
            </div>

            <div className="px-1 md:px-0 mt-2 border-t border-stone-100 pt-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-5 h-px bg-amber-400" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">Ürün Hikayesi & Detaylar</h3>
              </div>
              <p className="text-sm text-stone-500 leading-loose max-w-2xl">
                {urun.aciklama || 'Atölyemizin ustaları tarafından özenle hazırlanan bu tasarım, birinci sınıf malzemelerle tamamen el işçiliğiyle üretilmektedir.'}
              </p>
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[{ ikon: '◈', baslik: 'El Yapımı', alt: 'Her parça özel üretim' }, { ikon: '◎', baslik: 'Özgün Tasarım', alt: 'Benzersiz koleksiyon' }, { ikon: '✦', baslik: 'Kişiselleştir', alt: 'Sana özel detaylar' }].map(item => (
                  <div key={item.baslik} className="flex flex-col items-center text-center p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-amber-600 text-base mb-1.5">{item.ikon}</span>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-700">{item.baslik}</p>
                    <p className="text-[9px] text-stone-400 mt-0.5">{item.alt}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setIsModalOpen(true)} className="mt-8 text-[10px] uppercase tracking-widest text-stone-400 hover:text-stone-800 transition-colors flex items-center gap-2 group">
                <span className="w-4 h-px bg-stone-300 group-hover:bg-stone-700 transition-colors" />
                Bakım Kılavuzunu İncele
                <span className="w-4 h-px bg-stone-300 group-hover:bg-stone-700 transition-colors" />
              </button>
            </div>
          </div>

          {/* ── SAĞ ── */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="lg:sticky lg:top-24 h-fit pb-8">
              <div className="mb-7">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[9px] font-bold text-amber-600 tracking-[0.35em] uppercase bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">{urun.altKategori || urun.kategori || 'Atölye Tasarımı'}</span>
                  {urun.yeni && <span className="text-[9px] font-bold text-teal-700 tracking-[0.2em] uppercase bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-full">Yeni</span>}
                </div>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <h1 className="text-3xl md:text-4xl font-serif text-stone-800 leading-tight">{urun.isim}</h1>
                  <button onClick={favoriToggle} className={`p-2.5 rounded-full flex-shrink-0 transition-all duration-300 ${isFavorited ? 'bg-rose-50 text-rose-500 shadow-sm' : 'bg-stone-50 text-stone-300 hover:text-rose-400 hover:bg-rose-50'}`} title={isFavorited ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill={isFavorited ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </button>
                </div>
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
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-light tracking-tight text-stone-900">{toplamFiyat.toLocaleString('tr-TR')}</span>
                  <span className="text-xl font-light text-stone-500 mb-0.5">₺</span>
                  {(seciliBoyut?.ekUcret > 0 || seciliRenk?.ekUcret > 0 || seciliEkstralar.length > 0) && (
                    <span className="text-[10px] text-stone-400 mb-1 ml-1">(baz: {tabanFiyat.toLocaleString('tr-TR')} ₺ + seçenekler)</span>
                  )}
                </div>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-stone-200 via-stone-100 to-transparent mb-7" />

              {/* Boyut */}
              <div className="mb-7">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-700">Boyut</h3>
                  {seciliBoyut && <span className="text-[10px] text-stone-400">{seciliBoyut.isim} seçildi</span>}
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {BOYUTLAR.map(b => (
                    <button key={b.id} onClick={() => setSeciliBoyut(b)} className={`py-2.5 px-2 rounded-lg border text-center transition-all duration-200 ${seciliBoyut?.id === b.id ? 'border-amber-400 bg-amber-500 text-white shadow-md shadow-amber-200' : 'border-stone-200 text-stone-500 hover:border-amber-200 hover:bg-amber-50/40'}`}>
                      <span className="block text-[11px] font-semibold">{b.isim}</span>
                      <span className={`text-[9px] mt-0.5 block ${seciliBoyut?.id === b.id ? 'text-amber-100' : 'text-stone-400'}`}>{b.ekUcret > 0 ? `+${b.ekUcret} ₺` : 'Ücretsiz'}</span>
                    </button>
                  ))}
                </div>
                {/* ✅ Kompakt özel ölçü */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${seciliBoyut?.id === 'xl' ? 'max-h-16 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                  <div className="flex items-center gap-2 bg-amber-50/60 border border-amber-100 rounded-lg px-3 py-2">
                    <span className="text-amber-500 text-xs flex-shrink-0">✦</span>
                    <input type="text" value={ozelOlcu} onChange={e => setOzelOlcu(e.target.value)} placeholder="Ölçü girin (Örn: 45×90 cm)" className="flex-1 bg-transparent text-xs text-stone-700 placeholder-stone-400 focus:outline-none" />
                  </div>
                </div>
              </div>

              {/* Renk */}
              <div className="mb-7">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-700">Renk</h3>
                  {seciliRenk && <span className="text-[10px] text-stone-400">{seciliRenk.isim}{seciliRenk.ekUcret > 0 ? ` (+${seciliRenk.ekUcret} ₺)` : ''}</span>}
                </div>
                <div className="flex gap-3">
                  {RENKLER.map(r => (
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
                  {EKSTRALAR.map(e => {
                    const isSelected = seciliEkstralar.some(item => item.id === e.id);
                    return (
                      <div key={e.id}>
                        {/* ✅ Kompakt satır */}
                        <button onClick={() => toggleEkstra(e)} className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border transition-all duration-200 ${isSelected ? 'border-amber-400 bg-amber-50/70' : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'}`}>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs transition-colors ${isSelected ? 'text-amber-500' : 'text-stone-300'}`}>{e.ikon}</span>
                            <span className={`text-xs font-medium ${isSelected ? 'text-stone-800' : 'text-stone-500'}`}>{e.isim}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-stone-400">+{e.ekUcret} ₺</span>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${isSelected ? 'border-amber-500 bg-amber-500' : 'border-stone-300'}`}>
                              {isSelected && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5 text-white"><path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" /></svg>}
                            </div>
                          </div>
                        </button>
                        {/* ✅ Kompakt animasyonlu açılış */}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isSelected ? 'max-h-14 opacity-100 mt-1.5' : 'max-h-0 opacity-0'}`}>
                          {e.id === 'isim' && (
                            <div className="flex items-center gap-2 bg-amber-50/50 border border-amber-100 rounded-lg px-3 py-2 ml-1">
                              <span className="text-amber-400 text-[10px] flex-shrink-0 font-bold">A</span>
                              <input type="text" value={kazimaMetni} onChange={ev => setKazimaMetni(ev.target.value)} placeholder="Kazınacak isim veya harfler…" className="flex-1 bg-transparent text-xs text-stone-700 placeholder-stone-400 focus:outline-none" />
                              {kazimaMetni && <button onClick={() => setKazimaMetni('')} className="text-stone-300 hover:text-stone-500 text-xs">✕</button>}
                            </div>
                          )}
                          {e.id === 'hediye_paket' && (
                            <div className="flex items-start gap-2 bg-rose-50/30 border border-rose-100 rounded-lg px-3 py-2 ml-1">
                              <span className="text-rose-400 text-[10px] flex-shrink-0 mt-0.5">♡</span>
                              <textarea value={hediyeNotu} onChange={ev => setHediyeNotu(ev.target.value)} placeholder="Hediye notunuzu buraya yazabilirsiniz…" rows="2" className="flex-1 bg-transparent text-xs text-stone-700 placeholder-stone-400 focus:outline-none resize-none leading-relaxed" />
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
                <button onClick={sepeteEkle} className="w-full bg-amber-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-amber-700 active:scale-[0.99] transition-all duration-200 uppercase tracking-widest text-[11px] shadow-xl shadow-amber-600/10 flex justify-between items-center group">
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
      </div>


       {/* Atölye Sahibi Bilgisi ve Mesaj Butonu */}
<div className="flex items-center gap-3 my-6 p-4 bg-stone-50 rounded-xl border border-stone-100">
  {/* Tıklanabilir Alan: Avatar ve İsim */}
  <Link 
    to={`/atolyeler/${urun.atolyeId || urun.id}`} // Atölye ID'sine göre yönlendirir
    className="flex items-center gap-3 flex-1 group"
  >
    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold group-hover:ring-2 group-hover:ring-amber-200 transition-all">
      {urun.atolyeIsmi ? urun.atolyeIsmi[0] : 'A'}
    </div>
    <div className="text-left">
      <h4 className="text-xs font-bold text-stone-800 uppercase tracking-tight group-hover:text-amber-700 transition-colors">
        {urun.atolyeIsmi || "Tasarım Atölyesi"}
      </h4>
      <p className="text-[10px] text-stone-400">Genellikle 1 saat içinde yanıt veriyor</p>
    </div>
  </Link>

  {/* Soru Sor Butonu (Buna basınca sayfa değişmez, modal açılır) */}
  <button 
    onClick={() => setMesajModalAcik(true)}
    className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors"
  >
    Soru Sor
  </button>
</div>

      {/* ══ DEĞERLENDİRMELER BÖLÜMÜ ══ */}
      <DegerlendirmelerBolumu urunId={urun.id} />

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
              {[{ ikon: '◎', baslik: 'Temizlik', aciklama: 'Hafif nemli, yumuşak pamuklu bez ile silin. Kimyasal temizleyicilerden kaçının.' }, { ikon: '◈', baslik: 'Saklama', aciklama: 'Doğrudan güneş ışığından uzak, serin ve kuru bir ortamda saklayın.' }, { ikon: '✦', baslik: 'Uzun Ömür', aciklama: 'Düzenli bakım ile ürününüz yıllarca ilk günkü tazeliğini korur.' }].map(item => (
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
              <button onClick={() => setIsModalOpen(false)} className="w-full bg-stone-900 text-white text-[11px] uppercase tracking-widest font-semibold py-3 rounded-xl hover:bg-stone-800 transition-colors">Anladım</button>
            </div>
          </div>
        </div>
      )}
      

      {/* Atölyeye Mesaj Gönder Modal Penceresi */}
      {mesajModalAcik && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setMesajModalAcik(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-serif text-stone-800">Atölyeye Mesaj Gönder</h3>
              <button onClick={() => setMesajModalAcik(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>
            <textarea 
              value={atolyeMesaj} 
              onChange={e => setAtolyeMesaj(e.target.value)} 
              placeholder="Ürün hakkında sormak istediklerinizi yazın..." 
              className="w-full h-32 p-3 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-400 resize-none"
            />
            <button 
              onClick={() => {
                toast.success("Mesajınız iletildi!");
                setMesajModalAcik(false);
                setAtolyeMesaj("");
              }}
              className="w-full mt-4 py-3 bg-stone-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-stone-800 transition-colors"
            >
              Gönder
            </button>
          </div>
        </div>
      )}

    </>
  );
}

export default AtolyeUrunDetay;
