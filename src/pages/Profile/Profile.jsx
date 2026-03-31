import { User, ShoppingBag, Heart, MapPin, Settings, LogOut} from 'lucide-react'

function Profile() {
    return (
        <div className="min-h-screen bg-stone-50 py-10 px-6">
            <div className="max-w-5xl mx-auto flex gap-6">
                {/*Sol: Profil kartı */}
                <div className="w-72 flex-shrink-0">
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        {/* avatar */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-20 h-20 rounded-full bg-stone-200 flex items-center justify-center mb-3">
                                <User size={36} className="text-stone-400" />
                            </div> 
                            <h2 className="font-semibold text-stone-800">Başak Şimşek</h2>
                            <p className="text-sm text-stone-400">basak.simsek@gmail.com</p>
                            
                        </div>

                        {/* menu */}
                        <ul className="space-y-1 text-sm">
                            <li className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-stone-100 font-medium cursor-pointer">
                                <User size={16} /> Profil Bilgilerim
                            </li>
                            <li className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:text-amber-400 text-stone-600 cursor-pointer transition">
                                <ShoppingBag size={16} /> Siparişlerim
                            </li>
                            <li className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:text-amber-400 text-stone-600 cursor-pointer transition">
                                <Heart size={16} /> Favorilerim
                            </li>
                            <li className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:text-amber-400 text-stone-600 cursor-pointer transition">
                                <MapPin size={16} /> Adreslerim
                            </li>
                            <li className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:text-amber-400 text-stone-600 cursor-pointer transition">
                                <Settings size={16} /> Ayarlar
                            </li>
                            <li className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 text-red-500 cursor-pointer transition mt-4">
                                <LogOut size={16} /> Çıkış Yap
                            </li>
                        </ul>



                    </div>
                </div>

                {/*Sağ: Profil içeriği */}
            </div>
        </div>
    )
}

export default Profile