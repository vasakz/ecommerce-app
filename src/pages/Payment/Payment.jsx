import { useMemo, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { clearCart } from '../../store/slices/cartSlice'
import { 
  CreditCard, Wallet, Truck, Gift, CheckCircle, XCircle, FileText, 
  ShieldCheck, AlertTriangle, ChevronDown, Check, Coins, Lock, Download,
  Clock, MapPin, Zap, Calendar, Info, ArrowRight, ShoppingBag
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
      <main className="min-h-[70vh] flex flex-col items-center justify-center bg-stone-50/50">
         <div className="relative w-20 h-20 mb-8">
           <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full"></div>
           <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
         </div>
         <h2 className="text-3xl font-black text-stone-900 mb-3 tracking-tight">Ödemeniz İşleniyor</h2>
         <p className="text-stone-500 text-lg font-medium text-center max-w-sm">
           {paymentMethod === 'CREDIT_CARD' && use3DSecure ? '3D Secure güvenli doğrulama sayfasına yönlendiriliyorsunuz...' : 'İşleminiz güvenli bir şekilde tamamlanıyor, lütfen pencereyi kapatmayınız.'}
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
         <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-8 ring-8 ring-red-50/50">
           <XCircle className="w-12 h-12 text-red-500" />
         </div>
         <h2 className="text-3xl font-black text-stone-900 mb-3 tracking-tight text-center">İşlem Onaylanamadı</h2>
         <p className="text-stone-500 mb-8 text-center max-w-md leading-relaxed"> 
           Ödeme işlemi sırasında bir sorunla karşılaştık. <br/>
           <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-bold mt-4 inline-block border border-red-100">{failureReason || 'Banka bağlantısı başarısız oldu.'}</span>
         </p>
         <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
           <button onClick={retryPayment} className="flex-1 px-8 py-4 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-all shadow-lg hover:shadow-stone-900/20">Tekrar Dene</button>
           <button onClick={() => navigate('/sepet')} className="flex-1 px-8 py-4 border border-stone-200 text-stone-600 font-bold rounded-xl hover:bg-stone-100 transition-all">Sepete Dön</button>
         </div>
      </main>
    )
  }

  if (paymentStatus === 'SUCCESS') {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center bg-stone-50 p-6">
         <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8 ring-8 ring-emerald-50/50">
           <CheckCircle className="w-12 h-12 text-emerald-500" />
         </div>
         <h2 className="text-4xl font-black text-stone-900 mb-3 tracking-tight">Siparişiniz Alındı!</h2>
         <p className="text-stone-500 mb-10 text-lg font-medium">Güvenli ödeme işleminiz başarıyla tamamlandı.</p>
         
         <div className="bg-white border border-stone-100 rounded-3xl p-8 w-full max-w-md mb-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center border-b border-stone-50 pb-4 mb-4">
              <span className="text-stone-400 font-medium">Sipariş No</span>
              <span className="font-bold text-stone-900 tracking-wider">#SP-{Math.floor(Math.random() * 900000) + 100000}</span>
            </div>
            <div className="flex justify-between items-center border-b border-stone-50 pb-4 mb-4">
              <span className="text-stone-400 font-medium">Toplam Tutar</span>
              <span className="font-black text-2xl text-stone-900 tracking-tight">{genelToplam.toLocaleString('tr-TR')} <span className="text-sm font-bold text-stone-400">TL</span></span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-400 font-medium">Ödeme Yöntemi</span>
              <span className="text-stone-700 font-bold bg-stone-50 px-3 py-1 rounded-full text-xs">
                {paymentMethod === 'CREDIT_CARD' ? 'Kredi / Banka Kartı' : 
                 paymentMethod === 'DOOR' ? 'Kapıda Ödeme' : 
                 paymentMethod === 'WALLET' ? 'Cüzdan Bakiyesi' : 'Hediye/Promosyon'}
              </span>
            </div>
         </div>
         
         <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
           <button onClick={() => setPaymentStatus('RECEIPT')} className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-amber-500 text-white font-black rounded-2xl hover:bg-amber-600 transition-all shadow-[0_15px_30px_-10px_rgba(245,158,11,0.5)] hover:-translate-y-1">
              <FileText size={20}/> Dekontu Görüntüle
           </button>
           <button onClick={() => navigate('/')} className="flex-1 px-8 py-4 bg-white border border-stone-200 text-stone-900 font-black rounded-2xl hover:bg-stone-50 transition-all shadow-sm">
              Devam Et
           </button>
         </div>
      </main>
    )
  }

  if (paymentStatus === 'RECEIPT') {
    return (
      <main className="min-h-[70vh] bg-stone-50 p-4 md:p-12 flex items-center justify-center">
         <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.1)] overflow-hidden print:shadow-none print:w-full border border-stone-100">
            <div className="bg-stone-900 p-10 text-white relative overflow-hidden">
               {/* Decorative Gradient Overlay */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
               
               <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div>
                   <h1 className="text-3xl font-black tracking-tight text-white mb-1 uppercase italic">
                     E-COMMERCE <span className="text-amber-500">APP</span>
                   </h1>
                   <p className="text-stone-400 text-xs font-bold tracking-[0.3em] uppercase">Resmi İşlem Dekontu</p>
                 </div>
                 <div className="text-left md:text-right">
                    <p className="text-amber-500 text-sm font-black mb-1">DURUM: BAŞARILI</p>
                    <p className="text-stone-500 text-[10px] font-bold tracking-widest uppercase">{new Date().toLocaleDateString('tr-TR')} | {new Date().toLocaleTimeString('tr-TR')}</p>
                 </div>
               </div>
            </div>
            
            <div className="p-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-10 mb-10 border-b border-stone-50">
                 <div>
                    <h4 className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-4">Müşteri & Teslimat</h4>
                    <p className="text-stone-900 font-black text-lg mb-1 tracking-tight uppercase">{selectedAddress.recipient}</p>
                    <p className="text-stone-500 font-bold text-sm mb-3">{selectedAddress.phone}</p>
                    <p className="text-stone-400 text-xs leading-relaxed max-w-[240px] font-medium">{selectedAddress.detail}</p>
                 </div>
                 <div className="md:text-right flex flex-col md:items-end">
                    <h4 className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-4">Referans Bilgileri</h4>
                    <div className="bg-stone-50 p-4 rounded-2xl inline-block">
                      <p className="text-stone-400 text-[10px] font-bold mb-1 uppercase">İşlem ID</p>
                      <p className="text-stone-900 font-black tracking-widest text-sm">{transactionRef}</p>
                    </div>
                 </div>
               </div>
               
               <div className="mb-10">
                 <h4 className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-6">Sipariş Kalemleri</h4>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center bg-stone-50/50 p-4 rounded-xl">
                      <span className="text-sm font-bold text-stone-600">Ürünlerin Toplam Bedeli</span>
                      <span className="text-sm font-black text-stone-900">{araToplam.toLocaleString('tr-TR')} TL</span>
                    </div>
                    <div className="flex justify-between items-center p-4">
                      <span className="text-sm font-bold text-stone-600">Lojistik ve Operasyon</span>
                      <span className="text-sm font-black text-stone-900">{kargo === 0 ? 'ÜCRETSİZ' : `${kargo} TL`}</span>
                    </div>
                    {indirim > 0 && (
                      <div className="flex justify-between items-center bg-emerald-50/30 p-4 rounded-xl text-emerald-600">
                        <span className="text-sm font-bold">Uygulanan İndirimler</span>
                        <span className="text-sm font-black">-{indirim.toLocaleString('tr-TR')} TL</span>
                      </div>
                    )}
                 </div>
               </div>

               <div className="flex justify-between items-center bg-stone-900 rounded-3xl p-8 mb-10 shadow-2xl shadow-stone-900/10">
                  <span className="text-stone-400 font-black tracking-[0.2em] text-[10px] uppercase">Ödenen Toplam Tutar</span>
                  <div className="text-white text-right">
                    <span className="text-4xl font-black tracking-tighter italic">{genelToplam.toLocaleString('tr-TR')}</span>
                    <span className="text-lg font-bold text-amber-500 ml-1">TL</span>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row justify-between items-center gap-6 print:hidden">
                  <button onClick={() => window.print()} className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 border border-stone-200 text-stone-900 font-black rounded-2xl hover:bg-stone-50 transition-all text-xs tracking-widest uppercase">
                    <Download size={18} className="text-amber-500"/> PDF OLARAK KAYDET
                  </button>
                  <button onClick={() => navigate('/')} className="w-full sm:w-auto px-10 py-4 bg-stone-900 text-white font-black rounded-2xl hover:bg-black transition-all text-xs tracking-widest uppercase shadow-xl shadow-stone-900/20">
                    ANASAYFAYA DÖN
                  </button>
               </div>
               
               <p className="text-center text-stone-300 text-[10px] font-medium mt-10 tracking-widest uppercase">
                 Bu belge sistem tarafından otomatik oluşturulmuştur.
               </p>
            </div>
         </div>
      </main>
    )
  }

  // --- MAIN CHECKOUT VIEW ---
  return (
    <main className="bg-stone-50 min-h-[70vh]">
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-black tracking-widest flex items-center gap-1">
                <ShieldCheck size={10}/> SECURE CHECKOUT
              </div>
              <div className="w-1 h-1 bg-stone-300 rounded-full"></div>
              <p className="text-[10px] font-bold text-stone-400 tracking-widest uppercase">SSL Bit 256</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight">
              Ödeme <span className="text-amber-600 italic">Adımı</span>
            </h1>
            <p className="text-stone-500 mt-2 font-medium">Siparişinizi tamamlamaya sadece bir adım kaldı.</p>
          </div>
          <Link to="/sepet" className="group flex items-center gap-2 text-sm font-bold text-stone-400 hover:text-stone-900 transition-all">
             <ArrowRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
             SEPETE GERİ DÖN
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            
            {/* ADDRESS SECTION */}
            <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-500">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                    <Truck size={20}/>
                  </div>
                  <h2 className="text-xs tracking-[0.2em] font-black text-stone-400 uppercase">Teslimat Adresi</h2>
                </div>
                <button
                  onClick={() => { setDraftAddressId(selectedAddressId); setIsAddressModalOpen(true) }}
                  className="text-[10px] font-black tracking-widest text-amber-600 border border-amber-100 px-4 py-2 rounded-full hover:bg-amber-600 hover:text-white transition-all duration-300"
                >
                  DEĞİŞTİR
                </button>
              </div>

              <div className="group relative border-2 border-amber-500/10 bg-stone-50/30 rounded-2xl p-6 transition-all duration-500 hover:border-amber-500/30">
                <div className="flex items-start gap-5">
                    <div className="mt-1">
                      <div className="w-12 h-12 bg-white border border-stone-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                        <MapPin className="text-amber-500" size={24}/>
                      </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-stone-900 text-lg uppercase tracking-tight">{selectedAddress.title}</h3>
                          <span className="bg-amber-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full tracking-widest">VARSAYILAN</span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-stone-700 font-bold text-sm tracking-tight">{selectedAddress.recipient} <span className="mx-2 text-stone-300">|</span> <span className="text-stone-400 font-medium">{selectedAddress.phone}</span></p>
                          <p className="text-sm text-stone-500 font-medium leading-relaxed max-w-md">{selectedAddress.detail}</p>
                        </div>
                    </div>
                </div>
              </div>
            </div>

            {/* DELIVERY METHOD SECTION */}
            <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                  <Zap size={20}/>
                </div>
                <h2 className="text-xs tracking-[0.2em] font-black text-stone-400 uppercase">Teslimat Seçenekleri</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: 'standard', label: 'Standart', desc: '2-5 İş Günü', price: 'Ücretsiz', icon: Truck },
                  { id: 'fast', label: 'Hızlı', desc: 'Ertesi Gün', price: '₺29.90', icon: Clock },
                  { id: 'same_day', label: 'Aynı Gün', desc: 'Bugün Teslim', price: '₺49.90', icon: Zap },
                ].map((method) => {
                  const Icon = method.icon
                  const isSelected = deliveryMethod === method.id
                  return (
                    <label key={method.id} className={`group relative flex flex-col gap-4 p-5 rounded-2xl cursor-pointer border-2 transition-all duration-500 ${
                      isSelected ? 'border-amber-500 bg-amber-50/30' : 'border-stone-50 hover:border-stone-100 bg-white'
                    }`}>
                      <input 
                        type="radio" 
                        name="deliveryMethod" 
                        className="hidden" 
                        checked={isSelected} 
                        onChange={() => setDeliveryMethod(method.id)} 
                      />
                      <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-xl transition-all duration-500 ${isSelected ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'bg-stone-50 text-stone-400 group-hover:bg-amber-50'}`}>
                          <Icon size={20}/>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 transition-all ${isSelected ? 'border-amber-500 bg-amber-500' : 'border-stone-200'}`}>
                          {isSelected && <Check size={12} className="text-white"/>}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-bold tracking-tight ${isSelected ? 'text-stone-900' : 'text-stone-800'}`}>{method.label}</span>
                          <span className={`text-xs font-black ${isSelected ? 'text-amber-600' : 'text-stone-400'}`}>{method.price}</span>
                        </div>
                        <p className="text-[10px] text-stone-500 font-medium uppercase tracking-wider">{method.desc}</p>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* PAYMENT METHODS */}
            <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                  <Wallet size={20}/>
                </div>
                <h2 className="text-xs tracking-[0.2em] font-black text-stone-400 uppercase">Ödeme Yöntemi</h2>
              </div>

              <div className="flex bg-stone-100 p-1 rounded-2xl mb-10 overflow-x-auto no-scrollbar border border-stone-200">
                  {[
                      { id: 'CREDIT_CARD', label: 'Banka / Kredi Kartı', icon: <CreditCard size={16}/> },
                      { id: 'WALLET', label: 'Cüzdan Bakiyesi', icon: <Wallet size={16}/> },
                      { id: 'OTHER', label: 'Hediye Kartı', icon: <Gift size={16}/> }
                  ].map((method) => (
                      <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 text-[11px] font-black tracking-widest uppercase rounded-xl transition-all duration-300 whitespace-nowrap ${
                              paymentMethod === method.id ? 'bg-white text-stone-900 shadow-lg border border-stone-200' : 'text-stone-400 hover:text-stone-600'
                          }`}
                      >
                          {method.icon} {method.label}
                      </button>
                  ))}
                </div>

              {/* METHOD: CREDIT CARD */}
              {paymentMethod === 'CREDIT_CARD' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-fadeIn">
                    <div className="space-y-6">
                        <div className="group">
                            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2 group-focus-within:text-amber-600 mt-2 transition-colors">Kart Sahibi</label>
                            <input type="text" value={cardName} onChange={e => setCardName(e.target.value)} placeholder="Kart Üzerindeki İsim" className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm font-bold text-stone-900 outline-none focus:border-amber-500 focus:bg-white transition-all uppercase placeholder:text-stone-300" />
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2 group-focus-within:text-amber-600 transition-colors">Kart Numarası</label>
                            <div className="relative">
                                <input type="text" value={cardNumber} onChange={handleCardNumberChange} placeholder="0000 0000 0000 0000" maxLength={19} className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm font-bold text-stone-900 outline-none focus:border-amber-500 focus:bg-white transition-all tracking-[0.25em] font-mono placeholder:text-stone-300" />
                                <CreditCard className="absolute right-6 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-amber-500 transition-colors" size={20}/>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2 group-focus-within:text-amber-600 transition-colors">S.K.T.</label>
                                <div className="flex gap-2">
                                    <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-4 py-4 text-sm font-bold text-stone-900 outline-none focus:border-amber-500 focus:bg-white transition-all appearance-none">
                                        <option value="">Ay</option>{monthOptions.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-4 py-4 text-sm font-bold text-stone-900 outline-none focus:border-amber-500 focus:bg-white transition-all appearance-none">
                                        <option value="">Yıl</option>{yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="group">
                                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2 group-focus-within:text-amber-600 transition-colors">CVV</label>
                                <input type="password" value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0,3))} placeholder="***" maxLength={3} className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-4 py-4 text-sm font-black text-stone-900 outline-none focus:border-amber-500 focus:bg-white transition-all text-center tracking-[0.5em] placeholder:text-stone-300" />
                            </div>
                        </div>

                        <div className="pt-2 space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-lg flex items-center justify-center border-2 transition ${saveCard ? 'bg-amber-600 border-amber-600 shadow-lg shadow-amber-600/20' : 'border-stone-200 group-hover:border-stone-300'}`}>
                                    {saveCard && <Check size={12} className="text-white"/>}
                                </div>
                                <input type="checkbox" className="hidden" checked={saveCard} onChange={() => setSaveCard(!saveCard)} />
                                <span className="text-sm font-medium text-stone-500 group-hover:text-stone-900 transition">Kartımı sonraki alışverişlerim için güvenle kaydet.</span>
                            </label>
                        </div>
                    </div>

                    <div className="bg-stone-50 border border-stone-100 rounded-3xl p-6 self-start">
                        <div className="flex items-center gap-2 mb-6">
                           <ShieldCheck className="text-emerald-500" size={14}/>
                           <h3 className="text-[10px] font-black tracking-widest text-emerald-700 uppercase">Taksit Seçenekleri</h3>
                        </div>
                        <div className="space-y-3">
                            {installmentRows.map((row) => (
                                <label key={row.count} className={`flex items-center gap-4 px-5 py-4 rounded-2xl cursor-pointer transition-all border-2 ${selectedInstallmentCount === row.count ? 'border-amber-500 bg-white shadow-md' : 'border-transparent bg-white/50 hover:bg-white'}`}>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedInstallmentCount === row.count ? 'border-amber-500 bg-amber-500' : 'border-stone-200'}`}>
                                      {selectedInstallmentCount === row.count && <Check size={12} className="text-white"/>}
                                    </div>
                                    <input type="radio" name="installment" checked={selectedInstallmentCount === row.count} onChange={() => setSelectedInstallmentCount(row.count)} className="hidden"/>
                                    <div className="flex-1">
                                      <p className={`text-sm font-bold tracking-tight ${selectedInstallmentCount === row.count ? 'text-stone-900' : 'text-stone-800'}`}>{row.label}</p>
                                      <p className={`text-[10px] font-medium tracking-wide ${selectedInstallmentCount === row.count ? 'text-amber-600' : 'text-stone-400'}`}>{row.rightText}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
              )}

              {/* WALLET & OTHER - Already decent, no major changes but small polish */}
              {paymentMethod === 'WALLET' && (
                <div className="space-y-8 animate-fadeIn max-w-lg mx-auto py-10 text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-stone-50 border border-stone-100 rounded-full mb-2 shadow-inner">
                        <Wallet className="text-amber-600" size={40}/>
                    </div>
                    <div>
                        <p className="text-[10px] font-black tracking-[0.3em] text-stone-400 mb-2 uppercase">Kullanılabilir Bakiye</p>
                        <h3 className="text-5xl font-serif text-stone-900 tracking-tight">{walletBalance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} <span className="text-2xl font-sans text-stone-400">₺</span></h3>
                    </div>
                    
                    {walletBalance >= genelToplam ? (
                        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl text-emerald-800 text-sm font-bold flex flex-col items-center gap-2">
                            <CheckCircle size={24} className="text-emerald-500 mb-2"/>
                            Bakiyeniz bu siparişi tamamlamak için yeterlidir.
                        </div>
                    ) : (
                        <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl text-rose-800 text-sm font-bold flex flex-col items-center gap-4">
                            <AlertTriangle size={24} className="text-rose-500 mb-2"/>
                            <p>Yetersiz Bakiye. Lütfen cüzdanınıza yükleme yapın veya farklı bir yöntem seçin.</p>
                            <button className="bg-white border border-rose-200 text-rose-700 px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md transition">
                                Hemen Bakiye Yükle
                            </button>
                        </div>
                    )}
                </div>
              )}
            </div>

            {/* AGREEMENTS */}
            <div className="bg-stone-100/50 border border-stone-200 rounded-3xl p-6">
                <label className="flex items-start gap-4 cursor-pointer group">
                    <div className={`mt-0.5 w-5 h-5 shrink-0 rounded-lg flex items-center justify-center border-2 transition ${isAgreementChecked ? 'bg-amber-600 border-amber-600 shadow-md shadow-amber-600/20' : 'border-stone-300 bg-white group-hover:border-stone-400'}`}>
                        {isAgreementChecked && <Check size={14} className="text-white"/>}
                    </div>
                    <input type="checkbox" className="hidden" checked={isAgreementChecked} onChange={() => setIsAgreementChecked(!isAgreementChecked)}/>
                    <p className="text-[13px] text-stone-500 leading-relaxed font-medium">
                      Siparişi tamamlayarak, <span className="text-stone-900 underline underline-offset-2 hover:text-amber-600 transition-colors">Ön Bilgilendirme Formunu</span> ve <span className="text-stone-900 underline underline-offset-2 hover:text-amber-600 transition-colors">Mesafeli Satış Sözleşmesini</span> onaylamış sayılırsınız.
                    </p>
                </label>
            </div>
          </div>

          {/* ORDER SUMMARY SIDEBAR */}
          <aside className="lg:col-span-4 lg:sticky lg:top-8">
            <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xl shadow-stone-200/50">
              <div className="bg-stone-900 p-8 text-white relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000 rotate-12">
                    <ShoppingBag size={120} />
                  </div>
                  <h2 className="text-[10px] tracking-[0.4em] font-black text-amber-500 mb-8 border-b border-white/10 pb-4 uppercase">Sipariş Detayı</h2>
                  
                  <ul className="space-y-4 mb-10">
                    <li className="flex justify-between items-center text-sm">
                      <span className="text-stone-400 font-medium tracking-wide">Ürünler ({toplamAdet})</span>
                      <span className="font-bold tracking-tight">{araToplam.toLocaleString('tr-TR')} ₺</span>
                    </li>
                    <li className="flex justify-between items-center text-sm">
                      <span className="text-stone-400 font-medium tracking-wide">Gönderim Ücreti</span>
                      <span className="font-bold tracking-tight">{kargo === 0 ? <span className="text-amber-500">Ücretsiz</span> : `${kargo} ₺`}</span>
                    </li>
                    {indirim > 0 && (
                      <li className="flex justify-between items-center bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                        <span className="text-xs font-black uppercase text-emerald-400">İndirim</span>
                        <span className="font-black text-emerald-400">-{indirim.toLocaleString('tr-TR')} ₺</span>
                      </li>
                    )}
                  </ul>

                  <div className="pt-6 border-t border-white/10 flex flex-col items-end">
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-1">Toplam</span>
                    <p className="text-5xl font-bold tracking-tighter italic">
                      {genelToplam.toLocaleString('tr-TR')} <span className="text-xl font-sans not-italic text-stone-500">₺</span>
                    </p>
                  </div>
              </div>

              <div className="p-8">
                <button
                    onClick={handleProcessPayment}
                    disabled={!isAgreementChecked || (paymentMethod === 'WALLET' && walletBalance < genelToplam)}
                    className={`group relative w-full py-5 rounded-2xl text-xs font-black tracking-[0.3em] uppercase transition-all duration-500 ${
                        !isAgreementChecked || (paymentMethod === 'WALLET' && walletBalance < genelToplam)
                        ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
                        : 'bg-amber-600 text-white shadow-2xl shadow-amber-600/30 hover:bg-amber-700 active:scale-95'
                    }`}
                >
                    <div className="relative z-10 flex items-center justify-center gap-3">
                      <Lock size={16} />
                      <span>Güvenli Ödeme Yap</span>
                    </div>
                </button>
                
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-100 border-dashed">
                    <ShieldCheck size={20} className="text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-stone-900 uppercase">256-bit SSL Koruma</p>
                      <p className="text-[9px] text-stone-500 mt-1 uppercase font-bold tracking-tighter">İşleminiz banka güvencesindedir.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ADDRESS MODAL */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden max-h-[90vh] border border-stone-100">
            <div className="px-10 py-8 bg-stone-50 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black tracking-tight text-stone-900 uppercase italic">Teslimat <span className="text-amber-500">Adresleri</span></h3>
                <p className="text-stone-400 text-[10px] font-bold tracking-widest uppercase mt-1">Siparişin Gönderileceği Adresi Belirleyin</p>
              </div>
              <button 
                onClick={() => setIsAddressModalOpen(false)} 
                className="w-12 h-12 bg-white border border-stone-100 rounded-2xl flex items-center justify-center text-stone-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm"
              >
                <XCircle size={24}/>
              </button>
            </div>

            <div className="p-10 space-y-4 overflow-y-auto hide-scrollbar">
              {addresses.map((address) => {
                const isSelected = draftAddressId === address.id
                return (
                  <label key={address.id} className={`group block border-2 rounded-3xl p-6 cursor-pointer transition-all duration-500 ${isSelected ? 'border-amber-500 bg-amber-50/20 shadow-lg shadow-amber-500/5' : 'border-stone-50 hover:border-stone-200 bg-white'}`}>
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex items-start gap-6">
                        <div className={`mt-1 w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-amber-500 bg-amber-500' : 'border-stone-200'}`}>
                            {isSelected && <Check size={14} className="text-white font-black"/>}
                        </div>
                        <div>
                          <p className={`text-sm font-black uppercase tracking-tight transition-colors ${isSelected ? 'text-amber-600' : 'text-stone-900'}`}>{address.title}</p>
                          <p className="text-[11px] text-stone-500 font-bold mt-1 uppercase tracking-wider">{address.recipient} <span className="mx-2 opacity-30 text-stone-300">|</span> {address.phone}</p>
                          <p className="text-sm text-stone-400 font-medium mt-3 leading-relaxed max-w-md">{address.detail}</p>
                        </div>
                      </div>
                    </div>
                    <input type="radio" className="hidden" name="draftAddress" checked={isSelected} onChange={() => setDraftAddressId(address.id)} />
                  </label>
                )
              })}

              {!isAddingNewAddress ? (
                  <button type="button" onClick={() => setIsAddingNewAddress(true)} className="w-full border-2 border-dashed border-stone-200 bg-stone-50/50 text-stone-400 rounded-3xl p-8 text-xs font-black tracking-[0.2em] uppercase hover:border-amber-500 hover:text-amber-500 hover:bg-amber-50 transition-all duration-500">
                    + Yeni Bir Adres Tanımla
                  </button>
              ) : (
                <div className="border border-amber-100 rounded-3xl p-8 space-y-6 bg-amber-50/10 mt-4 animate-scale-in">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1 h-4 bg-amber-500 rounded-full"></div>
                    <h4 className="text-sm font-black text-stone-900 uppercase tracking-tight">Yeni Adres Bilgileri</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 group-focus-within:text-amber-500 transition-colors">Ad</label>
                      <input type="text" value={newAddress.firstName} onChange={(e) => setNewAddress(p => ({ ...p, firstName: e.target.value }))} className="w-full bg-white border border-stone-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-stone-900 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 transition-all" />
                    </div>
                    <div className="group">
                      <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 group-focus-within:text-amber-500 transition-colors">Soyad</label>
                      <input type="text" value={newAddress.lastName} onChange={(e) => setNewAddress(p => ({ ...p, lastName: e.target.value }))} className="w-full bg-white border border-stone-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-stone-900 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 transition-all" />
                    </div>
                  </div>
                  
                  <div className="group">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 group-focus-within:text-amber-500 transition-colors">Telefon Numarası</label>
                    <input type="text" placeholder="5XX XXX XX XX" value={newAddress.phone} onChange={(e) => setNewAddress(p => ({ ...p, phone: e.target.value }))} className="w-full bg-white border border-stone-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-stone-900 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 transition-all tracking-widest" />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 group-focus-within:text-amber-500 transition-colors">Şehir / İl</label>
                      <input type="text" value={newAddress.city} onChange={(e) => setNewAddress(p => ({ ...p, city: e.target.value }))} className="w-full bg-white border border-stone-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-stone-900 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 transition-all" />
                    </div>
                    <div className="group">
                      <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 group-focus-within:text-amber-500 transition-colors">İlçe</label>
                      <input type="text" value={newAddress.district} onChange={(e) => setNewAddress(p => ({ ...p, district: e.target.value }))} className="w-full bg-white border border-stone-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-stone-900 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 transition-all" />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 group-focus-within:text-amber-500 transition-colors">Açık Adres</label>
                    <textarea placeholder="Mahalle, sokak, bina ve kapı no..." value={newAddress.detail} onChange={(e) => setNewAddress(p => ({ ...p, detail: e.target.value }))} rows={3} className="w-full bg-white border border-stone-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-stone-900 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 transition-all resize-none leading-relaxed" />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={handleSaveNewAddress} className="flex-1 bg-amber-500 text-white font-black py-5 rounded-2xl text-xs tracking-widest uppercase hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20 active:scale-95">KAYDET VE SEÇ</button>
                    <button type="button" onClick={() => setIsAddingNewAddress(false)} className="px-8 border border-stone-200 text-stone-400 font-black py-5 rounded-2xl text-xs tracking-widest uppercase hover:bg-stone-50 transition-all bg-white">İPTAL</button>
                  </div>
                </div>
              )}
            </div>

            <div className="px-10 py-8 border-t border-stone-100 bg-stone-50">
              <button
                onClick={() => { setSelectedAddressId(draftAddressId); setIsAddressModalOpen(false) }}
                className="w-full bg-stone-900 text-white font-black tracking-[0.2em] py-6 rounded-3xl hover:bg-black transition-all shadow-2xl shadow-stone-900/20 uppercase text-sm"
              >
                BU ADRESİ KULLANMAYA DEVAM ET
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Payment
