import { Link, useParams } from 'react-router-dom'
import { OFFERS } from '../../data/offers'
import { MOCK_PRODUCTS } from '../../data/products'

function KampanyaDetail() {
  const { id } = useParams()
  const offer = OFFERS.find((item) => String(item.id) === String(id))

  if (!offer) {
    return (
      <main className="min-h-screen px-6 py-12 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-3">Kampanya bulunamadı</h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">Aradığınız kampanya mevcut değil veya sona ermiş olabilir.</p>
          <Link
            to="/kampanyalar"
            className="inline-block px-5 py-3 rounded-md bg-amber-500 text-white font-semibold hover:bg-amber-600 transition"
          >
            Kampanyalara geri dön
          </Link>
        </div>
      </main>
    )
  }

  const remainingMs = new Date(offer.endsAt).getTime() - Date.now()
  const remaining = remainingMs > 0 ? Math.floor(remainingMs / 1000) : 0

  const matchedOffers = offer.category === 'Genel'
    ? MOCK_PRODUCTS.slice(0, 6)
    : MOCK_PRODUCTS.filter((product) => product.category === offer.category).slice(0, 6)

  return (
    <main className="min-h-screen px-6 py-12 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      <div className="max-w-4xl mx-auto bg-white dark:bg-stone-900 rounded-2xl p-8 shadow-lg border border-stone-200 dark:border-stone-800">
        <h1 className="text-4xl font-extrabold mb-4">{offer.title}</h1>
        <p className="text-sm text-stone-600 dark:text-stone-300 mb-4">{offer.description}</p>

        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-stone-200 dark:border-stone-800 p-4">
            <div className="text-xs uppercase text-stone-500">Kategori</div>
            <div className="font-bold">{offer.category}</div>
          </div>
          <div className="rounded-lg border border-stone-200 dark:border-stone-800 p-4">
            <div className="text-xs uppercase text-stone-500">İndirim</div>
            <div className="font-bold">{offer.discount > 0 ? `${offer.discount}%` : 'Kargo Ücretsiz'}</div>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-xs uppercase text-stone-500">Kalan süre</div>
          <div className="text-lg font-semibold">{remaining > 0 ? `${remaining} saniye` : 'Bitti'}</div>
        </div>

        <div className="flex gap-3">
          <Link
            to="/urunler"
            className="px-4 py-2 rounded-md bg-amber-500 text-white font-semibold hover:bg-amber-600 transition"
          >
            Kampanyalı ürünlere git
          </Link>
          <Link
            to="/kampanyalar"
            className="px-4 py-2 rounded-md border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            Tüm kampanyalar
          </Link>
        </div>

        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Kampanyaya uygun ürünler</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {matchedOffers.map((product) => (
              <Link
                key={product.id}
                to={`/urunler/${product.id}`}
                className="rounded-xl border border-stone-200 dark:border-stone-700 p-3 bg-stone-50 dark:bg-stone-900 hover:shadow-lg transition"
              >
                <div className="h-32 overflow-hidden rounded-lg">
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                </div>
                <h3 className="mt-3 text-sm font-bold">{product.name}</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">{product.brand}</p>
                <p className="mt-2 text-sm font-semibold text-amber-600 dark:text-amber-300">{product.price.toLocaleString('tr-TR')}₺</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default KampanyaDetail
