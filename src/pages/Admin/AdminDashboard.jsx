import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { Users, ShoppingBag, Package, Store, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react'

const gelirData = [
  { ay: 'Oca', gelir: 42000, siparis: 180 },
  { ay: 'Sub', gelir: 38000, siparis: 155 },
  { ay: 'Mar', gelir: 55000, siparis: 220 },
  { ay: 'Nis', gelir: 61000, siparis: 265 },
  { ay: 'May', gelir: 49000, siparis: 198 },
  { ay: 'Haz', gelir: 72000, siparis: 310 },
  { ay: 'Tem', gelir: 68000, siparis: 290 },
  { ay: 'Agu', gelir: 75000, siparis: 325 },
  { ay: 'Eyl', gelir: 83000, siparis: 360 },
  { ay: 'Eki', gelir: 91000, siparis: 410 },
  { ay: 'Kas', gelir: 105000, siparis: 480 },
  { ay: 'Ara', gelir: 125000, siparis: 560 },
]

const kategoriData = [
  { name: 'Deri & Aksesuar', value: 32 },
  { name: 'Tekstil & Giyim', value: 25 },
  { name: 'Ev & Dekor', value: 18 },
  { name: 'Seramik & Cam', value: 12 },
  { name: 'Ahsap', value: 8 },
  { name: 'Diger', value: 5 },
]

const RENKLER = ['#292524', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899']

const sonSiparisler = [
  { id: 'ORD-9921', musteri: 'Ayse D.', tutar: 3500, durum: 'Teslim Edildi' },
  { id: 'ORD-9920', musteri: 'Mehmet K.', tutar: 1200, durum: 'Kargoda' },
  { id: 'ORD-9919', musteri: 'Fatma Y.', tutar: 8900, durum: 'Hazirlaniyor' },
  { id: 'ORD-9918', musteri: 'Ali C.', tutar: 2400, durum: 'Teslim Edildi' },
  { id: 'ORD-9917', musteri: 'Zeynep A.', tutar: 5600, durum: 'Iptal Edildi' },
]

const durumRenk = {
  'Teslim Edildi': 'bg-green-100 text-green-700',
  'Kargoda': 'bg-blue-100 text-blue-700',
  'Hazirlaniyor': 'bg-amber-100 text-amber-700',
  'Iptal Edildi': 'bg-red-100 text-red-700',
}

function StatKart({ baslik, deger, alt, ikon, renk, trend, trendDeger }) {
  const Ikon = ikon
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-stone-500 font-medium">{baslik}</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${renk}`}>
          <Ikon size={18} />
        </div>
      </div>
      <p className="text-2xl font-black text-stone-900 mb-1">{deger}</p>
      <div className="flex items-center gap-1.5">
        {trend === 'up'
          ? <TrendingUp size={13} className="text-green-500" />
          : <TrendingDown size={13} className="text-red-500" />
        }
        <span className={`text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trendDeger}
        </span>
        <span className="text-xs text-stone-400">{alt}</span>
      </div>
    </div>
  )
}

function AdminDashboard() {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>
        <p className="text-sm text-stone-500 mt-0.5">Platform genelindeki anlık verilere genel bakış</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatKart baslik="Toplam Kullanıcı" deger="12.483" alt="geçen aya göre" ikon={Users} renk="bg-blue-50 text-blue-600" trend="up" trendDeger="+8.2%" />
        <StatKart baslik="Toplam Sipariş" deger="4.921" alt="geçen aya göre" ikon={ShoppingBag} renk="bg-amber-50 text-amber-600" trend="up" trendDeger="+12.5%" />
        <StatKart baslik="Aktif Ürün" deger="8.764" alt="geçen aya göre" ikon={Package} renk="bg-green-50 text-green-600" trend="up" trendDeger="+3.1%" />
        <StatKart baslik="Aktif Satıcı" deger="342" alt="geçen aya göre" ikon={Store} renk="bg-purple-50 text-purple-600" trend="down" trendDeger="-2.4%" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-xl border border-stone-200 p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-stone-900">Aylık Gelir</h2>
              <p className="text-xs text-stone-400 mt-0.5">Son 12 ay</p>
            </div>
            <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2.5 py-1 rounded-lg">
              <ArrowUpRight size={14} />
              <span className="text-xs font-bold">+18.3%</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={gelirData}>
              <defs>
                <linearGradient id="gelirGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
              <XAxis dataKey="ay" tick={{ fontSize: 11, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#a8a29e' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => [`${v.toLocaleString('tr-TR')} TL`, 'Gelir']} contentStyle={{ borderRadius: 8, border: '1px solid #e7e5e4', fontSize: 12 }} />
              <Area type="monotone" dataKey="gelir" stroke="#f59e0b" strokeWidth={2} fill="url(#gelirGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h2 className="text-base font-bold text-stone-900 mb-1">Kategori Dağılımı</h2>
          <p className="text-xs text-stone-400 mb-4">Satış yüzdesi</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={kategoriData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {kategoriData.map((entry, i) => (
                  <Cell key={entry.name} fill={RENKLER[i % RENKLER.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`%${v}`, '']} contentStyle={{ borderRadius: 8, border: '1px solid #e7e5e4', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {kategoriData.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: RENKLER[i] }} />
                  <span className="text-stone-600">{item.name}</span>
                </div>
                <span className="font-bold text-stone-800">%{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h2 className="text-base font-bold text-stone-900 mb-1">Aylık Sipariş</h2>
          <p className="text-xs text-stone-400 mb-4">Son 12 ay</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={gelirData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
              <XAxis dataKey="ay" tick={{ fontSize: 10, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e7e5e4', fontSize: 12 }} />
              <Bar dataKey="siparis" fill="#292524" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="xl:col-span-2 bg-white rounded-xl border border-stone-200 p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-stone-900">Son Siparişler</h2>
            <button className="text-xs text-amber-500 font-medium hover:underline">Tümünü Gör</button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100">
                <th className="text-left pb-3 text-xs font-bold text-stone-400 uppercase">Sipariş No</th>
                <th className="text-left pb-3 text-xs font-bold text-stone-400 uppercase">Müşteri</th>
                <th className="text-left pb-3 text-xs font-bold text-stone-400 uppercase">Tutar</th>
                <th className="text-left pb-3 text-xs font-bold text-stone-400 uppercase">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {sonSiparisler.map(s => (
                <tr key={s.id} className="hover:bg-stone-50 transition">
                  <td className="py-3 font-mono text-xs text-stone-600">{s.id}</td>
                  <td className="py-3 font-medium text-stone-800">{s.musteri}</td>
                  <td className="py-3 font-bold text-stone-900">{s.tutar.toLocaleString('tr-TR')} TL</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${durumRenk[s.durum] || 'bg-stone-100 text-stone-600'}`}>
                      {s.durum}
                    </span>
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

export default AdminDashboard