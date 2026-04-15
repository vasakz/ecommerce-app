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
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white dark:bg-stone-950 p-6 md:p-12 relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-4xl font-black text-stone-900 dark:text-white mb-3 tracking-tighter">KAYIT OL.</h2>
            <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
              Zaten hesabın var mı?{' '}
              <Link to="/giris-yap" className="text-amber-600 font-bold hover:underline transition-all">Giriş Yap</Link>
            </p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-1">Adınız</label>
                <input 
                  type="text" 
                  placeholder="Can" 
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-1">Soyadınız</label>
                <input 
                  type="text" 
                  placeholder="Yılmaz" 
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium" 
                />
              </div>
            </div>

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

            <div className="flex items-start gap-3 py-3">
              <div className="relative flex items-center mt-1">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-stone-200 checked:bg-amber-500 checked:border-amber-500 transition-all"
                />
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
              </div>
              <label htmlFor="terms" className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-medium cursor-pointer">
                <span className="text-amber-600 font-bold hover:underline">Gizlilik Politikası</span>
                {' '}ve{' '}
                <span className="text-amber-600 font-bold hover:underline">Kullanım Şartları</span>
                'nı kabul ediyorum
              </label>
            </div>

            <div className="pt-2">
              <button className="w-full bg-stone-900 dark:bg-white text-white dark:text-stone-950 py-4 text-xs font-black tracking-[0.2em] shadow-2xl shadow-stone-500/20 hover:bg-amber-600 dark:hover:bg-amber-500 hover:text-white transition-all rounded-3xl active:scale-[0.98] mb-6">
                KAYIT OL
              </button>

              <div className="relative flex items-center gap-4 text-stone-300 dark:text-stone-800 mb-6">
                <div className="flex-1 h-[1px] bg-stone-100 dark:bg-stone-800" />
                <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Veya</span>
                <div className="flex-1 h-[1px] bg-stone-100 dark:bg-stone-800" />
              </div>

              <button
                type="button"
                onClick={() => navigate('/satici-kayit')}
                className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 text-stone-900 dark:text-white py-4 text-xs font-black tracking-[0.2em] hover:bg-white dark:hover:bg-stone-800 hover:border-amber-500/50 transition-all rounded-3xl active:scale-[0.98] flex items-center justify-center gap-3 group"
              >
                SATICI HESABI OLUŞTUR
                <div className="w-5 h-5 rounded-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all scale-75 group-hover:scale-100">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  )
}

export default Register