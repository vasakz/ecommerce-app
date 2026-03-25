import loginGorsel from '../../../assets/register-login.jpg'
import { Link } from 'react-router-dom'

function Login() {
  return (
    <div className="h-screen flex overflow-hidden">

      {/* Sol: Görsel */}
      <div className="hidden md:flex w-1/2">
        <img
          src={loginGorsel}
          alt="login"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Sağ: Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-10">
        <div className="w-full max-w-md">

          <h2 className="text-3xl font-bold mb-2 tracking-widest">GİRİŞ YAP.</h2>
          <p className="text-sm text-stone-500 mb-8">
            Hesabın yok mu?{' '}
            <Link to="/kayit-ol" className="text-amber-500 hover:underline">Kayıt Ol</Link>
          </p>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="E-posta Adresi"
              className="w-full border-b border-stone-300 py-2 text-sm outline-none focus:border-amber-500 transition"
            />
            <input
              type="password"
              placeholder="Şifre"
              className="w-full border-b border-stone-300 py-2 text-sm outline-none focus:border-amber-500 transition"
            />
          </div>

          <div className="flex items-center justify-between mt-6 mb-8">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="beniHatirla" />
              <label htmlFor="beniHatirla" className="text-xs text-stone-500">Beni Hatırla</label>
            </div>
            <span className="text-xs text-amber-500 cursor-pointer hover:underline">Şifremi Unuttum</span>
          </div>

          <button className="w-full bg-stone-900 text-white py-3 text-sm font-semibold tracking-widest hover:bg-amber-500 transition rounded-full">
            GİRİŞ YAP
          </button>

        </div>
      </div>

    </div>
  )
}

export default Login