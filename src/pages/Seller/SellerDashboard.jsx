import { useState, useEffect } from 'react'
import { 
    LayoutDashboard, Package, ShoppingBag, 
    TrendingUp, Users, Star, ArrowUpRight,
    Search, Filter, ChevronRight, MoreHorizontal,
    Mail, Phone, MapPin, Globe, Calendar, Edit2,
    DollarSign, CreditCard, Activity, CheckCircle, Clock, AlertTriangle, FileText, Truck, XCircle
} from 'lucide-react'

const stats = [
    { 
        label: 'Toplam Satış', 
        value: '₺12,450', 
        trend: '+12.5%', 
        icon: DollarSign, 
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10',
        chartColor: '#10b981',
        chartData: [20, 45, 28, 80, 40, 90, 65]
    },
    { 
        label: 'Aktif Siparişler', 
        value: '18', 
        trend: '+3', 
        icon: ShoppingBag, 
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10',
        chartColor: '#f59e0b',
        chartData: [40, 30, 70, 50, 90, 60, 80]
    },
    { 
        label: 'Müşteri Puanı', 
        value: '4.9', 
        trend: '+0.2', 
        icon: Star, 
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        chartColor: '#3b82f6',
        chartData: [60, 70, 65, 80, 85, 90, 98]
    },
    { 
        label: 'Ziyaretçi', 
        value: '2.8k', 
        trend: '+18%', 
        icon: Users, 
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
        chartColor: '#a855f7',
        chartData: [30, 40, 60, 45, 80, 55, 95]
    },
]

const recentOrders = [
    { id: '#ORD-7234', customer: 'Ayşe Yılmaz', date: 'Bugün, 14:20', amount: '₺450.00', status: 'Yeni', avatar: 'AY' },
    { id: '#ORD-7233', customer: 'Mehmet Demir', date: 'Bugün, 11:45', amount: '₺820.00', status: 'Hazırlanıyor', avatar: 'MD' },
    { id: '#ORD-7230', customer: 'Selin Kaya', date: 'Dün, 18:10', amount: '₺2,150.00', status: 'Kargoda', avatar: 'SK' },
    { id: '#ORD-7228', customer: 'Can Berk', date: 'Dün, 15:30', amount: '₺120.00', status: 'Teslim Edildi', avatar: 'CB' },
]

const statusStyles = {
    'Yeni': 'bg-amber-100 text-amber-700',
    'Hazırlanıyor': 'bg-blue-100 text-blue-700',
    'Kargoda': 'bg-purple-100 text-purple-700',
    'Teslim Edildi': 'bg-emerald-100 text-emerald-700',
}

export default function SellerDashboard() {
    const [seller, setSeller] = useState({
        name: 'Hanımeli Atölyesi',
        owner: 'Aylin Şahin',
        email: 'info@hanimeli.com',
        phone: '+90 555 123 45 67',
        location: 'İstanbul, Türkiye',
        website: 'www.hanimeliatolye.com',
        bio: 'Doğal malzemelerle el yapımı dekorasyon ürünleri ve aksesuarlar üretiyoruz. Her ürünümüz bir hikaye taşır.',
        since: 'Temmuz 2022',
        rating: 4.9,
        reviews: 124,
        products: 42
    })

    const [isEditing, setIsEditing] = useState(false)

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Seller Header Section */}
            <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-[2.5rem] p-8 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                
                <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center border-4 border-white dark:border-stone-800 shadow-md overflow-hidden">
                             <div className="text-3xl font-serif font-bold text-amber-600">H</div>
                        </div>
                        <button className="absolute bottom-0 right-0 p-1.5 bg-white dark:bg-stone-800 rounded-full shadow-sm border border-stone-100 dark:border-stone-700 text-stone-400 hover:text-amber-600 transition-colors">
                            <Edit2 size={12} />
                        </button>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h1 className="text-2xl font-black text-stone-900 dark:text-white tracking-tight">{seller.name}</h1>
                                <p className="text-sm text-stone-400 flex items-center gap-1 mt-1 font-medium">
                                    <MapPin size={14} /> {seller.location} · {seller.since}'den beri
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button className="px-6 py-2.5 text-[11px] font-black tracking-widest uppercase border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-gray-400 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-2xl transition-all">
                                    Mağazayı Gör
                                </button>
                                <button 
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="px-6 py-2.5 text-[11px] font-black tracking-widest uppercase bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:opacity-90 rounded-2xl transition-all shadow-lg flex items-center gap-2"
                                >
                                    <Edit2 size={12} /> Düzenle
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-2">
                            <div className="flex items-center gap-2 text-stone-600 dark:text-gray-400 text-sm font-medium">
                                <Mail size={14} className="text-stone-300" />
                                <span>{seller.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-stone-600 dark:text-gray-400 text-sm font-medium">
                                <Phone size={14} className="text-stone-300" />
                                <span>{seller.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-stone-600 dark:text-gray-400 text-sm font-medium">
                                <Globe size={14} className="text-stone-300" />
                                <span>{seller.website}</span>
                            </div>
                            <div className="flex items-center gap-2 text-stone-600 dark:text-gray-400 text-sm font-medium">
                                <Calendar size={14} className="text-stone-300" />
                                <span>{seller.since}</span>
                            </div>
                        </div>

                        <p className="text-sm text-stone-500 dark:text-gray-400 leading-relaxed max-w-2xl bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl italic font-medium mt-2">
                            "{seller.bio}"
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon
                    return (
                        <div key={idx} className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
                            <div className="flex items-center justify-between mb-6 relative z-10">
                                <div className={`w-12 h-12 rounded-2xl ${stat.bgColor} flex items-center justify-center ${stat.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                    <Icon size={24} />
                                </div>
                                <div className={`flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                    <TrendingUp size={12} className={stat.trend.startsWith('+') ? '' : 'rotate-180'} />
                                    {stat.trend}
                                </div>
                            </div>
                            
                            <div className="space-y-1 relative z-10">
                                <p className="text-[11px] font-black tracking-widest text-stone-400 uppercase">{stat.label}</p>
                                <h3 className={`text-3xl font-black ${stat.color} tracking-tight`}>{stat.value}</h3>
                            </div>

                            <div className="mt-6 h-16 w-full relative">
                                <svg viewBox="0 0 100 40" className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                                    <defs>
                                        <linearGradient id={`grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={stat.chartColor} stopOpacity="0.4" />
                                            <stop offset="100%" stopColor={stat.chartColor} stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path 
                                        d={`M0,40 ${stat.chartData.map((val, i) => `L${(i * 100) / (stat.chartData.length - 1)},${40 - (val / 100) * 35}`).join(' ')} L100,40 Z`} 
                                        fill={`url(#grad-${idx})`}
                                    />
                                    <path 
                                        d={`M0,${40 - (stat.chartData[0] / 100) * 35} ${stat.chartData.map((val, i) => `L${(i * 100) / (stat.chartData.length - 1)},${40 - (val / 100) * 35}`).join(' ')}`} 
                                        fill="none" 
                                        stroke={stat.chartColor} 
                                        strokeWidth="3" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                        className="animate-draw"
                                    />
                                </svg>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-black tracking-[0.2em] text-stone-400 uppercase">Son Siparişler</h2>
                        <button className="text-[10px] font-black tracking-widest uppercase text-amber-600 hover:text-amber-700 transition-colors">Tümünü Gör</button>
                    </div>
                    
                    <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-[2.5rem] shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-stone-50/50 dark:bg-stone-800/50 border-b border-stone-100 dark:border-stone-800">
                                        <th className="px-6 py-4 text-[10px] font-black tracking-widest text-stone-400 uppercase">Müşteri</th>
                                        <th className="px-6 py-4 text-[10px] font-black tracking-widest text-stone-400 uppercase">Tarih</th>
                                        <th className="px-6 py-4 text-[10px] font-black tracking-widest text-stone-400 uppercase">Tutar</th>
                                        <th className="px-6 py-4 text-[10px] font-black tracking-widest text-stone-400 uppercase">Durum</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/50 transition-colors group">
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-xs font-black text-stone-600 dark:text-gray-400 border border-stone-200 dark:border-stone-700">
                                                        {order.avatar}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-stone-900 dark:text-white leading-none">{order.customer}</p>
                                                        <p className="text-[10px] font-bold text-stone-400 mt-1.5 uppercase tracking-tighter">{order.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <p className="text-xs font-bold text-stone-500">{order.date}</p>
                                            </td>
                                            <td className="px-6 py-6">
                                                <p className="text-sm font-black text-stone-900 dark:text-white">{order.amount}</p>
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className={`text-[10px] font-black px-2.5 py-1.5 rounded-lg uppercase tracking-wider ${statusStyles[order.status]}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6 text-right">
                                                <button className="p-2 text-stone-300 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-all">
                                                    <ChevronRight size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Progress / Checklist Card */}
                <div className="space-y-4">
                    <h2 className="text-xs font-black tracking-[0.2em] text-stone-400 uppercase">Mağaza Sağlığı</h2>
                    <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-[2.5rem] p-8 shadow-sm space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-xs font-black text-stone-800 dark:text-white uppercase tracking-wider">Tamamlanma</span>
                                <span className="text-lg font-black text-amber-600">%85</span>
                            </div>
                            <div className="h-3 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden p-1">
                                <div className="h-full bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" style={{ width: '85%' }}></div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-3 p-3 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100/50 dark:border-emerald-800/50">
                                <CheckCircle size={18} className="text-emerald-500" />
                                <span className="text-xs font-bold text-stone-600 dark:text-emerald-400">E-posta adresi doğrulandı</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100/50 dark:border-emerald-800/50">
                                <CheckCircle size={18} className="text-emerald-500" />
                                <span className="text-xs font-bold text-stone-600 dark:text-emerald-400">Mağaza bio'su eklendi</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-amber-50/50 dark:bg-amber-900/10 rounded-2xl border border-amber-100/50 dark:border-amber-800/50">
                                <Clock size={18} className="text-amber-500" />
                                <span className="text-xs font-bold text-stone-600 dark:text-amber-400">İlk 50 ürünü listele (42/50)</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-stone-50/50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-800">
                                <AlertTriangle size={18} className="text-stone-300" />
                                <span className="text-xs font-bold text-stone-400">IBAN bilgilerinizi güncelleyin</span>
                            </div>
                        </div>

                        <div className="pt-4">
                            <div className="bg-stone-50 dark:bg-stone-800/50 rounded-3xl p-5 border border-dashed border-stone-200 dark:border-stone-700">
                                <p className="text-[10px] font-black uppercase text-amber-600 mb-2 tracking-widest flex items-center gap-1.5 font-serif">
                                    <Activity size={12} /> Uzman İpucu
                                </p>
                                <p className="text-xs text-stone-600 dark:text-gray-400 leading-relaxed italic font-medium">
                                    "Ürün fotoğraflarınızın kalitesini artırmak, dönüşüm oranınızı ortalama %25 artırır."
                                </p>
                            </div>
                        </div>

                        <button className="w-full py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-[10px] font-black tracking-[0.2em] uppercase rounded-2xl transition-all shadow-lg active:scale-95">
                            Tüm İpuçlarını Gör
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
