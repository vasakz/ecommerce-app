import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { decreaseQuantity, increaseQuantity, removeFromCart } from '../../store/slices/cartSlice'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CreditCard, ShieldCheck, Truck } from 'lucide-react'
import toast from 'react-hot-toast'

// undefined veya null fiyat için güvenli dönüşüm
const priceToNumber = (price) => {
  if (typeof price === 'number') return price
  if (!price) return 0
  return Number(String(price).replace(/[^\d]/g, '')) || 0
}

function Cart() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = useSelector((state) => state.cart.items)

  const toplamAdet = items.reduce((total, item) => total + (item.quantity ?? 1), 0)
  const araToplam = items.reduce(
    (total, item) => total + priceToNumber(item.fiyat ?? item.price) * (item.quantity ?? 1),
    0
  )
  const kargo = araToplam > 2000 || araToplam === 0 ? 0 : 149
  const genelToplam = araToplam + kargo

  const handleNavigation = (item) => {
    if (item.type === 'atolye' && item.orijinalUrun) {
      navigate(`/atolye-urun/${item.gercekId}`, { state: { urun: item.orijinalUrun } })
    } else {
      navigate(`/urunler/${item.id}`)
    }
  }

  return (
    <main className="bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-px bg-amber-500"></div>
              <span className="text-[10px] font-bold tracking-[0.3em] text-amber-600 uppercase">Görünüm</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-stone-900">Sepetim</h1>
          </div>
          <Link 
            to="/" 
            className="group flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
          >
            Alışverişe devam et 
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-stone-200 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/10"></div>
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-300">
                <ShoppingBag size={40} strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-serif text-stone-800 mb-4">Sepetin henüz boş</h2>
              <p className="text-stone-500 mb-8 max-w-xs mx-auto leading-relaxed">
                Henüz sepetine bir ürün eklemedin. Senin için seçtiğimiz özel tasarımlara göz atmak ister misin?
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-3 bg-stone-900 text-white px-8 py-4 rounded-xl hover:bg-stone-800 transition-all duration-300 shadow-xl shadow-stone-900/10 hover:shadow-stone-900/20 active:scale-95"
              >
                Koleksiyonu Keşfet <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Cart Items List */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-stone-50/50 border-b border-stone-100 flex justify-between items-center">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-stone-400">
                    Ürünler ({toplamAdet})
                  </span>
                  {kargo === 0 && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-full uppercase tracking-wider">
                      <Truck size={12} /> ÜCRETSİZ KARGO
                    </div>
                  )}
                </div>

                <div className="divide-y divide-stone-100">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-6 flex flex-col sm:flex-row items-start gap-6 group hover:bg-stone-50/40 transition-colors"
                    >
                      {/* Image Cluster */}
                      <div 
                        onClick={() => handleNavigation(item)} 
                        className="relative cursor-pointer flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-stone-100 shadow-sm group-hover:shadow-md transition-all duration-500"
                      >
                        <img
                          src={item.image}
                          alt={item.isim ?? item.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <button
                            onClick={() => handleNavigation(item)}
                            className="text-left font-serif text-lg text-stone-800 hover:text-amber-600 transition-colors line-clamp-1"
                          >
                            {item.isim ?? item.name}
                          </button>
                          <p className="font-semibold text-stone-900 whitespace-nowrap">
                            {(priceToNumber(item.fiyat ?? item.price) * (item.quantity ?? 1)).toLocaleString('tr-TR')} ₺
                          </p>
                        </div>

                        {/* Atölye Özellikleri */}
                        {item.ozellikler && (
                          <div className="mb-4 flex flex-wrap gap-2">
                            {Object.entries(item.ozellikler).map(([key, val]) => {
                              if (!val || (Array.isArray(val) && val.length === 0)) return null;
                              return (
                                <span key={key} className="inline-flex items-center px-2 py-0.5 rounded-md bg-stone-100 text-[10px] font-medium text-stone-500 border border-stone-200">
                                  {key === 'boyut' && '📐 '}
                                  {key === 'renk' && '🎨 '}
                                  {key === 'kazimaMetni' && '✍️ '}
                                  {key === 'hediyeNotu' && '🎁 '}
                                  {Array.isArray(val) ? val.join(', ') : val}
                                </span>
                              );
                            })}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center bg-stone-100 rounded-lg p-1 border border-stone-200">
                            <button
                              onClick={() => dispatch(decreaseQuantity(item.id))}
                              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-white rounded-md transition-all active:scale-90"
                              aria-label="Azalt"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-10 text-center text-xs font-bold text-stone-800">
                              {item.quantity ?? 1}
                            </span>
                            <button
                              onClick={() => dispatch(increaseQuantity(item.id))}
                              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-white rounded-md transition-all active:scale-90"
                              aria-label="Artır"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              dispatch(removeFromCart(item.id))
                              toast.success('Ürün sepetten çıkarıldı')
                            }}
                            className="flex items-center gap-1.5 text-stone-400 hover:text-rose-500 transition-colors text-[11px] font-bold uppercase tracking-wider group/del"
                          >
                            <Trash2 size={14} className="group-hover/del:scale-110 transition-transform" />
                            <span>Kaldır</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-stone-200 flex items-center gap-4">
                  <div className="bg-amber-50 text-amber-600 p-2 rounded-lg">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-stone-800 uppercase tracking-tight">Güvenli Ödeme</p>
                    <p className="text-[10px] text-stone-500">256-bit SSL koruması</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-stone-200 flex items-center gap-4">
                  <div className="bg-stone-50 text-stone-600 p-2 rounded-lg">
                    <Truck size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-stone-800 uppercase tracking-tight">Hızlı Gönderim</p>
                    <p className="text-[10px] text-stone-500">Sigortalı lojistik desteği</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Sidebar */}
            <aside className="lg:col-span-4 h-fit sticky top-24">
              <div className="bg-white border border-stone-200 rounded-2xl p-7 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 mb-8 border-b border-stone-100 pb-4">
                  Sipariş Özeti
                </h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Ara Toplam</span>
                    <span className="font-medium text-stone-800">{araToplam.toLocaleString('tr-TR')} ₺</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Teslimat Ücreti</span>
                    <span className="font-medium text-stone-800">
                      {kargo === 0 ? (
                        <span className="text-teal-600">Ücretsiz</span>
                      ) : (
                        `${kargo} ₺`
                      )}
                    </span>
                  </div>
                  {kargo > 0 && (
                    <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-100">
                      <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                        Sepetinize <span className="font-bold">{(2000 - araToplam).toLocaleString('tr-TR')} ₺</span> değerinde ürün daha ekleyin, kargo bedelini karşılayalım.
                      </p>
                    </div>
                  )}
                  <div className="pt-4 border-t border-stone-100 flex justify-between items-end">
                    <span className="text-stone-900 font-bold">Toplam</span>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-stone-900 leading-none">
                        {genelToplam.toLocaleString('tr-TR')} ₺
                      </p>
                      <p className="text-[10px] text-stone-400 mt-1">KDV Dahil</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-amber-600 transition-colors">
                      <CreditCard size={16} />
                    </div>
                    <input
                      type="text"
                      placeholder="Kart Numarası"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-inner"
                    />
                  </div>

                  <Link
                    to="/odeme"
                    className="w-full bg-amber-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-amber-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20"
                  >
                    Ödemeye Geç <ArrowRight size={16} />
                  </Link>

                  <p className="text-[10px] text-stone-400 text-center italic">
                    Iyzico ile %100 güvenli ödeme altyapısı tercih edilmiştir.
                  </p>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="mt-4 bg-white border border-stone-200 rounded-2xl p-4 flex gap-2">
                <input 
                  type="text" 
                  placeholder="İndirim Kodu" 
                  className="flex-1 bg-stone-50 text-[11px] px-3 py-2 rounded-lg border border-stone-100 focus:outline-none focus:border-stone-300" 
                />
                <button className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors px-2">
                  Uygula
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}

export default Cart
