import { ShoppingCart, User, Search } from 'lucide-react'

function Navbar() {
  return (
    <nav className="bg-slate-300 text-black">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <h1 className="text-xl font-bold tracking-widest text-black">
          brandname
        </h1>

        {/* Linkler */}
        <ul className="flex gap-8 text-sm text-black">
          <li className="hover:text-amber-400 cursor-pointer transition">Ürünler</li>
          <li className="hover:text-amber-400 cursor-pointer transition">Kampanyalar</li>
          <li className="hover:text-amber-400 cursor-pointer transition">Mağazalar</li>
          <li className="hover:text-amber-400 cursor-pointer transition">Hakkımızda</li>
        </ul>

        {/* İkonlar */}
        <div className="flex items-center gap-6 white">
          <Search size={20} className="hover:text-amber-400 cursor-pointer transition" />
          <User size={20} className="hover:text-amber-400 cursor-pointer transition" />
          <ShoppingCart size={20} className="hover:text-amber-400 cursor-pointer transition" />
        </div>

      </div>
    </nav>
  )
}

export default Navbar