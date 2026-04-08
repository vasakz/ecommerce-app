import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { OFFERS } from '../../data/offers'
import { MOCK_PRODUCTS } from '../../data/products'
import { addToCart } from '../../store/slices/cartSlice'

const formatRemaining = (endsAt) => {
  const ms = new Date(endsAt).getTime() - Date.now()
  if (ms <= 0) return 'Bitti'

  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const parts = []
  if (days) parts.push(`${days}g`)
  if (hours || parts.length) parts.push(`${hours}s`)
  if (minutes || parts.length) parts.push(`${minutes}d`)
  parts.push(`${seconds}sn`)

  return parts.join(' ')
}

function Kampanyalar() {
  const dispatch = useDispatch()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Tümü')
  const [tick, setTick] = useState(0)

  const addOfferToCart = (offer) => {
    const product = MOCK_PRODUCTS.find((p) => p.id === offer.productId)
    if (product) {
      const discountedPrice = Math.round(product.price * (1 - offer.discount / 100))
      dispatch(
        addToCart({
          id: product.id,
          isim: product.name,
          fiyat: `${discountedPrice}TL`,
          image: product.image,
        })
      )
      return
    }

    // fallback kalau product yok
    dispatch(
      addToCart({
        id: `offer-${offer.id}`,
        isim: offer.title,
        fiyat: `${offer.discount > 0 ? 100 - offer.discount : 100}TL`,
        image: offer.image,
      })
    )
  }

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  const categories = useMemo(() => ['Tümü', ...new Set(OFFERS.map((offer) => offer.category))], [])

  const filtered = useMemo(
    () =>
      OFFERS.filter((offer) => {
        const matchesCategory = category === 'Tümü' || offer.category === category
        const matchesSearch =
          offer.title.toLowerCase().includes(search.toLowerCase()) ||
          offer.description.toLowerCase().includes(search.toLowerCase())
        return matchesCategory && matchesSearch
      }),
    [category, search]
  )

  return (
    <main className="min-h-screen px-6 py-10 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-3">Kampanyalar</h1>
        <p className="mb-8 text-sm text-stone-600 dark:text-stone-300">
          En yeni fırsatlar ve indirimler burada. Hemen uygulamak için bir kampanya seçin.
        </p>

        <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto] items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kampanya ara..."
            className="px-4 py-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 outline-none focus:ring-2 focus:ring-amber-400"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-sm text-stone-500 dark:text-stone-400">
              Aradığınız kriterlere uygun kampanya bulunamadı.
            </div>
          )}

          {filtered.map((offer) => (
            <article
              key={offer.id}
              className="border border-stone-200 dark:border-stone-800 rounded-xl p-5 bg-white dark:bg-stone-900 shadow-sm"
            >
              <h2 className="text-xl font-bold mb-2">{offer.title}</h2>
              <p className="text-sm text-stone-600 dark:text-stone-300 mb-3">{offer.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs uppercase font-bold text-amber-500">{offer.category}</span>
                <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">{offer.badge}</span>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                <div className="text-sm text-stone-500 dark:text-stone-400">Kalan süre: <strong>{formatRemaining(offer.endsAt)}</strong></div>
                <span className="text-lg font-bold text-amber-600 dark:text-amber-300">{offer.discount > 0 ? `${offer.discount}% İNDİRİM` : 'Kargo Ücretsiz'}</span>
                <div className="flex gap-2">
                  <Link
                    to={`/kampanyalar/${offer.id}`}
                    className="flex-1 text-center rounded-md bg-amber-500 text-white px-3 py-2 text-sm font-semibold hover:bg-amber-600 transition"
                  >
                    Teklifi Gör
                  </Link>
                  <button
                    onClick={() => addOfferToCart(offer)}
                    className="flex-1 text-center rounded-md border border-amber-500 text-amber-600 dark:text-amber-300 px-3 py-2 text-sm font-semibold hover:bg-amber-50 dark:hover:bg-amber-500/20 transition"
                  >
                    Sepete Ekle
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10">
          <Link
            to="/urunler"
            className="inline-block px-5 py-2 rounded-md bg-amber-500 text-white font-bold hover:bg-amber-600 transition"
          >
            Tüm Ürünlere Gözat
          </Link>
        </div>
      </div>
    </main>
  )
}

export default Kampanyalar
