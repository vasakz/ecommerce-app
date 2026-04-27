import { useState } from 'react'
import { Eye, MoreHorizontal, Search, Filter } from 'lucide-react'

const MOCK_KULLANICILAR = [
  { id: 'USR-001', ad: 'Merve Nur', soyad: 'Karaca', email: 'merve@brand.com', rol: 'Yönetici', durum: 'Aktif' },
  { id: 'USR-002', ad: 'Ahmet', soyad: 'Yılmaz', email: 'ahmet.y@email.com', rol: 'Müşteri', durum: 'Aktif' },
  { id: 'USR-003', ad: 'Zeynep', soyad: 'Kaya', email: 'zeynep.kaya@email.com', rol: 'Müşteri', durum: 'Pasif' },
]

export default function AdminUsers() {
  // Arama ve filtreleme için şimdilik boş state'ler
  const [arama, setArama] = useState('')

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      
      {/* Üst Kısım: Başlık */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-800">Kullanıcılar</h1>
        <p className="text-sm text-stone-500 mt-1">Sistemdeki tüm müşterileri ve yöneticileri görüntüleyin.</p>
      </div>

      {/* Araç Çubuğu: Arama ve Filtre */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="İsim veya e-posta ara..."
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 text-stone-600 px-4 py-2 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors text-sm font-medium">
          <Filter size={18} />
          <span>Role Göre Filtrele</span>
        </button>
      </div>

      {/* Tablo */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-stone-50 text-stone-500 font-medium border-b border-stone-200">
              <tr>
                <th className="px-6 py-4">Kullanıcı</th>
                <th className="px-6 py-4">E-posta</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {MOCK_KULLANICILAR.map((kullanici) => (
                <tr key={kullanici.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-stone-800">
                    {kullanici.ad} {kullanici.soyad}
                  </td>
                  <td className="px-6 py-4 text-stone-600">{kullanici.email}</td>
                  <td className="px-6 py-4 text-stone-600">{kullanici.rol}</td>
                  <td className="px-6 py-4 text-stone-600">{kullanici.durum}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-stone-400 hover:text-amber-500 transition-colors">
                        <Eye size={18} />
                      </button>
                      <button className="text-stone-400 hover:text-stone-600 transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}