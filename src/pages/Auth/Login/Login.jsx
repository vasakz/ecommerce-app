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
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white dark:bg-stone-950 p-6 md:p-12 relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-4xl font-black text-stone-900 dark:text-white mb-3 tracking-tighter">GİRİŞ YAP.</h2>
            <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
              Hesabın yok mu?{' '}
              <Link to="/kayit-ol" className="text-amber-600 font-bold hover:underline transition-all">Kayıt Ol</Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-1">E-posta Adresi</label>
              <input
                type="email"
                placeholder="uzman@example.com"
                className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-1">Şifre</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    id="beniHatirla"
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-stone-200 checked:bg-amber-500 checked:border-amber-500 transition-all"
                  />
                  <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </div>
                </div>
                <label htmlFor="beniHatirla" className="text-xs text-stone-500 dark:text-stone-400 font-medium cursor-pointer">Beni Hatırla</label>
              </div>
              <Link to="/sifremi-unuttum" className="text-xs text-amber-600 font-bold hover:underline transition-all">Şifremi Unuttum</Link>
            </div>

            <button className="w-full bg-stone-900 dark:bg-white text-white dark:text-stone-950 py-4 text-xs font-black tracking-[0.2em] shadow-2xl shadow-stone-500/20 hover:bg-amber-600 dark:hover:bg-amber-500 hover:text-white transition-all rounded-3xl active:scale-[0.98]">
              GİRİŞ YAP
            </button>
          </form>
        </div>
      </div>

    </div>
  )
}

export default Login