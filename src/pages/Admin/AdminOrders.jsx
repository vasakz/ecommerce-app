import { useState, useEffect, useMemo, useRef } from 'react'
import { 
  Search, Filter, Eye, MoreHorizontal, Loader2, ArrowUpDown, X, 
  MapPin, Package, Calendar, Store, User, CreditCard, CheckCircle, XCircle, AlertCircle, FileText
} from 'lucide-react'

// --- 1. MOCK VERİ & API SİMÜLASYONU ---
const MOCK_SIPARISLER = [
  { 
    id: 'ORD-1042', musteri: 'Ahmet Yılmaz', satici: 'Vintage Butik', tarih: '2026-04-27', tutar: 1250, durum: 'Hazırlanıyor',
    adres: 'Moda Cad. No:12 D:4 Kadıköy, İstanbul', odemeTipi: 'Kredi Kartı', komisyonOrani: 15,
    urunler: [{ ad: 'Vintage Deri Omuz Çantası', adet: 1, fiyat: 1250 }]
  },
  { 
    id: 'ORD-1041', musteri: 'Zeynep Kaya', satici: 'Glow Cosmetics', tarih: '2026-04-26', tutar: 450, durum: 'İade Talebi',
    adres: 'Tunalı Hilmi Cad. No:88 Çankaya, Ankara', odemeTipi: 'Kredi Kartı', komisyonOrani: 10,
    urunler: [{ ad: 'Aydınlatıcı Yüz Serumu', adet: 1, fiyat: 450 }]
  },
  { 
    id: 'ORD-1040', musteri: 'Caner Demir', satici: 'Minimalist Home', tarih: '2026-04-25', tutar: 3200, durum: 'Anlaşmazlık',
    adres: 'Kıbrıs Şehitleri Cad. No:42 Konak, İzmir', odemeTipi: 'Havale/EFT', komisyonOrani: 12,
    urunler: [{ ad: 'El Yapımı Seramik Kupa', adet: 2, fiyat: 180 }, { ad: 'Minimalist Kol Saati', adet: 1, fiyat: 2840 }]
  },
  { 
    id: 'ORD-1039', musteri: 'Elif Şahin', satici: 'Eco Life', tarih: '2026-04-25', tutar: 180, durum: 'İptal Edildi',
    adres: 'Lara Yolu No:15 Muratpaşa, Antalya', odemeTipi: 'Kredi Kartı', komisyonOrani: 15,
    urunler: [{ ad: 'Organik Bez Çanta', adet: 1, fiyat: 180 }]
  },
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
  }
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] uppercase tracking-wider font-semibold ${renkler[durum] || 'bg-stone-100 text-stone-600'}`}>
      {durum}
    </span>
  )
}

// --- 3. ANA BİLEŞEN ---
export default function AdminOrders() {
  // State Yönetimi
  const [siparisler, setSiparisler] = useState([])
  const [yukleniyor, setYukleniyor] = useState(true)
  
  const [arama, setArama] = useState('')
  const [siralaYonu, setSiralaYonu] = useState('desc')
  const [seciliDurum, setSeciliDurum] = useState('Tümü')
  
  const [seciliSiparis, setSeciliSiparis] = useState(null)
  const [aktifDropdown, setAktifDropdown] = useState(null) // 3 Nokta menüsü için

  // Simüle edilmiş veri yükleme
  useEffect(() => {
    setTimeout(() => {
      setSiparisler(MOCK_SIPARISLER)
      setYukleniyor(false)
    }, 600)
  }, [])

  // Aksiyonlar (Dinamik İşlevler)
  const durumuGuncelle = (id, yeniDurum) => {
    setSiparisler(prev => prev.map(s => s.id === id ? { ...s, durum: yeniDurum } : s))
    setAktifDropdown(null) // İşlem bitince dropdown'ı kapat
    if(seciliSiparis && seciliSiparis.id === id) {
      setSeciliSiparis(prev => ({...prev, durum: yeniDurum})) // Modal açıksa orayı da güncelle
    }
  }

  // Filtreleme & Sıralama Mantığı
  const islenenSiparisler = useMemo(() => {
    let sonuc = [...siparisler]
    if (arama) {
      const aramaKucuk = arama.toLowerCase()
      sonuc = sonuc.filter(s => 
        s.id.toLowerCase().includes(aramaKucuk) || 
        s.musteri.toLowerCase().includes(aramaKucuk) ||
        s.satici.toLowerCase().includes(aramaKucuk)
      )
    }
    if (seciliDurum !== 'Tümü') {
      sonuc = sonuc.filter(s => s.durum === seciliDurum)
    }
    sonuc.sort((a, b) => siralaYonu === 'asc' ? a.tutar - b.tutar : b.tutar - a.tutar)
    return sonuc
  }, [siparisler, arama, siralaYonu, seciliDurum])

  const durumListesi = ['Tümü', 'Hazırlanıyor', 'Kargolandı', 'Teslim Edildi', 'İptal Edildi', 'İade Talebi', 'Anlaşmazlık', 'İade Onaylandı']

  if (yukleniyor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full text-stone-400">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="text-sm font-medium">Platform verileri alınıyor...</p>
      </div>
    )
  }

  // Acil müdahale gereken sipariş sayısı 
  const sorunluSiparisSayisi = siparisler.filter(s => s.durum === 'İade Talebi' || s.durum === 'Anlaşmazlık').length

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full p-6">
      
      {/* Header Alanı (Arkadaşının stiline benzer) */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Sipariş Yönetimi</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            {sorunluSiparisSayisi > 0 && (
              <span className="text-rose-600 font-medium">{sorunluSiparisSayisi} müdahale bekleyen sipariş · </span>
            )}
            Toplam {siparisler.length} sipariş
          </p>
        </div>
      </div>

      {/* Araç Çubuğu */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center border border-stone-200 rounded-lg px-3 py-2 gap-2 bg-white w-72">
          <Search size={15} className="text-stone-400" />
          <input
            type="text"
            placeholder="Sipariş no, müşteri veya satıcı..."
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            className="text-sm outline-none flex-1 bg-transparent text-stone-700"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {durumListesi.map(durum => (
            <button
              key={durum}
              onClick={() => setSeciliDurum(durum)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                seciliDurum === durum
                  ? 'bg-stone-900 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'
              }`}
            >
              {durum}
            </button>
          ))}
        </div>
      </div>

      {/* Sipariş Tablosu */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden min-h-[400px]">
        <table className="w-full text-sm text-left">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="px-5 py-3 text-xs font-bold text-stone-500 uppercase tracking-wider">Sipariş No</th>
              <th className="px-5 py-3 text-xs font-bold text-stone-500 uppercase tracking-wider">Müşteri</th>
              <th className="px-5 py-3 text-xs font-bold text-stone-500 uppercase tracking-wider">Satıcı (Mağaza)</th>
              <th className="px-5 py-3 text-xs font-bold text-stone-500 uppercase tracking-wider cursor-pointer hover:text-stone-900" onClick={() => setSiralaYonu(prev => prev === 'asc' ? 'desc' : 'asc')}>
                <div className="flex items-center gap-1">Tutar <ArrowUpDown size={12} /></div>
              </th>
              <th className="px-5 py-3 text-xs font-bold text-stone-500 uppercase tracking-wider">Durum</th>
              <th className="px-5 py-3 text-xs font-bold text-stone-500 uppercase tracking-wider text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {islenenSiparisler.map((siparis) => (
              <tr key={siparis.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-5 py-4 font-mono font-medium text-stone-800">{siparis.id}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-stone-800">{siparis.musteri}</span>
                    <span className="text-[11px] text-stone-400">{siparis.tarih}</span>
                  </div>
                </td>
                <td className="px-5 py-4 font-medium text-stone-600">{siparis.satici}</td>
                <td className="px-5 py-4 font-bold text-stone-900">{siparis.tutar.toLocaleString('tr-TR')} ₺</td>
                <td className="px-5 py-4">
                  <StatusBadge durum={siparis.durum} />
                </td>
                <td className="px-5 py-4 text-right relative">
                  <div className="flex items-center justify-end gap-2">
                    
                    {/* İncele Butonu */}
                    <button 
                      onClick={() => setSeciliSiparis(siparis)}
                      className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition"
                      title="Detayları İncele"
                    >
                      <Eye size={16} />
                    </button>

                    {/* 3 NOKTA (HIZLI İŞLEMLER) BUTONU */}
                    <div className="relative">
                      <button 
                        onClick={() => setAktifDropdown(aktifDropdown === siparis.id ? null : siparis.id)}
                        className={`p-1.5 rounded-lg transition ${aktifDropdown === siparis.id ? 'bg-stone-200 text-stone-900' : 'hover:bg-stone-100 text-stone-500 hover:text-stone-800'}`}
                      >
                        <MoreHorizontal size={16} />
                      </button>

                      {/* Dropdown Menü */}
                      {aktifDropdown === siparis.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setAktifDropdown(null)}></div>
                          <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-xl shadow-lg py-1.5 z-20 text-left">
                            <p className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100 mb-1">Hızlı İşlemler</p>
                            
                            <button onClick={() => durumuGuncelle(siparis.id, 'İptal Edildi')} className="w-full text-left px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 flex items-center gap-2">
                              <XCircle size={14} /> İptal Et
                            </button>
                            
                            <button onClick={() => durumuGuncelle(siparis.id, 'Teslim Edildi')} className="w-full text-left px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 flex items-center gap-2">
                              <CheckCircle size={14} /> Teslim Edildi İşaretle
                            </button>

                            <button className="w-full text-left px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 flex items-center gap-2">
                              <FileText size={14} /> Fatura Görüntüle
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                  </div>
                </td>
              </tr>
            ))}
            {islenenSiparisler.length === 0 && (
              <tr>
                <td colSpan="6" className="px-5 py-12 text-center text-stone-400 text-sm">
                  Kriterlere uygun sipariş bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* SİPARİŞ DETAY MODALI */}
      {seciliSiparis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 sticky top-0 bg-white/95 backdrop-blur z-10">
              <div>
                <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Package size={20} className="text-stone-400" /> Sipariş Detayı
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">{seciliSiparis.id} · {seciliSiparis.tarih}</p>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge durum={seciliSiparis.durum} />
                <button onClick={() => setSeciliSiparis(null)} className="text-stone-400 hover:text-stone-700 transition">
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              
              {/* Taraflar (Müşteri & Satıcı) Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Müşteri Kutusu */}
                <div>
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <User size={13} /> Müşteri Bilgileri
                  </h3>
                  <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                    <p className="font-bold text-stone-800 text-sm">{seciliSiparis.musteri}</p>
                    <div className="mt-3 flex items-start gap-2 text-stone-600 text-sm">
                      <MapPin size={14} className="mt-0.5 text-stone-400 shrink-0" />
                      <p className="leading-relaxed">{seciliSiparis.adres}</p>
                    </div>
                  </div>
                </div>

                {/* Satıcı Kutusu */}
                <div>
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Store size={13} /> Satıcı Bilgileri
                  </h3>
                  <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                    <p className="font-bold text-stone-800 text-sm">{seciliSiparis.satici}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-stone-400">Platform Komisyonu</p>
                        <p className="font-medium text-stone-700">%{seciliSiparis.komisyonOrani}</p>
                      </div>
                      <div>
                        <p className="text-xs text-stone-400">Kesinti Tutarı</p>
                        <p className="font-medium text-stone-700">
                          {((seciliSiparis.tutar * seciliSiparis.komisyonOrani) / 100).toLocaleString('tr-TR')} ₺
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sipariş İçeriği */}
              <div>
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Package size={13} /> Sipariş Özeti
                </h3>
                <div className="border border-stone-200 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-stone-100">
                      {seciliSiparis.urunler.map((urun, index) => (
                        <tr key={index} className="bg-white">
                          <td className="px-4 py-3 text-stone-800">
                            <span className="inline-block w-6 h-6 bg-stone-100 text-stone-500 rounded text-xs font-bold text-center leading-6 mr-3">
                              {urun.adet}x
                            </span>
                            {urun.ad}
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-stone-900">
                            {urun.fiyat.toLocaleString('tr-TR')} ₺
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-stone-50 border-t border-stone-200">
                      <tr>
                        <td className="px-4 py-3 text-right font-medium text-stone-600">Ödeme ({seciliSiparis.odemeTipi})</td>
                        <td className="px-4 py-3 text-right font-bold text-stone-900 text-base">
                          {seciliSiparis.tutar.toLocaleString('tr-TR')} ₺
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

            </div>

            {/* Modal Footer (Sadece sorunlu durumlarda aksiyon butonları çıkar) */}
            {(seciliSiparis.durum === 'İade Talebi' || seciliSiparis.durum === 'Anlaşmazlık') && (
              <div className="px-6 py-4 border-t border-stone-100 bg-rose-50/50 flex gap-3">
                <div className="flex-1 flex items-center gap-2 text-rose-600 text-sm font-medium">
                  <AlertCircle size={18} />
                  Yönetici Kararı Bekleniyor
                </div>
                <button
                  onClick={() => durumuGuncelle(seciliSiparis.id, 'Kargolandı')}
                  className="px-4 py-2 border border-stone-200 bg-white text-stone-700 rounded-lg text-sm font-bold hover:bg-stone-50 transition"
                >
                  Talebi Reddet
                </button>
                <button
                  onClick={() => durumuGuncelle(seciliSiparis.id, 'İade Onaylandı')}
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-bold hover:bg-rose-700 transition"
                >
                  İadeyi Onayla
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}