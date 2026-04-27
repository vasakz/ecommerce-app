import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  RotateCcw, 
  ChevronRight, 
  Package, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search,
  ArrowRight,
  Info
} from 'lucide-react';
import { orders, getStatusColor } from '../../data/orders';

const MyReturns = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter orders that have return details or are in "İade Sürecinde" status
  const returnOrders = orders.filter(order => 
    order.status === 'İade Sürecinde' || order.returnDetails
  );

  const filteredReturns = returnOrders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white dark:bg-stone-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-stone-900 dark:text-white tracking-tight flex items-center gap-3">
              <RotateCcw className="text-amber-600 w-10 h-10" />
              İadelerim
            </h1>
            <p className="text-stone-500 dark:text-stone-400 mt-2 font-medium">İade süreçlerinizi buradan takip edebilirsiniz.</p>
          </div>
          <div className="relative group min-w-[280px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-amber-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Sipariş veya ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl focus:ring-2 focus:ring-amber-500/20 font-bold text-sm outline-none transition-all"
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 p-6 rounded-3xl mb-10 flex gap-4">
           <div className="w-10 h-10 bg-amber-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-amber-500/20">
              <Info size={20} />
           </div>
           <div className="flex-1">
              <p className="font-black text-amber-900 dark:text-amber-300 text-sm uppercase tracking-wide mb-1">İade Politikamız</p>
              <p className="text-xs text-amber-800/80 dark:text-amber-400 font-medium leading-relaxed">
                Teslim aldığınız ürünleri 14 gün içerisinde ücretsiz iade edebilirsiniz. İadeniz onaylandıktan sonra geri ödemeniz 1-3 iş günü içinde kartınıza yansır.
              </p>
           </div>
        </div>

        {/* Returns List */}
        <div className="space-y-6">
          {filteredReturns.length === 0 ? (
            <div className="text-center py-24 bg-stone-50 dark:bg-stone-900/50 rounded-[2.5rem] border border-dashed border-stone-200 dark:border-stone-800">
               <div className="w-20 h-20 bg-white dark:bg-stone-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <RotateCcw className="text-stone-300 w-10 h-10" />
               </div>
               <h3 className="text-xl font-bold text-stone-900 dark:text-white">Henüz iade talebiniz yok</h3>
               <p className="text-stone-500 dark:text-stone-400 mt-2">İşlemde olan veya tamamlanmış bir iade bulunamadı.</p>
               <Link to="/siparislerim" className="inline-flex items-center gap-2 mt-8 text-amber-600 font-black text-xs uppercase tracking-widest hover:underline">
                  Tüm Siparişlerim <ArrowRight size={14} />
               </Link>
            </div>
          ) : (
            filteredReturns.map(order => (
              <Link 
                key={order.id} 
                to={`/siparislerim/${order.id}`}
                className="group block bg-white dark:bg-stone-900 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300 overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-2xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
                           <Package size={22} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Sipariş No: #{order.id}</p>
                           <h3 className="text-lg font-black text-stone-900 dark:text-white group-hover:text-amber-600 transition-colors uppercase tracking-tight">
                              {order.items[0].name} {order.items.length > 1 && `ve ${order.items.length - 1} ürün daha`}
                           </h3>
                        </div>
                     </div>
                     <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${getStatusColor(order.status)}`}>
                        {order.status}
                     </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-stone-50 dark:bg-stone-800/40 p-6 rounded-3xl border border-stone-100 dark:border-stone-800">
                     <div className="flex items-center gap-3">
                        <Clock size={16} className="text-stone-400" />
                        <div>
                           <p className="text-[10px] font-black text-stone-400 uppercase">Talep Tarihi</p>
                           <p className="text-sm font-bold">{order.returnDetails?.steps[0]?.date || order.date}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        <div>
                           <p className="text-[10px] font-black text-stone-400 uppercase">Süreç Durumu</p>
                           <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                              {order.returnDetails?.steps.find(s => s.status === 'current')?.title || 'İade Alındı'}
                           </p>
                        </div>
                     </div>
                     <div className="flex items-center justify-end font-black text-stone-900 dark:text-white text-xl">
                        {order.total.toLocaleString('tr-TR')} ₺
                        <ChevronRight className="ml-3 text-stone-300 group-hover:translate-x-1 transition-transform" />
                     </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Help Center Shortcut */}
        <div className="mt-20 p-8 bg-stone-900 dark:bg-white rounded-[2.5rem] text-white dark:text-stone-900 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
           <div>
              <h3 className="text-xl font-bold mb-1">Sorunuz mu var?</h3>
              <p className="text-stone-400 dark:text-stone-500 text-sm font-medium">İade sürecinizle ilgili destek almak için müşteri hizmetlerimize bağlanın.</p>
           </div>
           <Link to="/destek" className="px-8 py-4 bg-amber-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-700 shadow-xl shadow-amber-500/20 active:scale-95 transition-all">
              Müşteri Hizmetleri
           </Link>
        </div>

      </div>
    </div>
  );
};

export default MyReturns;
