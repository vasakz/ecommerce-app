import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { addToCart } from '../../store/slices/cartSlice'
import { removeFromFavorites } from '../../store/slices/favoritesSlice'

function Favorites() {
  const dispatch = useDispatch()
  const favoritesItems = useSelector(state => state.favorites.items)

  const handleAddToCart = (item) => {
    dispatch(
      addToCart({
        id: item.id,
        isim: item.name,
        fiyat: `${item.price}TL`,
        image: item.image,
      })
    )
    dispatch(removeFromFavorites(item.id))
    toast.success('Sepete eklendi ve beğendiklerden çıkarıldı', {
      style: {
        background: '#16a34a',
        color: '#ffffff',
      },
    })
  }

  const handleRemoveFromFavorites = (id) => {
    dispatch(removeFromFavorites(id))
    toast.info('Beğendiklerden çıkarıldı')
  }

  return (
    <main className="bg-gradient-to-br from-stone-50 to-stone-100 min-h-[70vh]">
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8 text-center">
          <p className="text-xs tracking-widest text-stone-500 bg-stone-100 px-3 py-1 rounded-full inline-block mb-2">HESABIM</p>
          <h1 className="text-4xl font-bold tracking-wide text-stone-900 bg-gradient-to-r from-stone-900 to-stone-700 bg-clip-text text-transparent">BEĞENDİKLERİM</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {favoritesItems.map((item) => (
            <article key={item.id} className="bg-gradient-to-br from-white to-stone-50 border border-stone-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <p className="text-xs tracking-widest text-stone-500 mb-2 bg-stone-100 px-2 py-1 rounded-full inline-block">{item.category}</p>
                <h2 className="text-lg font-semibold text-stone-900 mb-2 hover:text-amber-600 transition-colors">{item.name}</h2>
                <p className="text-stone-700 mt-2 text-lg font-bold">{item.price.toLocaleString('tr-TR')} TL</p>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 bg-gradient-to-r from-stone-900 to-stone-700 text-white py-2 rounded-lg hover:from-stone-800 hover:to-stone-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Sepete ekle
                  </button>
                  <button
                    onClick={() => handleRemoveFromFavorites(item.id)}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Çıkar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Favorites
