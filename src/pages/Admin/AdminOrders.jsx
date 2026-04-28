import { useState, useEffect, useMemo } from 'react'
import { 
  Search, Filter, Eye, MoreHorizontal, Loader2, ArrowUpDown, X, 
  MapPin, Package, Calendar, Store, User, CheckCircle, XCircle, AlertCircle, FileText, ImageIcon
} from 'lucide-react'

// ---  MOCK VERİler  ---
const MOCK_SIPARISLER = [
  { 
    id: 'ORD-1042', musteri: 'Ahmet Yılmaz', satici: 'Vintage Butik', tarih: '2026-04-27', tutar: 1250, durum: 'Hazırlanıyor',
    adres: 'Moda Cad. No:12 D:4 Kadıköy, İstanbul', odemeTipi: 'Kredi Kartı', komisyonOrani: 15,
    urunler: [{ ad: 'Vintage Deri Omuz Çantası', adet: 1, fiyat: 1250 }]
  },
  { 
    id: 'ORD-1041', musteri: 'Zeynep Kaya', satici: 'Glow Cosmetics', tarih: '2026-04-26', tutar: 450, durum: 'İade Talebi',
    adres: 'Tunalı Hilmi Cad. No:88 Çankaya, Ankara', odemeTipi: 'Kredi Kartı', komisyonOrani: 10,
    iadeNedeni: 'Ürün kargoda hasar görmüş, şişe çatlak geldi.', kanitGorseli: true,
    urunler: [{ ad: 'Aydınlatıcı Yüz Serumu', adet: 1, fiyat: 450 }]
  },
  { 
    id: 'ORD-1040', musteri: 'Caner Demir', satici: 'Minimalist Home', tarih: '2026-04-25', tutar: 3200, durum: 'Anlaşmazlık',
    adres: 'Kıbrıs Şehitleri Cad. No:42 Konak, İzmir', odemeTipi: 'Havale/EFT', komisyonOrani: 12,
    sikayetNedeni: 'Satıcı farklı renk gönderdi, iadeyi kabul etmiyor.', saticiSavunmasi: 'Açıklamada stok durumuna göre renk değişebilir yazıyordu.',
    urunler: [{ ad: 'El Yapımı Seramik Kupa', adet: 2, fiyat: 180 }, { ad: 'Minimalist Kol Saati', adet: 1, fiyat: 2840 }]
  },
  { 
    id: 'ORD-1039', musteri: 'Elif Şahin', satici: 'Eco Life', tarih: '2026-04-25', tutar: 180, durum: 'İptal Edildi',
    adres: 'Lara Yolu No:15 Muratpaşa, Antalya', odemeTipi: 'Kredi Kartı', komisyonOrani: 15,
    urunler: [{ ad: 'Organik Bez Çanta', adet: 1, fiyat: 180 }]
  },
  { 
    id: 'ORD-1038', musteri: 'Burak Özkan', satici: 'Teknoloji Dünyası', tarih: '2026-04-24', tutar: 8500, durum: 'Teslim Edildi',
    adres: 'Beşiktaş Meydanı No:2 İstanbul', odemeTipi: 'Kredi Kartı', komisyonOrani: 8,
    urunler: [{ ad: 'Bluetooth Kulaklık Pro', adet: 1, fiyat: 8500 }]
  },
  { 
    id: 'ORD-1037', musteri: 'Merve Aydın', satici: 'Bohem Takı', tarih: '2026-04-24', tutar: 320, durum: 'Kargolandı',
    adres: 'Bornova, İzmir', odemeTipi: 'Kredi Kartı', komisyonOrani: 20,
    urunler: [{ ad: 'Gümüş Tasarım Kolye', adet: 1, fiyat: 320 }]
  },
  { 
    id: 'ORD-1036', musteri: 'Selin Yurt', satici: 'Doğal Yaşam', tarih: '2026-04-23', tutar: 750, durum: 'İade Talebi',
    adres: 'Nilüfer, Bursa', odemeTipi: 'Kredi Kartı', komisyonOrani: 15,
    iadeNedeni: 'Beklediğimden çok daha küçük bir ürün geldi.', kanitGorseli: false,
    urunler: [{ ad: 'Ahşap Organizer', adet: 1, fiyat: 750 }]
  }
]

// --- 2. YARDIMCI BİLEŞENLER ---
const StatusBadge = ({ durum }) => {
  const renkler = {
    'Hazırlanıyor': 'bg-amber-100 text-amber-700',
    'Kargolandı': 'bg-blue-100 text-blue-700',
    'Teslim Edildi': 'bg-green-100 text-green-700',
    'İptal Edildi': 'bg-stone-100 text-stone-600',
    'İade Talebi': 'bg-rose-100 text-rose-700 font-bold',
    'Anlaşmazlık': 'bg-purple-100 text-purple-700 font-bold',
    'İade Onaylandı': 'bg-emerald-100 text-emerald-700',
    'Reddedildi': 'bg-red-100 text-red-700',
  }
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${renkler[durum] || 'bg-stone-100 text-stone-600'}`}>
      {durum}
    </span>
  )
}

// --- 3. ANA BİLEŞEN ---
export default function AdminOrders() {
  const [siparisler, setSiparisler] = useState([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [aktifSekme, setAktifSekme] = useState('siparisler') // 'siparisler' veya 'cozum-merkezi'
  const [arama, setArama] = useState('')
  const [siralaYonu, setSiralaYonu] = useState('desc')
  const [seciliDurum, setSeciliDurum] = useState('Tümü')
  const [seciliSiparis, setSeciliSiparis] = useState(null)
  const [aktifDropdown, setAktifDropdown] = useState(null)

  useEffect(() => {
    setTimeout(() => {
      setSiparisler(MOCK_SIPARISLER)
      setYukleniyor(false)
    }, 600)
  }, [])

  const durumuGuncelle = (id, yeniDurum) => {
    setSiparisler(prev => prev.map(s => s.id === id ? { ...s, durum: yeniDurum } : s))
    setAktifDropdown(null)
    if(seciliSiparis && seciliSiparis.id === id) {
      setSeciliSiparis(prev => ({...prev, durum: yeniDurum}))
    }
  }

  const islenenSiparisler = useMemo(() => {
    let sonuc = [...siparisler]
    
    // Sekme Filtresi
    if (aktifSekme === 'cozum-merkezi') {
      sonuc = sonuc.filter(s => s.durum === 'İade Talebi' || s.durum === 'Anlaşmazlık')
    }

    if (arama) {
      const lowArama = arama.toLowerCase()
      sonuc = sonuc.filter(s => 
        s.id.toLowerCase().includes(lowArama) || 
        s.musteri.toLowerCase().includes(lowArama) ||
        s.satici.toLowerCase().includes(lowArama)
      )
    }

    if (seciliDurum !== 'Tümü' && aktifSekme === 'siparisler') {
      sonuc = sonuc.filter(s => s.durum === seciliDurum)
    }

    sonuc.sort((a, b) => siralaYonu === 'asc' ? a.tutar - b.tutar : b.tutar - a.tutar)
    return sonuc
  }, [siparisler, arama, siralaYonu, seciliDurum, aktifSekme])

  const sorunluSiparisSayisi = siparisler.filter(s => s.durum === 'İade Talebi' || s.durum === 'Anlaşmazlık').length

  if (yukleniyor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full text-stone-400">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="text-sm font-medium tracking-tight">Veriler yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Sipariş & İade Yönetimi</h1>
          <p className="text-sm text-stone-500 mt-1 font-medium">Platform genelindeki tüm ticari akışı ve uyuşmazlıkları denetleyin.</p>
        </div>
      </div>

      {/* Sekme Menüsü */}
      <div className="flex items-center gap-8 border-b border-stone-200 mb-2">
        <button 
          onClick={() => setAktifSekme('siparisler')}
          className={`pb-4 text-sm font-bold transition-all relative ${aktifSekme === 'siparisler' ? 'text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
        >
          Tüm Siparişler
          {aktifSekme === 'siparisler' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-stone-900 rounded-full"></span>}
        </button>
        
        <button 
          onClick={() => setAktifSekme('cozum-merkezi')}
          className={`pb-4 text-sm font-bold transition-all relative flex items-center gap-2 ${aktifSekme === 'cozum-merkezi' ? 'text-rose-600' : 'text-stone-400 hover:text-stone-600'}`}
        >
          Çözüm Merkezi
          {sorunluSiparisSayisi > 0 && (
            <span className="bg-rose-100 text-rose-700 py-0.5 px-2 rounded-full text-[10px] font-black">{sorunluSiparisSayisi}</span>
          )}
          {aktifSekme === 'cozum-merkezi' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-600 rounded-full"></span>}
        </button>
      </div>

      {/* Filtreler */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center border border-stone-200 rounded-xl px-4 py-2.5 gap-3 bg-white w-80 shadow-sm focus-within:ring-2 focus-within:ring-stone-900/5 transition-all">
          <Search size={16} className="text-stone-400" />
          <input
            type="text"
            placeholder="Sipariş, müşteri veya satıcı..."
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            className="text-sm outline-none flex-1 bg-transparent text-stone-800 font-medium placeholder:text-stone-400"
          />
        </div>
        
        {aktifSekme === 'siparisler' && (
          <div className="flex items-center gap-2">
            {['Tümü', 'Hazırlanıyor', 'Kargolandı', 'Teslim Edildi'].map(durum => (
              <button
                key={durum}
                onClick={() => setSeciliDurum(durum)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  seciliDurum === durum
                    ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400'
                }`}
              >
                {durum}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tablo */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="px-6 py-4 text-[11px] font-black text-stone-400 uppercase tracking-widest">Sipariş Bilgisi</th>
              <th className="px-6 py-4 text-[11px] font-black text-stone-400 uppercase tracking-widest">Müşteri / Satıcı</th>
              <th className="px-6 py-4 text-[11px] font-black text-stone-400 uppercase tracking-widest cursor-pointer hover:text-stone-900" onClick={() => setSiralaYonu(prev => prev === 'asc' ? 'desc' : 'asc')}>
                <div className="flex items-center gap-1">Tutar <ArrowUpDown size={12} /></div>
              </th>
              <th className="px-6 py-4 text-[11px] font-black text-stone-400 uppercase tracking-widest text-center">Durum</th>
              <th className="px-6 py-4 text-[11px] font-black text-stone-400 uppercase tracking-widest text-right">Aksiyon</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {islenenSiparisler.map((siparis) => (
              <tr key={siparis.id} className="hover:bg-stone-50/40 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono font-bold text-stone-900">{siparis.id}</span>
                    <span className="text-[11px] text-stone-400 font-bold">{siparis.tarih}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-stone-800 font-bold">
                      <User size={12} className="text-stone-300" /> {siparis.musteri}
                    </div>
                    <div className="flex items-center gap-2 text-stone-500 font-medium text-xs">
                      <Store size={12} className="text-stone-300" /> {siparis.satici}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-black text-stone-900 text-base">{siparis.tutar.toLocaleString('tr-TR')} ₺</td>
                <td className="px-6 py-4 text-center">
                  <StatusBadge durum={siparis.durum} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setSeciliSiparis(siparis)} className="p-2 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-900 transition-all">
                      <Eye size={18} />
                    </button>

                    <div className="relative">
                      <button 
                        onClick={() => setAktifDropdown(aktifDropdown === siparis.id ? null : siparis.id)}
                        className={`p-2 rounded-xl transition-all ${aktifDropdown === siparis.id ? 'bg-stone-200 text-stone-900' : 'hover:bg-stone-100 text-stone-400'}`}
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {aktifDropdown === siparis.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setAktifDropdown(null)}></div>
                          <div className="absolute right-0 mt-2 w-52 bg-white border border-stone-200 rounded-2xl shadow-xl py-2 z-20 overflow-hidden ring-4 ring-stone-900/5">
                            <button onClick={() => durumuGuncelle(siparis.id, 'İptal Edildi')} className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                              <XCircle size={14} /> Siparişi İptal Et
                            </button>
                            <button onClick={() => durumuGuncelle(siparis.id, 'Teslim Edildi')} className="w-full text-left px-4 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-50 flex items-center gap-2">
                              <CheckCircle size={14} /> Teslim Edildi Yap
                            </button>
                            <button className="w-full text-left px-4 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-50 flex items-center gap-2 border-t border-stone-100">
                              <FileText size={14} /> Faturayı İndir
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {seciliSiparis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 ">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-stone-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-stone-100 sticky top-0 bg-white/90 backdrop-blur-xl z-10">
              <div>
                <h2 className="text-xl font-black text-stone-900 flex items-center gap-3">
                  <Package size={24} className="text-stone-900" /> Sipariş Detay Analizi
                </h2>
                <p className="text-xs text-stone-400 font-bold mt-1 uppercase tracking-widest">{seciliSiparis.id} • PLATFORM KAYDI</p>
              </div>
              <button onClick={() => setSeciliSiparis(null)} className="p-2 bg-stone-50 hover:bg-stone-100 text-stone-400 hover:text-stone-900 rounded-full transition-all">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Taraflar Kartları */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-stone-50 rounded-[1.5rem] p-6 border border-stone-100">
                  <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <User size={14} /> Alıcı Bilgileri
                  </h3>
                  <p className="font-black text-stone-900 text-lg">{seciliSiparis.musteri}</p>
                  <p className="mt-3 text-sm text-stone-500 leading-relaxed font-medium">{seciliSiparis.adres}</p>
                </div>

                <div className="bg-stone-50 rounded-[1.5rem] p-6 border border-stone-100">
                  <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Store size={14} /> Mağaza Verileri
                  </h3>
                  <p className="font-black text-stone-900 text-lg">{seciliSiparis.satici}</p>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-xl border border-stone-200/50">
                      <p className="text-[10px] font-bold text-stone-400">KOMİSYON</p>
                      <p className="font-black text-stone-900">%{seciliSiparis.komisyonOrani}</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-stone-200/50">
                      <p className="text-[10px] font-bold text-stone-400">NET KAZANÇ</p>
                      <p className="font-black text-stone-900">{((seciliSiparis.tutar * (100 - seciliSiparis.komisyonOrani)) / 100).toLocaleString('tr-TR')} ₺</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Uyuşmazlık Detayı (Sadece Sorun Varsa Görünür) */}
              {(seciliSiparis.durum === 'İade Talebi' || seciliSiparis.durum === 'Anlaşmazlık') && (
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                    <AlertCircle size={14} /> Çözüm Merkezi Kanıtları
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-rose-50/30 p-5 rounded-2xl border border-rose-100">
                      <p className="text-[10px] font-black text-rose-700 uppercase mb-2">Müşteri Şikayeti</p>
                      <p className="text-sm text-stone-700 font-medium leading-relaxed italic">"{seciliSiparis.iadeNedeni || seciliSiparis.sikayetNedeni}"</p>
                      {seciliSiparis.kanitGorseli && (
                        <button className="mt-4 flex items-center gap-2 text-[11px] font-black text-rose-600 bg-white px-3 py-2 rounded-lg border border-rose-100 shadow-sm">
                          <ImageIcon size={14} /> GÖRSEL KANITI İNCELE
                        </button>
                      )}
                    </div>
                    {seciliSiparis.saticiSavunmasi && (
                      <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
                        <p className="text-[10px] font-black text-stone-400 uppercase mb-2">Satıcı Yanıtı</p>
                        <p className="text-sm text-stone-600 font-medium leading-relaxed italic">"{seciliSiparis.saticiSavunmasi}"</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Sipariş İçeriği */}
              <div className="border border-stone-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-stone-50 px-6 py-3 border-b border-stone-100">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Sipariş Edilen Ürünler</p>
                </div>
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-stone-100">
                    {seciliSiparis.urunler.map((urun, index) => (
                      <tr key={index} className="bg-white">
                        <td className="px-6 py-4 text-stone-900 font-bold">
                          <span className="text-stone-300 mr-3 font-medium">{urun.adet}x</span> {urun.ad}
                        </td>
                        <td className="px-6 py-4 text-right font-black text-stone-900">{urun.fiyat.toLocaleString('tr-TR')} ₺</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-stone-900 text-white">
                    <tr>
                      <td className="px-6 py-5 font-bold uppercase text-[11px] tracking-widest">Genel Toplam ({seciliSiparis.odemeTipi})</td>
                      <td className="px-6 py-5 text-right font-black text-xl">{seciliSiparis.tutar.toLocaleString('tr-TR')} ₺</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Karar Butonları (Sadece Sorun Varsa) */}
            {(seciliSiparis.durum === 'İade Talebi' || seciliSiparis.durum === 'Anlaşmazlık') && (
              <div className="px-8 py-6 border-t border-stone-100 bg-rose-50/20 flex items-center justify-between">
                <div className="flex items-center gap-3 text-rose-600 font-black text-xs uppercase tracking-tighter">
                  <AlertCircle size={20} /> Karar Verilmesi Gerekiyor
                </div>
                <div className="flex gap-4">
                  <button onClick={() => durumuGuncelle(seciliSiparis.id, 'Reddedildi')} className="px-6 py-3 bg-white border border-stone-200 text-stone-900 rounded-2xl text-xs font-black hover:bg-stone-50 transition-all shadow-sm">
                    İADEYİ REDDET
                  </button>
                  <button onClick={() => durumuGuncelle(seciliSiparis.id, 'İade Onaylandı')} className="px-6 py-3 bg-stone-900 text-white rounded-2xl text-xs font-black hover:bg-stone-800 transition-all shadow-lg">
                    İADEYİ ONAYLA (PARA İADESİ)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}