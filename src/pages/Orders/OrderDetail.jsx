import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orders, getStatusColor } from '../../data/orders';
import { generateInvoicePDF } from '../../utils/generateInvoice';

const OrderDetail = () => {
  const { id } = useParams();
  const order = orders.find(o => o.id === id);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadInvoice = async () => {
    setIsGenerating(true);
    try {
      await generateInvoicePDF(order);
    } catch (error) {
      console.error('Fatura oluşturulurken hata:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Sipariş bulunamadı</h2>
          <Link to="/siparislerim" className="text-primary-600 hover:underline">Siparişlerime dön</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Link */}
        <Link 
          to="/siparislerim" 
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-8 transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Siparişlerime Dön
        </Link>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Sipariş Detayı</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Sipariş No: <span className="font-mono font-bold text-gray-900 dark:text-white">{order.id}</span> • {new Date(order.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleDownloadInvoice}
              disabled={isGenerating}
              className="px-5 py-2.5 text-sm font-semibold text-gray-900 bg-white dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-750 transition-all shadow-sm disabled:opacity-50"
            >
              {isGenerating ? 'Hazırlanıyor...' : 'Fatura İndir'}
            </button>
            <button className="px-5 py-2.5 text-sm font-semibold text-gray-900 bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-md active:scale-95">
              Tekrar Sipariş Ver
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Status Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-8">Sipariş Durumu</h2>
              <div className="relative">
                <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-100 dark:bg-gray-700" />
                <div className="relative flex justify-between">
                  {order.timeline.map((step, index) => (
                    <div key={index} className="flex flex-col items-center relative z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors ${
                        step.completed 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                      }`}>
                        {step.completed ? (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-sm font-bold">{index + 1}</span>
                        )}
                      </div>
                      <span className={`text-xs font-bold text-center max-w-[80px] ${
                        step.completed ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {step.status}
                      </span>
                      {step.date && (
                        <span className="text-[10px] text-gray-500 mt-1">
                          {new Date(step.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Product List */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="p-6 border-b border-gray-50 dark:border-gray-700/50">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Ürünler ({order.items.length})</h2>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {order.items.map((item) => (
                  <div key={item.id} className="p-6 flex items-center gap-6">
                    <div className="w-24 h-24 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{item.name}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                        {item.color && (
                          <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-gray-200" /> {item.color}
                          </span>
                        )}
                        {item.size && (
                          <span>Beden: {item.size}</span>
                        )}
                        <span>Adet: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white text-lg">
                        {(item.price * item.quantity).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                      </p>
                      <p className="text-sm text-gray-500">Birim: {item.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-8 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
                <div className="flex flex-col items-end gap-3">
                  <div className="flex justify-between w-64 text-gray-500 dark:text-gray-400">
                    <span>Ara Toplam</span>
                    <span>{(order.total * 0.8).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                  </div>
                  <div className="flex justify-between w-64 text-gray-500 dark:text-gray-400">
                    <span>KDV (%20)</span>
                    <span>{(order.total * 0.2).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                  </div>
                  <div className="flex justify-between w-64 text-gray-500 dark:text-gray-400">
                    <span>Kargo</span>
                    <span className="text-green-600 font-medium">Ücretsiz</span>
                  </div>
                  <div className="flex justify-between w-64 pt-3 border-t border-gray-200 dark:border-gray-600 text-xl font-extrabold text-gray-900 dark:text-white">
                    <span>Toplam</span>
                    <span>{order.total.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Delivery & Tracking */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Teslimat Bilgileri</h2>
              {order.trackingNumber && (
                <div className="mb-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800/30">
                  <p className="text-xs font-bold text-primary-700 dark:text-primary-300 uppercase tracking-wider mb-2">Kargo Takip</p>
                  <p className="font-bold text-gray-900 dark:text-white mb-1">{order.carrier}</p>
                  <p className="text-sm font-mono text-primary-600 dark:text-primary-400 mb-3">{order.trackingNumber}</p>
                  <button className="w-full py-2 bg-primary-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-primary-700 transition-colors">
                    Kargom Nerede?
                  </button>
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Teslimat Adresi</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    {order.deliveryAddress}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Ödeme Yöntemi</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    {order.paymentMethod}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm text-center">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Yardıma mı ihtiyacınız var?</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 px-4">
                Siparişinizle ilgili bir sorun mu yaşıyorsunuz? Bize ulaşın veya talebinizi iletin.
              </p>
              <div className="space-y-3">
                {order.status === 'Teslim Edildi' ? (
                  <Link 
                    to="/destek" 
                    state={{ orderId: order.id, subject: 'İade Talebi' }}
                    className="block w-full py-3 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors text-center"
                  >
                    Kolay İade Talebi
                  </Link>
                ) : (order.status !== 'İptal Edildi' && (
                  <Link 
                    to="/destek"
                    state={{ orderId: order.id, subject: 'Sipariş İptali' }}
                    className="block w-full py-3 bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors text-center"
                  >
                    Siparişi İptal Et
                  </Link>
                ))}
                <Link 
                  to="/destek"
                  state={{ orderId: order.id }}
                  className="block w-full py-3 bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors text-center"
                >
                  Destek Ekibine Bağlan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;