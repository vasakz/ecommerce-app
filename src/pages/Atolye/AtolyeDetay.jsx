// Gerekli görselleri import ediyoruz
import deriAtolye1 from '../../assets/deri-atolye1.jpeg'
import atolyeden from '../../assets/atolyeden.jpeg'

export default function AtolyeDetay() {
  return (
    <div className="bg-stone-50 min-h-screen pb-20">
      
      {/* 1. Kapak ve Profil Bölümü */}
      <div className="relative w-full h-80 bg-stone-800">
        <img src={atolyeden} alt="Kapak" className="w-full h-full object-cover opacity-60" />
        
        {/* Yuvarlak Profil Avatarı */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 md:left-24 md:translate-x-0 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="w-40 h-40 rounded-full border-4 border-stone-50 overflow-hidden shadow-xl bg-stone-200">
            <img src={deriAtolye1} alt="Mila Usta" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* 2. Usta Bilgileri ve İstatistikler */}
      <div className="max-w-7xl mx-auto px-6 pt-24 md:pt-12 md:pl-72 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-stone-200 pb-8">
        <div>
          <h1 className="text-3xl font-serif text-stone-800 mb-1">Mila Vintage Deri</h1>
          <p className="text-sm font-semibold tracking-widest text-amber-600 uppercase mb-3">El Yapımı Çanta & Zanaat</p>
          
          <div className="flex items-center gap-2 text-stone-500 text-sm">
            {/* Yıldız İkonu */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-500">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-stone-800">4.9</span> (128 Değerlendirme)
            <span className="mx-2 text-stone-300">•</span>
            <span>İstanbul, Türkiye</span>
          </div>
        </div>
        
        {/* Güven Veren İstatistik Kutusu */}
        <div className="flex gap-8 text-center bg-white px-6 py-4 rounded-md shadow-sm border border-stone-100 w-full md:w-auto">
          <div>
            <p className="text-2xl font-serif text-stone-800">15+</p>
            <p className="text-[10px] tracking-widest text-stone-500 uppercase">Yıllık Tecrübe</p>
          </div>
          <div className="w-px bg-stone-200"></div>
          <div>
            <p className="text-2xl font-serif text-stone-800">340</p>
            <p className="text-[10px] tracking-widest text-stone-500 uppercase">Tamamlanan İş</p>
          </div>
        </div>
      </div>

      {/* Bir sonraki adım buraya gelecek */}

    </div>
  )
}