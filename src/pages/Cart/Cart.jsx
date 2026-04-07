import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { decreaseQuantity, increaseQuantity, removeFromCart } from '../../store/slices/cartSlice'
import { toast } from 'react-toastify'

const priceToNumber = (price) => {
  if (typeof price === 'number') return price
  return Number(String(price).replace(/[^\d]/g, '')) || 0
}

function Cart() {
  const dispatch = useDispatch()
  const items = useSelector((state) => state.cart.items)
  const toplamAdet = items.reduce((total, item) => total + (item.quantity ?? 1), 0)

  const araToplam = items.reduce(
    (total, item) => total + priceToNumber(item.fiyat ?? item.price) * (item.quantity ?? 1),
    0
  )
  const kargo = araToplam > 2000 || araToplam === 0 ? 0 : 149
  const genelToplam = araToplam + kargo

  return (
    <main className="bg-gradient-to-br from-stone-50 to-stone-100 min-h-[70vh]">
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs tracking-widest text-stone-500">ALIŞVERİŞ</p>
            <h1 className="text-3xl font-bold tracking-wide text-stone-900">SEPETİM</h1>
          </div>
          <Link to="/" className="text-sm text-stone-600 hover:text-amber-600 transition">
            Alışverişe devam et
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-gradient-to-br from-white to-stone-50 border border-stone-200 rounded-lg p-10 text-center shadow-lg">
            <p className="text-lg font-medium text-stone-800 mb-2">Sepetin şu an boş.</p>
            <p className="text-sm text-stone-500 mb-6">
              Beğendiğin ürünleri sepete eklediğinde burada göreceksin.
            </p>
            <Link
              to="/"
              className="inline-block bg-gradient-to-r from-stone-900 to-stone-700 text-white px-6 py-3 rounded-lg hover:from-stone-800 hover:to-stone-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              Ürünlere git
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-gradient-to-br from-white to-stone-50 border border-stone-200 rounded-lg p-6 shadow-lg">
              <h2 className="text-sm tracking-widest font-semibold mb-6 text-stone-700 bg-gradient-to-r from-stone-700 to-stone-600 bg-clip-text text-transparent">
                SEPET ÜRÜNLERİ ({toplamAdet})
              </h2>

              <div className="space-y-5">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-6 border-b border-stone-100 pb-5 hover:bg-gradient-to-r hover:from-stone-50 hover:to-stone-25 transition-all duration-300 rounded-lg p-4 hover:shadow-md">
                    {item.image && (
                      <Link to={`/urunler/${item.id}`}>
                        <img src={item.image} alt={item.isim ?? item.name} className="w-16 h-16 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 hover:scale-105" />
                      </Link>
                    )}
                    <div className="min-w-0 flex-1">
                      <Link to={`/urunler/${item.id}`} className="font-semibold text-stone-800 truncate hover:text-amber-600 transition-colors duration-300">
                        {item.isim ?? item.name}
                      </Link>

                      <div className="mt-3 flex items-center gap-3">
                        <div className="inline-flex items-center border border-stone-300 rounded-lg overflow-hidden shadow-sm">
                          <button
                            onClick={() => dispatch(decreaseQuantity(item.id))}
                            className="px-3 py-1 text-stone-700 hover:bg-stone-100 transition-colors duration-200"
                            aria-label="Adet azalt"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 text-sm font-medium text-stone-800 bg-stone-50">
                            {item.quantity ?? 1}
                          </span>
                          <button
                            onClick={() => dispatch(increaseQuantity(item.id))}
                            className="px-3 py-1 text-stone-700 hover:bg-stone-100 transition-colors duration-200"
                            aria-label="Adet artır"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="text-sm text-stone-500 hover:text-red-600 transition-colors duration-200 hover:bg-red-50 px-2 py-1 rounded"
                        >
                          Ürünü sil
                        </button>
                      </div>
                    </div>
                    <p className="font-semibold text-stone-900 text-lg">
                      {(priceToNumber(item.fiyat ?? item.price) * (item.quantity ?? 1)).toLocaleString('tr-TR')} TL
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="bg-gradient-to-br from-white to-stone-50 border border-stone-200 rounded-lg p-6 h-fit space-y-7 shadow-lg">
              <div>
                <h3 className="text-sm tracking-widest font-semibold mb-5 text-stone-700 bg-gradient-to-r from-stone-700 to-stone-600 bg-clip-text text-transparent">SEPET ÖZETİ</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-100 transition-colors">
                    <span className="text-stone-600">Ürün Sayısı</span>
                    <span className="font-medium text-stone-800">{toplamAdet}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-100 transition-colors">
                    <span className="text-stone-600">Ara Toplam</span>
                    <span className="font-medium text-stone-800">{araToplam.toLocaleString('tr-TR')} TL</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-100 transition-colors">
                    <span className="text-stone-600">Kargo</span>
                    <span className="font-medium text-stone-800">{kargo === 0 ? 'Ücretsiz' : `${kargo} TL`}</span>
                  </div>
                  <div className="border-t border-stone-200 pt-3 mt-3 flex items-center justify-between bg-gradient-to-r from-stone-100 to-stone-50 p-3 rounded-lg">
                    <span className="text-stone-800 font-semibold">Genel Toplam</span>
                    <span className="text-stone-900 text-lg font-bold">{genelToplam.toLocaleString('tr-TR')} TL</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-stone-200 pt-6">
                <h3 className="text-sm tracking-widest font-semibold mb-4 text-stone-700 bg-gradient-to-r from-stone-700 to-stone-600 bg-clip-text text-transparent">ÖDEME</h3>

                <div className="space-y-3 text-sm mb-4">
                  <label className="flex items-center justify-between border border-stone-200 rounded-lg px-3 py-2 cursor-pointer hover:border-stone-400 hover:bg-stone-50 transition-all duration-200 shadow-sm">
                    <span className="text-stone-700">Kredi / Banka Kartı</span>
                    <input type="radio" name="odeme-yontemi" defaultChecked />
                  </label>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Kart Üzerindeki İsim"
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Kart Numarası"
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="AA / YY"
                      className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-stone-500 mb-3">
                  Siparişi tamamladığında ön bilgilendirme formunu ve mesafeli satış sözleşmesini kabul etmiş olursun.
                </p>
                <Link
                  to="/odeme"
                  className="block w-full bg-gradient-to-r from-stone-900 to-stone-700 text-white py-3 rounded-lg hover:from-stone-800 hover:to-stone-600 transition-all duration-300 text-center shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  Siparişi tamamla
                </Link>
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  )
}

export default Cart
