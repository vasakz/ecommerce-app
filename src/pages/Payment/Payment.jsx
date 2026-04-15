import { useMemo, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { clearCart } from '../../store/slices/cartSlice'
import { 
  CreditCard, Wallet, Truck, Gift, CheckCircle, XCircle, FileText, 
  ShieldCheck, AlertTriangle, ChevronDown, Check, Coins, Lock, Download,
  Clock, MapPin, Zap, Calendar, Info
} from 'lucide-react'

const priceToNumber = (price) => {
  if (typeof price === 'number') return price
  return Number(String(price).replace(/[^\d]/g, '')) || 0
}

function Payment() {
  const items = useSelector((state) => state.cart.items)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Delivery Method State
  const [deliveryMethod, setDeliveryMethod] = useState('standard')

  // Addresses State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
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
      detail: 'Kaşüstü Mahallesi, Sahil Cad. No:8, Ortahisar / Trabzon',
    },
  ])
  const [selectedAddressId, setSelectedAddressId] = useState('ev')
  const [draftAddressId, setDraftAddressId] = useState('ev')
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false)
  const [newAddress, setNewAddress] = useState({
    firstName: '', lastName: '', phone: '', city: '', district: '', neighborhood: '', detail: ''
  })
  const selectedAddress = addresses.find((address) => address.id === selectedAddressId) ?? addresses[0]

  // Payment Options State
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD') // CREDIT_CARD, DOOR, WALLET, OTHER
  const [isAgreementChecked, setIsAgreementChecked] = useState(false)
  
  // Credit Card Form State
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [cvv, setCvv] = useState('')
  const [saveCard, setSaveCard] = useState(false)
  const [use3DSecure, setUse3DSecure] = useState(true)
  const [selectedInstallmentCount, setSelectedInstallmentCount] = useState(1)

  // Door Payment State
  const [doorPaymentType, setDoorPaymentType] = useState('CASH') // CASH, POS

  // Wallet / Other State
  const [walletBalance, setWalletBalance] = useState(1250.50) // Mock Balance
  const [useWalletBalance, setUseWalletBalance] = useState(false)
  const [giftCode, setGiftCode] = useState('')
  const [appliedGiftCode, setAppliedGiftCode] = useState(false)

  // System State
  const [paymentStatus, setPaymentStatus] = useState('IDLE') // IDLE, PROCESSING, SUCCESS, FAILURE, RECEIPT
  const [failureReason, setFailureReason] = useState('')
  
  // Transaction Reference for Receipt
  const [transactionRef, setTransactionRef] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [paymentStatus])

  const { toplamAdet, araToplam, baseKargo, kargo, indirim, ekstraUcret, genelToplam, odenecekTutar } = useMemo(() => {
    const adet = items.reduce((total, item) => total + (item.quantity ?? 1), 0)
    const subtotal = items.reduce((total, item) => total + priceToNumber(item.fiyat ?? item.price) * (item.quantity ?? 1), 0)
    
    // Base Calculations
    const baseShipping = subtotal > 2000 || subtotal === 0 ? 0 : 149
    let applyDiscount = subtotal > 4000 ? 199 : 0
    if (appliedGiftCode) applyDiscount += 100 // Extra 100 TL discount for gift code
    
    // Extra Fees
    let extraFee = 0;

    const grandTotal = subtotal + baseShipping + extraFee - applyDiscount
    
    // Subtractions for Wallet
    let finalPayable = grandTotal
    if (paymentMethod === 'WALLET') {
      finalPayable = Math.max(0, grandTotal - walletBalance)
    }

    return {
      toplamAdet: adet,
      araToplam: subtotal,
      baseKargo: baseShipping,
      kargo: baseShipping,
      indirim: applyDiscount,
      ekstraUcret: extraFee,
      genelToplam: grandTotal,
      odenecekTutar: finalPayable,
    }
  }, [items, paymentMethod, appliedGiftCode, walletBalance])

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '')
    val = val.substring(0, 16)
    const formatted = val.replace(/(\d{4})/g, '$1 ').trim()
    setCardNumber(formatted)
  }

  const handleProcessPayment = () => {
    if (!isAgreementChecked) return
    setPaymentStatus('PROCESSING')

    setTimeout(() => {
      // Mock Frauld/Validation rules
      if (paymentMethod === 'CREDIT_CARD') {
        if (!cardName || cardNumber.replace(/\s/g, '').length !== 16 || !selectedMonth || !selectedYear || !cvv) {
          setFailureReason('Lütfen tüm kart bilgilerini eksiksiz giriniz.')
          setPaymentStatus('FAILURE')
          return
        }
        if (cvv === '000') {
          setFailureReason('Şüpheli işlem tespit edildi. (Fraud Detection) Hata Kodu: F-0034')
          setPaymentStatus('FAILURE')
          return
        }
      } else if (paymentMethod === 'WALLET') {
        if (walletBalance < odenecekTutar) {
          setFailureReason('Cüzdan bakiyeniz yetersiz. Lütfen bakiye yükleyin veya farklı bir ödeme yöntemi seçin.')
          setPaymentStatus('FAILURE')
          return
        }
        setWalletBalance(prev => prev - genelToplam)
      }

      // Success
      setTransactionRef(`TRX-${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`)
      setPaymentStatus('SUCCESS')
      dispatch(clearCart())
    }, 2500)
  }

  const retryPayment = () => {
    setPaymentStatus('IDLE')
    setFailureReason('')
  }

  // Helper arrays
  const monthOptions = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0'))
  const yearOptions = Array.from({ length: 12 }, (_, index) => String(new Date().getFullYear() + index))

  const installmentRows = useMemo(() => {
    const total = genelToplam
    const counts = [1, 2, 3, 4, 6]
    return counts.map((count) => {
      if (count === 1) return { count, label: 'Tek Çekim', rightText: `${total.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL` }
      const factor = 1 + (count * 0.02) // 2% markup per month installment
      const installmentTotal = total * factor
      const perMonth = Math.ceil((installmentTotal / count) * 100) / 100
      return { count, label: `${count} Taksit`, rightText: `${count} x ${perMonth.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL` }
    })
  }, [genelToplam])

  const handleSaveNewAddress = () => {
    const { firstName, lastName, phone, city, district, neighborhood, detail } = newAddress
    if (!firstName || !lastName || !phone || !city || !district || !neighborhood || !detail) return

    const createdAddress = {
      id: `addr-${Date.now()}`, title: neighborhood.toUpperCase(), recipient: `${firstName} ${lastName}`, phone, detail: `${detail}, ${neighborhood}, ${district} / ${city}`,
    }
    setAddresses((prev) => [...prev, createdAddress])
    setDraftAddressId(createdAddress.id)
    setIsAddingNewAddress(false)
    setNewAddress({ firstName: '', lastName: '', phone: '', city: '', district: '', neighborhood: '', detail: '' })
  }

  // --- VIEWS ---
  if (paymentStatus === 'PROCESSING') {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center bg-stone-50">
         <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-6"></div>
         <h2 className="text-2xl font-bold text-stone-800 mb-2">Ödemeniz İşleniyor</h2>
         <p className="text-stone-500">
           {paymentMethod === 'CREDIT_CARD' && use3DSecure ? '3D Secure doğrulaması yapılıyor...' : 'Bankanız ile iletişim kuruluyor, lütfen bekleyiniz...'}
         </p>
         <div className="mt-8 flex items-center gap-2 text-sm text-stone-400">
            <ShieldCheck size={16}/> Modül SSL / TLS Şifreleme ile Korunmaktadır.
         </div>
      </main>
    )
  }

  if (paymentStatus === 'FAILURE') {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center bg-stone-50 p-6">
         <XCircle className="w-20 h-20 text-red-500 mb-6" />
         <h2 className="text-3xl font-bold text-stone-900 mb-3">Ödeme Başarısız</h2>
         <p className="text-stone-600 mb-6 text-center max-w-md"> İşleminiz sırasında bir hata oluştu. <br/><span className="text-red-600 font-semibold mt-2 block">{failureReason}</span></p>
         <div className="flex gap-4">
           <button onClick={retryPayment} className="px-6 py-3 bg-stone-900 text-white rounded hover:bg-stone-800 transition">Tekrar Dene</button>
           <button onClick={() => navigate('/sepet')} className="px-6 py-3 border border-stone-300 text-stone-700 rounded hover:bg-stone-50 transition">Sepete Dön</button>
         </div>
      </main>
    )
  }

  if (paymentStatus === 'SUCCESS') {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center bg-stone-50 p-6">
         <CheckCircle className="w-20 h-20 text-emerald-500 mb-6" />
         <h2 className="text-3xl font-bold text-stone-900 mb-2">Siparişiniz Alındı!</h2>
         <p className="text-stone-600 mb-6">Ödemeniz başarıyla gerçekleşti. Bizi tercih ettiğiniz için teşekkür ederiz.</p>
         <div className="bg-white border border-stone-200 rounded-lg p-6 w-full max-w-md mb-6">
            <div className="flex justify-between border-b pb-3 mb-3">
              <span className="text-stone-500">Sipariş No:</span>
              <span className="font-semibold text-stone-800">SP-{Math.floor(Math.random() * 900000) + 100000}</span>
            </div>
            <div className="flex justify-between border-b pb-3 mb-3">
              <span className="text-stone-500">Ödenen Tutar:</span>
              <span className="font-bold text-emerald-600">{genelToplam.toLocaleString('tr-TR')} TL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Ödeme Yöntemi:</span>
              <span className="text-stone-800 font-medium">
                {paymentMethod === 'CREDIT_CARD' ? 'Kredi / Banka Kartı' : 
                 paymentMethod === 'DOOR' ? 'Kapıda Ödeme' : 
                 paymentMethod === 'WALLET' ? 'Uygulama Cüzdanı' : 'Diğer'}
              </span>
            </div>
         </div>
         <div className="flex gap-4">
           <button onClick={() => setPaymentStatus('RECEIPT')} className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              <FileText size={18}/> Ödeme Dekontu
           </button>
           <button onClick={() => navigate('/')} className="px-6 py-3 border border-stone-300 text-stone-700 rounded hover:bg-stone-50 transition">
              Alışverişe Devam Et
           </button>
         </div>
      </main>
    )
  }

  if (paymentStatus === 'RECEIPT') {
    return (
      <main className="min-h-[70vh] bg-stone-100 p-8 flex items-center justify-center">
         <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden print:shadow-none print:w-full">
            <div className="bg-stone-900 p-6 text-white text-center relative">
               <ShieldCheck className="absolute top-6 left-6 text-amber-500 opacity-20 w-16 h-16"/>
               <h1 className="text-2xl font-bold tracking-widest text-amber-500">E-COMMERCE APP</h1>
               <p className="text-stone-400 text-sm mt-1">Ödeme Dekontu / E-Arşiv Fatura</p>
            </div>
            <div className="p-8">
               <div className="flex justify-between text-sm text-stone-600 border-b border-stone-100 pb-6 mb-6">
                 <div>
                    <p className="font-semibold text-stone-800 mb-1">Müşteri Bilgileri</p>
                    <p>{selectedAddress.recipient}</p>
                    <p>{selectedAddress.phone}</p>
                    <p className="max-w-[200px] mt-1 text-xs">{selectedAddress.detail}</p>
                 </div>
                 <div className="text-right">
                    <p className="font-semibold text-stone-800 mb-1">İşlem Detayları</p>
                    <p>Tarih: {new Date().toLocaleDateString('tr-TR')} {new Date().toLocaleTimeString('tr-TR')}</p>
                    <p>İşlem No: {transactionRef}</p>
                    <p>Durum: <span className="text-emerald-500 font-semibold">BAŞARILI</span></p>
                 </div>
               </div>
               
               <table className="w-full text-sm text-left mb-6">
                 <thead className="text-xs text-stone-500 uppercase bg-stone-50">
                    <tr><th className="px-4 py-2 rounded-l">Açıklama</th><th className="px-4 py-2 text-right rounded-r">Tutar</th></tr>
                 </thead>
                 <tbody>
                    <tr className="border-b border-stone-50"><td className="px-4 py-3">Ürünler (Ara Toplam)</td><td className="px-4 py-3 text-right">{araToplam.toLocaleString('tr-TR')} TL</td></tr>
                    <tr className="border-b border-stone-50"><td className="px-4 py-3">Kargo Ücreti</td><td className="px-4 py-3 text-right">{kargo === 0 ? 'Ücretsiz' : `${kargo} TL`}</td></tr>
                    {ekstraUcret > 0 && <tr className="border-b border-stone-50"><td className="px-4 py-3">Kapıda Ödeme Hizmet Bedeli</td><td className="px-4 py-3 text-right">{ekstraUcret} TL</td></tr>}
                    {indirim > 0 && <tr className="border-b border-stone-50 text-emerald-600"><td className="px-4 py-3">İndirimler</td><td className="px-4 py-3 text-right">-{indirim.toLocaleString('tr-TR')} TL</td></tr>}
                 </tbody>
                 <tfoot>
                    <tr className="text-lg font-bold text-stone-900 border-t-2 border-stone-100"><td className="px-4 py-4">GENEL TOPLAM</td><td className="px-4 py-4 text-right">{genelToplam.toLocaleString('tr-TR')} TL</td></tr>
                 </tfoot>
               </table>

               <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex gap-3 text-sm text-amber-800 mb-8">
                  <ShieldCheck className="shrink-0 text-amber-600" />
                  <p>Bu dekont, e-posta adresinize ve telefonunuza SMS olarak gönderilmiştir. Bu dokümanı resmi bir e-fatura yerine kullanamazsınız.</p>
               </div>

               <div className="flex justify-between print:hidden">
                  <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2.5 border border-stone-300 text-stone-700 hover:bg-stone-50 transition rounded-lg">
                    <Download size={18}/> PDF İndir / Yazdır
                  </button>
                  <button onClick={() => navigate('/')} className="px-5 py-2.5 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition">
                    Ana Sayfaya Dön
                  </button>
               </div>
            </div>
         </div>
      </main>
    )
  }

  // --- MAIN CHECKOUT VIEW ---
  return (
    <main className="bg-stone-50 min-h-[70vh]">
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8 flex items-end justify-between border-b border-stone-200 pb-4">
          <div>
            <p className="text-xs tracking-widest text-stone-500 mb-1 flex items-center gap-2"><Lock size={12}/> GÜVENLİ ÖDEME</p>
            <h1 className="text-3xl font-bold tracking-wide text-stone-900">ÖDEME ADIMI</h1>
          </div>
          <Link to="/sepet" className="text-sm text-stone-600 hover:text-amber-600 transition underline-offset-4 hover:underline">
             Sepete dön
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            
            {/* ADDRESS SECTION */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xs tracking-widest font-bold text-stone-800 flex items-center gap-2"><Truck size={16}/> TESLİMAT ADRESİ</h2>
                <button
                  onClick={() => { setDraftAddressId(selectedAddressId); setIsAddressModalOpen(true) }}
                  className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded hover:bg-amber-100 transition"
                >
                  Değiştir / Ekle
                </button>
              </div>

              <div className="border border-stone-100 bg-stone-50 rounded-lg p-5 flex items-start gap-4">
                <div className="bg-white p-3 border border-stone-200 rounded-lg">
                  <Truck className="text-stone-400" size={24}/>
                </div>
                <div>
                    <h3 className="font-semibold text-stone-900 flex items-center gap-2">{selectedAddress.title} <span className="bg-stone-200 text-stone-600 text-[10px] px-2 py-0.5 rounded-full">Seçili</span></h3>
                    <p className="text-sm text-stone-600 mt-1">{selectedAddress.recipient} • {selectedAddress.phone}</p>
                    <p className="text-sm text-stone-500 mt-1">{selectedAddress.detail}</p>
                </div>
              </div>
            </div>

            {/* DELIVERY METHOD SECTION (New) */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-xs tracking-widest font-bold text-stone-800 mb-5 flex items-center gap-2">
                <Truck size={16}/> TESLİMAT SEÇENEKLERİ
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'standard', label: 'Standart Teslimat', desc: '2-5 İş Günü', price: 'Ücretsiz', icon: Truck },
                  { id: 'fast', label: 'Hızlı Teslimat', desc: 'Ertesi Gün Kapında', price: '₺29.90', icon: Clock },
                  { id: 'same_day', label: 'Aynı Gün Teslimat', desc: 'Bugün 21:00\'e kadar', price: '₺49.90', icon: Zap },
                  { id: 'scheduled', label: 'Belirli Saatte Teslim', desc: 'Size Uygun Saatte', price: '₺39.90', icon: Calendar },
                  { id: 'pickup', label: 'Mağazadan Teslim Alma', desc: 'En Yakın Atölye', price: 'Ücretsiz', icon: MapPin },
                  { id: 'neighbor', label: 'Komşuya Bırak', desc: 'Siz Yoksanız Komşunuzda', price: 'Ücretsiz', icon: Info },
                  { id: 'drop_point', label: 'Kargo Teslim Noktası', desc: 'Esnaf veya PUDO', price: 'Ücretsiz', icon: MapPin },
                ].map((method) => (
                  <label key={method.id} className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${
                    deliveryMethod === method.id ? 'border-stone-900 bg-stone-50' : 'border-stone-100 hover:border-stone-200 bg-white'
                  }`}>
                    <input 
                      type="radio" 
                      name="deliveryMethod" 
                      className="mt-1 accent-stone-900" 
                      checked={deliveryMethod === method.id} 
                      onChange={() => setDeliveryMethod(method.id)} 
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-stone-900">{method.label}</span>
                        <span className="text-xs font-bold text-stone-600">{method.price}</span>
                      </div>
                      <p className="text-xs text-stone-500">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* PAYMENT METHODS TABS */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-xs tracking-widest font-bold text-stone-800 mb-5 flex items-center gap-2"><Wallet size={16}/> ÖDEME YÖNTEMLERİ</h2>

              {/* MOCK: Fraud Detection Limits Notice */}
              <div className="mb-5 flex items-start gap-3 bg-stone-50 border border-stone-100 p-3 rounded-lg text-xs text-stone-500">
                  <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={16}/>
                  <p>Tüm işlemleriniz SSL sertifikası ile şifrelenmektedir. Limitsiz ve güvenilir alışverişin keyfini çıkarın. Başarısız ödeme deneme limiti 3'tür.</p>
              </div>

              <div className="flex bg-stone-100 p-1 rounded-lg mb-6 overflow-x-auto hide-scrollbar">
                  {[
                      { id: 'CREDIT_CARD', label: 'Banka / Kredi Kartı', icon: <CreditCard size={16}/> },
                      { id: 'WALLET', label: 'Cüzdan', icon: <Wallet size={16}/> },
                      { id: 'OTHER', label: 'Hediye/Puan', icon: <Gift size={16}/> }
                  ].map((method) => (
                      <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium rounded-md transition whitespace-nowrap ${
                              paymentMethod === method.id ? 'bg-white text-stone-900 shadow-sm border border-stone-200' : 'text-stone-500 hover:text-stone-700 hover:bg-stone-200'
                          }`}
                      >
                          {method.icon} {method.label}
                      </button>
                  ))}
                </div>

              {/* METHOD: CREDIT CARD */}
              {paymentMethod === 'CREDIT_CARD' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1.5">Kart Üzerindeki İsim</label>
                            <input type="text" value={cardName} onChange={e => setCardName(e.target.value)} placeholder="Örn: FEYZA ALSAN" className="w-full border border-stone-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition uppercase" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1.5">Kart Numarası</label>
                            <div className="relative">
                                <input type="text" value={cardNumber} onChange={handleCardNumberChange} placeholder="0000 0000 0000 0000" maxLength={19} className="w-full border border-stone-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition tracking-widest font-mono" />
                                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" size={18}/>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-stone-700 mb-1.5">Son Kul. Tarihi</label>
                                <div className="flex gap-2">
                                    <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="w-full border border-stone-300 rounded-lg px-2 py-2.5 text-sm outline-none focus:border-amber-600 bg-white">
                                        <option value="">Ay</option>{monthOptions.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="w-full border border-stone-300 rounded-lg px-2 py-2.5 text-sm outline-none focus:border-amber-600 bg-white">
                                        <option value="">Yıl</option>{yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-stone-700 mb-1.5">CVV</label>
                                <input type="password" value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0,3))} placeholder="***" maxLength={3} className="w-full border border-stone-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-600 text-center tracking-widest" />
                                <p className="text-[10px] text-stone-400 mt-1">CVV her işlemde istenir.</p>
                            </div>
                        </div>

                        <div className="pt-2 space-y-3">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-4 h-4 rounded flex items-center justify-center border transition ${saveCard ? 'bg-amber-600 border-amber-600' : 'border-stone-300 group-hover:border-stone-400'}`}>
                                    {saveCard && <Check size={12} className="text-white"/>}
                                </div>
                                <input type="checkbox" className="hidden" checked={saveCard} onChange={() => setSaveCard(!saveCard)} />
                                <span className="text-sm text-stone-600 group-hover:text-stone-900 transition">Kartımı sonraki alışverişlerim için kaydet</span>
                            </label>
                            
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-4 h-4 rounded flex items-center justify-center border transition ${use3DSecure ? 'bg-amber-600 border-amber-600' : 'border-stone-300 group-hover:border-stone-400'}`}>
                                    {use3DSecure && <Check size={12} className="text-white"/>}
                                </div>
                                <input type="checkbox" className="hidden" checked={use3DSecure} onChange={() => setUse3DSecure(!use3DSecure)} />
                                <div className="flex flex-col">
                                    <span className="text-sm text-stone-600 group-hover:text-stone-900 transition">3D Secure ile Öde</span>
                                    <span className="text-[10px] text-emerald-600 font-medium">Extra güvenlik onayı sağlanır, zorunludur.</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                        <h3 className="text-xs font-bold tracking-widest text-stone-700 bg-stone-100 px-4 py-3 border-b border-stone-200">TAKSİT SEÇENEKLERİ</h3>
                        <div className="divide-y divide-stone-200 text-sm max-h-[280px] overflow-y-auto">
                            {installmentRows.map((row) => (
                                <label key={row.count} className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition ${selectedInstallmentCount === row.count ? 'bg-white border-l-4 border-l-amber-500' : 'hover:bg-stone-100 border-l-4 border-l-transparent'}`}>
                                    <input type="radio" name="installment" checked={selectedInstallmentCount === row.count} onChange={() => setSelectedInstallmentCount(row.count)} className="accent-amber-600"/>
                                    <span className="flex-1 font-medium text-stone-800">{row.label}</span>
                                    <span className="text-stone-600 tabular-nums">{row.rightText}</span>
                                </label>
                            ))}
                        </div>
                        <div className="p-3 text-[10px] text-stone-500 bg-white border-t border-stone-200">Taksit seçenekleri banka ve kart tipine göre değişiklik gösterebilmektedir.</div>
                    </div>
                </div>
              )}


              {/* METHOD: APP WALLET */}
              {paymentMethod === 'WALLET' && (
                <div className="space-y-6 animate-fade-in max-w-lg mx-auto py-4 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-stone-100 rounded-full mb-2">
                        <Wallet className="text-stone-700" size={32}/>
                    </div>
                    <div>
                        <p className="text-sm tracking-widest text-stone-500 mb-1">CÜZDAN BAKİYENİZ</p>
                        <h3 className="text-4xl font-bold text-stone-900 tracking-tight">{walletBalance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} <span className="text-2xl text-stone-500">TL</span></h3>
                    </div>
                    
                    {walletBalance >= genelToplam ? (
                        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg text-emerald-800 text-sm flex flex-col items-center gap-2">
                            <CheckCircle size={20} className="text-emerald-500"/>
                            Bakiyeniz siparişi tamamlamak için yeterlidir.
                        </div>
                    ) : (
                        <div className="bg-red-50 border border-red-100 p-4 rounded-lg text-red-800 text-sm flex flex-col items-center gap-3">
                            <XCircle size={20} className="text-red-500"/>
                            <p>Bakiyeniz yetersiz. Lütfen cüzdanınıza yükleme yapınız veya farklı bir ödeme yöntemi seçiniz.</p>
                            <button className="bg-white border border-red-200 text-red-700 font-medium px-4 py-2 rounded shadow-sm hover:bg-red-50 transition">
                                Kart / Havale ile Bakiye Yükle
                            </button>
                        </div>
                    )}
                </div>
              )}

              {/* METHOD: OTHER / GIFT / POINTS */}
              {paymentMethod === 'OTHER' && (
                <div className="space-y-6 animate-fade-in py-4 px-2 max-w-md">
                    <div className="space-y-2">
                         <h3 className="text-sm font-semibold text-stone-800">Hediye Çeki veya Promosyon Kodu</h3>
                         <p className="text-xs text-stone-500 mb-2">Kupon kodunuz veya hediye çekiniz varsa ilgili alana giriniz.</p>
                         <div className="flex gap-2">
                             <input type="text" value={giftCode} onChange={e => setGiftCode(e.target.value)} placeholder="Kod Giriniz" className="flex-1 border border-stone-300 rounded px-4 py-2 outline-none focus:border-stone-900 uppercase" disabled={appliedGiftCode}/>
                             <button 
                                disabled={!giftCode || appliedGiftCode} 
                                onClick={() => setAppliedGiftCode(true)}
                                className="bg-stone-900 text-white px-5 rounded font-medium disabled:opacity-50 transition">
                                {appliedGiftCode ? 'Uygulandı' : 'Uygula'}
                             </button>
                         </div>
                         {appliedGiftCode && <p className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1"><Check size={14}/> Hediye çeki uygulandı! (100 TL İndirim)</p>}
                    </div>

                    <div className="border-t border-stone-200 pt-6 space-y-2 mt-6">
                        <h3 className="text-sm font-semibold text-stone-800">Sadakat Puanı (Kısmi/Tam Ödeme)</h3>
                        <p className="text-xs text-stone-500 mb-3">Hesabınızda kullanılabilir puan bulunmamaktadır (0 Puan).</p>
                        <button disabled className="w-full bg-stone-100 text-stone-400 py-3 rounded text-sm font-medium cursor-not-allowed">
                            Puan ile Öde
                        </button>
                    </div>
                </div>
              )}
            </div>

            {/* AGREEMENTS */}
            <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
                <label className="flex items-start gap-3 cursor-pointer group">
                    <div className={`mt-0.5 w-5 h-5 shrink-0 rounded flex items-center justify-center border transition ${isAgreementChecked ? 'bg-amber-600 border-amber-600' : 'border-stone-300 group-hover:border-stone-400'}`}>
                        {isAgreementChecked && <Check size={14} className="text-white"/>}
                    </div>
                    <input type="checkbox" className="hidden" checked={isAgreementChecked} onChange={() => setIsAgreementChecked(!isAgreementChecked)}/>
                    <p className="text-sm text-stone-600">
                        Siparişi onaylayarak, <span className="underline hover:text-stone-900">Ön Bilgilendirme Formunu</span> ve <span className="underline hover:text-stone-900">Mesafeli Satış Sözleşmesini</span> okuduğumu ve kabul ettiğimi onaylıyorum.
                    </p>
                </label>
            </div>
          </div>

          {/* ORDER SUMMARY SIDEBAR */}
          <aside className="lg:sticky lg:top-8 bg-amber-500 text-white rounded-xl shadow-[0_10px_40px_-10px_rgba(245,158,11,0.5)] overflow-hidden flex flex-col border border-amber-400">
            <div className="p-6">
                <h2 className="text-xs tracking-widest font-bold text-amber-100 mb-6 border-b border-amber-400/50 pb-4">SİPARİŞ ÖZETİ</h2>
                <div className="space-y-4 text-sm text-amber-50 mb-6">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-amber-100">Sepetteki Ürünler ({toplamAdet})</span>
                    <span className="text-white font-bold">{araToplam.toLocaleString('tr-TR')} TL</span>
                </div>
                {baseKargo > 0 && (
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-amber-100">Kargo</span>
                        <span className="text-white font-bold">{baseKargo} TL</span>
                    </div>
                )}
                {baseKargo === 0 && (
                    <div className="flex items-center justify-between text-yellow-100">
                        <span className="font-bold">Kargo İndirimi</span>
                        <span className="font-bold uppercase tracking-widest bg-yellow-400/30 px-2 py-0.5 rounded text-[10px]">Ücretsiz</span>
                    </div>
                )}
                {ekstraUcret > 0 && (
                     <div className="flex items-center justify-between">
                        <span className="font-medium text-amber-100">Kapıda Ödeme Bedeli</span>
                        <span className="text-white font-bold">{ekstraUcret} TL</span>
                     </div>
                )}
                {indirim > 0 && (
                    <div className="flex items-center justify-between text-yellow-100">
                        <span className="font-medium">İndirim</span>
                        <span className="font-bold">-{indirim.toLocaleString('tr-TR')} TL</span>
                    </div>
                )}
                </div>

                <div className="border-t border-amber-400/50 pt-5 pb-2 border-b border-amber-400/50 mb-6">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-amber-100 font-medium">Genel Toplam</span>
                        <span className="text-white font-bold">{genelToplam.toLocaleString('tr-TR')} TL</span>
                    </div>
                    {paymentMethod === 'WALLET' && walletBalance > 0 && (
                        <div className="flex items-center justify-between mt-2 text-yellow-200 font-bold">
                            <span>Cüzdandan Düşülecek</span>
                            <span>-{Math.min(walletBalance, genelToplam).toLocaleString('tr-TR')} TL</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-xs text-amber-100 mb-1 font-bold">ÖDENECEK TUTAR</span>
                    <span className="text-4xl font-black text-white tracking-tight">{odenecekTutar.toLocaleString('tr-TR')} <span className="text-xl font-bold text-amber-200">TL</span></span>
                </div>
            </div>

            <button
                onClick={handleProcessPayment}
                disabled={!isAgreementChecked || (paymentMethod === 'WALLET' && walletBalance < genelToplam)}
                className={`w-full py-5 text-sm font-black tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-xl ${
                    !isAgreementChecked || (paymentMethod === 'WALLET' && walletBalance < genelToplam)
                    ? 'bg-amber-600/50 text-amber-200 cursor-not-allowed border-t border-amber-600/30'
                    : 'bg-stone-900 text-white hover:bg-stone-800 shadow-stone-900/20 hover:shadow-stone-900/40 transform active:scale-[0.98]'
                }`}
            >
                <Lock size={18} className={!isAgreementChecked ? 'text-amber-200' : 'text-white'}/>
                ÖDEMEYİ TAMAMLA
            </button>
          </aside>
        </div>
      </section>

      {/* ADDRESS MODAL */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-xl border border-stone-200 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-sm font-bold tracking-widest text-stone-800">TESLİMAT ADRESİ SEÇİMİ</h3>
              <button onClick={() => setIsAddressModalOpen(false)} className="text-stone-500 hover:text-stone-900 transition"><XCircle/></button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              {addresses.map((address) => {
                const isSelected = draftAddressId === address.id
                return (
                  <label key={address.id} className={`block border-2 rounded-xl p-4 cursor-pointer transition ${isSelected ? 'border-amber-600 bg-amber-50/30 shadow-sm' : 'border-stone-200 hover:border-stone-300 bg-white'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-4">
                        <div className={`mt-0.5 w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition ${isSelected ? 'border-amber-600' : 'border-stone-300'}`}>
                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-amber-600"/>}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-stone-900 uppercase tracking-wide">{address.title}</p>
                          <p className="text-xs text-stone-500 mt-1">{address.recipient} - {address.phone}</p>
                          <p className="text-sm text-stone-700 mt-2 leading-relaxed">{address.detail}</p>
                        </div>
                      </div>
                      <button type="button" className="text-xs font-medium text-stone-400 hover:text-stone-900 transition underline underline-offset-2">Düzenle</button>
                    </div>
                  </label>
                )
              })}

              {!isAddingNewAddress ? (
                  <button type="button" onClick={() => setIsAddingNewAddress(true)} className="w-full border-2 border-dashed border-stone-200 bg-stone-50 text-stone-600 rounded-xl p-4 text-sm font-medium hover:border-stone-400 hover:text-stone-900 transition">
                    + Yeni Adres Ekle
                  </button>
              ) : (
                <div className="border border-stone-200 rounded-xl p-5 space-y-4 bg-stone-50 mt-4">
                  <h4 className="text-sm font-bold text-stone-800 uppercase tracking-wider mb-2">Adres Bilgileri</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Ad *</label>
                      <input type="text" value={newAddress.firstName} onChange={(e) => setNewAddress(p => ({ ...p, firstName: e.target.value }))} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-600 bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Soyad *</label>
                      <input type="text" value={newAddress.lastName} onChange={(e) => setNewAddress(p => ({ ...p, lastName: e.target.value }))} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-600 bg-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Telefon *</label>
                    <input type="text" placeholder="05xx xxx xx xx" value={newAddress.phone} onChange={(e) => setNewAddress(p => ({ ...p, phone: e.target.value }))} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-600 bg-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">İl *</label>
                      <input type="text" value={newAddress.city} onChange={(e) => setNewAddress(p => ({ ...p, city: e.target.value }))} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-600 bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">İlçe *</label>
                      <input type="text" value={newAddress.district} onChange={(e) => setNewAddress(p => ({ ...p, district: e.target.value }))} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-600 bg-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Mahalle *</label>
                    <input type="text" value={newAddress.neighborhood} onChange={(e) => setNewAddress(p => ({ ...p, neighborhood: e.target.value }))} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-600 bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Açık Adres *</label>
                    <textarea placeholder="Cadde, sokak, bina no vb." value={newAddress.detail} onChange={(e) => setNewAddress(p => ({ ...p, detail: e.target.value }))} rows={2} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-600 bg-white resize-none" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={handleSaveNewAddress} className="flex-1 bg-stone-900 text-white font-medium py-2.5 rounded-lg text-sm hover:bg-stone-800 transition">Kaydet</button>
                    <button type="button" onClick={() => setIsAddingNewAddress(false)} className="px-5 border border-stone-300 font-medium py-2.5 rounded-lg text-sm hover:bg-stone-200 transition bg-white text-stone-700">Vazgeç</button>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-stone-200 bg-white">
              <button
                onClick={() => { setSelectedAddressId(draftAddressId); setIsAddressModalOpen(false) }}
                className="w-full bg-stone-900 text-white font-bold tracking-wide py-3.5 rounded-xl hover:bg-stone-800 transition"
              >
                SEÇİLİ ADRESİ KULLAN
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Payment
