import { useState, useEffect, useMemo, useRef } from 'react'
import { Search, Filter, Eye, MoreHorizontal, Loader2, ArrowUpDown, X, MapPin, Package, Calendar } from 'lucide-react'

// 1. API SİMÜLASYONU 
const fetchOrdersAPI = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { 
          id: 'ORD-1042', musteri: 'Ahmet Yılmaz', tarih: '2026-04-27', tutar: 1250, durum: 'Hazırlanıyor',
          adres: 'Moda Cad. No:12 D:4 Kadıköy, İstanbul', 
          urunler: [{ ad: 'Vintage Deri Omuz Çantası', adet: 1, fiyat: 1250 }]
        },
        { 
          id: 'ORD-1041', musteri: 'Zeynep Kaya', tarih: '2026-04-26', tutar: 450, durum: 'Kargolandı',
          adres: 'Tunalı Hilmi Cad. No:88 Çankaya, Ankara', 
          urunler: [{ ad: 'Aydınlatıcı Yüz Serumu', adet: 1, fiyat: 450 }]
        },
        { 
          id: 'ORD-1040', musteri: 'Caner Demir', tarih: '2026-04-25', tutar: 3200, durum: 'Teslim Edildi',
          adres: 'Kıbrıs Şehitleri Cad. No:42 Konak, İzmir', 
          urunler: [{ ad: 'El Yapımı Seramik Kupa', adet: 2, fiyat: 180 }, { ad: 'Minimalist Kol Saati', adet: 1, fiyat: 2840 }]
        },
        { 
          id: 'ORD-1039', musteri: 'Elif Şahin', tarih: '2026-04-25', tutar: 180, durum: 'İptal Edildi',
          adres: 'Lara Yolu No:15 Muratpaşa, Antalya', 
          urunler: [{ ad: 'Organik Bez Çanta', adet: 1, fiyat: 180 }]
        },
      ])
    }, 800)
  })
}

// 2. YARDIMCI BİLEŞENLER
const StatusBadge = ({ durum }) => {
  const renkler = {
    'Hazırlanıyor': 'bg-amber-100 text-amber-700',
    'Kargolandı': 'bg-blue-100 text-blue-700',
    'Teslim Edildi': 'bg-green-100 text-green-700',
    'İptal Edildi': 'bg-red-100 text-red-700'
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${renkler[durum] || 'bg-stone-100 text-stone-600'}`}>
      {durum}
    </span>
  )
}

// 3. ANA BİLEŞEN
export default function AdminOrders() {
  const [siparisler, setSiparisler] = useState([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState(null)

  // Filtre ve Arama State'leri
  const [arama, setArama] = useState('')
  const [siralaYonu, setSiralaYonu] = useState('desc')
  const [seciliDurum, setSeciliDurum] = useState('Tümü') // Filtre için yeni state
  const [filtreMenusuAcik, setFiltreMenusuAcik] = useState(false)
  const filtreRef = useRef(null)

  // Modal State'leri
  const [seciliSiparis, setSeciliSiparis] = useState(null) // Detay gösterilecek sipariş

  useEffect(() => {
    const yukle = async () => {
      try {
        setYukleniyor(true)
        const data = await fetchOrdersAPI()
        setSiparisler(data)
      } catch (error) {
  console.error("API Hatası:", error)
        setHata('Siparişler yüklenirken bir hata oluştu.')
      } finally {
        setYukleniyor(false)
      }
    }
    yukle()
  }, [])

  // Menü dışına tıklayınca filtreyi kapanması
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filtreRef.current && !filtreRef.current.contains(event.target)) {
        setFiltreMenusuAcik(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Filtreleme ve Sıralama Mantığı
  const islenenSiparisler = useMemo(() => {
    let sonuc = [...siparisler]

    // 1. Arama Filtresi
    if (arama) {
      sonuc = sonuc.filter(s => 
        s.id.toLowerCase().includes(arama.toLowerCase()) || 
        s.musteri.toLowerCase().includes(arama.toLowerCase())
      )
    }

    // 2. Durum Filtresi (YENİ)
    if (seciliDurum !== 'Tümü') {
      sonuc = sonuc.filter(s => s.durum === seciliDurum)
    }

    // 3. Sıralama
    sonuc.sort((a, b) => {
      return siralaYonu === 'asc' ? a.tutar - b.tutar : b.tutar - a.tutar
    })

    return sonuc
  }, [siparisler, arama, siralaYonu, seciliDurum])

  const siralamayiDegistir = () => {
    setSiralaYonu(prev => prev === 'asc' ? 'desc' : 'asc')
  }

  // DURUM LİSTESİ
  const durumListesi = ['Tümü', 'Hazırlanıyor', 'Kargolandı', 'Teslim Edildi', 'İptal Edildi']

  if (yukleniyor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full text-stone-400">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="text-sm font-medium">Sipariş verileri alınıyor...</p>
      </div>
    )
  }

  if (hata) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-2xl border border-red-100 max-w-2xl mx-auto mt-10">
        <p className="font-medium">{hata}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-sm underline hover:text-red-700">Tekrar Dene</button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto w-full relative">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-800">Siparişler</h1>
        <p className="text-sm text-stone-500 mt-1">Mağazanıza gelen tüm siparişleri ve durumlarını takip edin.</p>
      </div>

      {/* Araç Çubuğu */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm relative z-10">
        <div className="relative w-full sm:w-96">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Sipariş no veya müşteri ara..."
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          />
        </div>
        
        {/* FİLTRE BUTONU VE AÇILIR MENÜSÜ */}
        <div className="relative w-full sm:w-auto" ref={filtreRef}>
          <button 
            onClick={() => setFiltreMenusuAcik(!filtreMenusuAcik)}
            className="flex items-center justify-between sm:justify-center w-full sm:w-auto gap-2 text-stone-600 px-4 py-2 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors text-sm font-medium"
          >
            <div className="flex items-center gap-2">
              <Filter size={18} />
              <span>{seciliDurum === 'Tümü' ? 'Filtrele' : seciliDurum}</span>
            </div>
            {seciliDurum !== 'Tümü' && (
              <span className="flex items-center justify-center bg-stone-200 w-5 h-5 rounded-full text-[10px] ml-1">1</span>
            )}
          </button>

          {/* Açılır Menü */}
          {filtreMenusuAcik && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-xl shadow-lg py-2 z-20">
              {durumListesi.map(durum => (
                <button
                  key={durum}
                  onClick={() => {
                    setSeciliDurum(durum)
                    setFiltreMenusuAcik(false)
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${seciliDurum === durum ? 'bg-stone-100 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                >
                  {durum}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tablo */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden relative z-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-stone-50 text-stone-500 font-medium border-b border-stone-200">
              <tr>
                <th className="px-6 py-4">Sipariş No</th>
                <th className="px-6 py-4">Müşteri</th>
                <th className="px-6 py-4">Tarih</th>
                <th className="px-6 py-4 cursor-pointer hover:text-amber-600 transition-colors" onClick={siralamayiDegistir}>
                  <div className="flex items-center gap-1">Tutar <ArrowUpDown size={14} /></div>
                </th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {islenenSiparisler.map((siparis) => (
                <tr key={siparis.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-stone-800">{siparis.id}</td>
                  <td className="px-6 py-4 font-medium text-stone-700">{siparis.musteri}</td>
                  <td className="px-6 py-4 text-stone-500">{siparis.tarih}</td>
                  <td className="px-6 py-4 font-bold text-stone-900">{siparis.tutar.toLocaleString('tr-TR')} ₺</td>
                  <td className="px-6 py-4">
                    <StatusBadge durum={siparis.durum} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      {/* DETAY (GÖZ) BUTONU */}
                      <button 
                        onClick={() => setSeciliSiparis(siparis)}
                        className="text-stone-400 hover:text-amber-500 transition-colors"
                        title="Detayları Gör"
                      >
                        <Eye size={18} />
                      </button>
                      <button className="text-stone-400 hover:text-stone-600 transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {islenenSiparisler.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-stone-400">
                    Arama veya filtre kriterlerine uygun sipariş bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SİPARİŞ DETAY MODALI */}
      {seciliSiparis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSeciliSiparis(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div>
                <h3 className="font-bold text-stone-800 text-lg flex items-center gap-2">
                  <Package size={20} className="text-stone-500" />
                  {seciliSiparis.id} Detayı
                </h3>
              </div>
              <button onClick={() => setSeciliSiparis(null)} className="text-stone-400 hover:text-stone-700 bg-white p-1.5 rounded-lg border border-stone-200 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-stone-600 text-sm">
                  <Calendar size={16} />
                  <span>{seciliSiparis.tarih}</span>
                </div>
                <StatusBadge durum={seciliSiparis.durum} />
              </div>

              <div className="mb-6 p-4 bg-stone-50 rounded-xl border border-stone-100">
                <h4 className="text-xs font-bold text-stone-400 uppercase mb-2 flex items-center gap-2">
                  <MapPin size={14} /> Müşteri & Teslimat
                </h4>
                <p className="font-medium text-stone-800">{seciliSiparis.musteri}</p>
                <p className="text-sm text-stone-600 mt-1">{seciliSiparis.adres}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-stone-400 uppercase mb-3 border-b border-stone-100 pb-2">Sipariş İçeriği</h4>
                <ul className="space-y-3 mb-4 max-h-40 overflow-y-auto pr-2">
                  {seciliSiparis.urunler.map((urun, index) => (
                    <li key={index} className="flex justify-between items-center text-sm">
                      <span className="text-stone-700"><span className="text-stone-400 mr-2">{urun.adet}x</span>{urun.ad}</span>
                      <span className="font-medium text-stone-800">{urun.fiyat.toLocaleString('tr-TR')} ₺</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
              <span className="text-sm text-stone-500">Toplam Tutar:</span>
              <span className="text-xl font-bold text-stone-900">{seciliSiparis.tutar.toLocaleString('tr-TR')} ₺</span>
            </div>
            
          </div>
        </div>
      )}
    </div>
  )
}