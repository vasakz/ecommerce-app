import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ShoppingBag, 
  Star, 
  Eye, 
  Users, 
  PieChart, 
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Activity
} from 'lucide-react';

// Recharts for charting (assuming it's either requested or I fake it with basic CSS if not installed. Since I don't know if Recharts is installed, I will draw an aesthetic CSS-based visual or simple Recharts placeholders with clear fallback).
// Actually, I'll use simple CSS-based bar/line representations to ensure it works without extra dependencies unless specified.

const StatisticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('Haftalık');

  const stats = {
    dailySales: 12500,
    weeklySales: 84000,
    monthlySales: 320000,
    totalOrders: 1450,
    avgRating: 4.8,
    storeViews: 45000,
    conversionRate: 3.2
  };

  const topProducts = [
    { id: 1, name: 'Klasik Deri Ceket', sales: 120, revenue: 119880, img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=150' },
    { id: 2, name: 'Kablosuz Kulaklık G7', sales: 95, revenue: 80750, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=150' },
    { id: 3, name: 'Minimalist Kol Saati', sales: 64, revenue: 25536, img: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=150' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-white flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-indigo-600" />
              İstatistikler & Dashboard
            </h1>
            <p className="text-stone-500 dark:text-stone-400 mt-1">Mağazanızın performansını analiz edin.</p>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-stone-900 p-1.5 rounded-xl border border-gray-200 dark:border-stone-800">
            {['Günlük', 'Haftalık', 'Aylık'].map(range => (
              <button 
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${timeRange === range ? 'bg-stone-900 dark:bg-white text-white dark:text-black shadow-md' : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'}`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: `${timeRange} Satış`, value: `₺ ${timeRange === 'Günlük' ? stats.dailySales : timeRange === 'Haftalık' ? stats.weeklySales : stats.monthlySales}`, icon: <TrendingUp className="text-indigo-500" />, trend: '+12.5%', isUp: true },
            { title: 'Toplam Sipariş', value: stats.totalOrders, icon: <ShoppingBag className="text-emerald-500" />, trend: '+5.2%', isUp: true },
            { title: 'Mağaza Görüntülenme', value: stats.storeViews.toLocaleString('tr-TR'), icon: <Eye className="text-blue-500" />, trend: '+18.1%', isUp: true },
            { title: 'Dönüşüm Oranı', value: `%${stats.conversionRate}`, icon: <PieChart className="text-purple-500" />, trend: '-1.4%', isUp: false },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-gray-100 dark:border-stone-800 shadow-xl relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-gray-50 dark:bg-stone-800/50 rounded-full blur-2xl group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-all"></div>
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 bg-gray-50 dark:bg-stone-800 rounded-xl">
                  {React.cloneElement(stat.icon, { className: 'w-6 h-6' })}
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${stat.isUp ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-red-50 text-red-600 dark:bg-red-900/20'}`}>
                  {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
                </div>
              </div>
              <h3 className="text-stone-500 dark:text-stone-400 text-sm font-medium relative z-10">{stat.title}</h3>
              <p className="text-2xl font-black text-stone-900 dark:text-white mt-1 relative z-10">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts & Advanced Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Chart (CSS Mockup for now) */}
          <div className="lg:col-span-2 bg-white dark:bg-stone-900 rounded-3xl border border-gray-100 dark:border-stone-800 p-6 shadow-xl">
            <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              Satış Grafiği ({timeRange})
            </h3>
            <div className="h-64 flex items-end gap-2 sm:gap-4 relative w-full pt-8">
              {/* Grid lines */}
              <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between pointer-events-none pb-6">
                {[4,3,2,1,0].map(n => (
                  <div key={n} className="w-full border-b border-gray-100 dark:border-stone-800/50 flex-[1] relative">
                    <span className="absolute -left-2 -top-2 text-[10px] text-stone-400 -translate-x-full pr-2">
                      {n * 25}k
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Bars */}
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group z-10 relative">
                  <div className="w-full relative h-[200px] flex items-end justify-center">
                    <div 
                      className="w-full max-w-[48px] bg-indigo-500 rounded-t-lg transition-all group-hover:bg-indigo-400 relative"
                      style={{ height: `${h}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-900 dark:bg-white text-white dark:text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        ₺{h * 1253}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-stone-500 font-medium">{['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'][i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Satisfaction & Average Rating */}
          <div className="flex flex-col gap-8">
            {/* Avg Rating */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl border border-gray-100 dark:border-stone-800 p-6 shadow-xl flex-1 flex flex-col justify-center items-center text-center">
              <div className="mb-4 relative">
                <Star className="w-16 h-16 text-amber-400 fill-amber-400/20" />
                <div className="absolute -inset-4 bg-amber-400/10 blur-xl rounded-full"></div>
              </div>
              <p className="text-4xl font-black text-stone-900 dark:text-white mb-2">{stats.avgRating} <span className="text-2xl text-stone-400">/ 5</span></p>
              <h3 className="font-bold text-stone-600 dark:text-stone-300">Ortalama Ürün Puanı</h3>
              <p className="text-xs text-stone-400 mt-2">+420 Değerlendirme</p>
            </div>

            {/* Satisfaction Chart */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl border border-gray-100 dark:border-stone-800 p-6 shadow-xl flex-1">
              <h3 className="font-bold text-stone-900 dark:text-white mb-4">Müşteri Memnuniyeti</h3>
              <div className="space-y-4">
                {[
                  { label: 'Çok Memnun', percent: 75, color: 'bg-emerald-500' },
                  { label: 'Memnun', percent: 15, color: 'bg-blue-500' },
                  { label: 'Tarafsız', percent: 7, color: 'bg-amber-500' },
                  { label: 'Memnun Değil', percent: 3, color: 'bg-red-500' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-stone-600 dark:text-stone-300">{item.label}</span>
                      <span className="text-stone-900 dark:text-white">%{item.percent}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percent}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-gray-100 dark:border-stone-800 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-500" />
              En Çok Satan Ürünler
            </h3>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-700">Tümünü Gör</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-stone-800 text-stone-400 text-xs font-bold uppercase tracking-widest">
                  <th className="pb-4">Ürün</th>
                  <th className="pb-4 text-center">Satış Adedi</th>
                  <th className="pb-4 text-right">Elde Edilen Gelir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-stone-800">
                {topProducts.map((product, i) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-stone-800/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-stone-400 w-4">{i + 1}.</span>
                        <img src={product.img} alt={product.name} className="w-12 h-12 rounded-xl object-cover bg-gray-100" />
                        <span className="font-bold text-stone-900 dark:text-white text-sm">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <span className="inline-flex items-center justify-center bg-gray-100 dark:bg-stone-800 text-stone-900 dark:text-white px-3 py-1 rounded-lg text-sm font-bold">
                        {product.sales}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <span className="font-black text-stone-900 dark:text-white">
                        ₺{product.revenue.toLocaleString('tr-TR')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StatisticsDashboard;
