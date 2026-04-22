import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orders } from '../../data/orders';
import { ArrowLeft, AlertCircle, CheckCircle, UploadCloud, Truck, Wallet, FileText } from 'lucide-react';

const OrderAction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // We use a mock order id if not provided via routing for demo purposes
  const mockOrder = orders[0] || { id: 'ORD-123', status: 'Teslim Edildi', date: new Date().toISOString(), total: 1500, items: [] };
  const order = orders.find((o) => o.id === id) || mockOrder;

  // Determine action type based on status
  // "Hazırlanıyor", "Onay Bekliyor" -> İptal (Cancellation)
  // "Teslim Edildi" -> İade (Return)
  const isCancellable = order.status === 'Hazırlanıyor' || order.status === 'Onay Bekliyor' || order.status === 'Ödeme Bekleniyor';
  const isReturnable = order.status === 'Teslim Edildi';

  const [step, setStep] = useState(1);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [returnMethod, setReturnMethod] = useState('');
  const [refundMethod, setRefundMethod] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Reasons options
  const cancelReasons = [
    'Siparişi yanlışlıkla verdim',
    'Fiyatı uygun bulmadım',
    'Teslimat süresi çok uzun',
    'Farklı bir ürün buldum',
    'Diğer'
  ];

  const returnReasons = [
    'Ayıplı / Kusurlu Ürün',
    'Yanlış Ürün Gönderildi',
    'Vazgeçme Hakkı (Bedeni/Rengi uymadı vb.)',
    'Ürün beklentilerimi karşılamadı',
    'Kargo hasarı',
    'Diğer'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason) return;
    if (reason === 'Diğer' && !otherReason) return;
    if (isReturnable && (!returnMethod || !refundMethod)) return;
    
    // Process submission
    const finalReason = reason === 'Diğer' ? otherReason : reason;
    console.log('Submitting with reason:', finalReason);
    
    setIsSuccess(true);
    setStep(3);
  };

  if(!isCancellable && !isReturnable && !isSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
         <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 max-w-md w-full">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2 dark:text-white">İşlem Yapılamaz</h2>
            <p className="text-gray-500 text-sm mb-6">Bu sipariş iptal veya iade kurallarına uygun bir aşamada değil. Sadece "Hazırlanıyor" aşamasındaki siparişleri iptal edebilir veya "Teslim Edildi" statüsündeki siparişleri iade edebilirsiniz.</p>
            <button onClick={() => navigate('/siparislerim')} className="bg-amber-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-700">Siparişlerime Dön</button>
         </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 text-center max-w-lg w-full">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Talebiniz Alındı!</h2>
            <p className="text-gray-600 mb-6">
                {isCancellable 
                ? "Sipariş iptal talebiniz başarıyla satıcıya iletilmiştir. İptal onaylandığında ücret iadeniz otomatik olarak başlayacaktır." 
                : "Sipariş iade talebiniz oluşturulmuştur. Aşağıdaki iade kargo kodu ile belirtilen firmaya ürünü teslim edebilirsiniz."}
            </p>

            {isReturnable && (
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl mb-6">
                    <p className="text-sm text-gray-500 mb-1">İade Kargo Kodu (Yurtiçi Kargo)</p>
                    <p className="text-2xl font-bold tracking-widest text-gray-900">774 256 941</p>
                </div>
            )}

            <button onClick={() => navigate('/siparislerim')} className="w-full bg-amber-600 text-white py-3 rounded-xl font-medium hover:bg-amber-700 transition">
                Siparişlerime Dön
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Geri Dön
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
             <div>
               <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {isCancellable ? 'Sipariş İptal Talebi' : 'Sipariş İade Talebi'}
               </h1>
               <p className="text-sm text-gray-500 mt-1">Sipariş No: {order.id}</p>
             </div>
             <div className={`px-3 py-1 rounded-full text-xs font-semibold ${isCancellable ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                {isCancellable ? 'İptal Akışı' : 'İade Akışı'}
             </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Step 1: Reason Selection */}
            <div>
               <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">1. {isCancellable ? 'İptal' : 'İade'} Sebebini Seçin *</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(isCancellable ? cancelReasons : returnReasons).map((r, i) => (
                      <label key={i} className={`flex items-start p-4 border rounded-xl cursor-pointer transition-colors ${reason === r ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                          <input type="radio" name="reason" value={r} checked={reason === r} onChange={(e) => setReason(e.target.value)} className="mt-1 text-primary-600 focus:ring-primary-500" />
                          <span className="ml-3 text-sm text-gray-800 dark:text-gray-200">{r}</span>
                      </label>
                  ))}
               </div>
               {reason === 'Diğer' && (
                  <div className="mt-4 animate-fade-in">
                    <textarea 
                      value={otherReason} 
                      onChange={(e) => setOtherReason(e.target.value)} 
                      placeholder="Lütfen iptal/iade sebebinizi buraya yazın..."
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary-500 outline-none" 
                      rows={3}
                      required
                    />
                  </div>
               )}
            </div>

            {/* Step 2: Extra Details for Returns */}
            {isReturnable && (
                <div className="space-y-8 animate-fade-in">
                    <div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Durum Açıklaması & Fotoğraf/Video</h3>
                        <p className="text-xs text-gray-500 mb-3">Hasarlı veya kusurlu ürünlerde fotoğraf yüklemek zorunludur. İşlemlerinizin hızlanmasını sağlar.</p>
                        <textarea 
                            value={description} onChange={(e) => setDescription(e.target.value)} 
                            placeholder="İade sebebinizi detaylandırın..."
                            className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary-500 outline-none mb-3" rows={3}
                        />
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                            <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm font-medium text-primary-600">Dosya Yüklemek İçin Tıklayın</p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG, MP4 (Maks: 10MB)</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">2. İade Yöntemi Seçimi *</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className={`flex items-center p-4 border rounded-xl cursor-pointer ${returnMethod === 'DOOR' ? 'border-primary-500 ring-1 ring-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 hover:border-gray-300'}`}>
                                <input type="radio" checked={returnMethod === 'DOOR'} onChange={() => setReturnMethod('DOOR')} className="hidden" />
                                <Truck className={`w-6 h-6 mr-3 ${returnMethod === 'DOOR' ? 'text-primary-600' : 'text-gray-400'}`} />
                                <div><p className="font-medium text-sm">Kapıdan Alım</p><p className="text-xs text-gray-500 mt-1">Kurye adresinize gelip teslim alsın</p></div>
                            </label>
                            <label className={`flex items-center p-4 border rounded-xl cursor-pointer ${returnMethod === 'BRANCH' ? 'border-primary-500 ring-1 ring-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 hover:border-gray-300'}`}>
                                <input type="radio" checked={returnMethod === 'BRANCH'} onChange={() => setReturnMethod('BRANCH')} className="hidden" />
                                <FileText className={`w-6 h-6 mr-3 ${returnMethod === 'BRANCH' ? 'text-primary-600' : 'text-gray-400'}`} />
                                <div><p className="font-medium text-sm">Kargo Şubesine Teslim</p><p className="text-xs text-gray-500 mt-1">İade kodu ile şubeye teslim edeceğim</p></div>
                            </label>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">3. Geri Ödeme Yöntemi Seçimi *</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <label className={`flex flex-col items-center p-5 border rounded-xl cursor-pointer text-center ${refundMethod === 'CARD' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 hover:border-gray-300'}`}>
                                <input type="radio" checked={refundMethod === 'CARD'} onChange={() => setRefundMethod('CARD')} className="hidden" />
                                <div className="text-sm font-semibold mb-1">Aynı Karta İade</div>
                                <div className="text-xs text-gray-500">1-3 iş günü sürer</div>
                            </label>
                            <label className={`flex flex-col items-center p-5 border rounded-xl cursor-pointer text-center ${refundMethod === 'WALLET' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 hover:border-gray-300'}`}>
                                <input type="radio" checked={refundMethod === 'WALLET'} onChange={() => setRefundMethod('WALLET')} className="hidden" />
                                <div className="text-sm font-semibold mb-1">Cüzdana İade</div>
                                <div className="text-xs text-emerald-600 font-medium">Anında Yansır</div>
                            </label>
                            <label className={`flex flex-col items-center p-5 border rounded-xl cursor-pointer text-center ${refundMethod === 'POINT' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 hover:border-gray-300'}`}>
                                <input type="radio" checked={refundMethod === 'POINT'} onChange={() => setRefundMethod('POINT')} className="hidden" />
                                <div className="text-sm font-semibold mb-1">Hediye Puan</div>
                                <div className="text-xs text-amber-600 font-medium">%5 Ekstra Puan Hediye</div>
                            </label>
                        </div>
                    </div>
                </div>
            )}

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
               <button 
                  type="submit" 
                  disabled={!reason || (isReturnable && (!returnMethod || !refundMethod))}
                  className="bg-amber-600 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-700 transition-colors"
                >
                  Talebi Oluştur
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderAction;
