import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    ChevronLeft, ChevronRight, User, Store,
    FileText, CreditCard, Image, Check, HelpCircle, MessageCircle, X, Phone, Mail
} from 'lucide-react'

import registerForm1 from '../../assets/registerform1.jpg'
import registerForm2 from '../../assets/registerform2.jpg'

// ─── Adımlar ──────────────────────────────────────────────
const adimlar = [
    { id: 1, baslik: 'Temel Bilgiler',     ikon: User },
    { id: 2, baslik: 'Mağaza Bilgileri',   ikon: Store },
    { id: 3, baslik: 'Kimlik & Belgeler',  ikon: FileText },
    { id: 4, baslik: 'Banka Bilgileri',    ikon: CreditCard },
    { id: 5, baslik: 'Mağaza Profili',     ikon: Image },
]

const inputClass = "w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-200 transition bg-white placeholder:text-stone-300"
const labelClass = "block text-xs font-medium text-stone-500 mb-1.5 tracking-wide"

function AdimTemelBilgiler() {
    const [hesapTuru, setHesapTuru] = useState('')

    return (
        <div className="space-y-5">
            <div>
                <label className={labelClass}>Hesap Türü</label>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { deger: 'satici', baslik: 'Bireysel Satıcı', aciklama: 'Ürün satan bireysel kişi' },
                        { deger: 'atolye', baslik: 'Atölye Satıcısı', aciklama: 'El yapımı ürün üreten atölye' },
                    ].map(t => (
                        <button
                            key={t.deger}
                            type="button"
                            onClick={() => setHesapTuru(t.deger)}
                            className={`flex flex-col items-start gap-1 border rounded-lg px-4 py-3.5 cursor-pointer transition text-left ${
                                hesapTuru === t.deger
                                    ? 'border-stone-800 bg-stone-50'
                                    : 'border-stone-200 hover:border-stone-400'
                            }`}
                        >
                            <span className="text-sm font-semibold text-stone-800">{t.baslik}</span>
                            <span className="text-xs text-stone-400">{t.aciklama}</span>
                        </button>
                    ))}
                </div>
            </div>
            <div className="border-t border-stone-100" />
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Ad</label>
                    <input type="text" placeholder="Adınız" className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Soyad</label>
                    <input type="text" placeholder="Soyadınız" className={inputClass} />
                </div>
            </div>
            <div>
                <label className={labelClass}>E-posta</label>
                <input type="email" placeholder="ornek@email.com" className={inputClass} />
            </div>
            <div>
                <label className={labelClass}>Telefon</label>
                <div className="flex gap-2">
                    <input type="tel" placeholder="+90 555 000 00 00" className={inputClass} />
                    <button className="px-4 py-2.5 bg-stone-800 text-white text-xs rounded-lg hover:bg-stone-700 transition whitespace-nowrap">
                        Doğrula
                    </button>
                </div>
                <p className="text-[11px] text-stone-400 mt-1">SMS ile doğrulama kodu gönderilecektir.</p>
            </div>
            <div>
                <label className={labelClass}>Şifre</label>
                <input type="password" placeholder="En az 8 karakter" className={inputClass} />
            </div>
            <div>
                <label className={labelClass}>Şifre Tekrar</label>
                <input type="password" placeholder="Şifrenizi tekrar girin" className={inputClass} />
            </div>
        </div>
    )
}

function AdimMagazaBilgileri() {
    const kategoriler = [
        'Deri & Aksesuar', 'Tekstil & Giyim', 'Ev Yaşam & Dekor',
        'Takı & Bijuteri', 'Ahşap & Mobilya', 'Oyuncak & Çocuk',
        'Seramik & Cam', 'Diğer'
    ]
    const [seciliKategoriler, setSeciliKategoriler] = useState([])
    const toggleKategori = (k) => {
        setSeciliKategoriler(prev =>
            prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]
        )
    }
    return (
        <div className="space-y-5">
            <div>
                <label className={labelClass}>Mağaza Adı</label>
                <input type="text" placeholder="Atölye veya marka adınız" className={inputClass} />
            </div>
            <div>
                <label className={labelClass}>İşletme Türü</label>
                <div className="grid grid-cols-2 gap-3">
                    {['Şahıs', 'Şirket'].map(t => (
                        <label key={t} className="flex items-center gap-3 border border-stone-200 rounded-lg px-4 py-3 cursor-pointer hover:border-stone-400 transition">
                            <input type="radio" name="isletme" value={t} className="accent-stone-800" />
                            <span className="text-sm text-stone-700">{t}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div>
                <label className={labelClass}>Vergi Numarası</label>
                <input type="text" placeholder="10 haneli vergi numaranız" className={inputClass} />
            </div>
            <div>
                <label className={labelClass}>Ürün Kategorisi <span className="text-stone-400">(Çoklu seçim)</span></label>
                <div className="flex flex-wrap gap-2 mt-1">
                    {kategoriler.map(k => (
                        <button key={k} type="button" onClick={() => toggleKategori(k)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                                seciliKategoriler.includes(k)
                                    ? 'bg-stone-800 text-white border-stone-800'
                                    : 'border-stone-200 text-stone-600 hover:border-stone-400'
                            }`}>
                            {k}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

function AdimKimlikBelgeler() {
    return (
        <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                <p className="text-xs text-amber-700 font-medium">Belgeleriniz güvenli şekilde şifrelenerek saklanmaktadır.</p>
            </div>
            {['Kimlik Belgesi — Ön Yüz', 'Kimlik Belgesi — Arka Yüz', 'İşletme Belgesi'].map((label, i) => (
                <div key={i}>
                    <label className={labelClass}>{label} {i === 2 && <span className="text-stone-400">(Şirketler için)</span>}</label>
                    <div className="border-2 border-dashed border-stone-200 rounded-lg p-6 text-center hover:border-stone-400 transition cursor-pointer">
                        <FileText size={24} className="text-stone-300 mx-auto mb-2" />
                        <p className="text-sm text-stone-500">Dosya seçin veya sürükleyin</p>
                        <p className="text-xs text-stone-400 mt-1">PNG, JPG veya PDF — Maks. 5MB</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

function AdimBankaBilgileri() {
    return (
        <div className="space-y-5">
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                <p className="text-xs text-blue-700 font-medium">Banka bilgileriniz 256-bit şifreleme ile güvence altında saklanmaktadır.</p>
            </div>
            <div>
                <label className={labelClass}>Banka Adı</label>
                <select className={inputClass}>
                    <option value="">Banka seçin</option>
                    {['Ziraat Bankası','İş Bankası','Garanti BBVA','Yapı Kredi','Akbank','Halkbank','Vakıfbank','QNB Finansbank','Diğer'].map(b => (
                        <option key={b}>{b}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className={labelClass}>IBAN Numarası</label>
                <input type="text" placeholder="TR00 0000 0000 0000 0000 0000 00" className={inputClass} />
            </div>
            <div>
                <label className={labelClass}>Hesap Sahibi Adı</label>
                <input type="text" placeholder="Ad Soyad / Şirket Adı" className={inputClass} />
            </div>
        </div>
    )
}

function AdimMagazaProfili({ aydinlatmaOnayi, setAydinlatmaOnayi }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                {[['Mağaza Logosu','Logo yükle','PNG, JPG — Maks. 2MB'],['Kapak Fotoğrafı','Kapak yükle','PNG, JPG — Maks. 5MB']].map(([label, text, hint]) => (
                    <div key={label}>
                        <label className={labelClass}>{label}</label>
                        <div className="border-2 border-dashed border-stone-200 rounded-lg p-6 text-center hover:border-stone-400 transition cursor-pointer aspect-square flex flex-col items-center justify-center">
                            <Image size={24} className="text-stone-300 mb-2" />
                            <p className="text-xs text-stone-500">{text}</p>
                            <p className="text-[11px] text-stone-400 mt-1">{hint}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div>
                <label className={labelClass}>Mağaza Açıklaması</label>
                <textarea rows={4} placeholder="Mağazanızı ve ürünlerinizi kısaca tanıtın..." className={`${inputClass} resize-none`} />
            </div>
            <div>
                <label className={labelClass}>İade Politikası</label>
                <textarea rows={3} placeholder="İade ve değişim koşullarınızı belirtin..." className={`${inputClass} resize-none`} />
            </div>
            <div>
                <label className={labelClass}>Kargo Politikası</label>
                <textarea rows={3} placeholder="Kargo süreçleri ve teslimat bilgilerini belirtin..." className={`${inputClass} resize-none`} />
            </div>
            <label className="flex items-start gap-3 border border-stone-200 rounded-lg px-4 py-3 cursor-pointer hover:border-stone-400 transition">
                <input
                    type="checkbox"
                    checked={aydinlatmaOnayi}
                    onChange={(e) => setAydinlatmaOnayi(e.target.checked)}
                    className="mt-0.5 accent-stone-800"
                />
                <span className="text-xs text-stone-600 leading-relaxed">
                    <span className="underline">Aydınlatma metnini</span> okudum, kişisel verilerimin belirtilen kapsamda işlenmesini kabul ediyorum.
                </span>
            </label>
        </div>
    )
}

// ─── Ana Bileşen ──────────────────────────────────────────

function SaticiKayit() {
    const [aktifAdim, setAktifAdim] = useState(1)
    const [aydinlatmaOnayi, setAydinlatmaOnayi] = useState(false)
    const [destekAcik, setDestekAcik] = useState(false)
    const navigate = useNavigate()
    const sonAdimda = aktifAdim === adimlar.length
    const basvuruTamamlanabilir = !sonAdimda || aydinlatmaOnayi

    const ileri = () => {
        if (!basvuruTamamlanabilir) return
        if (aktifAdim < adimlar.length) setAktifAdim(prev => prev + 1)
        else navigate('/satici-panel')
    }
    const geri = () => {
        if (aktifAdim > 1) setAktifAdim(prev => prev - 1)
    }

    const renderAdim = () => {
        switch (aktifAdim) {
            case 1: return <AdimTemelBilgiler />
            case 2: return <AdimMagazaBilgileri />
            case 3: return <AdimKimlikBelgeler />
            case 4: return <AdimBankaBilgileri />
            case 5:
                return (
                    <AdimMagazaProfili
                        aydinlatmaOnayi={aydinlatmaOnayi}
                        setAydinlatmaOnayi={setAydinlatmaOnayi}
                    />
                )
            default: return null
        }
    }

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col relative">

            {/* Navbar */}
            <header className="bg-white border-b border-stone-200">
                <div className="px-6 py-4 flex items-center gap-4">
                    <Link to="/kayit-ol" className="text-lg font-bold tracking-widest text-stone-900 hover:text-stone-600 transition">
                        BRAND
                    </Link>
                    <span className="text-stone-300">|</span>
                    <span className="text-sm text-stone-500">Satıcı Başvuru Formu</span>
                </div>
            </header>

            {/* İkinci bar */}
            <div className="bg-white border-b border-stone-200 px-6 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={geri} className="text-stone-400 hover:text-stone-700 transition">
                        <ChevronLeft size={18} />
                    </button>
                    <h1 className="text-sm font-semibold text-stone-700">Satıcı Başvuru Formu</h1>
                </div>
                <a href="#" className="flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-600 transition font-medium">
                    <HelpCircle size={13} /> Nasıl Başvuru Yapabilirim?
                </a>
            </div>

            {/* 3 kolonlu layout */}
            <div className="flex-1 flex">

                {/* Sol Görsel */}
                <div className="hidden xl:block flex-shrink-0 relative w-[480px]">
                    <img
                        src={registerForm1}
                        alt="handmade products"
                        className="w-full h-full object-cover sticky top-0"
                        style={{ position: 'sticky', top: 0, height: '100vh' }}
                    />
                </div>

                {/* Orta: Form */}
                <div className="flex-1 px-8 py-10 min-w-0">
                    {/* Adım Göstergesi */}
                    <div className="flex items-center mb-10 max-w-2xl mx-auto">
                        {adimlar.map((adim, idx) => {
                            const AdimIkon = adim.ikon
                            const tamamlandi = aktifAdim > adim.id
                            const aktif = aktifAdim === adim.id
                            return (
                                <div key={adim.id} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                                            tamamlandi ? 'bg-stone-800 text-white' :
                                            aktif ? 'bg-stone-800 text-white ring-4 ring-stone-200' :
                                            'bg-stone-100 text-stone-400'
                                        }`}>
                                            {tamamlandi ? <Check size={16} /> : <AdimIkon size={15} />}
                                        </div>
                                        <p className={`text-[10px] mt-1.5 tracking-wide whitespace-nowrap ${aktif ? 'text-stone-800 font-semibold' : 'text-stone-400'}`}>
                                            {adim.baslik}
                                        </p>
                                    </div>
                                    {idx < adimlar.length - 1 && (
                                        <div className={`flex-1 h-px mx-3 mb-4 transition-all ${tamamlandi ? 'bg-stone-800' : 'bg-stone-200'}`} />
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* Form Kartı */}
                    <div className="bg-white border border-stone-100 rounded-xl p-8 shadow-sm max-w-2xl mx-auto">
                        <h2 className="text-base font-semibold text-stone-800 mb-6">
                            {adimlar[aktifAdim - 1].baslik}
                        </h2>
                        {renderAdim()}
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-stone-100">
                            <button
                                onClick={geri}
                                className={`flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition ${aktifAdim === 1 ? 'invisible' : ''}`}
                            >
                                <ChevronLeft size={16} /> Geri
                            </button>
                            <button
                                onClick={ileri}
                                disabled={!basvuruTamamlanabilir}
                                className={`flex items-center gap-2 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition ${
                                    basvuruTamamlanabilir
                                        ? 'bg-stone-900 hover:bg-amber-500'
                                        : 'bg-stone-300 cursor-not-allowed'
                                }`}
                            >
                                {aktifAdim === adimlar.length ? 'Başvuruyu Tamamla' : 'Devam Et'}
                                {aktifAdim < adimlar.length && <ChevronRight size={16} />}
                            </button>
                        </div>
                    </div>

                    <p className="text-xs text-stone-400 text-center mt-6">
                        Adım {aktifAdim} / {adimlar.length} — Bilgileriniz güvenle saklanmaktadır.
                    </p>
                </div>

                {/* Sağ Görsel */}
                <div className="hidden xl:block flex-shrink-0 relative w-[480px]">
                    <img
                        src={registerForm2}
                        alt="lifestyle products"
                        className="w-full h-full object-cover"
                        style={{ position: 'sticky', top: 0, height: '100vh' }}
                    />
                </div>

            </div>

            <div className="fixed right-6 bottom-6 z-30">
                {destekAcik && (
                    <div className="w-[280px] bg-white border border-stone-200 rounded-xl shadow-xl p-4 mb-3">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold text-stone-800">Destek Hattı</p>
                            <button
                                type="button"
                                onClick={() => setDestekAcik(false)}
                                className="text-stone-400 hover:text-stone-700 transition"
                                aria-label="Destek panelini kapat"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <p className="text-xs text-stone-500 mb-3">Hafta içi 09:00 - 18:00</p>
                        <div className="space-y-2">
                            <a href="tel:+908500000000" className="flex items-center gap-2 text-sm text-stone-700 hover:text-stone-900 transition">
                                <Phone size={14} /> 0850 000 00 00
                            </a>
                            <a href="mailto:destek@brand.com" className="flex items-center gap-2 text-sm text-stone-700 hover:text-stone-900 transition">
                                <Mail size={14} /> destek@brand.com
                            </a>
                            <a href="https://wa.me/905550000000" target="_blank" rel="noreferrer" className="block text-xs text-emerald-600 hover:text-emerald-700 underline">
                                WhatsApp ile yaz
                            </a>
                            <a href="#" className="block text-xs text-amber-600 hover:text-amber-700 underline">
                                Sık sorulan sorular
                            </a>
                        </div>
                    </div>
                )}
                <button
                    type="button"
                    onClick={() => setDestekAcik(prev => !prev)}
                    className="ml-auto flex items-center gap-3 bg-amber-500 hover:bg-amber-600 text-white text-lg font-semibold px-7 py-3.5 rounded-full shadow-lg transition"
                >
                    <MessageCircle size={20} />
                    Destek
                </button>
            </div>
        </div>
    )
}

export default SaticiKayit