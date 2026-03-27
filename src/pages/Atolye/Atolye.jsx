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

  return (
    <div className="w-[260px] flex-shrink-0 cursor-pointer group">
      <div className="relative bg-stone-100 w-[260px] h-[260px] mb-3 overflow-hidden">
        <img
          src={urun.gorseller[aktifIndex]}
          alt={urun.isim}
          className="object-cover w-full h-full transition duration-300"
        />

        {/* Sol Ok */}
        <button
          onClick={onceki}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-7 h-7 flex items-center justify-center text-stone-700 shadow transition"
        >
          ‹
        </button>

        {/* Sağ Ok */}
        <button
          onClick={sonraki}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-7 h-7 flex items-center justify-center text-stone-700 shadow transition"
        >
          ›
        </button>

        {/* Nokta göstergesi */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {urun.gorseller.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition ${i === aktifIndex ? 'bg-stone-800' : 'bg-stone-400'}`}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center text-xs px-1">
        <p className="font-medium tracking-wide">{urun.isim}</p>
        <p className="text-stone-500">{urun.fiyat}</p>
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