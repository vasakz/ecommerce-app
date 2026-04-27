import { useState } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import {
    LayoutDashboard, Package, PlusCircle, ShoppingBag, 
    ClipboardList, RotateCcw, Calendar, BarChart2, 
    CreditCard, Truck, Settings, LogOut, User,
    Store, Bell, Search, Menu, X
} from 'lucide-react'

const menuItems = [
    { key: 'urunler', label: 'Ürün Yönetimi', icon: Package, path: '/satici/urunler' },
    { key: 'urun-ekle', label: 'Yeni Ürün Ekle', icon: PlusCircle, path: '/satici/urun-ekle' },
    { key: 'siparisler', label: 'Sipariş Yönetimi', icon: ShoppingBag, path: '/satici/siparisler' },
    { key: 'talepler', label: 'Sipariş Talepleri', icon: ClipboardList, path: '/satici/talepler' },
    { key: 'iadeler', label: 'İade Talepleri', icon: RotateCcw, path: '/satici/iadeler' },
    { key: 'takvim', label: 'Mağaza Takvimi', icon: Calendar, path: '/satici/takvim' },
    { key: 'istatistikler', label: 'İstatistikler', icon: BarChart2, path: '/satici/istatistikler' },
    { key: 'finans', label: 'Finans Yönetimi', icon: CreditCard, path: '/satici/finans' },
    { key: 'kargo', label: 'Kargo Yönetimi', icon: Truck, path: '/satici/kargo' },
    { key: 'iban', label: 'IBAN Ayarları', icon: Settings, path: '/satici/iban-ayarlari' },
]

export default function SellerLayout({ children }) {
    const location = useLocation()
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const sellerInfo = {
        name: 'Hanımeli Atölyesi',
        email: 'info@hanimeli.com',
        avatar: null
    }

    return (
        <div className="bg-stone-50 min-h-screen flex">
            {/* Sidebar for Desktop */}
            <aside className="hidden lg:flex w-64 bg-white border-r border-stone-100 flex-col sticky top-0 h-screen">
                <div className="p-6 border-b border-stone-50">
                    <Link to="/satici" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center text-white font-serif font-bold italic text-xl">A</div>
                        <span className="text-xl font-serif font-bold text-stone-800 italic">Antigravity</span>
                    </Link>
                </div>

                <div className="p-6 border-b border-stone-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center border border-stone-200">
                            <Store size={20} className="text-stone-400" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-stone-800 truncate">{sellerInfo.name}</p>
                            <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Satıcı Paneli</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-0.5 custom-scrollbar">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase px-3 mb-4 mt-2">Menü</p>
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.path
                        return (
                            <Link
                                key={item.key}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] tracking-wide transition-all
                                    ${isActive 
                                        ? 'bg-amber-50 text-amber-700 font-semibold shadow-sm' 
                                        : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'}`}
                            >
                                <Icon size={16} className={isActive ? 'text-amber-600' : 'text-stone-400'} />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-stone-100">
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] tracking-wide text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors w-full"
                    >
                        <LogOut size={16} />
                        Çıkış Yap
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                    <aside className="fixed inset-y-0 left-0 w-72 bg-white flex flex-col shadow-2xl">
                        <div className="p-6 flex items-center justify-between border-b border-stone-50">
                            <Link to="/satici" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center text-white font-serif font-bold italic text-xl">A</div>
                                <span className="text-xl font-serif font-bold text-stone-800 italic">Antigravity</span>
                            </Link>
                            <button onClick={() => setSidebarOpen(false)} className="text-stone-400">
                                <X size={20} />
                            </button>
                        </div>
                        <nav className="flex-1 overflow-y-auto p-4 space-y-0.5">
                            {menuItems.map((item) => {
                                const Icon = item.icon
                                const isActive = location.pathname === item.path
                                return (
                                    <Link
                                        key={item.key}
                                        to={item.path}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm tracking-wide transition-all
                                            ${isActive 
                                                ? 'bg-amber-50 text-amber-700 font-bold' 
                                                : 'text-stone-500 hover:bg-stone-50'}`}
                                    >
                                        <Icon size={18} />
                                        {item.label}
                                    </Link>
                                )
                            })}
                        </nav>
                    </aside>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Seller Specific Navbar */}
                <header className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-100 dark:border-stone-800 h-20 flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-6">
                        <button 
                            className="lg:hidden text-stone-500 p-2.5 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-xl transition-all"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu size={22} />
                        </button>
                        
                        {/* Store Status Badge */}
                        <div className="hidden sm:flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full border border-emerald-100 dark:border-emerald-800/50">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Mağaza Açık</span>
                        </div>

                        <div className="relative hidden xl:block">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                            <input 
                                type="text" 
                                placeholder="Panelde ara (Sipariş, ürün...)" 
                                className="pl-11 pr-6 py-2.5 bg-stone-50 dark:bg-stone-800 border-none rounded-2xl text-xs text-stone-600 dark:text-gray-400 focus:ring-2 focus:ring-amber-500/20 w-80 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Quick Action Button */}
                        <Link 
                            to="/satici/urun-ekle"
                            className="hidden md:flex items-center gap-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-stone-900/10 active:scale-95"
                        >
                            <PlusCircle size={16} />
                            Hızlı Ekle
                        </Link>

                        <div className="h-8 w-[1px] bg-stone-100 dark:bg-stone-800 mx-2 hidden sm:block" />

                        <div className="flex items-center gap-3 group cursor-pointer">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-stone-900 dark:text-white leading-none group-hover:text-amber-600 transition-colors">Aylin Şahin</p>
                                <p className="text-[10px] text-stone-400 mt-1.5 uppercase tracking-tighter font-bold">Hanımeli Atölyesi</p>
                            </div>
                            <div className="relative">
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 p-[2px] shadow-md group-hover:rotate-6 transition-transform">
                                    <div className="w-full h-full rounded-[14px] bg-white dark:bg-stone-800 flex items-center justify-center overflow-hidden">
                                        <User size={20} className="text-amber-600" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-stone-900 rounded-full"></div>
                            </div>
                        </div>

                        <button className="p-3 text-stone-400 hover:text-stone-900 dark:hover:text-white relative transition-all hover:bg-stone-50 dark:hover:bg-stone-800 rounded-2xl">
                            <Bell size={20} />
                            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-stone-900 animate-bounce"></span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6 lg:p-10">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
