import { useState, useEffect } from 'react'
import registerGorsel from '../../../assets/register-login.jpg'
import { Link, useNavigate } from 'react-router-dom'
import { Check, X, ShieldAlert, Mail, Smartphone, RefreshCw } from 'lucide-react'

function Register() {
  const navigate = useNavigate()
  const [step, setStep] = useState('FORM') // FORM, EMAIL, PHONE
  
  // Form states
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  // OTP State
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(120)
  const [canResend, setCanResend] = useState(false)

  const requirements = [
    { label: "En az 8 karakter", test: (p) => p.length >= 8 },
    { label: "Büyük harf (A-Z)", test: (p) => /[A-Z]/.test(p) },
    { label: "Küçük harf (a-z)", test: (p) => /[a-z]/.test(p) },
    { label: "Rakam (0-9)", test: (p) => /[0-9]/.test(p) },
    { label: "Özel karakter (@$!%*?&)", test: (p) => /[@$!%*?&]/.test(p) },
  ]

  const strength = requirements.filter(req => req.test(password)).length
  const strengthColor = 
    strength <= 2 ? 'bg-red-500' : 
    strength <= 4 ? 'bg-amber-500' : 
    'bg-green-500'

  const isFormValid = 
    firstName && lastName && email && phone &&
    password && password === passwordRepeat && 
    strength === requirements.length && termsAccepted

  const handleRegisterClick = (e) => {
    e.preventDefault()
    if (isFormValid) {
      setStep('EMAIL')
    }
  }

  // OTP Timer
  useEffect(() => {
    let timer;
    if (step === 'PHONE' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    } else if (countdown === 0) {
      setCanResend(true)
    }
    return () => clearInterval(timer)
  }, [step, countdown])

  const handleResendOtp = () => {
    setCountdown(120)
    setCanResend(false)
    // simulate sending otp
  }

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  }

  const handleVerifyPhone = () => {
    if (otp.join('').length === 6) {
      // Başarılı giriş, ana sayfaya veya onboarding ekranına yönlendirme
      navigate('/giris-yap')
    }
  }

  const renderForm = () => (
    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 mx-auto">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-4xl font-black text-stone-900 dark:text-white mb-3 tracking-tighter">KAYIT OL.</h2>
        <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
          Zaten hesabın var mı?{' '}
          <Link to="/giris-yap" className="text-amber-600 font-bold hover:underline transition-all">Giriş Yap</Link>
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleRegisterClick}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-1">Adınız</label>
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-1">Soyadınız</label>
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-1">
            E-posta Adresi
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="uzman@example.com"
            className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-1">
            Telefon Numarası
          </label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
            placeholder="05XX XXX XX XX"
            className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-1">
              Şifre
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsFocused(true)}
                placeholder="••••••••"
                className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium"
              />
            </div>
            {/* Password Strength Indicator */}
            {isFocused && (
              <div className="mt-4 p-4 bg-stone-50 dark:bg-stone-900/50 rounded-2xl border border-stone-100 dark:border-stone-800 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Şifre Gücü</p>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    strength <= 2 ? 'text-red-500 bg-red-50' : 
                    strength <= 4 ? 'text-amber-500 bg-amber-50' : 
                    'text-green-500 bg-green-50'
                  }`}>
                    {strength <= 2 ? 'Zayıf' : strength <= 4 ? 'Orta' : 'Güçlü'}
                  </span>
                </div>
                
                <div className="h-1 w-full bg-stone-200 dark:bg-stone-800 rounded-full mb-4 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${strengthColor}`}
                    style={{ width: `${(strength / requirements.length) * 100}%` }}
                  />
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  {requirements.map((req, i) => {
                    const met = req.test(password)
                    return (
                      <li key={i} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                          met ? 'bg-green-500 text-white' : 'bg-stone-200 dark:bg-stone-800 text-stone-400'
                        }`}>
                          {met ? <Check size={10} strokeWidth={4} /> : <X size={10} strokeWidth={4} />}
                        </div>
                        <span className={`text-[11px] font-medium transition-colors ${
                          met ? 'text-stone-700 dark:text-stone-200' : 'text-stone-400'
                        }`}>
                          {req.label}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-1">
              Şifre Tekrar
            </label>
            <input
              type="password"
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
              placeholder="••••••••"
              className={`w-full bg-stone-50 dark:bg-stone-900 border rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-4 transition-all font-medium ${
                passwordRepeat && password !== passwordRepeat ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10' : 
                passwordRepeat && password === passwordRepeat ? 'border-green-500/50 focus:border-green-500 focus:ring-green-500/10' : 
                'border-stone-100 dark:border-stone-800 focus:border-amber-500 focus:ring-amber-500/10'
              }`}
            />
            {passwordRepeat && password !== passwordRepeat && (
              <p className="text-[10px] text-red-500 px-1 font-medium">Şifreler eşleşmiyor</p>
            )}
            {passwordRepeat && password === passwordRepeat && (
              <p className="text-[10px] text-green-500 px-1 font-medium">Şifreler eşleşti</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3 py-3">
          <div className="relative flex items-center mt-1">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-stone-200 dark:border-stone-700 checked:bg-amber-500 checked:border-amber-500 transition-all"
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
          <button 
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-4 text-xs font-black tracking-[0.2em] shadow-2xl transition-all rounded-3xl active:scale-[0.98] mb-6 ${
              !isFormValid
              ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed shadow-none'
              : 'bg-stone-900 dark:bg-white text-white dark:text-stone-950 hover:bg-amber-600 dark:hover:bg-amber-500 hover:text-white'
            }`}
          >
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
  )

  const renderEmailVerif = () => (
    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 text-center flex flex-col items-center mx-auto">
      <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mb-8">
        <Mail size={40} strokeWidth={1.5} />
      </div>
      <h2 className="text-3xl font-black text-stone-900 dark:text-white mb-4 tracking-tighter">E-POSTA DOĞRULAMASI</h2>
      <p className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-8 leading-relaxed px-4">
        <span className="font-bold text-stone-800 dark:text-stone-200">{email}</span> adresine bir doğrulama bağlantısı gönderdik. Lütfen gelen kutunuzu kontrol edin ve e-postanızı doğrulayın.
      </p>

      <button 
        onClick={() => setStep('PHONE')}
        className="w-full py-4 text-xs font-black tracking-[0.2em] shadow-2xl transition-all rounded-3xl active:scale-[0.98] bg-stone-900 dark:bg-white text-white dark:text-stone-950 hover:bg-amber-600 dark:hover:bg-amber-500 hover:text-white"
      >
        E-POSTAYI DOĞRULADIM (SİMÜLASYON)
      </button>

      <div className="mt-8">
        <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
          E-posta gelmedi mi? <button className="text-amber-600 font-bold hover:underline">Tekrar Gönder</button>
        </p>
      </div>
    </div>
  )

  const renderPhoneVerif = () => (
    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 text-center flex flex-col items-center mx-auto">
      <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mb-8">
        <Smartphone size={40} strokeWidth={1.5} />
      </div>
      <h2 className="text-3xl font-black text-stone-900 dark:text-white mb-4 tracking-tighter">TELEFON DOĞRULAMASI</h2>
      <p className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-8 leading-relaxed px-4">
        <span className="font-bold text-stone-800 dark:text-stone-200">{phone}</span> numarasına 6 haneli bir doğrulama kodu gönderdik. Lütfen kodu aşağıya girin.
      </p>

      <div className="flex gap-2 justify-center mb-8" dir="ltr">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
            className="w-12 h-14 text-center text-xl font-black bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-stone-900 dark:text-white"
          />
        ))}
      </div>

      <button 
        onClick={handleVerifyPhone}
        disabled={otp.join('').length !== 6}
        className={`w-full py-4 text-xs font-black tracking-[0.2em] shadow-2xl transition-all rounded-3xl active:scale-[0.98] mb-6 ${
          otp.join('').length !== 6
          ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed shadow-none'
          : 'bg-stone-900 dark:bg-white text-white dark:text-stone-950 hover:bg-amber-600 dark:hover:bg-amber-500 hover:text-white'
        }`}
      >
        DOĞRULA
      </button>

      <div className="flex items-center justify-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
        {countdown > 0 ? (
          <span>Kodu tekrar göndermek için {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')} bekleyin</span>
        ) : (
          <button 
            onClick={handleResendOtp}
            className="flex items-center gap-1.5 text-amber-600 font-bold hover:underline"
          >
            <RefreshCw size={14} />
            <span>Kodu Tekrar Gönder</span>
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex bg-white dark:bg-stone-950">
      {/* Sol: Görsel */}
      <div className="hidden md:block w-1/2 relative bg-stone-900 border-r border-stone-800">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <img
            src={registerGorsel}
            alt="register"
            className="object-cover w-full h-full"
          />
          {step !== 'FORM' && (
            <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-1000 z-10">
              <div className="text-center text-white">
                <h3 className="text-4xl font-black tracking-tighter mb-4 shadow-sm">Neredeyse Bitti!</h3>
                <p className="text-white/80 font-medium max-w-sm mx-auto">Güvenliğiniz için hesabınızı doğrulamanız gerekiyor.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sağ: Kayıt Formu / Doğrulama Adımları */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 relative min-h-screen py-12">
        <div className="absolute top-0 -right-24 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

        {step === 'FORM' && renderForm()}
        {step === 'EMAIL' && renderEmailVerif()}
        {step === 'PHONE' && renderPhoneVerif()}
      </div>
    </div>
  )
}

export default Register