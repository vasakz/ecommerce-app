import React, { useState } from 'react';
import { 
  Building2, 
  CreditCard, 
  User, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft,
  Info,
  Banknote,
  Lock,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const TURKISH_BANKS = [
  'Ziraat Bankası',
  'VakıfBank',
  'Halkbank',
  'İş Bankası',
  'Garanti BBVA',
  'Akbank',
  'Yapı Kredi',
  'QNB Finansbank',
  'DenizBank',
  'TEB (Türk Ekonomi Bankası)',
  'Kuveyt Türk',
  'Türkiye Finans',
  'Albaraka Türk',
  'Enpara.com',
  'Papara'
];

const IbanSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [iban, setIban] = useState('TR62 0006 2000 0001 2345 6789 01');
  const [bankName, setBankName] = useState('Garanti BBVA');
  const [accountHolder, setAccountHolder] = useState('Atölye Deri Sanayi Tic. Ltd. Şti.');
  const [isSaved, setIsSaved] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsSaved(true);
      toast.success('IBAN bilgileriniz başarıyla güncellendi.');
    }, 1500);
  };

  const handleIbanChange = (e) => {
    let value = e.target.value.toUpperCase();
    // Simple format for TR IBAN
    if (value.startsWith('TR')) {
      // Logic for spacing could go here
    }
    setIban(value);
    setIsSaved(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-950 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Top Navigation */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors group mb-8"
        >
          <div className="p-2 bg-white dark:bg-stone-900 rounded-lg border border-gray-100 dark:border-stone-800 shadow-sm group-hover:bg-gray-50 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm">Geri Dön</span>
        </button>

        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-stone-900 dark:text-white flex items-center gap-3">
            <div className="p-3 bg-amber-500 rounded-2xl text-white shadow-lg shadow-amber-500/20">
              <Building2 className="w-7 h-7" />
            </div>
            Ödeme Bilgileri
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-2 font-medium">
            Kazançlarınızın aktarılacağı banka hesabınızı buradan yönetebilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          
          {/* Status Banner */}
          {isSaved ? (
            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-900 dark:text-emerald-400 uppercase tracking-tight">Hesap Doğrulandı</p>
                <p className="text-xs text-emerald-700 dark:text-emerald-500/80">Para çekme talepleriniz bu hesaba aktarılacaktır.</p>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-900 dark:text-amber-400 uppercase tracking-tight">Kaydedilmemiş Değişiklikler</p>
                <p className="text-xs text-amber-700 dark:text-amber-500/80">Lütfen güncellediğiniz bilgileri kaydetmeyi unutmayın.</p>
              </div>
            </div>
          )}

          {/* IBAN Form Card */}
          <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] border border-gray-100 dark:border-stone-800 shadow-xl overflow-hidden">
            <div className="p-8 md:p-10">
              <form onSubmit={handleSave} className="space-y-6">
                
                {/* Account Holder */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Hesap Sahibi Unvanı</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-amber-500 transition-colors" />
                    <input 
                      type="text" 
                      value={accountHolder}
                      onChange={(e) => {setAccountHolder(e.target.value); setIsSaved(false);}}
                      placeholder="Hesap sahibi adı veya şirket unvanı"
                      className="w-full pl-12 pr-5 py-4 bg-gray-50 dark:bg-stone-800 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 font-bold text-stone-900 dark:text-white transition-all shadow-inner"
                      required
                    />
                  </div>
                </div>

                {/* Bank Selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Banka Adı</label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-amber-500 transition-colors z-10" />
                    <select 
                      value={bankName}
                      onChange={(e) => {setBankName(e.target.value); setIsSaved(false);}}
                      className="w-full pl-12 pr-10 py-4 bg-gray-50 dark:bg-stone-800 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 font-bold text-stone-900 dark:text-white transition-all shadow-inner appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Banka Seçin</option>
                      {TURKISH_BANKS.map(bank => (
                        <option key={bank} value={bank}>{bank}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                       <ChevronRight className="w-5 h-5 rotate-90" />
                    </div>
                  </div>
                </div>

                {/* IBAN */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">IBAN Numarası</label>
                  <div className="relative group">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-amber-500 transition-colors" />
                    <input 
                      type="text" 
                      value={iban}
                      onChange={handleIbanChange}
                      placeholder="TR00 0000 0000 0000 0000 0000 00"
                      className="w-full pl-12 pr-5 py-4 bg-gray-50 dark:bg-stone-800 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 font-bold text-stone-900 dark:text-white transition-all shadow-inner tracking-wider"
                      required
                    />
                    {iban.length > 2 && !iban.startsWith('TR') && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-red-500 text-[10px] font-bold">
                        <AlertCircle className="w-3 h-3" />
                        TR ile başlamalı
                      </div>
                    )}
                  </div>
                </div>

                {/* Security Note */}
                <div className="p-4 bg-stone-50 dark:bg-stone-800/30 rounded-2xl border border-dotted border-stone-200 dark:border-stone-700">
                  <div className="flex gap-3">
                    <Lock className="w-5 h-5 text-stone-400 shrink-0" />
                    <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-medium">
                      Güvenliğiniz için IBAN değişikliği yapıldığında kayıtlı cep telefonunuza bir onay kodu gönderilebilir. Lojistik ve ödeme süreçlerinin aksamaması için bilgilerin doğruluğundan emin olun.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={loading || isSaved}
                  className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg
                    ${isSaved 
                      ? 'bg-gray-100 dark:bg-stone-800 text-stone-400 cursor-not-allowed shadow-none' 
                      : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/25 active:scale-[0.98]'
                    }`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Bilgileri Güncelle
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Visual Card Preview */}
          <div className="relative group perspective-1000">
             <div className="bg-gradient-to-br from-stone-900 to-stone-800 dark:from-stone-800 dark:to-stone-900 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                
                <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                   <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Kayıtlı Banka</p>
                        <h4 className="text-xl font-bold">{bankName || 'Banka Seçilmedi'}</h4>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <Banknote className="w-6 h-6 text-amber-500" />
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest">IBAN</p>
                        <p className="text-2xl font-mono tracking-tighter sm:tracking-normal overflow-hidden text-ellipsis">{iban || 'TR00 ...'}</p>
                      </div>
                      
                      <div className="flex justify-between items-end border-t border-white/5 pt-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Hesap Sahibi</p>
                          <p className="font-bold text-sm tracking-tight">{accountHolder || '---'}</p>
                        </div>
                        <div className="flex -space-x-2">
                           <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/50 backdrop-blur-sm"></div>
                           <div className="w-8 h-8 rounded-full bg-stone-500/20 border border-stone-500/50 backdrop-blur-sm"></div>
                        </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* FAQ / Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
             <div className="p-6 bg-white dark:bg-stone-900 rounded-3xl border border-gray-100 dark:border-stone-800 shadow-sm flex flex-col gap-3 group hover:border-amber-500/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                   <Info className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-stone-900 dark:text-white">Para ne zaman yatar?</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-medium">Sipariş onaylandıktan sonraki ilk Çarşamba günü ödemeniz hesabınıza aktarılır.</p>
             </div>

             <div className="p-6 bg-white dark:bg-stone-900 rounded-3xl border border-gray-100 dark:border-stone-800 shadow-sm flex flex-col gap-3 group hover:border-amber-500/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
                   <Lock className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-stone-900 dark:text-white">Bilgim dışında değişiklik?</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-medium">Banka bilgilerinizde size ait olmayan bir düzenleme fark ederseniz hemen desteğe ulaşın.</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default IbanSettings;
