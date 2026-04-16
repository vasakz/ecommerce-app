import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orders, getStatusColor } from '../../data/orders';
import { generateInvoicePDF } from '../../utils/generateInvoice';
import { Package, Truck, Clock, MapPin, Info, ArrowRight, ExternalLink, RefreshCw, X, Edit3, RotateCcw } from 'lucide-react';

const TrackingModal = ({ isOpen, onClose, order }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Truck className="text-primary-600" />
            Kargo Takip Detayları
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="mb-6 flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl">
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase">Kargo Firması</p>
              <p className="font-bold">{order.carrier}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-stone-400 uppercase">Takip No</p>
              <p className="font-mono font-bold text-primary-600">{order.trackingNumber}</p>
            </div>
          </div>

          <div className="relative space-y-8 before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-stone-100 dark:before:bg-stone-800">
            {order.deliveryDetails.history.map((h, i) => (
              <div key={i} className="relative pl-10">
                <div className={`absolute left-0 top-1 w-9 h-9 rounded-full border-4 border-white dark:border-stone-900 flex items-center justify-center z-10 ${
                  i === 0 ? 'bg-primary-600' : 'bg-stone-200 dark:bg-stone-700'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-white' : 'bg-stone-400'}`} />
                </div>
                <div>
                  <p className={`font-bold ${i === 0 ? 'text-primary-600' : 'text-stone-900 dark:text-white'}`}>
                    {h.status}
                  </p>
                  <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">{h.detail}</p>
                  <p className="text-xs text-stone-400 mt-1 uppercase">
                    {new Date(h.date).toLocaleString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {order.deliveryDetails.history.length === 0 && (
              <div className="text-center py-8 text-stone-400 italic">
                Henüz kargo hareketi bulunmamaktadır.
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-stone-50 dark:bg-stone-800/30 border-t border-stone-100 dark:border-stone-800">
          <button onClick={onClose} className="w-full py-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl font-bold hover:opacity-90 transition-opacity">
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

const AddressModal = ({ isOpen, onClose, currentAddress, onSave }) => {
  const [address, setAddress] = useState(currentAddress);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <MapPin className="text-primary-600" />
            Teslimat Adresini Güncelle
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-100 dark:border-amber-900/40 flex gap-3 text-xs text-amber-800 dark:text-amber-400">
             <Info size={18} className="shrink-0" />
             <p>Kargonuz henüz yola çıkmadıysa adres değişikliği anında uygulanacaktır. Yoldaki kargolar için şube değişikliği gerekebilir.</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Yeni Adres</label>
              <textarea 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
                className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
                placeholder="Mahalle, Cadde, Sokak, Bina No, Daire..."
              />
            </div>
          </div>
        </div>

        <div className="p-6 flex gap-3 bg-stone-50 dark:bg-stone-800/30 border-t border-stone-100 dark:border-stone-800">
          <button onClick={onClose} className="flex-1 py-3 border border-stone-200 dark:border-stone-700 text-stone-600 rounded-xl font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
            Vazgeç
          </button>
          <button 
            onClick={() => onSave(address)} 
            className="flex-1 py-3 bg-stone-900 dark:bg-stone-100 dark:text-stone-900 text-white rounded-xl font-bold shadow-lg hover:bg-black dark:hover:bg-white transition-all"
          >
            Adresi Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

const OrderDetail = () => {
  const { id } = useParams();
  const orderData = orders.find(o => o.id === id);
  const [order, setOrder] = useState(orderData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);

  const handleUpdateAddress = (newAddress) => {
    setOrder(prev => ({ ...prev, deliveryAddress: newAddress }));
    setAddressOpen(false);
    // In a real app, you would make an API call here
    alert('Adresiniz başarıyla güncellenmiştir.');
  };

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
    <div className="min-h-screen bg-white dark:bg-stone-950 transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Link */}
        <Link 
          to="/siparislerim" 
          className="inline-flex items-center text-sm font-medium text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 mb-8 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
            <X size={16} />
          </div>
          Siparişlerime Dön
        </Link>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              <span className="text-xs text-stone-400 font-medium">#{order.id}</span>
            </div>
            <h1 className="text-4xl font-black text-stone-900 dark:text-white tracking-tight">Sipariş Detayı</h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleDownloadInvoice}
              disabled={isGenerating}
              className="px-6 py-3 text-sm font-bold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-900 rounded-2xl hover:bg-stone-200 dark:hover:bg-stone-800 transition-all disabled:opacity-50"
            >
              Fatura İndir
            </button>
            <button className="px-6 py-3 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-2xl transition-all shadow-lg active:scale-95">
              Tekrar Sipariş Ver
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Delivery Info Section (New) */}
            <div className="bg-stone-50 dark:bg-stone-900 rounded-[2.5rem] p-8 border border-stone-100 dark:border-stone-800">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <Package className="text-primary-600" />
                  Teslimat & Seçenekler
                </h2>
                <div className="flex items-center gap-2 bg-white dark:bg-stone-800 px-4 py-2 rounded-xl border border-stone-100 dark:border-stone-800">
                  <Clock size={16} className="text-stone-400" />
                  <span className="text-sm font-bold">{order.deliveryDetails.type} Teslimat</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-white dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-800">
                  <p className="text-xs font-bold text-stone-400 uppercase mb-3">Teslimat Tercihi</p>
                  <p className="font-bold flex items-center gap-2">
                    <MapPin size={18} className="text-primary-600" />
                    {order.deliveryDetails.option}
                  </p>
                  {order.deliveryDetails.neighborName && (
                    <p className="text-sm text-stone-500 mt-2">Komşu: {order.deliveryDetails.neighborName}</p>
                  )}
                </div>
                
                <div className="p-5 bg-white dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-800">
                  <p className="text-xs font-bold text-stone-400 uppercase mb-3">Tahmini Teslimat</p>
                  <p className="font-bold flex items-center gap-2">
                    <Clock size={18} className="text-amber-500" />
                    {order.status === 'Teslim Edildi' ? 'Teslimat Tamamlandı' : '2-3 İş Günü İçinde'}
                  </p>
                </div>
              </div>

              {order.status === 'Teslim Edilemedi' && (
                <div className="mt-6 p-5 bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-800 rounded-2xl">
                  <div className="flex gap-4">
                    <Info className="text-orange-600 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-orange-900 dark:text-orange-400">Paketiniz Teslim Edilemedi</p>
                      <p className="text-sm text-orange-700 dark:text-orange-500 mt-1">Geldik ama sizi bulamadık. Lütfen aşağıdaki seçeneklerden birini seçin:</p>
                      <div className="flex flex-wrap gap-3 mt-4">
                        <button className="px-4 py-2 bg-white dark:bg-stone-800 border border-orange-200 dark:border-orange-800 rounded-lg text-xs font-bold hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors">
                          Yeniden Teslimat Talebi
                        </button>
                        <button className="px-4 py-2 bg-white dark:bg-stone-800 border border-orange-200 dark:border-orange-800 rounded-lg text-xs font-bold hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors">
                          Şubeden Teslim Alacağım
                        </button>
                        <button 
                          onClick={() => setAddressOpen(true)}
                          className="px-4 py-2 bg-white dark:bg-stone-800 border border-orange-200 dark:border-orange-800 rounded-lg text-xs font-bold hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors"
                        >
                          Adres Güncelle
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Product List */}
            <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] overflow-hidden border border-stone-100 dark:border-stone-800 shadow-sm">
              <div className="p-8 border-b border-stone-50 dark:border-stone-800/50">
                <h2 className="text-xl font-bold">Sipariş İçeriği ({order.items.length})</h2>
              </div>
              <div className="divide-y divide-stone-50 dark:divide-stone-800/50">
                {order.items.map((item) => (
                  <div key={item.id} className="p-8 flex items-center gap-8">
                    <div className="w-24 h-24 rounded-3xl overflow-hidden border border-stone-100 dark:border-stone-800 flex-shrink-0 shadow-sm">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-stone-900 dark:text-white text-xl mb-1">{item.name}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-stone-400">
                        {item.color && (
                          <span className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-stone-200 dark:bg-stone-700" /> {item.color}
                          </span>
                        )}
                        {item.size && <span>Beden: {item.size}</span>}
                        <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-xs">x{item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-stone-900 dark:text-white text-xl">
                        {(item.price * item.quantity).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-8 bg-stone-50 dark:bg-stone-900/50 border-t border-stone-100 dark:border-stone-800">
                <div className="flex flex-col items-end gap-3 max-w-xs ml-auto">
                  <div className="flex justify-between w-full text-stone-400 font-medium">
                    <span>Ara Toplam</span>
                    <span className="text-stone-700 dark:text-stone-300">{(order.total * 0.8).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                  </div>
                  <div className="flex justify-between w-full text-stone-400 font-medium">
                    <span>KDV (%20)</span>
                    <span className="text-stone-700 dark:text-stone-300">{(order.total * 0.2).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                  </div>
                  <div className="flex justify-between w-full text-green-600 font-bold">
                    <span>Kargo</span>
                    <span>Ücretsiz</span>
                  </div>
                  <div className="flex justify-between w-full pt-4 mt-2 border-t border-stone-200 dark:border-stone-700 text-2xl font-black text-stone-900 dark:text-white">
                    <span>Toplam</span>
                    <span>{order.total.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            {/* Tracking Card */}
            <div className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-[2.5rem] p-8 shadow-2xl shadow-stone-500/10">
              <h2 className="text-lg font-bold mb-6 flex items-center justify-between">
                Kargo Takibi
                <Truck size={20} className="opacity-50" />
              </h2>
              
              {order.trackingNumber ? (
                <div className="space-y-6">
                  <div className="p-4 bg-white/10 dark:bg-stone-100 rounded-2xl border border-white/10 dark:border-stone-200">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{order.carrier}</p>
                    <p className="font-mono text-lg font-bold tracking-tight">{order.trackingNumber}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <button 
                      onClick={() => setTrackingOpen(true)}
                      className="w-full py-4 bg-primary-600 dark:bg-primary-500 text-white rounded-2xl text-sm font-black shadow-lg shadow-primary-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      Kargom Nerede?
                      <ArrowRight size={16} />
                    </button>
                    <a href="#" className="flex items-center justify-center gap-2 text-xs font-bold opacity-60 hover:opacity-100 transition-opacity">
                      Kargo Web Sitesine Git
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 bg-white/5 rounded-2xl border border-white/5">
                  <RefreshCw className="mx-auto mb-3 opacity-40 animate-spin-slow" />
                  <p className="text-sm font-bold opacity-70">Takip no bekleniyor...</p>
                  <p className="text-[10px] opacity-40 mt-1 uppercase tracking-widest">Sipariş Hazırlanıyor</p>
                </div>
              )}
            </div>

            {/* Return & Address Management Card (New) */}
            <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] p-8 border border-stone-100 dark:border-stone-800 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[1.25rem] bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 shadow-sm">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-stone-900 dark:text-white">Teslimat Adresi</h3>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">{order.deliveryAddress.split('/').pop()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-stone-50 dark:bg-stone-800/50 p-5 rounded-2xl border border-stone-100 dark:border-stone-800 mb-8">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">Güncel Adres Detayı</p>
                <p className="text-sm text-stone-700 dark:text-stone-300 font-bold leading-relaxed">
                  {order.deliveryAddress}
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setAddressOpen(true)}
                    className="flex items-center justify-center gap-2 py-4 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-stone-50 dark:hover:bg-stone-700 transition-all border border-stone-100 dark:border-stone-800 shadow-sm"
                  >
                    <Edit3 size={14} />
                    Adresi Düzenle
                  </button>
                  
                  {order.status === 'Teslim Edildi' ? (
                    <Link 
                      to={`/siparislerim/${order.id}/islem`}
                      className="flex items-center justify-center gap-2 py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-stone-900/10"
                    >
                      <RotateCcw size={14} />
                      Kolay İade
                    </Link>
                  ) : (
                    <Link 
                      to={`/siparislerim/${order.id}/islem`}
                      className="flex items-center justify-center gap-2 py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-stone-900/10"
                    >
                      <X size={14} />
                      Siparişi İptal Et
                    </Link>
                  )}
                </div>

                <Link 
                  to="/destek"
                  className="flex items-center justify-center gap-3 w-full py-4 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors text-[10px] font-black border-t border-stone-50 dark:border-stone-800 mt-4 pt-4 uppercase tracking-[0.2em]"
                >
                  Yardım Merkezi & Destek
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TrackingModal 
        isOpen={trackingOpen} 
        onClose={() => setTrackingOpen(false)} 
        order={order} 
      />

      <AddressModal 
        isOpen={addressOpen} 
        onClose={() => setAddressOpen(false)} 
        currentAddress={order.deliveryAddress}
        onSave={handleUpdateAddress}
      />
    </div>
  );
};

export default OrderDetail;