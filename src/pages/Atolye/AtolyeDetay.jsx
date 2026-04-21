import { Link, Navigate, useParams } from 'react-router-dom'

import { atolyelerVerisi } from '../../data/atolyeData'

function AtolyeDetay() {
  const { id } = useParams()
  const atolye = atolyelerVerisi.find((item) => item.id === id)

  if (!atolye) {
    return <Navigate to="/404" replace />
  }

  return (
    <div className="bg-stone-50 min-h-screen pb-16">
      <div className="max-w-6xl mx-auto px-6 pt-10">
        <div className="mb-8">
          <Link
            to="/atolyeler"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-stone-500 hover:text-stone-800 transition-colors"
          >
            <span>‹</span>
            Tüm Atölyeler
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="relative w-full h-56 md:h-72 overflow-hidden">
            <img src={atolye.heroBanner} alt={atolye.heroBannerAlt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="text-white/60 text-[10px] uppercase tracking-widest">{atolye.kategori} · {atolye.lokasyon}</span>
                <h1 className="text-white text-3xl font-serif mt-1">{atolye.isim}</h1>
              </div>
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-amber-400">
                  <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                </svg>
                <span className="text-white text-xs font-bold">{atolye.puan}</span>
                <span className="text-white/60 text-[10px]">({atolye.degerlendirmeSayisi})</span>
              </div>
            </div>
          </div>

          <div className="px-8 py-6 border-b border-stone-100">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 flex-shrink-0 ring-2 ring-stone-100 rounded-full shadow-sm overflow-hidden bg-white">
                    <img src={atolye.avatar} alt={atolye.isim} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed">{atolye.aciklama}</p>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed">{atolye.hikaye || atolye.aciklama}</p>
              </div>

              <div className="lg:col-span-1">
                <div className="border border-stone-100 rounded-lg p-4 bg-stone-50/40">
                  <p className="text-[10px] font-bold tracking-[0.25em] text-stone-400 uppercase mb-3">Atölye</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between gap-3">
                      <span className="text-stone-400">Kategori</span>
                      <span className="font-medium text-stone-700">{atolye.kategori}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-stone-400">Konum</span>
                      <span className="font-medium text-stone-700">{atolye.lokasyon}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-stone-400">Üretim</span>
                      <span className="font-medium text-stone-700">{atolye.uretim || 'El yapımı'}</span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2.5">
                    <button className="w-full flex items-center justify-center gap-2 text-xs font-semibold tracking-widest text-stone-600 uppercase bg-white border border-stone-200 px-6 py-2.5 rounded-full hover:bg-stone-50 hover:border-stone-300 transition-colors">
                      Takip Et
                    </button>
                    <Link
                      to={`/satici/profil/${atolye.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold tracking-widest text-stone-600 uppercase bg-white border border-stone-200 px-6 py-2.5 rounded-full hover:bg-stone-50 hover:border-stone-300 transition-colors"
                    >
                      Satıcı Profili
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-7">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold tracking-widest uppercase text-stone-800">Atölye Ürünleri</h2>
              <span className="text-xs text-stone-500">{atolye.urunler.length} ürün</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {atolye.urunler.map((urun) => (
                <Link
                  key={urun.id}
                  to={`/atolye-urun/${urun.id}`}
                  state={{ urun }}
                  className="group border border-stone-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square bg-stone-100 overflow-hidden">
                    <img
                      src={urun.gorseller?.[0] || urun.gorsel}
                      alt={urun.isim}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-stone-800 line-clamp-1">{urun.isim}</p>
                    <p className="text-sm font-bold text-stone-900 mt-1">{urun.fiyat}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AtolyeDetay
