import registerGorsel from '../../../assets/register-login.jpg'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const inputClass = "w-full border-b border-stone-300 py-2 text-sm outline-none focus:border-amber-500 transition"
  const navigate = useNavigate()

  return (
    <div className="h-screen flex overflow-hidden">

      {/* Sol: Görsel */}
      <div className="hidden md:flex w-1/2 overflow-hidden">
        <img
          src={registerGorsel}
          alt="register"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Sağ: Kayıt Formu */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-10">
        <div className="w-full max-w-md">

          <h2 className="text-3xl font-bold mb-2 tracking-widest">KAYIT OL.</h2>
          <p className="text-sm text-stone-500 mb-8">
            Zaten hesabın var mı?{' '}
            <Link to="/giris-yap" className="text-amber-500 cursor-pointer hover:underline">Giriş Yap</Link>
          </p>

          <div className="space-y-4">
            <input type="text" placeholder="Adınız" className={inputClass} />
            <input type="text" placeholder="Soyadınız" className={inputClass} />
            <input type="email" placeholder="E-posta Adresi" className={inputClass} />
            <input type="password" placeholder="Şifre" className={inputClass} />
          </div>

          <div className="flex items-center gap-2 mt-6 mb-6">
            <input type="checkbox" id="terms" />
            <label htmlFor="terms" className="text-xs text-stone-500">
              <span className="text-amber-500 cursor-pointer hover:underline">Gizlilik Politikası</span>
              {' '}ve{' '}
              <span className="text-amber-500 cursor-pointer hover:underline">Kullanım Şartları</span>
              'nı kabul ediyorum
            </label>
          </div>

          <button className="w-full bg-stone-900  dark:border dark:border-stone-400 text-white py-3 text-sm font-semibold tracking-widest hover:bg-amber-500 transition rounded-full mb-3">
            KAYIT OL
          </button>

          <button
            onClick={() => navigate('/satici-kayit')}
            className="w-full border border-stone-400 dark:border-stone-600 dark:text-white text-stone-700 py-3 text-sm font-semibold tracking-widest hover:bg-amber-500 hover:border-amber-500 hover:text-white transition rounded-full"
          >
            SATICI HESABI OLUŞTUR
          </button>

        </div>
      </div>

    </div>
  )
}

export default Register