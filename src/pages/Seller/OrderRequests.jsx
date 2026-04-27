import React, { useState } from 'react';
import { 
  Package, 
  XCircle, 
  CheckCircle, 
  AlertTriangle, 
  MessageSquare, 
  RefreshCw, 
  ArrowRight, 
  Search, 
  Filter, 
  ArrowUpDown,
  History,
  ShieldCheck,
  Eye,
  Camera,
  Clock,
  ArrowRightLeft
} from 'lucide-react';
import { toast } from 'react-toastify';

const OrderRequests = () => {
  const [activeTab, setActiveTab] = useState('returns'); // returns, cancellations
  const [searchTerm, setSearchTerm] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState(null);
  const [selectedRejectReason, setSelectedRejectReason] = useState('');

  const [requests, setRequests] = useState([
    {
      id: 'REQ-1001',
      orderId: 'ORD-INT-901',
      type: 'İptal',
      customerName: 'Ahmet Yılmaz',
      date: '2026-04-10',
      reason: 'Farklı bir ürün buldum',
      status: 'Bekliyor', 
      amount: 1250,
      product: 'Handmade Leather Bag',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'REQ-1002',
      orderId: 'ORD-INT-899',
      type: 'İade',
      customerName: 'Ayşe Kaya',
      date: '2024-04-09',
      reason: 'Ayıplı / Kusurlu Ürün',
      description: 'Ürünün dikiş kısımlarında sökülme mevcut. Beklediğimden daha dayanıksız görünüyor.',
      status: 'Bekliyor',
      amount: 4500,
      product: 'Premium Wool Sweater',
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=300&q=80',
      evidenceImages: [
        'https://images.unsplash.com/photo-1556905055-8f358a7a4bb4?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80'
      ],
      returnStatus: 'Müşteri Kargo Teslimi Yaptı'
    },
    {
        id: 'REQ-1003',
        orderId: 'ORD-INT-905',
        type: 'İptal',
        customerName: 'Mehmet Demir',
        date: '2024-04-12',
        reason: 'Siparişi yanlışlıkla verdim',
        status: 'Onaylandı', 
        amount: 850,
        product: 'Ceramic Vase Set',
        image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=300&q=80'
      }
  ]);

  const handleApprove = (reqId) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'Onaylandı' } : r));
    toast.success('Talep onaylandı. Müşteriye bildirim gönderildi.');
  };

  const handleRejectClick = (reqId) => {
    setActiveRequestId(reqId);
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    if (!selectedRejectReason) return;
    setRequests(prev => prev.map(r => r.id === activeRequestId ? { ...r, status: 'Reddedildi' } : r));
    setShowRejectModal(false);
    setSelectedRejectReason('');
    setActiveRequestId(null);
    toast.info('İade talebi reddedildi.');
  };

  const filteredRequests = requests.filter(r => {
    const matchesTab = (activeTab === 'returns' && r.type === 'İade') || (activeTab === 'cancellations' && r.type === 'İptal');
    const matchesSearch = r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || r.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    pendingReturns: requests.filter(r => r.type === 'İade' && r.status === 'Bekliyor').length,
    pendingCancellations: requests.filter(r => r.type === 'İptal' && r.status === 'Bekliyor').length,
    totalProcessed: requests.filter(r => r.status !== 'Bekliyor').length
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-stone-900 dark:text-white flex items-center gap-3">
              <div className="p-3 bg-amber-600 rounded-2xl text-white shadow-xl shadow-amber-500/20">
                <ArrowRightLeft className="w-7 h-7" />
              </div>
              İade & İptal Yönetimi
            </h1>
            <p className="text-stone-500 dark:text-stone-400 mt-2 font-medium">
              Müşteri taleplerini izleyin, inceleyin ve hızlıca aksiyon alın.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-white dark:bg-stone-900 p-2 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm">
             <div className="px-4 py-2 border-r border-stone-100 dark:border-stone-800">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Bekleyen İade</p>
                <p className="text-xl font-black text-amber-600">{stats.pendingReturns}</p>
             </div>
             <div className="px-4 py-2">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Bekleyen İptal</p>
                <p className="text-xl font-black text-stone-900 dark:text-white">{stats.pendingCancellations}</p>
             </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="sticky top-[64px] z-30 flex flex-col md:flex-row items-center gap-4 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md py-4">
           <div className="relative flex-1 w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-amber-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Müşteri adı veya sipariş no ile ara..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl focus:ring-2 focus:ring-amber-500 font-bold text-sm shadow-sm"
              />
           </div>

           <div className="flex items-center gap-2 bg-white dark:bg-stone-900 p-1.5 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm self-stretch md:self-auto">
              <button 
                onClick={() => setActiveTab('returns')}
                className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                  ${activeTab === 'returns' ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20' : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800'}`}
              >
                İadeler ({stats.pendingReturns})
              </button>
              <button 
                onClick={() => setActiveTab('cancellations')}
                className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                  ${activeTab === 'cancellations' ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-lg' : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800'}`}
              >
                İptaller ({stats.pendingCancellations})
              </button>
           </div>
        </div>

        {/* Requests List */}
        <div className="grid grid-cols-1 gap-6 pb-20">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-stone-900 rounded-[2.5rem] border border-dashed border-stone-200 dark:border-stone-800">
               <div className="w-20 h-20 bg-stone-50 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-300">
                  <Package className="w-10 h-10" />
               </div>
               <h3 className="text-xl font-bold text-stone-900 dark:text-white">Şu an gösterilecek talep yok</h3>
               <p className="text-stone-500 dark:text-stone-400 mt-2">Gelen tüm talepleri işlediniz. Harika iş!</p>
            </div>
          ) : (
            filteredRequests.map(req => (
              <div key={req.id} className="group bg-white dark:bg-stone-900 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                <div className="p-8">
                  
                  {/* Top Row: Meta Info */}
                  <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
                     <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                           <img src={req.image} className="w-full h-full object-cover" alt={req.product} />
                        </div>
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tight 
                                ${req.status === 'Bekliyor' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-green-100 dark:bg-green-900/30 text-green-600'}`}>
                                {req.status}
                              </span>
                              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{req.id}</span>
                           </div>
                           <h3 className="text-lg font-bold text-stone-900 dark:text-white group-hover:text-amber-600 transition-colors uppercase tracking-tight">{req.product}</h3>
                           <p className="text-xs text-stone-500 font-medium">Sipariş No: <span className="font-bold text-stone-900 dark:text-stone-300">{req.orderId}</span></p>
                        </div>
                     </div>
                     
                     <div className="text-right">
                        <p className="text-2xl font-black text-stone-900 dark:text-white">{req.amount.toLocaleString('tr-TR')} ₺</p>
                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mt-1">{req.date}</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                    
                    {/* Customer & Reason Info */}
                    <div className="space-y-6">
                       <div className="p-6 bg-stone-50 dark:bg-stone-800/40 rounded-3xl border border-stone-100 dark:border-stone-800">
                          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                             <MessageSquare className="w-3 h-3" />
                             Talep Detayı
                          </p>
                          <div className="space-y-4">
                             <div>
                                <p className="text-xs font-bold text-stone-400 mb-1">Müşteri</p>
                                <p className="font-bold text-stone-900 dark:text-white">{req.customerName}</p>
                             </div>
                             <div>
                                <p className="text-xs font-bold text-stone-400 mb-1">İade Sebebi</p>
                                <p className="font-bold text-red-500 flex items-center gap-2">
                                   <AlertTriangle className="w-4 h-4" />
                                   {req.reason}
                                </p>
                             </div>
                             {req.description && (
                               <div>
                                  <p className="text-xs font-bold text-stone-400 mb-1">Açıklama</p>
                                  <p className="text-sm text-stone-600 dark:text-stone-400 italic leading-relaxed font-medium">"{req.description}"</p>
                               </div>
                             )}
                          </div>
                       </div>
                    </div>

                    {/* Evidence & Status */}
                    <div className="space-y-6">
                        {req.type === 'İade' && (
                           <>
                             <div className="flex gap-4 mb-2">
                               {req.evidenceImages?.map((img, i) => (
                                 <div key={i} className="relative group/img w-24 h-24 rounded-2xl overflow-hidden shadow-lg cursor-zoom-in">
                                    <img src={img} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500" alt="Evidence" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                       <Eye className="w-5 h-5 text-white" />
                                    </div>
                                 </div>
                               ))}
                               {!req.evidenceImages && (
                                  <div className="w-full py-6 bg-stone-50 dark:bg-stone-800/40 border border-dashed border-stone-200 dark:border-stone-700 rounded-3xl flex flex-col items-center justify-center text-stone-400">
                                     <Camera className="w-8 h-8 mb-2 opacity-30" />
                                     <p className="text-[10px] font-black uppercase tracking-widest">Kanıt görseli yok</p>
                                  </div>
                               )}
                             </div>

                             <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/50 rounded-2xl flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                                   <Clock className="w-4 h-4" />
                                </div>
                                <div>
                                   <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Süreç Durumu</p>
                                   <p className="text-xs font-bold text-amber-900 dark:text-amber-400">{req.returnStatus || 'İnceleme Bekleniyor'}</p>
                                </div>
                             </div>
                           </>
                        )}

                        {/* Actions */}
                        {req.status === 'Bekliyor' && (
                          <div className="flex flex-col sm:flex-row gap-3 pt-4">
                             <button 
                               onClick={() => handleApprove(req.id)}
                               className="flex-1 px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2"
                             >
                                <CheckCircle className="w-5 h-5" />
                                Talebi Onayla
                             </button>
                             <button 
                               onClick={() => handleRejectClick(req.id)}
                               className="px-8 py-4 bg-white dark:bg-stone-800 text-red-500 border border-red-100 dark:border-stone-700 rounded-2xl font-black text-sm transition-all hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-95 flex items-center justify-center gap-2"
                             >
                                <XCircle className="w-5 h-5" />
                                Reddet
                             </button>
                          </div>
                        )}

                        {req.status !== 'Bekliyor' && (
                           <div className="p-4 border border-stone-100 dark:border-stone-800 rounded-2xl flex items-center justify-center gap-2 text-stone-400">
                              <ShieldCheck className="w-5 h-5" />
                              <span className="text-xs font-black uppercase tracking-widest">İşlem Tamamlandı</span>
                           </div>
                        )}
                    </div>

                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Info Legend */}
        <div className="flex flex-wrap gap-8 py-10 border-t border-stone-100 dark:border-stone-800">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                 <History className="w-5 h-5" />
              </div>
              <div>
                 <p className="font-bold text-sm text-stone-900 dark:text-white">Arşivlenen Talepler</p>
                 <p className="text-xs text-stone-500">Geçmişe dönük iadeler</p>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                 <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                 <p className="font-bold text-sm text-stone-900 dark:text-white">Güvenli İade</p>
                 <p className="text-xs text-stone-500">Otomatik onay süreci</p>
              </div>
           </div>
        </div>

      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-stone-800 animate-in zoom-in-95 duration-300">
              <div className="p-8 pb-0">
                 <h3 className="text-2xl font-black text-stone-900 dark:text-white mb-2">Talebi Reddet</h3>
                 <p className="text-sm text-stone-500 dark:text-stone-400 font-medium leading-relaxed">Müşteriye bildirilecek geçerli bir ret gerekçesi seçmelisiniz.</p>
              </div>
              
              <div className="p-8 space-y-6">
                 <div className="space-y-4">
                    {[
                      'Kurumsal iade prosedürüne uygun değil',
                      'Ürün hasarı müşteri kaynaklı tespit edildi',
                      'İade süresi (14 Gün) aşıldı',
                      'Hijyenik sebeplerle iadesi mümkün değil'
                    ].map((reason, idx) => (
                      <label key={idx} className={`flex items-center p-4 rounded-2xl border cursor-pointer transition-all ${selectedRejectReason === reason ? 'bg-red-50 dark:bg-red-900/20 border-red-500 shadow-lg' : 'bg-stone-50 dark:bg-stone-800 border-stone-100 dark:border-stone-800 hover:border-red-200'}`}>
                         <input type="radio" value={reason} checked={selectedRejectReason === reason} onChange={e => setSelectedRejectReason(e.target.value)} className="w-4 h-4 text-red-600 focus:ring-red-500 border-stone-300" />
                         <span className="ml-4 text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-tight">{reason}</span>
                      </label>
                    ))}
                 </div>

                 <div className="flex gap-4">
                    <button onClick={() => setShowRejectModal(false)} className="flex-1 py-4 bg-stone-100 dark:bg-stone-800 text-stone-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-stone-200 transition-all">Vazgeç</button>
                    <button onClick={handleConfirmReject} disabled={!selectedRejectReason} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-700 disabled:opacity-50 transition-all">Reddi Onayla</button>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default OrderRequests;
