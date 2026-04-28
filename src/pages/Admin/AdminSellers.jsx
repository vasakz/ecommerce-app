import { useState } from 'react'
import { CheckCircle, XCircle, Eye, Store, FileText, User, CreditCard, Search, AlertTriangle } from 'lucide-react'

const MOCK_BASVURULAR = [
  {
    id: 'BAS-001',
    ad: 'Ayşe', soyad: 'Demir',
    email: 'ayse.demir@email.com',
    telefon: '0532 111 22 33',
    hesapTuru: 'atolye',
    magazaAdi: 'Eller Atölyesi',
    isletmeTuru: 'Şahıs',
    vergiNo: '1234567890',
    kategoriler: ['Deri & Aksesuar', 'Takı & Bijuteri'],
    banka: 'Ziraat Bankası',
    iban: 'TR12 0001 0001 0000 0001 0001 00',
    magazaAciklama: 'El yapımı deri çanta ve aksesuar üretiyorum.',
    basvuruTarihi: '2026-04-20',
    durum: 'bekliyor',
  },
  {
    id: 'BAS-002',
    ad: 'Mehmet', soyad: 'Kaya',
    email: 'mehmet.kaya@email.com',
    telefon: '0543 222 33 44',
    hesapTuru: 'satici',
    magazaAdi: 'Kaya Ahşap',
    isletmeTuru: 'Şirket',
    vergiNo: '9876543210',
    kategoriler: ['Ahşap & Mobilya', 'Ev Yaşam & Dekor'],
    banka: 'Garanti BBVA',
    iban: 'TR12 0006 2000 0000 0000 0002 00',
    magazaAciklama: 'Doğal ahşaptan el yapımı mobilya ve dekor ürünleri.',
    basvuruTarihi: '2026-04-21',
    durum: 'bekliyor',
  },
  {
    id: 'BAS-003',
    ad: 'Fatma', soyad: 'Yıldız',
    email: 'fatma.yildiz@email.com',
    telefon: '0555 333 44 55',
    hesapTuru: 'atolye',
    magazaAdi: 'Seramik Köşesi',
    isletmeTuru: 'Şahıs',
    vergiNo: '5544332211',
    kategoriler: ['Seramik & Cam'],
    banka: 'İş Bankası',
    iban: 'TR12 0006 4000 0000 0000 0003 00',
    magazaAciklama: 'El yapımı seramik kap ve dekoratif objeler.',
    basvuruTarihi: '2026-04-19',
    durum: 'onaylandi',
  },
  {
    id: 'BAS-004',
    ad: 'Ali', soyad: 'Çelik',
    email: 'ali.celik@email.com',
    telefon: '0566 444 55 66',
    hesapTuru: 'satici',
    magazaAdi: 'Çelik Tekstil',
    isletmeTuru: 'Şirket',
    vergiNo: '1122334455',
    kategoriler: ['Tekstil & Giyim'],
    banka: 'Akbank',
    iban: 'TR12 0004 6000 0000 0000 0004 00',
    magazaAciklama: 'Organik pamuk ile üretilmiş giyim ürünleri.',
    basvuruTarihi: '2026-04-18',
    durum: 'reddedildi',
  },
]

const RED_SEBEPLERI = [
  'Eksik belge',
  'Hatalı kimlik bilgisi',
  'Geçersiz vergi numarası',
  'Uygun kategori değil',
  'Sahte belge şüphesi',
  'Diğer',
]

const durumRenk = {
  bekliyor: 'bg-amber-100 text-amber-700',
  onaylandi: 'bg-green-100 text-green-700',
  reddedildi: 'bg-red-100 text-red-700',
}

const durumLabel = {
  bekliyor: 'Bekliyor',
  onaylandi: 'Onaylandı',
  reddedildi: 'Reddedildi',
}

function RedModal({ basvuru, onKapat, onOnayla }) {
  const [sebep, setSebep] = useState('')
  const [aciklama, setAciklama] = useState('')

  if (!basvuru) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-500" />
            <h2 className="text-base font-bold text-stone-900">Reddetme Sebebi</h2>
          </div>
          <button onClick={onKapat} className="text-stone-400 hover:text-stone-700 transition">
            <XCircle size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-xs text-red-600">
            <strong>{basvuru.magazaAdi}</strong> başvurusu reddedilecek. Bu işlem satıcıya bildirim olarak iletilecektir.
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
              Red Sebebi <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {RED_SEBEPLERI.map(s => (
                <label key={s} className={`flex items-center gap-3 px-4 py-2.5 border rounded-lg cursor-pointer transition ${
                  sebep === s ? 'border-red-400 bg-red-50' : 'border-stone-200 hover:border-stone-400'
                }`}>
                  <input
                    type="radio"
                    name="sebep"
                    value={s}
                    checked={sebep === s}
                    onChange={() => setSebep(s)}
                    className="accent-red-500"
                  />
                  <span className="text-sm text-stone-700">{s}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
              Detaylı Açıklama <span className="text-stone-400">(İsteğe bağlı)</span>
            </label>
            <textarea
              value={aciklama}
              onChange={e => setAciklama(e.target.value)}
              rows={3}
              placeholder="Satıcıya iletilecek ek açıklama..."
              className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-stone-400 transition resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-stone-100 flex gap-3">
          <button
            onClick={onKapat}
            className="flex-1 py-2.5 border border-stone-200 text-stone-600 rounded-xl text-sm font-medium hover:bg-stone-50 transition"
          >
            Vazgeç
          </button>
          <button
            onClick={() => onOnayla(basvuru.id)}
            disabled={!sebep}
            className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reddi Onayla
          </button>
        </div>
      </div>
    </div>
  )
}

function DetayModal({ basvuru, onKapat, onOnayla, onReddetTikla }) {
  if (!basvuru) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div>
            <h2 className="text-lg font-bold text-stone-900">{basvuru.magazaAdi}</h2>
            <p className="text-xs text-stone-400">{basvuru.id} · {basvuru.basvuruTarihi}</p>
          </div>
          <button onClick={onKapat} className="text-stone-400 hover:text-stone-700 transition">
            <XCircle size={22} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <User size={13} /> Temel Bilgiler
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-stone-50 rounded-lg px-4 py-3">
                <p className="text-xs text-stone-400 mb-0.5">Ad Soyad</p>
                <p className="font-medium">{basvuru.ad} {basvuru.soyad}</p>
              </div>
              <div className="bg-stone-50 rounded-lg px-4 py-3">
                <p className="text-xs text-stone-400 mb-0.5">Hesap Türü</p>
                <p className="font-medium">{basvuru.hesapTuru === 'atolye' ? 'Atölye Satıcısı' : 'Bireysel Satıcı'}</p>
              </div>
              <div className="bg-stone-50 rounded-lg px-4 py-3">
                <p className="text-xs text-stone-400 mb-0.5">E-posta</p>
                <p className="font-medium">{basvuru.email}</p>
              </div>
              <div className="bg-stone-50 rounded-lg px-4 py-3">
                <p className="text-xs text-stone-400 mb-0.5">Telefon</p>
                <p className="font-medium">{basvuru.telefon}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Store size={13} /> Mağaza Bilgileri
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-stone-50 rounded-lg px-4 py-3">
                <p className="text-xs text-stone-400 mb-0.5">İşletme Türü</p>
                <p className="font-medium">{basvuru.isletmeTuru}</p>
              </div>
              <div className="bg-stone-50 rounded-lg px-4 py-3">
                <p className="text-xs text-stone-400 mb-0.5">Vergi No</p>
                <p className="font-medium font-mono">{basvuru.vergiNo}</p>
              </div>
              <div className="bg-stone-50 rounded-lg px-4 py-3 col-span-2">
                <p className="text-xs text-stone-400 mb-0.5">Kategoriler</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {basvuru.kategoriler.map(k => (
                    <span key={k} className="px-2 py-0.5 bg-stone-200 text-stone-700 rounded text-xs">{k}</span>
                  ))}
                </div>
              </div>
              <div className="bg-stone-50 rounded-lg px-4 py-3 col-span-2">
                <p className="text-xs text-stone-400 mb-0.5">Mağaza Açıklaması</p>
                <p className="font-medium text-sm">{basvuru.magazaAciklama}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <CreditCard size={13} /> Banka Bilgileri
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-stone-50 rounded-lg px-4 py-3">
                <p className="text-xs text-stone-400 mb-0.5">Banka</p>
                <p className="font-medium">{basvuru.banka}</p>
              </div>
              <div className="bg-stone-50 rounded-lg px-4 py-3">
                <p className="text-xs text-stone-400 mb-0.5">IBAN</p>
                <p className="font-medium font-mono text-xs">{basvuru.iban}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <FileText size={13} /> Belgeler
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {['Kimlik Ön Yüz', 'Kimlik Arka Yüz', 'İşletme Belgesi'].map(b => (
                <div key={b} className="border-2 border-dashed border-stone-200 rounded-lg p-4 text-center">
                  <FileText size={20} className="text-stone-300 mx-auto mb-1" />
                  <p className="text-xs text-stone-500">{b}</p>
                  <button className="text-[10px] text-amber-500 hover:underline mt-1">İncele</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {basvuru.durum === 'bekliyor' && (
          <div className="px-6 py-4 border-t border-stone-100 flex gap-3">
            <button
              onClick={() => onReddetTikla(basvuru)}
              className="flex-1 flex items-center justify-center gap-2 py-3 border border-red-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition"
            >
              <XCircle size={16} /> Reddet
            </button>
            <button
              onClick={() => onOnayla(basvuru.id)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition"
            >
              <CheckCircle size={16} /> Onayla
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function AdminSellers() {
  const [basvurular, setBasvurular] = useState(MOCK_BASVURULAR)
  const [seciliBasvuru, setSeciliBasvuru] = useState(null)
  const [redModalBasvuru, setRedModalBasvuru] = useState(null)
  const [aramaMetni, setAramaMetni] = useState('')
  const [durumFiltre, setDurumFiltre] = useState('hepsi')

  const handleOnayla = (id) => {
    setBasvurular(prev => prev.map(b => b.id === id ? { ...b, durum: 'onaylandi' } : b))
    setSeciliBasvuru(null)
  }

  const handleReddetTikla = (basvuru) => {
    setSeciliBasvuru(null)
    setRedModalBasvuru(basvuru)
  }

  const handleReddiOnayla = (id) => {
    setBasvurular(prev => prev.map(b => b.id === id ? { ...b, durum: 'reddedildi' } : b))
    setRedModalBasvuru(null)
  }

  const filtrelenmis = basvurular.filter(b => {
    const aramaUyumu =
      b.ad.toLowerCase().includes(aramaMetni.toLowerCase()) ||
      b.magazaAdi.toLowerCase().includes(aramaMetni.toLowerCase()) ||
      b.email.toLowerCase().includes(aramaMetni.toLowerCase())
    const durumUyumu = durumFiltre === 'hepsi' || b.durum === durumFiltre
    return aramaUyumu && durumUyumu
  })

  const bekleyenSayi = basvurular.filter(b => b.durum === 'bekliyor').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Satıcı Başvuruları</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            {bekleyenSayi > 0 && (
              <span className="text-amber-600 font-medium">{bekleyenSayi} bekleyen başvuru · </span>
            )}
            Toplam {basvurular.length} başvuru
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center border border-stone-200 rounded-lg px-3 py-2 gap-2 bg-white w-64">
          <Search size={15} className="text-stone-400" />
          <input
            type="text"
            placeholder="Ad, mağaza veya e-posta..."
            value={aramaMetni}
            onChange={e => setAramaMetni(e.target.value)}
            className="text-sm outline-none flex-1 bg-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          {['hepsi', 'bekliyor', 'onaylandi', 'reddedildi'].map(d => (
            <button
              key={d}
              onClick={() => setDurumFiltre(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                durumFiltre === d
                  ? 'bg-stone-900 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'
              }`}
            >
              {d === 'hepsi' ? 'Hepsi' : durumLabel[d]}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-bold text-stone-500 uppercase tracking-wider">Başvuran</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-stone-500 uppercase tracking-wider">Mağaza</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-stone-500 uppercase tracking-wider">Tür</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-stone-500 uppercase tracking-wider">Tarih</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-stone-500 uppercase tracking-wider">Durum</th>
              <th className="text-right px-5 py-3 text-xs font-bold text-stone-500 uppercase tracking-wider">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtrelenmis.map(b => (
              <tr key={b.id} className="hover:bg-stone-50 transition">
                <td className="px-5 py-4">
                  <p className="font-medium text-stone-900">{b.ad} {b.soyad}</p>
                  <p className="text-xs text-stone-400">{b.email}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="font-medium text-stone-800">{b.magazaAdi}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {b.kategoriler.slice(0, 2).map(k => (
                      <span key={k} className="text-[10px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded">{k}</span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs text-stone-600">{b.hesapTuru === 'atolye' ? 'Atölye' : 'Bireysel'}</span>
                </td>
                <td className="px-5 py-4 text-xs text-stone-500">{b.basvuruTarihi}</td>
                <td className="px-5 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${durumRenk[b.durum]}`}>
                    {durumLabel[b.durum]}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSeciliBasvuru(b)}
                      className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition"
                      title="İncele"
                    >
                      <Eye size={16} />
                    </button>
                    {b.durum === 'bekliyor' && (
                      <>
                        <button
                          onClick={() => handleReddetTikla(b)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition"
                          title="Reddet"
                        >
                          <XCircle size={16} />
                        </button>
                        <button
                          onClick={() => handleOnayla(b.id)}
                          className="p-1.5 rounded-lg hover:bg-green-50 text-green-400 hover:text-green-600 transition"
                          title="Onayla"
                        >
                          <CheckCircle size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtrelenmis.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-stone-400 text-sm">
                  Başvuru bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DetayModal
        basvuru={seciliBasvuru}
        onKapat={() => setSeciliBasvuru(null)}
        onOnayla={handleOnayla}
        onReddetTikla={handleReddetTikla}
      />

      <RedModal
        basvuru={redModalBasvuru}
        onKapat={() => setRedModalBasvuru(null)}
        onOnayla={handleReddiOnayla}
      />
    </div>
  )
}

export default AdminSellers