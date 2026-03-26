import { useState } from 'react'

import phone1 from '../../assets/phone-1.jpeg'
import phone2 from '../../assets/phone-2.jpeg'
import phone3 from '../../assets/phone-3.jpeg'
import hphone1 from '../../assets/hphone-1.jpeg'
import hphone2 from '../../assets/hphone-2.jpeg'
import phone4 from '../../assets/phone-4.jpeg'
import phone5 from '../../assets/phone-5.jpeg'
import phone6 from '../../assets/phone-6.jpeg'
import phone7 from '../../assets/phone-7.jpeg'

const urunler = [
  { isim: 'TELEFON NO.1', fiyat: '67.000TL', gorseller: [phone1, phone2, phone3] },
  { isim: 'KULAKLIK NO.1', fiyat: '12.000TL', gorseller: [hphone1, hphone2] },
  { isim: 'TELEFON NO.2', fiyat: '56.000TL', gorseller: [phone4, phone5] },
  { isim: 'TELEFON NO.3', fiyat: '9.000TL', gorseller: [phone6, phone7] },
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
    <div className="min-w-[260px] cursor-pointer group">
      <div className="relative bg-stone-100 w-full h-72 mb-3 overflow-hidden">
        <img
          src={urun.gorseller[aktifIndex]}
          alt={urun.isim}
          className="object-cover w-full h-full transition duration-300"
        />
        <button
          onClick={onceki}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-7 h-7 flex items-center justify-center text-stone-700 shadow transition"
        >
          ‹
        </button>
        <button
          onClick={sonraki}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-7 h-7 flex items-center justify-center text-stone-700 shadow transition"
        >
          ›
        </button>
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

function Home() {
  return (
    <div className="bg-stone-50">

      {/* Hero Banner */}
      <div className="relative w-full h-96 overflow-hidden">
        <img
          src={phone1}
          alt="hero"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center px-4">
          <p className="text-xs tracking-widest mb-2">ONLINE ALIŞVERİŞTE</p>
          <h1 className="text-4xl font-bold mb-4">En Yeni Ürün, En İyi Fiyat.</h1>
          <p className="text-sm max-w-xl text-stone-200">
            Hayatınızı kolaylaştıran ürünleri keşfedin.
          </p>
        </div>
      </div>

      {/* Ürün Slider */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-sm font-bold tracking-widest mb-6">TEKNOLOJİK ÜRÜNLER:</h2>
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
          {urunler.map((urun, index) => (
            <UrunKarti key={index} urun={urun} />
          ))}
        </div>
      </div>

    </div>
  )
}

export default Home