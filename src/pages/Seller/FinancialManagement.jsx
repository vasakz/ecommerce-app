import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Clock, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  ChevronRight,
  Download,
  PieChart
} from 'lucide-react';
import { toast } from 'react-toastify';

const FinancialManagement = () => {
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const stats = {
    balance: 45250,
    pendingFunds: 12400,
    totalWithdrawn: 125000
  };

  const pendingPayments = [
    { id: 'PAY-1001', orderId: 'ORD-9921', date: '2026-04-10', amount: 3500, status: 'Processing' },
    { id: 'PAY-1002', orderId: 'ORD-9925', date: '2026-04-11', amount: 8900, status: 'Processing' },
  ];

  const [withdrawalRequests, setWithdrawalRequests] = useState([
    { id: 'WR-501', date: '2026-04-01', amount: 15000, status: 'Completed' },
    { id: 'WR-502', date: '2026-04-05', amount: 20000, status: 'Pending' }
  ]);

  const earningsHistory = [
    { id: 'ERN-1', type: 'Sipariş Kazancı', desc: 'ORD-9880 nolu sipariş', date: '2026-04-08', amount: 1200, isPositive: true },
    { id: 'ERN-2', type: 'Sipariş Kazancı', desc: 'ORD-9875 nolu sipariş', date: '2026-04-07', amount: 3450, isPositive: true },
    { id: 'ERN-3', type: 'Platform Komisyonu', desc: 'Nisan ayı hizmet bedeli', date: '2026-04-01', amount: -650, isPositive: false },
    { id: 'ERN-4', type: 'Para Çekme', desc: 'Banka hesabına transfer (TR...1234)', date: '2026-03-25', amount: -15000, isPositive: false },
  ];

  const handleWithdraw = (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      toast.error('Lütfen geçerli bir tutar giriniz.');
      return;
    }
    if (amount > stats.balance) {
      toast.error('Çekilebilir bakiyenizden fazla tutar talep edemezsiniz.');
      return;
    }

    const newRequest = {
      id: `WR-${Math.floor(Math.random() * 1000) + 600}`,
      date: new Date().toISOString().split('T')[0],
      amount: amount,
      status: 'Pending'
    };

    setWithdrawalRequests([newRequest, ...withdrawalRequests]);
    setWithdrawAmount('');
    toast.success(`${amount} ₺ tutarındaki çekim talebiniz alınmıştır.`);
  };

  const handleDownloadInvoice = () => {
    toast.info("Fatura hazırlanıyor...");
    setTimeout(() => {
      const content = "Fatura Belgesi\n\nTarih: " + new Date().toLocaleDateString() + "\n\nAylik Komisyon Faturasi\n------------------------\n\nTutar: 1250 TL\nKDV (%20): 250 TL\nToplam: 1500 TL";
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fatura_${new Date().getTime()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Fatura belgesi indirildi.");
    }, 800);
  };

  const handleDownloadTaxReport = () => {
    toast.info("Vergi raporu hazırlanıyor...");
    setTimeout(() => {
      const content = "Tarih,Islem,Tutar(TL),Vergi(TL)\n2026-04-01,Satis,1000,180\n2026-04-05,Hizmet,500,90\n2026-04-10,Satis,2000,360";
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vergi_raporu_${new Date().getTime()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Vergi raporu indirildi.");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-white flex items-center gap-3">
            <Wallet className="w-8 h-8 text-emerald-600" />
            Finansal Yönetim
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">Bakiye yönetimi, ödemeler ve kazanç geçmişinizi takip edin.</p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Balance Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 text-emerald-100">
                <Wallet className="w-5 h-5" />
                <span className="font-medium text-sm">Çekilebilir Bakiye</span>
              </div>
              <p className="text-4xl font-black mb-6">₺{stats.balance.toLocaleString('tr-TR')}</p>
              
              <form onSubmit={handleWithdraw} className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="Tutar (₺)"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-white/20 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-emerald-200/70 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm font-bold"
                />
                <button type="submit" className="bg-white text-emerald-900 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors whitespace-nowrap whitespace-nowrap">
                  Para Çek
                </button>
              </form>
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-gray-100 dark:border-stone-800 shadow-xl flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2 text-stone-500 dark:text-stone-400">
              <Clock className="w-5 h-5 text-amber-500" />
              <span className="font-medium text-sm">Bekleyen Ödemeler</span>
            </div>
            <p className="text-3xl font-black text-stone-900 dark:text-white">₺{stats.pendingFunds.toLocaleString('tr-TR')}</p>
            <p className="text-xs text-stone-400 mt-2">Alıcı onayı bekleyen sipariş tutarları.</p>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-gray-100 dark:border-stone-800 shadow-xl flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2 text-stone-500 dark:text-stone-400">
              <Building2 className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-sm">Toplam Çekilen</span>
            </div>
            <p className="text-3xl font-black text-stone-900 dark:text-white">₺{stats.totalWithdrawn.toLocaleString('tr-TR')}</p>
            <p className="text-xs text-stone-400 mt-2">Bugüne kadar bankanıza aktarılan toplam tutar.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Pending Payments & Withdrawals */}
          <div className="space-y-8">
            
            {/* Pending Payments */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl border border-gray-100 dark:border-stone-800 p-6 shadow-xl">
              <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Hesaba Geçecek Ödemeler
              </h3>
              <div className="space-y-3">
                {pendingPayments.map(payment => (
                  <div key={payment.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-stone-800 hover:bg-gray-50 dark:hover:bg-stone-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-stone-900 dark:text-white">{payment.orderId}</p>
                        <p className="text-xs text-stone-500 mt-0.5">Tahmini geçiş: {payment.date}</p>
                      </div>
                    </div>
                    <span className="font-black text-amber-600">
                      +₺{payment.amount.toLocaleString('tr-TR')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
          </div>

          {/* Right Column: Earnings History */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-gray-100 dark:border-stone-800 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-stone-500" />
                Hesap Hareketleri & Kazanç Geçmişi
              </h3>
              <button className="text-sm font-bold text-blue-600 hover:text-blue-700">Tümünü Gör</button>
            </div>
            
            <div className="relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:ml-[2.25rem] before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-stone-700 before:to-transparent">
              {earningsHistory.map((item) => (
                <div key={item.id} className="relative mb-6 last:mb-0 pl-14 md:pl-20 group">
                  {/* Timeline Dot */}
                  <div className={`absolute left-0 left-0 md:left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white dark:border-stone-900 z-10 
                    ${item.isPositive ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {item.isPositive ? <ArrowDownCircle className="w-5 h-5" /> : <ArrowUpCircle className="w-5 h-5" />}
                  </div>
                  
                  {/* Content Card */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-gray-100 dark:border-stone-800 shadow-sm group-hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-stone-400">{item.date}</span>
                        <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-500">{item.type}</span>
                      </div>
                      <p className="font-medium text-sm text-stone-900 dark:text-white">{item.desc}</p>
                    </div>
                    <span className={`font-black whitespace-nowrap text-lg ${item.isPositive ? 'text-emerald-500' : 'text-stone-900 dark:text-white'}`}>
                      {item.isPositive ? '+' : ''}₺{item.amount.toLocaleString('tr-TR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Reports & Documents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            onClick={handleDownloadInvoice}
            className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-gray-100 dark:border-stone-800 shadow-xl flex items-center justify-between group cursor-pointer hover:border-indigo-500/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 dark:text-white">Fatura İndirme</h3>
                <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">Aylık komisyon ve hizmet faturaları</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-stone-800 flex items-center justify-center text-stone-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              <Download className="w-5 h-5" />
            </div>
          </div>

          <div 
            onClick={handleDownloadTaxReport}
            className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-gray-100 dark:border-stone-800 shadow-xl flex items-center justify-between group cursor-pointer hover:border-amber-500/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600">
                <PieChart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 dark:text-white">Vergi Raporları</h3>
                <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">Yıllık ve aylık vergi rücu raporları</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-stone-800 flex items-center justify-center text-stone-400 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
              <Download className="w-5 h-5" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FinancialManagement;
