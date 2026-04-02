import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const priceToNumber = (price) => {
  if (typeof price === 'number') return price
  return Number(String(price).replace(/[^\d]/g, '')) || 0
}

function Payment() {
  const items = useSelector((state) => state.cart.items)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [isAgreementChecked, setIsAgreementChecked] = useState(false)
  const [selectedInstallmentCount, setSelectedInstallmentCount] = useState(1)
  const [addresses, setAddresses] = useState([
    {
      id: 'ev',
      title: 'EV',
      recipient: 'Feyza Alşan',
      phone: '(544) *** **80',
      detail: 'Çınar Mahallesi, Örnek Sokak No:12 D:3, Ortahisar / Trabzon',
    },
    {
      id: 'is',
      title: 'İŞ',
      recipient: 'Feyza Alşan',
      phone: '(544) *** **80',
      detail: 'Kaşüstü Mahallesi, Sahil Cad. No:8, Yomra / Trabzon',
    },
  ])
  const [selectedAddressId, setSelectedAddressId] = useState('ev')
  const [draftAddressId, setDraftAddressId] = useState('ev')
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false)
  const [newAddress, setNewAddress] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
    district: '',
    neighborhood: '',
    detail: '',
  })

  const selectedAddress = addresses.find((address) => address.id === selectedAddressId) ?? addresses[0]
  const monthOptions = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0'))
  const yearOptions = Array.from({ length: 12 }, (_, index) => String(new Date().getFullYear() + index))

  const handleSaveNewAddress = () => {
    const firstName = newAddress.firstName.trim()
    const lastName = newAddress.lastName.trim()
    const phone = newAddress.phone.trim()
    const city = newAddress.city.trim()
    const district = newAddress.district.trim()
    const neighborhood = newAddress.neighborhood.trim()
    const detail = newAddress.detail.trim()

    if (!firstName || !lastName || !phone || !city || !district || !neighborhood || !detail) return

    const createdAddress = {
      id: `addr-${Date.now()}`,
      title: neighborhood.toUpperCase(),
      recipient: `${firstName} ${lastName}`,
      phone,
      detail: `${detail}, ${neighborhood}, ${district} / ${city}`,
    }

    setAddresses((prev) => [...prev, createdAddress])
    setDraftAddressId(createdAddress.id)
    setIsAddingNewAddress(false)
    setNewAddress({
      firstName: '',
      lastName: '',
      phone: '',
      city: '',
      district: '',
      neighborhood: '',
      detail: '',
    })
  }

  const { toplamAdet, araToplam, kargo, indirim, genelToplam } = useMemo(() => {
    const adet = items.reduce((total, item) => total + (item.quantity ?? 1), 0)
    const subtotal = items.reduce(
      (total, item) => total + priceToNumber(item.fiyat ?? item.price) * (item.quantity ?? 1),
      0
    )
    const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 149
    const discount = subtotal > 4000 ? 199 : 0

    return {
      toplamAdet: adet,
      araToplam: subtotal,
      kargo: shipping,
      indirim: discount,
      genelToplam: subtotal + shipping - discount,
    }
  }, [items])

  const installmentRows = useMemo(() => {
    const total = genelToplam
    const counts = [1, 2, 3, 4, 6, 8, 9]
    return counts.map((count) => {
      if (count === 1) {
        return {
          count,
          label: 'Tek Çekim',
          rightText: `${total.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`,
        }
      }
      const perMonth = Math.ceil((total / count) * 100) / 100
      return {
        count,
        label: `${count} Taksit`,
        rightText: `${count} x ${perMonth.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`,
      }
    })
  }, [genelToplam])

  return (
    <main className="bg-stone-50 min-h-[70vh]">
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs tracking-widest text-stone-500">ALIŞVERİŞ</p>
            <h1 className="text-3xl font-bold tracking-wide text-stone-900">ÖDEME</h1>
          </div>
          <Link to="/sepet" className="text-sm text-stone-600 hover:text-amber-600 transition">
            Sepete geri dön
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-stone-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm tracking-widest font-semibold text-stone-700">TESLİMAT ADRESİ</h2>
                <button
                  onClick={() => {
                    setDraftAddressId(selectedAddressId)
                    setIsAddressModalOpen(true)
                  }}
                  className="text-xs tracking-wide border border-stone-300 px-3 py-1.5 rounded hover:border-stone-700 transition"
                >
                  + Adres Ekle / Değiştir
                </button>
              </div>

              <div className="border border-amber-200 bg-amber-50 rounded p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-stone-800">{selectedAddress.title} Adresi</p>
                  <button
                    onClick={() => {
                      setDraftAddressId(selectedAddressId)
                      setIsAddressModalOpen(true)
                    }}
                    className="text-xs underline text-stone-600 hover:text-stone-900 transition"
                  >
                    Değiştir
                  </button>
                </div>
                <p className="text-xs text-stone-700 mt-2">
                  {selectedAddress.recipient} - {selectedAddress.phone}
                </p>
                <p className="text-sm text-stone-600 mt-1">{selectedAddress.detail}</p>
                <p className="text-xs text-stone-500 mt-2">Teslimat bu adrese yapılacaktır.</p>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-lg p-5">
              <h2 className="text-sm tracking-widest font-semibold text-stone-700 mb-4">ÖDEME SEÇENEKLERİ</h2>

              <label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-4">
                <input type="radio" name="payment-type" defaultChecked />
                Banka / Kredi Kartı ile Öde
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-stone-200 rounded p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-stone-700">Kart Bilgileri</h3>
                  <input
                    type="text"
                    placeholder="Kart Numarası"
                    className="w-full border border-stone-300 rounded px-3 py-2 text-sm outline-none focus:border-stone-600"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <select
                      value={selectedMonth}
                      onChange={(event) => setSelectedMonth(event.target.value)}
                      className="w-full border border-stone-300 rounded px-3 py-2 text-sm outline-none focus:border-stone-600 bg-white"
                    >
                      <option value="">Ay</option>
                      {monthOptions.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedYear}
                      onChange={(event) => setSelectedYear(event.target.value)}
                      className="w-full border border-stone-300 rounded px-3 py-2 text-sm outline-none focus:border-stone-600 bg-white"
                    >
                      <option value="">Yıl</option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="CVV"
                      className="w-full border border-stone-300 rounded px-3 py-2 text-sm outline-none focus:border-stone-600"
                    />
                  </div>
                </div>

                <div className="border border-stone-200 rounded overflow-hidden">
                  <h3 className="text-sm font-semibold text-stone-700 px-4 pt-4 pb-2">Taksit Seçenekleri</h3>
                  <div className="divide-y divide-stone-200 border-t border-stone-200 text-sm">
                    {installmentRows.map((row) => {
                      const isSelected = selectedInstallmentCount === row.count
                      return (
                        <label
                          key={row.count}
                          className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition ${
                            isSelected ? 'bg-amber-50' : 'bg-white hover:bg-stone-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="installment-option"
                            checked={isSelected}
                            onChange={() => setSelectedInstallmentCount(row.count)}
                            className="accent-amber-600 shrink-0"
                          />
                          <span className="flex-1 text-stone-800">{row.label}</span>
                          <span className="text-stone-700 tabular-nums shrink-0">{row.rightText}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-lg p-5">
              <h2 className="text-sm tracking-widest font-semibold text-stone-700 mb-3">SÖZLEŞMELER</h2>
              <label className="text-sm text-stone-600 flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={isAgreementChecked}
                  onChange={(event) => setIsAgreementChecked(event.target.checked)}
                />
                Ön bilgilendirme formunu ve mesafeli satış sözleşmesini okudum, onaylıyorum.
              </label>
            </div>
          </div>

          <aside className="bg-white border border-stone-200 rounded-lg p-5 h-fit">
            <h2 className="text-sm tracking-widest font-semibold text-stone-700 mb-4">SİPARİŞ ÖZETİ</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-stone-600">Sepetteki Ürünler</span>
                <span>{toplamAdet}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-600">Ara Toplam</span>
                <span>{araToplam.toLocaleString('tr-TR')} TL</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-600">Kargo</span>
                <span>{kargo === 0 ? 'Ücretsiz' : `${kargo} TL`}</span>
              </div>
              <div className="flex items-center justify-between text-green-700">
                <span>İndirim</span>
                <span>-{indirim.toLocaleString('tr-TR')} TL</span>
              </div>
              <div className="border-t border-stone-200 pt-3 flex items-center justify-between">
                <span className="font-semibold text-stone-800">Toplam</span>
                <span className="text-lg font-bold text-stone-900">{genelToplam.toLocaleString('tr-TR')} TL</span>
              </div>
            </div>

            <button
              disabled={!isAgreementChecked}
              className={`w-full mt-5 py-3 rounded transition ${
                isAgreementChecked
                  ? 'bg-stone-900 text-white hover:bg-stone-700'
                  : 'bg-stone-300 text-stone-500 cursor-not-allowed'
              }`}
            >
              Ödemeyi Yap
            </button>
          </aside>
        </div>
      </section>

      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-lg border border-stone-200 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-stone-900">Teslimat Adresi</h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="text-stone-500 hover:text-stone-900 transition"
                aria-label="Kapat"
              >
                X
              </button>
            </div>

            <div className="p-4 space-y-2.5 overflow-y-auto">
              {addresses.map((address) => {
                const isSelected = draftAddressId === address.id
                return (
                  <label
                    key={address.id}
                    className={`block border rounded p-3 cursor-pointer transition ${
                      isSelected
                        ? 'border-amber-400 bg-amber-50'
                        : 'border-stone-200 hover:border-stone-400 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="address-select"
                          checked={isSelected}
                          onChange={() => setDraftAddressId(address.id)}
                          className="mt-1"
                        />
                        <div>
                          <p className="text-sm font-semibold text-stone-900">{address.title}</p>
                          <p className="text-xs text-stone-600 mt-1">
                            {address.recipient} - {address.phone}
                          </p>
                          <p className="text-sm text-stone-700 mt-1">{address.detail}</p>
                        </div>
                      </div>
                      <button type="button" className="text-xs underline text-stone-600 hover:text-stone-900 transition">
                        Düzenle
                      </button>
                    </div>
                  </label>
                )
              })}

              <button
                type="button"
                onClick={() => setIsAddingNewAddress((prev) => !prev)}
                className="w-full border border-dashed border-stone-300 rounded p-3 text-sm hover:border-stone-500 transition"
              >
                + Yeni Adres Ekle
              </button>

              {isAddingNewAddress && (
                <div className="border border-stone-200 rounded p-3 space-y-2.5 bg-white">
                  <h4 className="text-base font-semibold text-stone-900">Adres ekle</h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-stone-700 mb-1">Ad *</label>
                      <input
                        type="text"
                        placeholder="Adınızı giriniz"
                        value={newAddress.firstName}
                        onChange={(event) =>
                          setNewAddress((prev) => ({ ...prev, firstName: event.target.value }))
                        }
                        className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm outline-none focus:border-stone-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-700 mb-1">Soyad *</label>
                      <input
                        type="text"
                        placeholder="Soyadınızı giriniz"
                        value={newAddress.lastName}
                        onChange={(event) =>
                          setNewAddress((prev) => ({ ...prev, lastName: event.target.value }))
                        }
                        className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm outline-none focus:border-stone-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-stone-700 mb-1">Telefon *</label>
                    <input
                      type="text"
                      placeholder="05xx xxx xx xx"
                      value={newAddress.phone}
                      onChange={(event) =>
                        setNewAddress((prev) => ({ ...prev, phone: event.target.value }))
                      }
                      className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm outline-none focus:border-stone-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-stone-700 mb-1">İl *</label>
                      <input
                        type="text"
                        placeholder="Seçiniz"
                        value={newAddress.city}
                        onChange={(event) =>
                          setNewAddress((prev) => ({ ...prev, city: event.target.value }))
                        }
                        className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm outline-none focus:border-stone-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-700 mb-1">İlçe *</label>
                      <input
                        type="text"
                        placeholder="Seçiniz"
                        value={newAddress.district}
                        onChange={(event) =>
                          setNewAddress((prev) => ({ ...prev, district: event.target.value }))
                        }
                        className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm outline-none focus:border-stone-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-stone-700 mb-1">Mahalle *</label>
                    <input
                      type="text"
                      placeholder="Seçiniz"
                      value={newAddress.neighborhood}
                      onChange={(event) =>
                        setNewAddress((prev) => ({ ...prev, neighborhood: event.target.value }))
                      }
                      className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm outline-none focus:border-stone-600"
                    />
                  </div>

                  <div className="bg-amber-50 border border-amber-200 text-xs text-stone-700 rounded p-3">
                    Kargonuzun size sorunsuz bir şekilde ulaşabilmesi için mahalle, cadde, sokak, bina gibi detay
                    bilgileri eksiksiz giriniz.
                  </div>

                  <div>
                    <label className="block text-xs text-stone-700 mb-1">Adres *</label>
                    <textarea
                      placeholder="Cadde, mahalle, sokak ve diğer bilgileri giriniz."
                      value={newAddress.detail}
                      onChange={(event) =>
                        setNewAddress((prev) => ({ ...prev, detail: event.target.value }))
                      }
                      rows={2}
                      className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm outline-none focus:border-stone-600 resize-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSaveNewAddress}
                      className="flex-1 bg-stone-900 text-white py-2.5 rounded text-sm hover:bg-stone-700 transition"
                    >
                      Kaydet
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingNewAddress(false)
                        setNewAddress({
                          firstName: '',
                          lastName: '',
                          phone: '',
                          city: '',
                          district: '',
                          neighborhood: '',
                          detail: '',
                        })
                      }}
                      className="px-4 border border-stone-300 py-2.5 rounded text-sm hover:border-stone-700 transition"
                    >
                      Vazgeç
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-stone-200">
              <button
                onClick={() => {
                  setSelectedAddressId(draftAddressId)
                  setIsAddressModalOpen(false)
                }}
                className="w-full bg-stone-900 text-white py-3 rounded hover:bg-stone-700 transition"
              >
                Adresi Seç
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Payment
