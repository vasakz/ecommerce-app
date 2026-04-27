import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react'

const MOCK_ADMIN = {
  email: 'admin@brand.com',
  sifre: 'admin123'
}

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [sifre, setSifre] = useState('')
  const [sifreGoster, setSifreGoster] = useState(false)
  const [hata, setHata] = useState('')
  const [yukleniyor, setYukleniyor] = useState(false)
  const navigate = useNavigate()

  const handleGiris = (e) => {
    e.preventDefault()
    setHata('')
    setYukleniyor(true)

    setTimeout(() => {
      if (email === MOCK_ADMIN.email && sifre === MOCK_ADMIN.sifre) {
        navigate('/admin')
      } else {
        setHata('E-posta veya şifre hatalı.')
      }
      setYukleniyor(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
      
      {/* Arka plan deseni */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-widest text-white">
            BRAND <span className="text-amber-500">ADMIN</span>
          </h1>
          <p className="text-stone-400 text-sm mt-2">Admin Dashboard Giriş</p>
        </div>

        {/* Kart */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">

          {hata && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
              <AlertCircle size={16} />
              {hata}
            </div>
          )}

          <form onSubmit={handleGiris} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                E-posta
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@brand.com"
                  required
                  className="w-full border border-stone-200 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-200 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                Şifre
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type={sifreGoster ? 'text' : 'password'}
                  value={sifre}
                  onChange={e => setSifre(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border border-stone-200 rounded-lg pl-10 pr-10 py-2.5 text-sm outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-200 transition"
                />
                <button
                  type="button"
                  onClick={() => setSifreGoster(!sifreGoster)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition"
                >
                  {sifreGoster ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={yukleniyor}
              className="w-full bg-stone-900 text-white py-3 rounded-lg text-sm font-bold hover:bg-amber-500 transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {yukleniyor ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <p className="text-center text-xs text-stone-400 mt-6">
            admin@brand.com · admin123
          </p>
        </div>

      </div>
    </div>
  )
}

export default AdminLogin