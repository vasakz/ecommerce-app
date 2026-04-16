import React, { useState } from 'react';
import { Package, XCircle, CheckCircle, AlertTriangle, MessageSquare, RefreshCw } from 'lucide-react';

const OrderRequests = () => {
  const [activeTab, setActiveTab] = useState('returns'); // returns, cancellations
  const [selectedReason, setSelectedReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState(null);

  const [requests, setRequests] = useState([
    {
      id: 'REQ-1001',
      orderId: 'ORD-INT-901',
      type: 'İptal',
      customerName: 'Ahmet Yılmaz',
      date: '2026-04-10',
      reason: 'Farklı bir ürün buldum',
      status: 'Bekliyor', // Bekliyor, Onaylandı, Reddedildi
      amount: 1250,
      product: 'Apple iPhone 15 Pro Max',
    },
    {
      id: 'REQ-1002',
      orderId: 'ORD-INT-899',
      type: 'İade',
      customerName: 'Ayşe Kaya',
      date: '2026-04-09',
      reason: 'Ayıplı / Kusurlu Ürün',
      description: 'Ürünün ekranında kılcal çizikler mevcut.',
      status: 'Bekliyor',
      amount: 4500,
      product: 'Sony WH-1000XM5 Kulaklık',
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80'],
      returnStatus: 'Satıcı İncelemesinde' // İade Talebi Oluşturuldu, Satıcı İncelemesinde, vs.
    }
  ]);

  const handleApprove = (reqId) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'Onaylandı', returnStatus: r.type === 'İptal' ? 'Tamamlandı' : 'İade Onaylandı (Geri Ödeme Başlatıldı)' } : r));
    // Simulate stock update alert
    alert('İşlem onaylandı. Stok durumu otomatik olarak güncellendi ve müşteriye para iadesi süreci başlatıldı.');
  };

  const handleRejectClick = (reqId) => {
    setActiveRequestId(reqId);
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    if (!selectedReason) return;
    setRequests(prev => prev.map(r => r.id === activeRequestId ? { ...r, status: 'Reddedildi', returnStatus: `Reddedildi: ${selectedReason}` } : r));
    setShowRejectModal(false);
    setSelectedReason('');
    setActiveRequestId(null);
  };

  const filteredRequests = requests.filter(r => 
    (activeTab === 'returns' && r.type === 'İade') || 
    (activeTab === 'cancellations' && r.type === 'İptal')
  );

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-[80vh] bg-gray-50 dark:bg-gray-900 rounded-xl">
       <div className="mb-8">
         <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2"><RefreshCw/> İade & İptal Talepleri</h1>
         <p className="text-gray-500 mt-1">Müşterilerden gelen iptal ve iade taleplerini yönetin.</p>
       </div>

       {/* Tabs */}
       <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-6">
          <button onClick={() => setActiveTab('returns')} className={`px-4 py-3 font-medium text-sm transition-colors relative ${activeTab === 'returns' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>
             İade Talepleri
             {activeTab === 'returns' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />}
          </button>
          <button onClick={() => setActiveTab('cancellations')} className={`px-4 py-3 font-medium text-sm transition-colors relative ${activeTab === 'cancellations' ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>
             İptal Talepleri
             {activeTab === 'cancellations' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-600" />}
          </button>
       </div>

       {/* List Array */}
       <div className="space-y-4">
         {filteredRequests.length === 0 ? (
             <div className="text-center py-16 text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
               Burada gösterilecek talep bulunmuyor.
             </div>
         ) : (
           filteredRequests.map(req => (
             <div key={req.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between border-b border-gray-100 dark:border-gray-700 p-5 bg-gray-50 dark:bg-gray-800/80">
                   <div>
                     <span className="text-xs font-bold px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300 mr-2">{req.type}</span>
                     <span className="font-semibold dark:text-white">Talep No: {req.id}</span>
                     <p className="text-sm text-gray-500 mt-1">Sipariş: {req.orderId} • Tarih: {req.date}</p>
                   </div>
                   <div className="text-right mt-3 md:mt-0">
                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${req.status === 'Onaylandı' ? 'bg-green-100 text-green-700' : req.status === 'Reddedildi' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                        {req.status}
                     </span>
                     <p className="font-bold text-lg text-primary-600 mt-1">{req.amount.toLocaleString('tr-TR')} TL</p>
                   </div>
                </div>

                <div className="p-5 flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                        <div>
                           <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase">Müşteri & Ürün</p>
                           <p className="font-medium mt-1 dark:text-gray-200">{req.customerName}</p>
                           <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-300">
                              <Package size={16}/> {req.product}
                           </div>
                        </div>
                        <div>
                           <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase">Sebep</p>
                           <p className="font-medium mt-1 text-red-500 flex items-center gap-2"><AlertTriangle size={16}/> {req.reason}</p>
                           {req.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">"{req.description}"</p>}
                           {req.returnStatus && <p className="text-xs mt-3 bg-gray-100 dark:bg-gray-700 inline-block px-3 py-1 rounded">Süreç Durumu: {req.returnStatus}</p>}
                        </div>
                    </div>
                    
                    {req.images && req.images.length > 0 && (
                        <div className="w-32">
                           <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase mb-2">Kanıt Görselleri</p>
                           <img src={req.images[0]} alt="Kanıt" className="w-full h-24 object-cover rounded shadow-sm border border-gray-200" />
                        </div>
                    )}

                    {req.status === 'Bekliyor' && (
                        <div className="flex md:flex-col gap-2 justify-end items-end w-full md:w-auto mt-4 md:mt-0">
                           <button onClick={() => handleApprove(req.id)} className="w-full md:w-36 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-medium">
                              <CheckCircle size={18}/> Onayla
                           </button>
                           <button onClick={() => handleRejectClick(req.id)} className="w-full md:w-36 flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded hover:bg-red-50 transition font-medium">
                              <XCircle size={18}/> Reddet
                           </button>
                        </div>
                    )}
                </div>
             </div>
           ))
         )}
       </div>

       {showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
             <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md p-6 shadow-2xl">
                 <h3 className="text-lg font-bold mb-4 dark:text-white">Talebi Reddet</h3>
                 <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Lütfen müşteriye iletilecek red sebebini seçin veya yazın.</p>
                 <select value={selectedReason} onChange={e => setSelectedReason(e.target.value)} className="w-full bg-gray-50 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded p-3 mb-4 outline-none dark:text-white">
                    <option value="">Sebep Seçin...</option>
                    <option value="Kurumsal iade prosedürüne uygun değil">Kurumsal iade prosedürüne uygun değil</option>
                    <option value="Ürün hasarı müşteri kaynaklı tespit edildi">Ürün hasarı müşteri kaynaklı tespit edildi</option>
                    <option value="İade süresi (14 Gün) aşıldı">İade süresi (14 Gün) aşıldı</option>
                    <option value="Hijyenik sebeplerle iadesi mümkün değil">Hijyenik sebeplerle iadesi mümkün değil</option>
                 </select>
                 <div className="flex gap-3 justify-end">
                    <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 text-gray-500 hover:text-gray-900 border border-gray-200 rounded">Vazgeç</button>
                    <button onClick={handleConfirmReject} disabled={!selectedReason} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50">Reddi Onayla ve Bildir</button>
                 </div>
             </div>
          </div>
       )}
    </div>
  );
};

export default OrderRequests;
