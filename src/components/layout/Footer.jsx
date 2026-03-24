function Footer() {
    return (
        <footer className="bg-slate-800 text-white">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-4 gap-8">
                    {/* Logo ve Açıklama */}
                    <div>
                        <h2 className="text-x1 font-bold mb-4">BRANDNAME</h2>
                        <p className="text-white text-sm">
                            about brand
                        </p>
                    </div>

                    {/* Keşfet Bölümü */}
                    <div>
                        <h3 className="font-semibold mb-4">Keşfet</h3>
                        <ul className="space-y-2 text-white text-sm">
                            <li>Ana Sayfa</li>
                            <li>Ürünler</li>
                            <li>Kampanyalar</li>
                            <li>Atölye</li>
                        </ul>
                    </div>
                    {/* Müşteri Hizmetleri Bölümü */}
                    <div>
                        <h3 className="font-semibold mb-4">Müşteri Hizmetleri</h3>
                        <ul className="space-y-2 text-white text-sm">
                            <li>Yardım Merkezi</li>
                            <li>Kargo Takibi</li>
                            <li>İade ve Değişim</li>
                            <li>İletişim</li>
                        </ul>
                    </div>
                    {/* Bizi Takip Edin Bölümü */}
                    <div>
                        <h3 className="font-semibold mb-4">Bizi Takip Edin</h3>
                        <ul className="space-y-2 text-white text-sm">
                            <li>Instagram</li>
                            <li>Twitter</li>
                            <li>Youtube</li>
                            <li>Facebook</li>
                        </ul>
                    </div>
                    
                </div>
            </div>

            {/* Alt Çizgi ve Telif Hakkı Bölümü */}
                    <div className="border-t border-white-700/2 py-6 text-center text-white text-sm">
                        <p>©2026 e-commerce. Tüm hakları saklıdır.</p>
                    </div>
            
        </footer>
    )

}

export default Footer