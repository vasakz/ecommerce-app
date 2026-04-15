import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, ShieldCheck } from 'lucide-react'

function ForgotPassword() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-[2.5rem] p-10 shadow-2xl shadow-stone-200 dark:shadow-none border border-stone-100 dark:border-stone-800 animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
          <div className="mb-10">
            <Link 
              to="/giris-yap" 
              className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-8 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Giriş Sayfasına Dön
            </Link>
            
            <h1 className="text-4xl font-black text-stone-900 dark:text-white mb-4 tracking-tighter">Şifremi Unuttum.</h1>
            <p className="text-sm font-medium text-stone-500 dark:text-stone-400 leading-relaxed">
              Endişelenmeyin! E-posta adresinizi girin, size şifrenizi sıfırlamanız için gerekli olan talimatları içeren bir bağlantı gönderelim.
            </p>
          </div>

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-1">E-posta Adresi</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-amber-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  placeholder="uzman@example.com" 
                  className="w-full bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-700 rounded-2xl pl-14 pr-6 py-4 text-sm outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium" 
                />
              </div>
            </div>

            <button className="w-full bg-stone-900 dark:bg-white text-white dark:text-stone-950 py-5 text-xs font-black tracking-[0.2em] shadow-2xl shadow-stone-500/20 hover:bg-amber-600 dark:hover:bg-amber-500 hover:text-white transition-all rounded-3xl active:scale-[0.98]">
              TALİMATLARI GÖNDER
            </button>
          </form>

          <div className="mt-12 p-6 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-800 flex items-start gap-4">
             <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
               <ShieldCheck size={20} />
             </div>
             <div>
               <h4 className="text-sm font-bold text-stone-900 dark:text-white mb-1">Hesabınız Güvende</h4>
               <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">Verileriniz SSL ile korunmaktadır. Doğrulama bağlantısı e-posta adresinize özel olarak oluşturulacaktır.</p>
             </div>
          </div>
        </div>
    </div>
  )
}

export default ForgotPassword
