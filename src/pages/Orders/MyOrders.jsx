import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { orders, getStatusColor } from '../../data/orders';
import { generateInvoicePDF } from '../../utils/generateInvoice';
import { RotateCcw } from 'lucide-react';

const MyOrders = () => {
  const [activeTab, setActiveTab] = useState('Hepsi');

  const tabs = ['Hepsi', 'Aktif', 'Tamamlanan', 'İadeler', 'İptal Edilen'];

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'Hepsi') return true;
    if (activeTab === 'Aktif') return ['Hazırlanıyor', 'Kargoya Verildi', 'Kargoda', 'Dağıtımda', 'Onay Bekliyor', 'Ödeme Bekleniyor'].includes(order.status);
    if (activeTab === 'Tamamlanan') return order.status === 'Teslim Edildi';
    if (activeTab === 'İadeler') return order.status === 'İade Sürecinde';
    if (activeTab === 'İptal Edilen') return order.status === 'İptal Edildi';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
           <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Siparişlerim</h1>
           <Link to="/iadelerim" className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-sm bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-xl border border-primary-100 dark:border-primary-800/50 hover:bg-primary-100 transition-all">
              <RotateCcw size={16} /> İade Taleplerimi Gör
           </Link>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200 dark:border-gray-800">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-4 text-sm font-medium transition-colors relative ${
                activeTab === tab
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 dark:bg-primary-400" />
              )}
            </button>
          ))}
        </div>

        {/* Order List */}
        <div className="space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Sipariş Numarası</p>
                      <p className="font-mono font-bold text-gray-900 dark:text-white">{order.id}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Sipariş Tarihi</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {new Date(order.date).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Tutar</p>
                      <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                        {order.total.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                      </p>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                    {order.items.map(item => (
                      <div key={item.id} className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {order.items.length > 5 && (
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm font-medium">
                        +{order.items.length - 5}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-700/50">
                    <Link
                      to={`/siparislerim/${order.id}`}
                      className="text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                    >
                      Sipariş Detaylarını Gör →
                    </Link>
                    <div className="flex gap-3">
                      {(order.status === 'Hazırlanıyor' || order.status === 'Onay Bekliyor' || order.status === 'Ödeme Bekleniyor') && (
                         <Link to={`/siparislerim/${order.id}/islem`} className="px-4 py-2 text-sm font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 dark:text-amber-200 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800 rounded-lg transition-colors">
                            Siparişi İptal Et
                         </Link>
                      )}
                      {(order.status === 'İade Sürecinde') && (
                         <Link to={`/siparislerim/${order.id}`} className="px-4 py-2 text-sm font-black text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:text-indigo-200 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800 rounded-lg transition-all animate-pulse">
                            İadeyi Takip Et
                         </Link>
                      )}
                      {(order.status === 'Teslim Edildi') && (
                         <Link to={`/siparislerim/${order.id}/islem`} className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 dark:text-blue-200 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors">
                            İade Talebi
                         </Link>
                      )}
                      <button 
                        onClick={() => generateInvoicePDF(order)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        Fatura
                      </button>
                      <button className="px-4 py-2 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-sm transition-colors">
                        Tekrar Sipariş Ver
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sipariş bulunamadı</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Bu kategoride henüz bir siparişiniz bulunmuyor.</p>
              <Link to="/urunler" className="inline-block mt-6 text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                Alışverişe Başla
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
