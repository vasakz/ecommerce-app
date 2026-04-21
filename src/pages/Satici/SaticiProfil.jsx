import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { atolyelerVerisi } from '../../data/atolyeData'

function BilgiKart({ baslik, deger }) {
  return (
    <div className="rounded-lg border border-stone-100 bg-white p-4">
      <p className="text-[10px] font-semibold tracking-widest uppercase text-stone-400 mb-2">{baslik}</p>
      <p className="text-sm font-medium text-stone-700">{deger}</p>
    </div>
  )
}

function YildizSatiri({ adet, toplam, etiket }) {
  const oran = toplam > 0 ? Math.round((adet / toplam) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="w-14 text-xs text-stone-500">{etiket}</span>
      <div className="h-2 flex-1 rounded-full bg-stone-100 overflow-hidden">
        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${oran}%` }} />
      </div>
      <span className="w-10 text-right text-xs text-stone-400">{adet}</span>
    </div>
  )
}

function SaticiProfil() {
  const [aktifDegerlendirme, setAktifDegerlendirme] = useState('urun')
  const { id } = useParams()
  const atolye = atolyelerVerisi.find((item) => item.id === id)

  if (!atolye) {
    return <Navigate to="/404" replace />
  }

  const toplamYorum = atolye.degerlendirmeSayisi || 0
  const puan = Number(atolye.puan || 0)
  const puanDagilimi = [
    { etiket: '5 yıldız', adet: Math.round(toplamYorum * 0.62) },
    { etiket: '4 yıldız', adet: Math.round(toplamYorum * 0.22) },
    { etiket: '3 yıldız', adet: Math.round(toplamYorum * 0.1) },
    { etiket: '2 yıldız', adet: Math.round(toplamYorum * 0.04) },
    { etiket: '1 yıldız', adet: Math.max(0, toplamYorum - Math.round(toplamYorum * 0.98)) },
  ]

  const yorumlar = [
    {
      id: 1,
      isim: 'Aylin S.',
      puan: 5,
      tarih: '2 gün önce',
      metin: 'İletişim hızlı, paketleme özenliydi. Ürün fotoğraftakiyle birebir geldi.',
    },
    {
      id: 2,
      isim: 'Burak Y.',
      puan: 5,
      tarih: '1 hafta önce',
      metin: 'Atölye sorularımı kısa sürede yanıtladı. İşçilik çok temiz, tavsiye ederim.',
    },
    {
      id: 3,
      isim: 'Zeynep K.',
      puan: 4,
      tarih: '2 hafta önce',
      metin: 'Kargo süreci sorunsuzdu. Ürün kalitesi iyi, tekrar sipariş verebilirim.',
    },
  ]

  const saticiYorumlari = [
    {
      id: 1,
      isim: 'Merve A.',
      puan: 5,
      tarih: '1 gün önce',
      metin: 'Mesajlara çok hızlı dönüş yaptı, sipariş sürecini adım adım bilgilendirdi.',
    },
    {
      id: 2,
      isim: 'Can T.',
      puan: 4,
      tarih: '5 gün önce',
      metin: 'Nazik ve ilgili bir satıcı. Kargolama söz verdiği tarihte yapıldı.',
    },
    {
      id: 3,
      isim: 'Elif D.',
      puan: 5,
      tarih: '9 gün önce',
      metin: 'Özelleştirme talebimi dikkatle dinledi ve tam istediğim gibi hazırladı.',
    },
  ]

  return (
    <div className="bg-stone-50 min-h-screen pb-16">
      <div className="max-w-6xl mx-auto px-6 pt-10">
        <Link
          to={`/atolyeler/${atolye.id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-stone-500 hover:text-stone-800 transition-colors mb-6"
        >
          <span>‹</span>
          Atölye Sayfası
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-stone-100">
                <img src={atolye.avatar} alt={atolye.isim} className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-3xl font-serif text-stone-800">{atolye.isim}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-amber-600 font-bold">{atolye.puan}</span>
                  <span className="text-xs text-stone-400">Satıcı profili</span>
                </div>
              </div>
            </div>
            <button className="inline-flex items-center justify-center text-xs font-semibold tracking-widest text-stone-600 uppercase bg-white border border-stone-200 px-6 py-2.5 rounded-full hover:bg-stone-50 hover:border-stone-300 transition-colors">
              Takip Et
            </button>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-xl shadow-sm border border-stone-100 p-6">
          <div className="flex gap-2 mb-5">
            <button className="text-xs px-4 py-2 rounded-md bg-stone-100 text-stone-700 font-semibold">Ana sayfa</button>
            <button className="text-xs px-4 py-2 rounded-md text-stone-500 hover:bg-stone-50 transition-colors">Koleksiyon</button>
            <button className="text-xs px-4 py-2 rounded-md text-stone-500 hover:bg-stone-50 transition-colors">Yorumlar</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <BilgiKart baslik="Atölye Deneyimi" deger="2 yıl" />
            <BilgiKart baslik="Konum" deger={atolye.lokasyon} />
            <BilgiKart baslik="Üretim Modeli" deger={atolye.uretim || 'El yapımı'} />
            <BilgiKart baslik="Ortalama Kargolama" deger={atolye.teslimat || '24-48 saat içinde'} />
          </div>

          <div className="mt-6 rounded-lg border border-stone-100 p-5">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-stone-400 mb-3">Hikaye</p>
            <p className="text-sm leading-relaxed text-stone-600">{atolye.hikaye || atolye.aciklama}</p>
          </div>

          <div className="mt-6 rounded-lg border border-stone-100 p-5">
            <div className="flex items-center justify-between gap-3 flex-wrap border-b border-stone-100 pb-4">
              <div className="flex gap-3">
                <button
                  onClick={() => setAktifDegerlendirme('urun')}
                  className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${
                    aktifDegerlendirme === 'urun'
                      ? 'text-amber-700 border-amber-500'
                      : 'text-stone-400 border-transparent hover:text-stone-600'
                  }`}
                >
                  Ürün Değerlendirmeleri
                </button>
                <button
                  onClick={() => setAktifDegerlendirme('satici')}
                  className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${
                    aktifDegerlendirme === 'satici'
                      ? 'text-amber-700 border-amber-500'
                      : 'text-stone-400 border-transparent hover:text-stone-600'
                  }`}
                >
                  Satıcı Değerlendirmeleri
                </button>
              </div>
              <p className="text-xs text-stone-400">{toplamYorum} değerlendirme</p>
            </div>

            <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 rounded-lg border border-stone-100 p-4 bg-stone-50/60">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl font-light text-stone-800">{puan.toFixed(1)}</span>
                  <div>
                    <p className="text-amber-500 text-base">★★★★★</p>
                    <p className="text-xs text-stone-400">Son yorumlara göre ortalama puan</p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {puanDagilimi.map((satir) => (
                    <YildizSatiri key={satir.etiket} etiket={satir.etiket} adet={satir.adet} toplam={toplamYorum} />
                  ))}
                </div>
              </div>

              <div className="lg:col-span-8">
                <div className="space-y-3">
                  {(aktifDegerlendirme === 'urun' ? yorumlar : saticiYorumlari).map((yorum) => (
                    <div key={yorum.id} className="rounded-lg border border-stone-100 p-4">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-stone-700">{yorum.isim}</p>
                        <span className="text-xs text-stone-400">{yorum.tarih}</span>
                      </div>
                      <p className="text-amber-500 text-sm mt-1">{'★'.repeat(yorum.puan)}{'☆'.repeat(5 - yorum.puan)}</p>
                      <p className="text-sm text-stone-600 mt-2 leading-relaxed">{yorum.metin}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SaticiProfil
