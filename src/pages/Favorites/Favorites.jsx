import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { addToCart } from '../../store/slices/cartSlice'

const favoriteItems = [
  { id: 'fav-1', name: 'Minimal Deri Çanta', price: 1850, category: 'Çanta' },
  { id: 'fav-2', name: 'Modern Duvar Saati', price: 2490, category: 'Ev & Yaşam' },
  { id: 'fav-3', name: 'Kablosuz Kulaklık', price: 3999, category: 'Teknoloji' },
]

function Favorites() {
  const dispatch = useDispatch()

  const handleAddToCart = (item) => {
    dispatch(
      addToCart({
        id: item.id,
        isim: item.name,
        fiyat: `${item.price}TL`,
      })
    )
    toast.success('Sepete eklendi', {
      style: {
        background: '#16a34a',
        color: '#ffffff',
      },
    })
  }

  return (
    <main className="bg-stone-50 min-h-[70vh]">
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <p className="text-xs tracking-widest text-stone-500">HESABIM</p>
          <h1 className="text-3xl font-bold tracking-wide text-stone-900">BEĞENDİKLERİM</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {favoriteItems.map((item) => (
            <article key={item.id} className="bg-white border border-stone-200 rounded-lg p-6">
              <p className="text-xs tracking-widest text-stone-500 mb-2">{item.category}</p>
              <h2 className="text-lg font-semibold text-stone-900">{item.name}</h2>
              <p className="text-stone-700 mt-2">{item.price.toLocaleString('tr-TR')} TL</p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => handleAddToCart(item)}
                  className="flex-1 bg-stone-900 text-white py-2 rounded hover:bg-stone-700 transition text-sm"
                >
                  Sepete ekle
                </button>
                <Link
                  to="/sepet"
                  className="flex-1 border border-stone-300 py-2 rounded text-center text-sm hover:border-stone-900 hover:text-stone-900 transition"
                >
                  Şimdi Al
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Favorites
