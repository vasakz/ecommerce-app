import { useState, useMemo } from 'react'
import { 
  Search, Eye, MoreHorizontal, User, Mail, Shield, 
  Slash, Trash2, X, Calendar, Activity, CheckCircle, 
  UserCheck, UserMinus, ShieldCheck, Clock, Store
} from 'lucide-react'

// --- MOCK VERİ ---
const MOCK_KULLANICILAR = [
  { id: 'USR-001', ad: 'Merve Nur', soyad: 'Karaca', email: 'merve@ecommerce.com', rol: 'Yönetici', durum: 'Aktif', kayitTarihi: '2026-03-02', sonGiris: 'Şimdi' },
  { id: 'USR-002', ad: 'Ahmet', soyad: 'Yılmaz', email: 'ahmet.y@email.com', rol: 'Müşteri', durum: 'Aktif', kayitTarihi: '2026-04-10', sonGiris: '2 saat önce' },
  { id: 'USR-003', ad: 'Zeynep', soyad: 'Kaya', email: 'zeynep.kaya@email.com', rol: 'Müşteri', durum: 'Pasif', kayitTarihi: '2026-04-15', sonGiris: '3 gün önce' },
  { id: 'USR-004', ad: 'Caner', soyad: 'Demir', email: 'caner.d@magaza.com', rol: 'Satıcı', durum: 'Onay Bekliyor', kayitTarihi: '2026-04-27', sonGiris: '-' },
  { id: 'USR-005', ad: 'Elif', soyad: 'Şahin', email: 'elif.sahin@email.com', rol: 'Müşteri', durum: 'Yasaklı', kayitTarihi: '2026-01-12', sonGiris: '1 ay önce' },
  { id: 'USR-006', ad: 'Burak', soyad: 'Özkan', email: 'burak.o@email.com', rol: 'Satıcı', durum: 'Aktif', kayitTarihi: '2026-03-25', sonGiris: 'Dün' },
]

// --- 2. YARDIMCI BİLEŞENLER ---
const StatusBadge = ({ durum }) => {
  const renkler = {
    'Aktif': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Pasif': 'bg-stone-50 text-stone-500 border-stone-100',
    'Yasaklı': 'bg-rose-50 text-rose-600 border-rose-100',
    'Onay Bekliyor': 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse'
  }
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-tight ${renkler[durum]}`}>
      {durum}
    </span>
  )
}

export default function AdminUsers() {
  const [kullanicilar, setKullanicilar] = useState(MOCK_KULLANICILAR)
  const [arama, setArama] = useState('')
  const [aktifSekme, setAktifSekme] = useState('Hepsi') // Navbar Filtresi
  const [seciliKullanici, setSeciliKullanici] = useState(null)
  const [aktifDropdown, setAktifDropdown] = useState(null)

  // --- 3. AKSİYONLAR (FONKSİYONEL BUTONLAR) ---
  const durumuGuncelle = (id, yeniDurum) => {
    setKullanicilar(prev => prev.map(u => u.id === id ? { ...u, durum: yeniDurum } : u))
    setAktifDropdown(null)
  }

  const kullaniciSil = (id) => {
    if(window.confirm("Bu hesabı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
      setKullanicilar(prev => prev.filter(u => u.id !== id))
      setAktifDropdown(null)
    }
  }

  // --- 4. FİLTRELEME---
  const filtrelenmisKullanicilar = useMemo(() => {
    return kullanicilar.filter(u => {
      const aramaUyumu = (u.ad + " " + u.soyad).toLowerCase().includes(arama.toLowerCase()) || u.email.toLowerCase().includes(arama.toLowerCase())
      const sekmeUyumu = aktifSekme === 'Hepsi' || u.rol === aktifSekme
      return aramaUyumu && sekmeUyumu
    })
  }, [kullanicilar, arama, aktifSekme])

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Kullanıcı Yönetimi</h1>
          <p className="text-sm text-stone-500 mt-1 font-medium italic">E-ticaret platformunun tüm paydaşlarını denetleyin ve yetkilendirin.</p>
        </div>
      </div>

     {/* ROL NAVBAR  */}
<div className="flex items-center gap-8 border-b border-stone-200 mb-6">
  {['Hepsi', 'Yönetici', 'Satıcı', 'Müşteri'].map(rol => {
    // Onay bekleyen satıcı sayısını hesapla
    const bekleyenSayisi = kullanicilar.filter(u => u.rol === 'Satıcı' && u.durum === 'Onay Bekliyor').length;
    
    return (
      <button 
        key={rol}
        onClick={() => setAktifSekme(rol)}
        className={`pb-4 text-sm font-bold transition-all relative flex items-center gap-2 ${aktifSekme === rol ? 'text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
      >
        {rol}
        {rol === 'Satıcı' && bekleyenSayisi > 0 && (
          <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-bounce">
            {bekleyenSayisi}
          </span>
        )}
        {aktifSekme === rol && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-stone-900 rounded-full"></span>}
      </button>
    );
  })}
</div>

      {/* Arama Çubuğu */}
      <div className="flex items-center border border-stone-200 rounded-2xl px-4 py-3 gap-3 bg-white w-full sm:w-96 shadow-sm focus-within:ring-4 focus-within:ring-stone-900/5 transition-all">
        <Search size={16} className="text-stone-400" />
        <input
          type="text"
          placeholder="İsim, soyisim veya e-posta ara..."
          value={arama}
          onChange={(e) => setArama(e.target.value)}
          className="text-sm outline-none flex-1 bg-transparent text-stone-800 font-medium"
        />
      </div>

      {/* Kullanıcı Tablosu */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-visible min-h-[450px] relative z-0">
  <div className="overflow-x-auto"></div>
        <table className="w-full text-sm text-left">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="px-6 py-4 text-[11px] font-black text-stone-400 uppercase tracking-widest text-center">Kullanıcı</th>
              <th className="px-6 py-4 text-[11px] font-black text-stone-400 uppercase tracking-widest">E-Posta</th>
              <th className="px-6 py-4 text-[11px] font-black text-stone-400 uppercase tracking-widest text-center">Durum</th>
              <th className="px-6 py-4 text-[11px] font-black text-stone-400 uppercase tracking-widest text-right">Aksiyon</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtrelenmisKullanicilar.map((kullanici) => (
              <tr key={kullanici.id} className="hover:bg-stone-50/40 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center text-xs font-black shadow-sm">
                      {kullanici.ad[0]}{kullanici.soyad[0]}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-stone-900">{kullanici.ad} {kullanici.soyad}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-stone-400 font-bold uppercase">{kullanici.rol}</span>
                        <span className="w-1 h-1 bg-stone-200 rounded-full"></span>
                        <span className="text-[10px] text-stone-400 font-bold uppercase">ID: {kullanici.id}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-stone-600 font-medium">
                    <Mail size={14} className="text-stone-300" /> {kullanici.email}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <StatusBadge durum={kullanici.durum} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Detay Görüntüleme */}
                    <button 
                      onClick={() => setSeciliKullanici(kullanici)}
                      className="p-2 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-900 transition-all"
                    >
                      <Eye size={18} />
                    </button>

                    {/* Hızlı Aksiyonlar */}
                    <div className="relative">
                      <button 
                        onClick={() => setAktifDropdown(aktifDropdown === kullanici.id ? null : kullanici.id)}
                        className={`p-2 rounded-xl transition-all ${aktifDropdown === kullanici.id ? 'bg-stone-200 text-stone-900' : 'hover:bg-stone-100 text-stone-400'}`}
                      >
                        <MoreHorizontal size={18} />
                      </button>

                  {aktifDropdown === kullanici.id && (
  <>
    <div className="fixed inset-0 z-10" onClick={() => setAktifDropdown(null)}></div>
    <div className="absolute right-0 mt-2 w-56 bg-white border border-stone-200 rounded-2xl shadow-xl py-2 z-20 overflow-hidden ring-4 ring-stone-900/5">
      
      {/* KRİTİK: Satıcı Başvurusu Onay Paneli */}
      {kullanici.rol === 'Satıcı' && kullanici.durum === 'Onay Bekliyor' && (
        <div className="bg-amber-50/50 pb-2 mb-2 border-b border-stone-100">
          <p className="px-4 py-2 text-[10px] font-black text-amber-600 uppercase tracking-widest">Başvuru Yönetimi</p>
          <button onClick={() => durumuGuncelle(kullanici.id, 'Aktif')} className="w-full text-left px-4 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2">
            <CheckCircle size={14} /> Başvuruyu Onayla
          </button>
          <button onClick={() => durumuGuncelle(kullanici.id, 'Yasaklı')} className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2">
            <XCircle size={14} /> Başvuruyu Reddet
          </button>
        </div>
      )}

      {/* HESAP YÖNETİMİ (Dinamik Butonlar) */}
      <p className="px-4 py-2 text-[10px] font-black text-stone-400 uppercase tracking-widest">Hesap Ayarları</p>
      
      {kullanici.durum === 'Aktif' ? (
        <button onClick={() => durumuGuncelle(kullanici.id, 'Pasif')} className="w-full text-left px-4 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-50 flex items-center gap-2">
          <Slash size={14} /> Hesabı Askıya Al
        </button>
      ) : (
        <button onClick={() => durumuGuncelle(kullanici.id, 'Aktif')} className="w-full text-left px-4 py-2.5 text-xs font-bold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2">
          <UserCheck size={14} /> Askıyı Kaldır / Aktifleştir
        </button>
      )}

      <button onClick={() => kullaniciSil(kullanici.id)} className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-stone-100">
        <Trash2 size={14} /> Hesabı Kalıcı Olarak Sil
      </button>
    </div>
  </>
)}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* KULLANICI DETAY MODALI  */}
      {seciliKullanici && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/10">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl border border-stone-200 overflow-hidden shadow-stone-900/10">
            
            <div className="px-10 py-8 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-3xl bg-stone-900 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-stone-900/20">
                  {seciliKullanici.ad[0]}{seciliKullanici.soyad[0]}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-stone-900">{seciliKullanici.ad} {seciliKullanici.soyad}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-stone-200 text-stone-600 rounded text-[9px] font-black uppercase tracking-widest">{seciliKullanici.rol}</span>
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-tighter">SİSTEM KAYITLI PAYDAŞ</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSeciliKullanici(null)} className="p-3 bg-white hover:bg-stone-100 text-stone-400 hover:text-stone-900 rounded-full transition-all border border-stone-100">
                <X size={20} />
              </button>
            </div>

            <div className="p-10 grid grid-cols-2 gap-10">
              <div className="space-y-8">
                <div>
                  <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <User size={14} /> Kimlik Bilgileri
                  </h3>
                  <div className="bg-stone-50 rounded-2xl p-5 border border-stone-100 space-y-4">
                    <div>
                      <p className="text-[9px] font-bold text-stone-300 uppercase">Tam Adı</p>
                      <p className="text-sm font-bold text-stone-800">{seciliKullanici.ad} {seciliKullanici.soyad}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-stone-300 uppercase">E-Posta Adresi</p>
                      <p className="text-sm font-medium text-stone-600 italic underline flex items-center gap-2 mt-1">
                        <Mail size={12} className="text-stone-400" /> {seciliKullanici.email}
                      </p>
                    </div>
                    
                    {/* Sadece Satıcıysa Mağaza Bilgisi Çıkar */}
                    {seciliKullanici.rol === 'Satıcı' && (
                      <div className="pt-3 border-t border-stone-200/50">
                        <p className="text-[9px] font-bold text-amber-600 uppercase mb-1">Mağaza Adı</p>
                        <p className="text-sm font-black text-stone-800 uppercase tracking-tight">
                           {seciliKullanici.ad.toUpperCase()} ATÖLYESİ
                        </p>
                      </div>
                    )}
                    
                    <div className="pt-3 border-t border-stone-200/50">
                      <p className="text-[9px] font-bold text-stone-300 uppercase mb-1">Platforma Katılım</p>
                      <p className="text-sm font-bold text-stone-800 flex items-center gap-2 italic">
                        <Calendar size={12} className="text-stone-400" /> {seciliKullanici.kayitTarihi}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Activity size={14} /> Güvenlik & Kayıtlar
                  </h3>
                  <div className="bg-stone-50 rounded-2xl p-5 border border-stone-100 space-y-5">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">IP Adresi</p>
                      <span className="text-[10px] font-mono font-bold text-stone-500">192.168.1.42</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter flex items-center gap-1.5">
                        <Clock size={12} /> Son Giriş
                      </p>
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg uppercase">{seciliKullanici.sonGiris}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-stone-200/50">
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter flex items-center gap-1.5">
                        <Shield size={12} /> Hesap Durumu
                      </p>
                      <StatusBadge durum={seciliKullanici.durum} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-10 py-8 bg-stone-50 border-t border-stone-100 flex justify-end gap-4">
              <button onClick={() => setSeciliKullanici(null)} className="px-8 py-3 bg-white border border-stone-200 text-stone-900 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-stone-50 transition-all">
                Pencereyi Kapat
              </button>
              {seciliKullanici.durum === 'Onay Bekliyor' && (
                <button onClick={() => durumuGuncelle(seciliKullanici.id, 'Aktif')} className="px-8 py-3 bg-stone-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/20">
                  Mağazayı Onayla
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  )
}