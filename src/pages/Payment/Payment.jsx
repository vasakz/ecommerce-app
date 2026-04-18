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
            <h1 className="text-5xl font-black tracking-tight text-stone-900 italic">ÖDEME <span className="text-amber-500">ADIMI</span></h1>
            <p className="text-stone-500 mt-2 font-medium">Siparişinizi tamamlamaya sadece bir adım kaldı.</p>
          </div>
          <Link to="/sepet" className="inline-flex items-center gap-2 text-sm font-bold text-stone-400 hover:text-amber-500 transition-all group">
             <span className="w-8 h-px bg-stone-200 group-hover:bg-amber-500 transition-all"></span>
             SEPETE GERİ DÖN
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            
            {/* ADDRESS SECTION */}
            <div className="bg-white border border-stone-100 rounded-3xl p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_50px_-10px_rgba(0,0,0,0.05)] transition-all duration-500">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                    <Truck size={20}/>
                  </div>
                  <h2 className="text-sm tracking-[0.2em] font-black text-stone-900">TESLİMAT ADRESİ</h2>
                </div>
                <button
                  onClick={() => { setDraftAddressId(selectedAddressId); setIsAddressModalOpen(true) }}
                  className="text-[10px] font-black tracking-widest text-amber-600 border border-amber-100 px-4 py-2 rounded-full hover:bg-amber-500 hover:text-white transition-all duration-300"
                >
                  DÜZENLE / DEĞİŞTİR
                </button>
              </div>

              <div className="group relative border-2 border-amber-500/10 bg-gradient-to-br from-amber-50/20 to-transparent rounded-2xl p-6 transition-all duration-500 hover:border-amber-500/30">
                <div className="flex items-start gap-5">
                    <div className="mt-1">
                      <div className="w-12 h-12 bg-white border border-stone-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                        <MapPin className="text-amber-500" size={24}/>
                      </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-black text-stone-900 text-lg uppercase tracking-tight">{selectedAddress.title}</h3>
                          <span className="bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full tracking-widest">AKTİF</span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-stone-700 font-bold text-sm tracking-tight">{selectedAddress.recipient} <span className="mx-2 text-stone-300">|</span> <span className="text-stone-400 font-medium">{selectedAddress.phone}</span></p>
                          <p className="text-sm text-stone-500 font-medium leading-relaxed max-w-md">{selectedAddress.detail}</p>
                        </div>
                    </div>
                </div>
              </div>
            </div>

            {/* DELIVERY METHOD SECTION (New) */}
            <div className="bg-white border border-stone-100 rounded-3xl p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                  <Zap size={20}/>
                </div>
                <h2 className="text-sm tracking-[0.2em] font-black text-stone-900">TESLİMAT SEÇENEKLERİ</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'standard', label: 'Standart Teslimat', desc: '2-5 İş Günü', price: 'Ücretsiz', icon: Truck },
                  { id: 'fast', label: 'Hızlı Teslimat', desc: 'Ertesi Gün Kapında', price: '₺29.90', icon: Clock },
                  { id: 'same_day', label: 'Aynı Gün Teslimat', desc: 'Bugün 21:00\'e kadar', price: '₺49.90', icon: Zap },
                  { id: 'scheduled', label: 'Belirli Saatte Teslim', desc: 'Özel Kurye Deneyimi', price: '₺39.90', icon: Calendar },
                  { id: 'pickup', label: 'Mağazadan Teslim Alma', desc: 'En Yakın Noktamız', price: 'Ücretsiz', icon: MapPin },
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
                        <div className={`p-2 rounded-xl transition-all duration-500 ${isSelected ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-stone-50 text-stone-400 group-hover:bg-amber-50 group-hover:text-amber-500'}`}>
                          <Icon size={20}/>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-amber-500 bg-amber-500' : 'border-stone-200'}`}>
                          {isSelected && <Check size={12} className="text-white"/>}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-black tracking-tight transition-colors ${isSelected ? 'text-amber-900' : 'text-stone-900'}`}>{method.label}</span>
                          <span className={`text-xs font-black ${isSelected ? 'text-amber-600' : 'text-stone-400'}`}>{method.price}</span>
                        </div>
                        <p className="text-[11px] text-stone-500 font-medium">{method.desc}</p>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* PAYMENT METHODS TABS */}
            <div className="bg-white border border-stone-100 rounded-3xl p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                  <Wallet size={20}/>
                </div>
                <h2 className="text-sm tracking-[0.2em] font-black text-stone-900 uppercase">Ödeme Yöntemi Seçin</h2>
              </div>

              <div className="flex bg-stone-50 p-1.5 rounded-2xl mb-10 overflow-x-auto hide-scrollbar gap-1 border border-stone-100">
                  {[
                      { id: 'CREDIT_CARD', label: 'Kart ile Öde', icon: <CreditCard size={16}/> },
                      { id: 'WALLET', label: 'Cüzdanım', icon: <Wallet size={16}/> },
                      { id: 'OTHER', label: 'Hediye/Kupon', icon: <Gift size={16}/> }
                  ].map((method) => (
                      <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`flex-1 flex items-center justify-center gap-3 py-3.5 px-6 text-xs font-black tracking-widest uppercase rounded-xl transition-all duration-300 whitespace-nowrap ${
                              paymentMethod === method.id ? 'bg-amber-500 text-white shadow-[0_10px_25px_-5px_rgba(245,158,11,0.4)] border border-amber-400' : 'text-stone-400 hover:text-stone-900 hover:bg-stone-100'
                          }`}
                      >
                          {method.icon} {method.label}
                      </button>
                  ))}
                </div>

              {/* METHOD: CREDIT CARD */}
              {paymentMethod === 'CREDIT_CARD' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-fade-in">
                    <div className="space-y-6">
                        <div className="group">
                            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2 group-focus-within:text-amber-500 transition-colors">Kart Üzerindeki İsim</label>
                            <input type="text" value={cardName} onChange={e => setCardName(e.target.value)} placeholder="ÖRN: FEYZA ALSAN" className="w-full bg-stone-50/50 border border-stone-100 rounded-2xl px-6 py-4 text-sm font-bold text-stone-900 outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/5 transition-all uppercase placeholder:text-stone-300 tracking-wider" />
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2 group-focus-within:text-amber-500 transition-colors">Kart Numarası</label>
                            <div className="relative">
                                <input type="text" value={cardNumber} onChange={handleCardNumberChange} placeholder="0000 0000 0000 0000" maxLength={19} className="w-full bg-stone-50/50 border border-stone-100 rounded-2xl px-6 py-4 text-sm font-bold text-stone-900 outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/5 transition-all tracking-[0.25em] font-mono placeholder:text-stone-300" />
                                <CreditCard className="absolute right-6 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-amber-500 transition-colors" size={20}/>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2 group-focus-within:text-amber-500 transition-colors">S.K.T.</label>
                                <div className="flex gap-2">
                                    <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="w-full bg-stone-50/50 border border-stone-100 rounded-2xl px-4 py-4 text-sm font-bold text-stone-900 outline-none focus:border-amber-500 focus:bg-white transition-all appearance-none cursor-pointer">
                                        <option value="">Ay</option>{monthOptions.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="w-full bg-stone-50/50 border border-stone-100 rounded-2xl px-4 py-4 text-sm font-bold text-stone-900 outline-none focus:border-amber-500 focus:bg-white transition-all appearance-none cursor-pointer">
                                        <option value="">Yıl</option>{yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="group">
                                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2 group-focus-within:text-amber-500 transition-colors">CVV / Güvenlik</label>
                                <input type="password" value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0,3))} placeholder="***" maxLength={3} className="w-full bg-stone-50/50 border border-stone-100 rounded-2xl px-4 py-4 text-sm font-black text-stone-900 outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/5 transition-all text-center tracking-[0.5em] placeholder:text-stone-300" />
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

                    <div className="bg-stone-50 border border-stone-100 rounded-3xl overflow-hidden self-start">
                        <div className="bg-emerald-50/50 px-6 py-4 border-b border-emerald-100 flex items-center gap-2">
                           <ShieldCheck className="text-emerald-500" size={14}/>
                           <h3 className="text-[10px] font-black tracking-widest text-emerald-700 uppercase">Taksit Seçenekleri</h3>
                        </div>
                        <div className="divide-y divide-stone-100 text-sm max-h-[320px] overflow-y-auto">
                            {installmentRows.map((row) => (
                                <label key={row.count} className={`flex items-center gap-4 px-6 py-4.5 cursor-pointer transition-all duration-300 ${selectedInstallmentCount === row.count ? 'bg-white' : 'hover:bg-stone-100/50'}`}>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedInstallmentCount === row.count ? 'border-amber-500 bg-amber-500' : 'border-stone-200'}`}>
                                      {selectedInstallmentCount === row.count && <Check size={12} className="text-white"/>}
                                    </div>
                                    <input type="radio" name="installment" checked={selectedInstallmentCount === row.count} onChange={() => setSelectedInstallmentCount(row.count)} className="hidden"/>
                                    <span className={`flex-1 font-bold text-sm tracking-tight ${selectedInstallmentCount === row.count ? 'text-amber-600' : 'text-stone-900'}`}>{row.label}</span>
                                    <span className={`text-sm font-black italic ${selectedInstallmentCount === row.count ? 'text-stone-900' : 'text-stone-400'}`}>{row.rightText}</span>
                                </label>
                            ))}
                        </div>
                        <div className="p-4 bg-white/50 text-[10px] text-stone-400 font-medium italic border-t border-stone-100">
                          * Taksit seçenekleri kartınızın özelliğine göre ödeme anında güncellenebilir.
                        </div>
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
          <aside className="lg:sticky lg:top-8 bg-white border border-stone-100 rounded-[2.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col p-2">
            <div className="bg-amber-500 text-white rounded-[2rem] p-8 pb-12 relative overflow-hidden">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full blur-2xl -ml-12 -mb-12"></div>
                
                <h2 className="text-[10px] tracking-[0.3em] font-black text-amber-100 mb-10 border-b border-white/10 pb-4 uppercase">Sipariş Özeti</h2>
                
                <div className="space-y-5 mb-10">
                  <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-100 uppercase tracking-widest">Ürünler</span>
                      <span className="text-lg font-black tracking-tighter">{araToplam.toLocaleString('tr-TR')} TL</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-100 uppercase tracking-widest">Kargo</span>
                      <span className="text-lg font-black tracking-tighter">
                        {baseKargo === 0 ? <span className="text-[10px] bg-white/20 px-3 py-1 rounded-full">ÜCRETSİZ</span> : `${baseKargo} TL`}
                      </span>
                  </div>

                  {indirim > 0 && (
                      <div className="flex items-center justify-between bg-black/5 p-3 rounded-2xl border border-white/5">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white">Toplam İndirim</span>
                          <span className="text-lg font-black tracking-tighter text-amber-100">-{indirim.toLocaleString('tr-TR')} TL</span>
                      </div>
                  )}
                </div>

                <div className="flex flex-col mb-4">
                    <span className="text-[10px] font-bold text-amber-200 uppercase tracking-widest mb-1">ÖDENECEK TOPLAM</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-6xl font-black tracking-tighter">{odenecekTutar.toLocaleString('tr-TR')}</span>
                      <span className="text-xl font-bold opacity-60">TL</span>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="mb-6">
                  <label className="flex items-start gap-4 cursor-pointer group">
                      <div className={`mt-0.5 w-6 h-6 shrink-0 rounded-lg flex items-center justify-center border-2 transition-all duration-300 ${isAgreementChecked ? 'bg-amber-500 border-amber-500 shadow-lg shadow-amber-500/30' : 'border-stone-100 group-hover:border-amber-200'}`}>
                          {isAgreementChecked && <Check size={14} className="text-white font-black"/>}
                      </div>
                      <input type="checkbox" className="hidden" checked={isAgreementChecked} onChange={() => setIsAgreementChecked(!isAgreementChecked)}/>
                      <p className="text-[11px] text-stone-400 font-medium leading-relaxed group-hover:text-stone-600 transition-colors">
                        <span className="font-bold text-stone-900">Satış Sözleşmesini</span> ve Gizlilik Politikası formlarını okudum, onaylıyorum.
                      </p>
                  </label>
                </div>

                <button
                    onClick={handleProcessPayment}
                    disabled={!isAgreementChecked || (paymentMethod === 'WALLET' && walletBalance < genelToplam)}
                    className={`group relative w-full py-6 rounded-[1.5rem] text-sm font-black tracking-[0.2em] uppercase transition-all duration-500 overflow-hidden ${
                        !isAgreementChecked || (paymentMethod === 'WALLET' && walletBalance < genelToplam)
                        ? 'bg-stone-50 text-stone-300 cursor-not-allowed border border-stone-100'
                        : 'bg-stone-900 text-white hover:bg-black shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] hover:-translate-y-1'
                    }`}
                >
                    <div className="relative z-10 flex items-center justify-center gap-3">
                      <Lock size={18} className={!isAgreementChecked ? 'opacity-30' : 'text-amber-500'}/>
                      <span>GÜVENLİ ÖDEME</span>
                    </div>
                </button>
                {/* Secure Highlights */}
                <div className="mt-8 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  <div className="flex flex-col items-center gap-2 p-4 bg-stone-50/50 rounded-2xl border border-stone-100 group hover:bg-white hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-stone-50 group-hover:scale-110 transition-transform">
                      <ShieldCheck size={18} className="text-emerald-500" />
                    </div>
                    <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest text-center leading-tight">256-bit SSL Güvenli Altyapı</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 bg-stone-50/50 rounded-2xl border border-stone-100 group hover:bg-white hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-stone-50 group-hover:scale-110 transition-transform">
                      <Truck size={18} className="text-amber-500" />
                    </div>
                    <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest text-center leading-tight">Aynı Gün Hızlı Teslimat</span>
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
