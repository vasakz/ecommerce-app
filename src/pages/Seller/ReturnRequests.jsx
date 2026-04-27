import React, { useState } from 'react';
import { 
  Package, 
  XCircle, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Search, 
  Filter, 
  ArrowRight,
  Eye,
  Camera,
  Clock,
  ArrowRightLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Inbox,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'react-toastify';

const ReturnRequests = () => {
  const [activeFilter, setActiveFilter] = useState('All'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReturn, setSelectedReturn] = useState(null);

  const [returns, setReturns] = useState([
    {
      id: 'RET-5520',
      orderId: 'ORD-7741',
      customer: 'Selin Işık',
      product: 'Minimalist Seramik Sürahi',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=300&q=80',
      price: 890,
      reason: 'Ayıplı / Kusurlu Ürün',
      description: 'Ürün kargoda kırılmış geldi. Paketi açtığımda parçalara ayrılmıştı.',
      status: 'Pending',
      date: '2024-04-18',
      evidence: [
        'https://images.unsplash.com/photo-1614028674026-a018318cd427?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1595461135849-bf08893fdc2c?auto=format&fit=crop&w=600&q=80'
      ],
      deadline: '24 Saat İçinde Yanıtlayın'
    },
    {
      id: 'RET-5518',
      orderId: 'ORD-7735',
      customer: 'Burak Tan',
      product: 'El Yapımı Deri Sandalet',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=300&q=80',
      price: 2450,
      reason: 'Vazgeçme Hakkı',
      description: 'Numarası uymadı, bir numara büyük sipariş vermem gerekiyordu.',
      status: 'Approved',
      date: '2024-04-15',
      evidence: [],
      returnTracking: 'Yurtici Kargo - 28471928'
    },
    {
        id: 'RET-5515',
        orderId: 'ORD-7730',
        customer: 'Deniz Aksu',
        product: 'Keten Nevresim Takımı',
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=300&q=80',
        price: 3200,
        reason: 'Yanlış Ürün Gönderildi',
        description: 'Ben beyaz renk istemiştim ama bej renk gönderilmiş.',
        status: 'Rejected',
        date: '2024-04-12',
        evidence: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80'],
        rejectReason: 'Ürün açıklamada belirtildiği gibi bej tonlarındadır.'
      }
  ]);

  const stats = [
    { label: 'Bekleyen Talep', value: '12', icon: <Clock />, color: 'text-amber-600 bg-amber-50' },
    { label: 'Onay Oranı', value: '%94', icon: <TrendingUp />, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Ort. Çözüm', value: '4.2 Sa', icon: <RefreshCw />, color: 'text-blue-600 bg-blue-50' },
  ];

  const handleApprove = (id) => {
    setReturns(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
    toast.success('İade talebi onaylandı.');
    setSelectedReturn(null);
  };

  const handleReject = (id) => {
    setReturns(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
    toast.info('İade talebi reddedildi.');
    setSelectedReturn(null);
  };

  const filtered = returns.filter(r => {
    if (activeFilter !== 'All' && r.status !== activeFilter) return false;
    return r.customer.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.includes(searchTerm);
  });

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Cinematic Header */}
      <div className="relative h-64 bg-stone-900 overflow-hidden flex items-center px-8 rounded-2xl mb-8">
        <div className="absolute inset-0 opacity-40">
           <img src="https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?auto=format&fit=crop&w=1500&q=80" className="w-full h-full object-cover grayscale" alt="Interior" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900 to-transparent"></div>
        
        <div className="relative z-10 max-w-6xl w-full mx-auto">
          <div className="flex items-center gap-4 mb-4">
             <div className="h-1 w-12 bg-amber-500 rounded-full"></div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Merchant Dashboard</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-2 italic">İade Talepleri</h1>
          <p className="text-stone-400 font-medium max-w-md">Satış sonrası destek sürecini yönetin ve müşteri memnuniyetini en üst düzeye çıkarın.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 mb-24">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           {stats.map((stat, i) => (
             <div key={i} className="bg-white dark:bg-stone-900 p-6 rounded-[2rem] border border-stone-100 dark:border-stone-800 shadow-xl shadow-stone-200/20 flex items-center justify-between group hover:scale-[1.02] transition-transform cursor-pointer">
                <div>
                   <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">{stat.label}</p>
                   <p className="text-3xl font-black">{stat.value}</p>
                </div>
                <div className={`p-4 rounded-2xl ${stat.color} group-hover:rotate-12 transition-transform`}>
                   {React.cloneElement(stat.icon, { size: 24 })}
                </div>
             </div>
           ))}
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-6 mb-10">
           <div className="relative flex-1 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-amber-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Talep no veya müşteri ara..." 
                className="w-full pl-14 pr-6 py-5 bg-stone-50 dark:bg-stone-900/50 border border-stone-100 dark:border-stone-800 rounded-[1.5rem] focus:bg-white dark:focus:bg-stone-900 focus:ring-4 focus:ring-amber-500/10 transition-all font-bold text-sm outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex items-center gap-2 p-1.5 bg-stone-50 dark:bg-stone-900 rounded-[1.5rem] border border-stone-100 dark:border-stone-800">
              {['All', 'Pending', 'Approved', 'Rejected'].map(filter => (
                <button 
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
                    ${activeFilter === filter ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/30' : 'text-stone-400 hover:text-stone-900 dark:hover:text-white'}`}
                >
                  {filter === 'All' ? 'Tümü' : filter === 'Pending' ? 'Bekleyen' : filter === 'Approved' ? 'Onaylı' : 'Reddedilen'}
                </button>
              ))}
           </div>
        </div>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {filtered.length === 0 ? (
             <div className="lg:col-span-2 py-32 text-center bg-stone-50 dark:bg-stone-900 rounded-[3rem] border border-dashed border-stone-200 dark:border-stone-800">
                <Inbox size={48} className="mx-auto mb-4 text-stone-300" />
                <h3 className="text-xl font-bold">Kayıt Bulunamadı</h3>
             </div>
           ) : (
             filtered.map(req => (
               <div 
                 key={req.id} 
                 onClick={() => setSelectedReturn(req)}
                 className="group relative bg-white dark:bg-stone-900 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden p-8"
               >
                 <div className="absolute top-0 right-0 p-8">
                    <ChevronRight className="text-stone-300 group-hover:translate-x-2 group-hover:text-amber-500 transition-all" />
                 </div>
                 
                 <div className="flex gap-6 mb-8">
                    <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden shadow-lg border border-stone-100 dark:border-stone-800 shrink-0">
                       <img src={req.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Product" />
                    </div>
                    <div className="flex flex-col justify-center">
                       <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${
                             req.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 
                             req.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                          }`}>
                             {req.status === 'Pending' ? 'Bekliyor' : req.status === 'Approved' ? 'Onaylandı' : 'Reddedildi'}
                          </span>
                          <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{req.id}</span>
                       </div>
                       <h3 className="text-lg font-black tracking-tight dark:text-white uppercase">{req.product}</h3>
                       <p className="text-stone-500 font-bold text-sm mt-1">{req.customer}</p>
                    </div>
                 </div>

                 <div className="flex items-center justify-between pt-6 border-t border-stone-50 dark:border-stone-800">
                    <div className="flex items-center gap-4">
                       <div className="flex -space-x-2">
                          {[1,2,3].map(i => (
                             <div key={i} className="w-6 h-6 rounded-full bg-stone-100 dark:bg-stone-800 border-2 border-white dark:border-stone-900 flex items-center justify-center text-[8px] font-black text-stone-400">
                                {i === 3 ? '+' : ''}
                             </div>
                          ))}
                       </div>
                       <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">İncele</span>
                    </div>
                    <div className="text-right">
                       <p className="text-xl font-black text-stone-900 dark:text-white">{req.price.toLocaleString('tr-TR')} ₺</p>
                       <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mt-0.5">{req.date}</p>
                    </div>
                 </div>

                 {req.status === 'Pending' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500/20 overflow-hidden">
                       <div className="h-full bg-amber-500 animate-pulse w-full"></div>
                    </div>
                 )}
               </div>
             ))
           )}
        </div>
      </div>

      {/* Detail Modal / Drawer */}
      {selectedReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in duration-500">
           <div 
             className="bg-white dark:bg-stone-900 w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col md:flex-row max-h-[90vh]"
             onClick={(e) => e.stopPropagation()}
           >
              {/* Left Side: Images & Reason */}
              <div className="w-full md:w-1/2 p-10 bg-stone-50 dark:bg-stone-800/50 flex flex-col">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black italic">Talep Detayı</h3>
                    <button onClick={() => setSelectedReturn(null)} className="p-3 bg-white dark:bg-stone-900 rounded-2xl shadow-sm hover:scale-95 transition-transform"><XCircle size={20} /></button>
                 </div>

                 <div className="flex-1 space-y-8">
                    <div>
                       <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <ImageIcon size={14} /> Ürün Kanıt Görselleri ({selectedReturn.evidence.length})
                       </p>
                       <div className="grid grid-cols-2 gap-4">
                          {selectedReturn.evidence.length > 0 ? selectedReturn.evidence.map((img, i) => (
                             <img key={i} src={img} className="w-full h-32 object-cover rounded-3xl shadow-lg border border-white dark:border-stone-800" alt="Evidence" />
                          )) : (
                             <div className="col-span-2 py-10 bg-stone-200/50 dark:bg-stone-900/50 rounded-3xl border border-dashed border-stone-300 dark:border-stone-700 flex flex-col items-center justify-center text-stone-400">
                                <Camera size={24} className="mb-2 opacity-50" />
                                <p className="text-[10px] font-black uppercase">Görsel Yüklenmedi</p>
                             </div>
                          )}
                       </div>
                    </div>

                    <div className="p-6 bg-white dark:bg-stone-900 rounded-[2rem] shadow-sm">
                       <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <AlertTriangle size={14} /> İade Sebebi
                       </p>
                       <p className="font-black text-lg mb-2 text-red-500 uppercase tracking-tight">{selectedReturn.reason}</p>
                       <p className="text-sm text-stone-500 font-medium leading-relaxed italic">"{selectedReturn.description}"</p>
                    </div>
                 </div>
              </div>

              {/* Right Side: Process & Actions */}
              <div className="w-full md:w-1/2 p-10 flex flex-col">
                 <div className="flex-1 space-y-10">
                    <div className="flex items-center gap-6">
                       <div className="w-20 h-20 rounded-[1.5rem] shadow-xl overflow-hidden border border-stone-100 dark:border-stone-800">
                          <img src={selectedReturn.image} className="w-full h-full object-cover" alt="Product" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Sipariş: {selectedReturn.orderId}</p>
                          <h4 className="text-2xl font-black tracking-tight uppercase">{selectedReturn.product}</h4>
                          <p className="text-amber-600 font-black text-xl mt-1">{selectedReturn.price.toLocaleString('tr-TR')} ₺</p>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <h3 className="text-sm font-black uppercase tracking-widest">Müşteri Bilgileri</h3>
                       <div className="grid grid-cols-2 gap-6">
                          <div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl">
                             <p className="text-[10px] font-black text-stone-400 uppercase mb-1">Ad Soyad</p>
                             <p className="font-bold text-sm">{selectedReturn.customer}</p>
                          </div>
                          <div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl">
                             <p className="text-[10px] font-black text-stone-400 uppercase mb-1">Talep Tarihi</p>
                             <p className="font-bold text-sm">{selectedReturn.date}</p>
                          </div>
                       </div>
                    </div>

                    {selectedReturn.status === 'Pending' && (
                       <div className="p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/50 rounded-[2rem] flex items-center gap-4">
                          <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                             <Clock size={24} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Yanıt Süresi</p>
                             <p className="text-sm font-black italic">{selectedReturn.deadline}</p>
                          </div>
                       </div>
                    )}

                    {selectedReturn.rejectReason && (
                       <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/50 rounded-[2rem] flex items-center gap-4">
                          <div className="w-12 h-12 bg-red-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-red-500/20">
                             <XCircle size={24} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Red Nedeni</p>
                             <p className="text-sm font-black italic">{selectedReturn.rejectReason}</p>
                          </div>
                       </div>
                    )}
                 </div>

                 {selectedReturn.status === 'Pending' && (
                    <div className="flex gap-4 pt-10">
                       <button 
                         onClick={() => handleReject(selectedReturn.id)}
                         className="flex-1 py-5 border border-red-100 dark:border-red-800 text-red-500 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-95"
                       >
                          Reddet
                       </button>
                       <button 
                         onClick={() => handleApprove(selectedReturn.id)}
                         className="flex-[2] py-5 bg-amber-600 hover:bg-amber-700 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-500/30 transition-all active:scale-95 flex items-center justify-center gap-3"
                       >
                          <CheckCircle size={18} /> Talebi Onayla
                       </button>
                    </div>
                 )}
                 
                 {selectedReturn.status !== 'Pending' && (
                    <div className="pt-10 flex gap-4">
                       <button className="flex-1 py-5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3">
                          <Package size={18} /> İadeyi Takip Et
                       </button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default ReturnRequests;
