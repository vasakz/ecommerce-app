import React, { useState } from 'react';
import { 
  Truck, 
  Settings, 
  BarChart3, 
  DollarSign, 
  Clock, 
  Globe, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight,
  Plus
} from 'lucide-react';

const ShippingManagement = () => {
  const [activeTab, setActiveTab] = useState('agreements');

  const carriers = [
    { id: 'yurtici', name: 'Yurtiçi Kargo', status: 'Active', performance: '98%', agreementDate: '2024-01-10', baseRate: '45.00' },
    { id: 'aras', name: 'Aras Kargo', status: 'Active', performance: '94%', agreementDate: '2024-02-15', baseRate: '42.50' },
    { id: 'mng', name: 'MNG Kargo', status: 'Paused', performance: '88%', agreementDate: '2024-03-01', baseRate: '40.00' },
  ];

  const regions = [
    { name: 'Marmara', deliveryTime: '24-48 Saat', performance: 'High' },
    { name: 'İç Anadolu', deliveryTime: '48-72 Saat', performance: 'Medium' },
    { name: 'Doğu Anadolu', deliveryTime: '72-120 Saat', performance: 'Medium' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 p-6 lg:p-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-stone-900 dark:text-white tracking-tight mb-2">Kargo Yönetimi</h1>
            <p className="text-stone-500 font-medium">Lojistik performansınızı ve anlaşmalarınızı yönetin.</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all">
            <Plus size={20} />
            Yeni Anlaşma Ekle
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Aktif Kargolar', value: '1,240', icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            { label: 'Ort. Teslimat Süresi', value: '1.8 Gün', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
            { label: 'Lojistik Maliyeti', value: '₺54,200', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
            { label: 'Müşteri Memnuniyeti', value: '%96', icon: CheckCircle2, color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/20' },
          ].map((stat, i) => (
            <div key={i} className="p-6 bg-white dark:bg-stone-900 rounded-[2rem] border border-stone-100 dark:border-stone-800 shadow-sm">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                <stat.icon size={24} />
              </div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-stone-900 dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 bg-stone-100 dark:bg-stone-900 p-2 rounded-2xl w-fit">
          {[
            { id: 'agreements', label: 'Anlaşmalar & Fiyatlar', icon: Settings },
            { id: 'reports', label: 'Performans Raporları', icon: BarChart3 },
            { id: 'regions', label: 'Bölge Yönetimi', icon: Globe },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm' 
                  : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 shadow-sm overflow-hidden">
          {activeTab === 'agreements' && (
            <div className="divide-y divide-stone-50 dark:divide-stone-800/50">
              <div className="p-8 grid grid-cols-4 text-xs font-black text-stone-400 uppercase tracking-widest">
                <span className="col-span-1">Kargo Firması</span>
                <span>Durum</span>
                <span>Anlaşma Fiyatı</span>
                <span className="text-right">İşlemler</span>
              </div>
              {carriers.map(carrier => (
                <div key={carrier.id} className="p-8 grid grid-cols-4 items-center group hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-stone-100 dark:bg-stone-800 rounded-2xl flex items-center justify-center font-bold text-lg">
                      {carrier.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-stone-900 dark:text-white">{carrier.name}</p>
                      <p className="text-xs text-stone-400 font-medium">{carrier.agreementDate}</p>
                    </div>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      carrier.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {carrier.status}
                    </span>
                  </div>
                  <div>
                    <p className="font-black text-stone-900 dark:text-white">₺{carrier.baseRate}</p>
                  </div>
                  <div className="flex justify-end">
                    <button className="p-3 bg-stone-100 dark:bg-stone-800 rounded-xl hover:bg-stone-900 hover:text-white dark:hover:bg-white dark:hover:text-stone-900 transition-all">
                      Detaylar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="p-10 space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">Firma Performans Karşılaştırması</h3>
                  {carriers.map(carrier => (
                    <div key={carrier.id} className="space-y-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span>{carrier.name}</span>
                        <span>{carrier.performance}</span>
                      </div>
                      <div className="h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            parseInt(carrier.performance) > 90 ? 'bg-green-500' : 'bg-amber-500'
                          }`}
                          style={{ width: carrier.performance }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-stone-50 dark:bg-stone-800/30 p-8 rounded-3xl flex flex-col justify-center">
                  <AlertCircle size={40} className="text-amber-500 mb-4" />
                  <h3 className="text-lg font-bold mb-2">Lojistik Optimizasyon Uyarısı</h3>
                  <p className="text-sm text-stone-500 leading-relaxed mb-6">
                    MNG Kargo performans verileri son 2 haftada Marmara bölgesinde %15 düşüş gösterdi. 
                    Anlaşma şartlarını incelemeniz önerilir.
                  </p>
                  <button className="w-fit px-6 py-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl text-xs font-bold">
                    Raporu İncele
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'regions' && (
            <div className="p-8 space-y-4">
              {regions.map((region, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-stone-50 dark:bg-stone-800/50 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <Globe className="text-stone-400" />
                    <div>
                      <p className="font-bold">{region.name} Bölgesi</p>
                      <p className="text-xs text-stone-500">Ortalama Teslimat Süresi: {region.deliveryTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-black tracking-widest uppercase ${
                      region.performance === 'High' ? 'text-green-600' : 'text-amber-600'
                    }`}>
                      {region.performance} Performance
                    </span>
                    <button className="p-2 bg-white dark:bg-stone-800 rounded-lg hover:scale-110 transition-transform">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShippingManagement;
