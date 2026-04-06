import { useState, useEffect } from 'react'
import {
    User, ShoppingBag, Heart, MapPin, Settings, LogOut,
    Mail, Phone, Calendar, Eye, EyeOff, Star,
    Plus, Trash2, Edit2, CheckCircle, Loader2
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────
// SERVİS KATMANI — Firebase bağlandığında sadece burası değişir
// ─────────────────────────────────────────────────────────────

// TODO: import { db, auth } from '../../firebase'
// TODO: import { doc, getDoc, updateDoc, collection, getDocs, deleteDoc } from 'firebase/firestore'
// TODO: import { updatePassword } from 'firebase/auth'

const profileService = {
    getUser: async () => ({
        ad: 'Başak', soyad: 'Şimşek',
        email: 'basak.simsek@gmail.com',
        telefon: '+90 555 123 45 67',
        cinsiyet: 'kadın', dogumTarihi: '1999-03-15',
    }),
    updateUser: async (data) => console.log('updateUser ->', data),
    updatePassword: async () => console.log('updatePassword çağrıldı'),
}

const siparisService = {
    // TODO: getDocs(collection(db, 'users', userId, 'siparisler'))
    getSiparisler: async () => ([
        { id: '#SP-1042', urun: 'Seramik Kupa Seti',   fiyat: '₺320', tarih: '28 Mar 2025', durum: 'Teslim Edildi', gorsel: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=200&q=80' },
        { id: '#SP-1031', urun: 'Makrome Duvar Süsü',  fiyat: '₺185', tarih: '14 Mar 2025', durum: 'Kargoda',       gorsel: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80' },
        { id: '#SP-1019', urun: 'Deri Cüzdan',         fiyat: '₺450', tarih: '02 Mar 2025', durum: 'Teslim Edildi', gorsel: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&q=80' },
        { id: '#SP-1008', urun: 'Keten Yastık Kılıfı', fiyat: '₺145', tarih: '18 Şub 2025', durum: 'Teslim Edildi', gorsel: 'https://images.unsplash.com/photo-1592789705501-f9ae4278a9f9?w=200&q=80' },
    ]),
}

const favoriService = {
    // TODO: getDocs(collection(db, 'users', userId, 'favoriler'))
    getFavoriler: async () => ([
        { id: '1', isim: 'El Yapımı Ahşap Tabak', fiyat: '₺280', puan: 4.8, gorsel: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=300&q=80' },
        { id: '2', isim: "Mum Seti (3'lü)",        fiyat: '₺220', puan: 4.9, gorsel: 'https://images.unsplash.com/photo-1603905424690-64e1d0e9f74a?w=300&q=80' },
        { id: '3', isim: 'Kumaş Çanta',            fiyat: '₺375', puan: 4.7, gorsel: 'https://images.unsplash.com/photo-1594938298603-c8148c4b8f15?w=300&q=80' },
        { id: '4', isim: 'Oyuncak Tavşan',         fiyat: '₺165', puan: 5.0, gorsel: 'https://images.unsplash.com/photo-1558171813-64da07b2b3b0?w=300&q=80' },
    ]),
    // TODO: deleteDoc(doc(db, 'users', userId, 'favoriler', favoriId))
    removeFavori: async (favoriId) => console.log('removeFavori ->', favoriId),
}

const adresService = {
    // TODO: getDocs(collection(db, 'users', userId, 'adresler'))
    getAdresler: async () => ([
        { id: '1', baslik: 'Ev', ad: 'Başak Şimşek', adres: 'Mimar Sinan Mah. Karacaahmet Sok. No:8 D:3', ilce: 'Üsküdar', sehir: 'İstanbul', posta: '34664', varsayilan: true },
        { id: '2', baslik: 'İş', ad: 'Başak Şimşek', adres: 'Bağlarbaşı Mah. Hakimiyet Cad. No:22 Kat:2', ilce: 'Üsküdar', sehir: 'İstanbul', posta: '34672', varsayilan: false },
    ]),
    // TODO: deleteDoc(doc(db, 'users', userId, 'adresler', adresId))
    deleteAdres: async (adresId) => console.log('deleteAdres ->', adresId),
    // TODO: updateDoc(doc(db, 'users', userId), { varsayilanAdres: adresId })
    setVarsayilan: async (adresId) => console.log('setVarsayilan ->', adresId),
}

// TODO: Firebase Auth'dan gerçek userId al → const userId = auth.currentUser?.uid

// ─────────────────────────────────────────────────────────────
// YARDIMCI BİLEŞENLER
// ─────────────────────────────────────────────────────────────

function Yukleniyor() {
    return (
        <div className="flex items-center justify-center py-24">
            <Loader2 size={20} className="animate-spin text-stone-400" />
        </div>
    )
}

function BosEkran({ mesaj }) {
    return <p className="text-xs tracking-widest text-stone-400 text-center py-16 uppercase">{mesaj}</p>
}

const durumuStil = {
    'Teslim Edildi': 'bg-stone-100 text-stone-600',
    'Kargoda':       'bg-amber-50 text-amber-700',
    'Hazırlanıyor':  'bg-sky-50 text-sky-700',
}

// ─────────────────────────────────────────────────────────────
// BÖLÜM BİLEŞENLERİ
// ─────────────────────────────────────────────────────────────

function ProfilBilgilerim() {
    const [form, setForm] = useState(null)
    const [yukleniyor, setYukleniyor] = useState(true)
    const [sifreler, setSifreler] = useState({ mevcut: '', yeni: '', tekrar: '' })
    const [goster, setGoster] = useState({ mevcut: false, yeni: false, tekrar: false })
    const [kaydedildi, setKaydedildi] = useState(false)
    const [hata, setHata] = useState('')

    useEffect(() => {
        profileService.getUser()
            .then(data => setForm(data))
            .finally(() => setYukleniyor(false))
    }, [])

    const handleKaydet = async (e) => {
        e.preventDefault()
        setHata('')
        try {
            await profileService.updateUser(form)
            setKaydedildi(true)
            setTimeout(() => setKaydedildi(false), 2500)
        } catch {
            setHata('Kaydetme sırasında bir hata oluştu.')
        }
    }

    const handleSifreGuncelle = async () => {
        setHata('')
        if (sifreler.yeni !== sifreler.tekrar) { setHata('Yeni şifreler eşleşmiyor.'); return }
        try {
            await profileService.updatePassword()
            setSifreler({ mevcut: '', yeni: '', tekrar: '' })
        } catch {
            setHata('Şifre güncellenirken bir hata oluştu.')
        }
    }

    if (yukleniyor) return <Yukleniyor />

    const inputClass = "w-full border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-400 transition placeholder:text-stone-300"

    return (
        <div className="space-y-8">
            {/* Profil Formu */}
            <div>
                <p className="text-[10px] font-bold tracking-[0.3em] text-stone-400 uppercase mb-6">Profil Bilgilerim</p>
                {hata && <p className="text-xs text-red-500 mb-4 tracking-wide">{hata}</p>}

                <form onSubmit={handleKaydet} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] tracking-widest text-stone-400 uppercase mb-1.5 block">Ad</label>
                            <input value={form.ad} onChange={e => setForm({ ...form, ad: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                            <label className="text-[10px] tracking-widest text-stone-400 uppercase mb-1.5 block">Soyad</label>
                            <input value={form.soyad} onChange={e => setForm({ ...form, soyad: e.target.value })} className={inputClass} />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] tracking-widest text-stone-400 uppercase mb-1.5 block">E-posta</label>
                        <div className="relative">
                            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" />
                            <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={`${inputClass} pl-9`} />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] tracking-widest text-stone-400 uppercase mb-1.5 block">Telefon</label>
                        <div className="relative">
                            <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" />
                            <input value={form.telefon} onChange={e => setForm({ ...form, telefon: e.target.value })} className={`${inputClass} pl-9`} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] tracking-widest text-stone-400 uppercase mb-1.5 block">Cinsiyet</label>
                            <div className="flex items-center gap-6 pt-2">
                                {['kadın', 'erkek'].map(c => (
                                    <label key={c} className="flex items-center gap-2 cursor-pointer text-sm text-stone-600 tracking-wide">
                                        <input type="radio" name="cinsiyet" value={c} checked={form.cinsiyet === c}
                                            onChange={() => setForm({ ...form, cinsiyet: c })} className="accent-stone-700" />
                                        {c.charAt(0).toUpperCase() + c.slice(1)}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] tracking-widest text-stone-400 uppercase mb-1.5 block">Doğum Tarihi</label>
                            <div className="relative">
                                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" />
                                <input type="date" value={form.dogumTarihi} onChange={e => setForm({ ...form, dogumTarihi: e.target.value })} className={`${inputClass} pl-9`} />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button type="submit" className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-white text-[11px] tracking-widest uppercase font-medium px-6 py-2.5 rounded-sm transition">
                            {kaydedildi ? <><CheckCircle size={13} /> Kaydedildi</> : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="border-t border-stone-100" />

            {/* Şifre Değiştir */}
            <div>
                <p className="text-[10px] font-bold tracking-[0.3em] text-stone-400 uppercase mb-6">Şifre Değiştir</p>
                <div className="space-y-4">
                    {[
                        { key: 'mevcut', label: 'Mevcut Şifre' },
                        { key: 'yeni',   label: 'Yeni Şifre' },
                        { key: 'tekrar', label: 'Yeni Şifre Tekrar' },
                    ].map(({ key, label }) => (
                        <div key={key}>
                            <label className="text-[10px] tracking-widest text-stone-400 uppercase mb-1.5 block">{label}</label>
                            <div className="relative">
                                <input
                                    type={goster[key] ? 'text' : 'password'}
                                    value={sifreler[key]}
                                    onChange={e => setSifreler({ ...sifreler, [key]: e.target.value })}
                                    placeholder="••••••••"
                                    className={`${inputClass} pr-10`}
                                />
                                <button type="button" onClick={() => setGoster({ ...goster, [key]: !goster[key] })}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 transition">
                                    {goster[key] ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end pt-4">
                    <button onClick={handleSifreGuncelle}
                        className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] tracking-widest uppercase font-medium px-6 py-2.5 rounded-sm transition">
                        Güncelle
                    </button>
                </div>
            </div>
        </div>
    )
}

function Siparislerim() {
    const [siparisler, setSiparisler] = useState([])
    const [yukleniyor, setYukleniyor] = useState(true)

    useEffect(() => {
        siparisService.getSiparisler()
            .then(setSiparisler)
            .finally(() => setYukleniyor(false))
    }, [])

    if (yukleniyor) return <Yukleniyor />

    return (
        <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-stone-400 uppercase mb-6">Siparişlerim</p>
            {siparisler.length === 0
                ? <BosEkran mesaj="Henüz siparişiniz bulunmuyor" />
                : (
                    <div className="space-y-3">
                        {siparisler.map(s => (
                            <div key={s.id} className="flex items-center gap-4 border border-stone-100 rounded-sm p-4 hover:border-stone-300 transition group">
                                <img src={s.gorsel} alt={s.urun} className="w-16 h-16 rounded-sm object-cover flex-shrink-0 grayscale-[20%] group-hover:grayscale-0 transition" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-stone-800 tracking-wide truncate">{s.urun}</p>
                                    <p className="text-[10px] tracking-widest text-stone-400 uppercase mt-1">{s.id} · {s.tarih}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-sm font-semibold text-stone-800">{s.fiyat}</p>
                                    <span className={`text-[10px] tracking-wider px-2 py-0.5 rounded-sm font-medium mt-1 inline-block uppercase ${durumuStil[s.durum] || 'bg-stone-100 text-stone-500'}`}>
                                        {s.durum}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    )
}

function Favorilerim() {
    const [favoriler, setFavoriler] = useState([])
    const [yukleniyor, setYukleniyor] = useState(true)

    useEffect(() => {
        favoriService.getFavoriler()
            .then(setFavoriler)
            .finally(() => setYukleniyor(false))
    }, [])

    const kaldir = async (id) => {
        try {
            await favoriService.removeFavori(id)
            setFavoriler(prev => prev.filter(f => f.id !== id))
        } catch (err) {
            console.error('Favori kaldırılamadı:', err)
        }
    }

    if (yukleniyor) return <Yukleniyor />

    return (
        <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-stone-400 uppercase mb-6">Favorilerim</p>
            {favoriler.length === 0
                ? <BosEkran mesaj="Henüz favori ürününüz yok" />
                : (
                    <div className="grid grid-cols-2 gap-5">
                        {favoriler.map(f => (
                            <div key={f.id} className="relative group cursor-pointer">
                                <div className="aspect-[4/3] overflow-hidden rounded-sm bg-stone-100 mb-3 relative">
                                    <img src={f.gorsel} alt={f.isim} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/40 transition-colors duration-500 flex items-center justify-center">
                                        <button
                                            onClick={() => kaldir(f.id)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-red-500 hover:bg-red-50 rounded-sm px-4 py-2 text-[10px] tracking-widest uppercase font-medium flex items-center gap-2"
                                        >
                                            <Trash2 size={12} /> Kaldır
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-stone-800 tracking-wide line-clamp-1">{f.isim}</p>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-sm font-semibold text-stone-700">{f.fiyat}</span>
                                    <span className="flex items-center gap-1 text-[10px] text-stone-400 tracking-wider">
                                        <Star size={10} className="fill-amber-400 text-amber-400" /> {f.puan}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    )
}

function Adreslerim() {
    const [adresler, setAdresler] = useState([])
    const [yukleniyor, setYukleniyor] = useState(true)
    const [yeniForm, setYeniForm] = useState(false)

    useEffect(() => {
        adresService.getAdresler()
            .then(setAdresler)
            .finally(() => setYukleniyor(false))
    }, [])

    const varsayilanYap = async (id) => {
        try {
            await adresService.setVarsayilan(id)
            setAdresler(prev => prev.map(a => ({ ...a, varsayilan: a.id === id })))
        } catch (err) { console.error(err) }
    }

    const sil = async (id) => {
        try {
            await adresService.deleteAdres(id)
            setAdresler(prev => prev.filter(a => a.id !== id))
        } catch (err) { console.error(err) }
    }

    if (yukleniyor) return <Yukleniyor />

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <p className="text-[10px] font-bold tracking-[0.3em] text-stone-400 uppercase">Adreslerim</p>
                <button onClick={() => setYeniForm(!yeniForm)}
                    className="flex items-center gap-1.5 text-[10px] tracking-widest text-stone-600 hover:text-stone-800 uppercase font-medium border-b border-stone-300 hover:border-stone-700 pb-0.5 transition">
                    <Plus size={12} /> Yeni Adres
                </button>
            </div>

            {adresler.length === 0
                ? <BosEkran mesaj="Kayıtlı adresiniz bulunmuyor" />
                : (
                    <div className="space-y-3">
                        {adresler.map(a => (
                            <div key={a.id} className={`border rounded-sm p-4 transition ${a.varsayilan ? 'border-stone-400 bg-stone-50' : 'border-stone-100'}`}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1.5">
                                            <span className="text-sm font-semibold text-stone-800 tracking-wide">{a.baslik}</span>
                                            {a.varsayilan && (
                                                <span className="text-[9px] bg-stone-800 text-white px-2 py-0.5 rounded-sm tracking-widest uppercase font-medium">
                                                    Varsayılan
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-stone-600">{a.ad}</p>
                                        <p className="text-sm text-stone-400">{a.adres}</p>
                                        <p className="text-sm text-stone-400">{a.ilce} / {a.sehir} {a.posta}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {!a.varsayilan && (
                                            <button onClick={() => varsayilanYap(a.id)}
                                                className="text-[10px] tracking-wider text-stone-400 hover:text-stone-700 uppercase transition border-b border-transparent hover:border-stone-500">
                                                Varsayılan Yap
                                            </button>
                                        )}
                                        <button className="text-stone-300 hover:text-stone-600 transition"><Edit2 size={13} /></button>
                                        <button onClick={() => sil(a.id)} className="text-stone-300 hover:text-red-500 transition"><Trash2 size={13} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }

            {yeniForm && (
                <div className="mt-4 border border-dashed border-stone-200 rounded-sm p-6 text-center">
                    <p className="text-[10px] tracking-widest text-stone-400 uppercase">Yeni adres formu buraya eklenecek</p>
                </div>
            )}
        </div>
    )
}

function Ayarlar() {
    const [bildirimler, setBildirimler] = useState({
        siparisDurumu: true, kampanyalar: false,
        yeniUrunler: true, favoriFiyat: true,
        eposta: true, sms: false,
    })

    // TODO: useEffect → getDoc(doc(db, 'users', userId, 'ayarlar', 'bildirimler'))
    // TODO: toggle sonrası → updateDoc(...)

    const toggle = (key) => setBildirimler(prev => ({ ...prev, [key]: !prev[key] }))

    const gruplar = [
        {
            baslik: 'Sipariş Bildirimleri',
            items: [
                { key: 'siparisDurumu', label: 'Sipariş Durum Güncellemeleri', aciklama: 'Kargo ve teslimat bilgileri' },
                { key: 'favoriFiyat',   label: 'Favori Fiyat Alarmı',          aciklama: 'Favorilerimdeki ürünlerde indirim olduğunda' },
            ]
        },
        {
            baslik: 'Pazarlama Bildirimleri',
            items: [
                { key: 'kampanyalar', label: 'Kampanya ve İndirimler', aciklama: 'Özel teklifler ve fırsatlar' },
                { key: 'yeniUrunler', label: 'Yeni Ürün Bildirimleri', aciklama: 'Yeni eklenen el yapımı ürünler' },
            ]
        },
        {
            baslik: 'İletişim Tercihleri',
            items: [
                { key: 'eposta', label: 'E-posta Bildirimleri', aciklama: 'Bildirimler e-posta adresime gelsin' },
                { key: 'sms',    label: 'SMS Bildirimleri',     aciklama: 'Bildirimler telefonuma SMS olarak gelsin' },
            ]
        },
    ]

    return (
        <div className="space-y-8">
            {gruplar.map(g => (
                <div key={g.baslik}>
                    <p className="text-[10px] font-bold tracking-[0.3em] text-stone-400 uppercase mb-4">{g.baslik}</p>
                    <div className="space-y-4">
                        {g.items.map(item => (
                            <div key={item.key} className="flex items-center justify-between py-3 border-b border-stone-100 last:border-0">
                                <div>
                                    <p className="text-sm font-medium text-stone-700 tracking-wide">{item.label}</p>
                                    <p className="text-[11px] text-stone-400 mt-0.5">{item.aciklama}</p>
                                </div>
                                <button
                                    onClick={() => toggle(item.key)}
                                    className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${bildirimler[item.key] ? 'bg-stone-700' : 'bg-stone-200'}`}
                                >
                                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${bildirimler[item.key] ? 'translate-x-5' : ''}`} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

// ─────────────────────────────────────────────────────────────
// MENÜ
// ─────────────────────────────────────────────────────────────

const menuItems = [
    { key: 'profil',     label: 'Profil Bilgilerim', icon: User },
    { key: 'siparisler', label: 'Siparişlerim',      icon: ShoppingBag },
    { key: 'favoriler',  label: 'Favorilerim',        icon: Heart },
    { key: 'adresler',   label: 'Adreslerim',         icon: MapPin },
    { key: 'ayarlar',    label: 'Ayarlar',            icon: Settings },
]

// ─────────────────────────────────────────────────────────────
// ANA BİLEŞEN
// ─────────────────────────────────────────────────────────────

function Profile() {
    const [aktif, setAktif] = useState('profil')

    // TODO: const [user] = useAuthState(auth)
    // TODO: const displayName = user?.displayName || 'Kullanıcı'
    // TODO: const email = user?.email || ''

    const renderIcerik = () => {
        switch (aktif) {
            case 'profil':     return <ProfilBilgilerim />
            case 'siparisler': return <Siparislerim />
            case 'favoriler':  return <Favorilerim />
            case 'adresler':   return <Adreslerim />
            case 'ayarlar':    return <Ayarlar />
            default:           return null
        }
    }

    return (
        <div className="bg-stone-50 min-h-screen">
            <div className="max-w-5xl mx-auto px-6 py-14 flex gap-10 items-start">

                {/* Sol: Sidebar */}
                <aside className="w-52 flex-shrink-0 sticky top-20 self-start">
                    <div className="bg-white border border-stone-100 rounded-sm p-6 shadow-sm">
                        {/* Avatar */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-3 ring-2 ring-stone-200">
                                <User size={28} className="text-stone-400" />
                            </div>
                            {/* TODO: {displayName} ve {email} */}
                            <h2 className="text-sm font-semibold text-stone-800 tracking-wide">Başak Şimşek</h2>
                            <p className="text-[10px] text-stone-400 tracking-wider mt-0.5">basak.simsek@gmail.com</p>
                        </div>

                        {/* Menü */}
                        <nav className="flex flex-col gap-0.5">
                            {menuItems.map((item) => {
                                const MenuIcon = item.icon
                                return (
                                    <button
                                        key={item.key}
                                        onClick={() => setAktif(item.key)}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-left text-[12px] tracking-wide transition-colors w-full
                                            ${aktif === item.key
                                                ? 'bg-stone-100 text-stone-800 font-semibold'
                                                : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
                                            }`}
                                    >
                                        <MenuIcon size={14} />
                                        {item.label}
                                    </button>
                                )
                            })}

                            <div className="border-t border-stone-100 mt-3 pt-3">
                                <button
                                    onClick={() => {
                                        // TODO: await signOut(auth); navigate('/login')
                                        console.log('Çıkış yapıldı')
                                    }}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-[12px] tracking-wide text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors w-full"
                                >
                                    <LogOut size={14} /> Çıkış Yap
                                </button>
                            </div>
                        </nav>
                    </div>
                </aside>

                {/* Sağ: İçerik */}
                <main className="flex-1 min-w-0 bg-white border border-stone-100 rounded-sm p-8 shadow-sm">
                    {renderIcerik()}
                </main>
            </div>
        </div>
    )
}

export default Profile