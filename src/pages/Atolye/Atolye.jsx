import { useState } from 'react'

import deri1 from '../../assets/deri-1.jpeg'
import deri2 from '../../assets/deri-2.jpeg'
import deri3 from '../../assets/deri-3.jpeg'
import deri4 from '../../assets/deri-4.jpeg'
import deri5 from '../../assets/deri-5.jpeg'
import deri6 from '../../assets/deri-6.jpeg'
import deri7 from '../../assets/deri-7.jpeg'
import deri8 from '../../assets/deri-8.jpeg'
import deri9 from '../../assets/deri-9.jpeg'
import deri10 from '../../assets/deri-10.jpeg'
import deri11 from '../../assets/deri-11.jpeg'
import deri12 from '../../assets/deri-12.jpeg'
import atolyeden from '../../assets/atolyeden.jpeg'

const urunler = [
  { isim: 'DERİ ÇANTA NO.1', fiyat: '1200TL', gorseller: [deri1, deri2, deri3, deri4] },
  { isim: 'DERİ ÇANTA NO.2', fiyat: '950TL', gorseller: [deri5, deri6, deri7] },
  { isim: 'DERİ ÇANTA NO.3', fiyat: '1100TL', gorseller: [deri8, deri9, deri10] },
  { isim: 'DERİ ÇANTA NO.4', fiyat: '850TL', gorseller: [deri11, deri12] },
]

function UrunKarti({ urun }) {
  const [aktifIndex, setAktifIndex] = useState(0)

  const onceki = () => {
    setAktifIndex((prev) => (prev === 0 ? urun.gorseller.length - 1 : prev - 1))
  }

  const sonraki = () => {
    setAktifIndex((prev) => (prev === urun.gorseller.length - 1 ? 0 : prev + 1))
  }

  // Yıldız oluşturma fonksiyonu (Statik 5 yıldız)
  const renderYildizlar = () => {
    return Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-amber-500">
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
      </svg>
    ))
  }

  return (
    <div className="w-[260px] flex-shrink-0 cursor-pointer group">
      <div className="relative bg-stone-100 w-[260px] h-[260px] mb-3 overflow-hidden rounded-md">
        <img
          src={urun.gorseller[aktifIndex]}
          alt={urun.isim}
          className="object-cover w-full h-full transition duration-500 group-hover:scale-105"
        />

        {/* Sol Ok - Sadece hover olunca görünür yapıldı */}
        <button
          onClick={onceki}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-7 h-7 flex items-center justify-center text-stone-700 shadow opacity-0 group-hover:opacity-100 transition"
        >
          ‹
        </button>

        {/* Sağ Ok - Sadece hover olunca görünür yapıldı */}
        <button
          onClick={sonraki}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-7 h-7 flex items-center justify-center text-stone-700 shadow opacity-0 group-hover:opacity-100 transition"
        >
          ›
        </button>

        {/* Nokta göstergesi */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {urun.gorseller.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition ${i === aktifIndex ? 'bg-stone-800' : 'bg-white/70'}`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col px-1">
        <p className="font-medium tracking-wide text-sm text-stone-800 line-clamp-1">{urun.isim}</p>
        
        {/* Senin İstediğin: Yıldızlar ve Değerlendirme Bölümü */}
        <div className="flex items-center gap-1 mt-1 mb-2">
          <div className="flex">{renderYildizlar()}</div>
          <span className="text-[10px] text-stone-500 font-medium">(12 Yorum)</span>
        </div>

        <div className="flex justify-between items-center mt-1">
          <p className="font-semibold text-stone-900">{urun.fiyat}</p>
          
          {/* Senin İstediğin: Sepete Ekle Butonu */}
          <button className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors" title="Sepete Ekle">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function Atolye() {
  return (
    <div className="bg-stone-50">

      {/* Hero Banner */}
      <div className="relative w-full h-96 overflow-hidden">
        <img
          src={atolyeden}
          alt="atolye"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center px-4">
          <p className="text-xs tracking-widest mb-2">ZEVKLİ TASARIMLAR</p>
          <h1 className="text-4xl font-bold mb-4">Atölyeden Evinize, Hikayesi Olan Tasarımlar.</h1>
          <p className="text-sm max-w-xl text-stone-200">
            Her bir detayında alın teri, her bir kıvrımında mükemmellik tutkusu var. Atölyemizin tozunda doğan özel koleksiyonları keşfedin.
          </p>
        </div>
      </div>

      {/* Ürün Slider */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-sm font-bold tracking-widest mb-6">BU HAFTA ÖNE ÇIKANLAR :</h2>
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
          {urunler.map((urun, index) => (
            <UrunKarti key={index} urun={urun} />
          ))}
        </div>
      </div>

    </div>
  )
}

export default Atolye