import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, ShoppingBag, Package,
  Store, LogOut, Menu, X, ChevronRight, Bell, Settings
} from 'lucide-react'

const menuItems = [
  { path: '/admin',            label: 'Dashboard',          icon: LayoutDashboard },
  { path: '/admin/kullanicilar', label: 'Kullanıcılar',     icon: Users },
  { path: '/admin/siparisler',   label: 'Siparişler',       icon: ShoppingBag },
  { path: '/admin/urunler',      label: 'Ürünler',          icon: Package },
  { path: '/admin/saticilar',    label: 'Satıcılar',        icon: Store },
]

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-stone-100 flex">

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} flex-shrink-0 bg-stone-900 text-white flex flex-col transition-all duration-300 min-h-screen`}>

        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-stone-800">
          {sidebarOpen && (
            <Link to="/admin" className="text-lg font-black tracking-widest text-white">
              BRAND <span className="text-amber-500 text-xs font-bold">ADMIN</span>
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-stone-800 transition text-stone-400 hover:text-white"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                  active
                    ? 'bg-amber-500 text-white'
                    : 'text-stone-400 hover:bg-stone-800 hover:text-white'
                }`}
              >
                <Icon size={18} className="flex-shrink-0" />
                {sidebarOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
                {sidebarOpen && active && (
                  <ChevronRight size={14} className="ml-auto" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-2 py-4 border-t border-stone-800 space-y-1">
          <Link
            to="/admin/ayarlar"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-400 hover:bg-stone-800 hover:text-white transition"
          >
            <Settings size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Ayarlar</span>}
          </Link>
          <button
            onClick={() => navigate('/admin/giris')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-400 hover:bg-red-900/40 hover:text-red-400 transition"
          >
            <LogOut size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Çıkış Yap</span>}
          </button>
        </div>
      </aside>

      {/* Sağ taraf */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">

        {/* Üst bar */}
        <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-sm font-bold text-stone-800">
              {menuItems.find(m => isActive(m.path))?.label || 'Admin Panel'}
            </h1>
            <p className="text-xs text-stone-400">BRAND Yönetim Paneli</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-stone-100 transition text-stone-500">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-stone-200">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold">
                A
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-stone-800">Admin</p>
                <p className="text-[10px] text-stone-400">admin@brand.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* İçerik */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout