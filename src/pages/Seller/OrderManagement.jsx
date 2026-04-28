import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Download,
  MoreVertical,
  Printer,
  Edit,
  ExternalLink,
  Package,
  Bell,
  FileText
} from 'lucide-react';
import { generateInvoicePDF } from '../../utils/generateInvoice';
import toast from 'react-hot-toast';

const SELLER_ORDERS = [
  {
    id: 'ORD-5501',
    customer: 'Başak Şimşek',
    date: '2024-04-08 14:30',
    total: 1250.00,
    status: 'Yeni',
    items: [{ name: 'El Örmesi Hırka', quantity: 1, price: 1250.00, image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=100&q=80' }],
    payment: 'Kredi Kartı',
    address: 'Üsküdar, İstanbul'
  },
  {
    id: 'ORD-5492',
    customer: 'Mehmet Demir',
    date: '2024-04-07 11:20',
    total: 350.00,
    status: 'Hazırlanıyor',
    items: [{ name: 'Seramik Kupa', quantity: 2, price: 175.00, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fbed20?auto=format&fit=crop&w=100&q=80' }],
    payment: 'Kredi Kartı',
    address: 'Çankaya, Ankara'
  },
  {
    id: 'ORD-5485',
    customer: 'Aylin Yılmaz',
    date: '2024-04-06 18:45',
    total: 890.00,
    status: 'Kargoya Verildi',
    items: [{ name: 'Deri Cüzdan', quantity: 1, price: 890.00, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=100&q=80' }],
    payment: 'Kredi Kartı',
    address: 'Konak, İzmir',
    tracking: 'TR2847192837',
    carrier: 'Yurtiçi Kargo'
  },
  {
    id: 'ORD-5420',
    customer: 'Can Özkan',
    date: '2024-04-01 09:15',
    total: 450.00,
    status: 'Tamamlandı',
    items: [{ name: 'Keten Masa Örtüsü', quantity: 1, price: 450.00, image: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?auto=format&fit=crop&w=100&q=80' }],
    payment: 'Kredi Kartı',
    address: 'Nilüfer, Bursa'
  },
  {
    id: 'ORD-5390',
    customer: 'Emir Karaca',
    date: '2024-03-28 15:00',
    total: 320.00,
    status: 'İade Talebi',
    items: [{ name: 'Dekoratif Mum Seti', quantity: 1, price: 320.00, image: 'https://images.unsplash.com/photo-1602872030219-cbf948a980dd?auto=format&fit=crop&w=100&q=80' }],
    payment: 'Kredi Kartı',
    address: 'Antalya'
  }
];

const OrderManagement = () => {
  const [activeTab, setActiveTab] = useState('Hepsi');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [shippingModal, setShippingModal] = useState({ show: false, orderId: null });
  const [rejectModal, setRejectModal] = useState({ show: false, orderId: null });
  const [detailModal, setDetailModal] = useState({ show: false, order: null });

  const carriers = ['Yurtiçi Kargo', 'Aras Kargo', 'MNG Kargo', 'HepsiJet', 'Trendyol Express'];

  const tabs = [
    { id: 'Hepsi', label: 'Tüm Siparişler', count: SELLER_ORDERS.length },
    { id: 'Yeni', label: 'Yeni', count: 1, color: 'text-blue-600 bg-blue-50', icon: <Bell className="w-3 h-3" /> },
    { id: 'Hazırlanıyor', label: 'Hazırlanıyor', count: 1 },
    { id: 'Kargoya Verildi', label: 'Kargoda', count: 1 },
    { id: 'Tamamlandı', label: 'Tamamlananlar', count: 1 },
    { id: 'İade Talebi', label: 'İptal / İade', count: 1, color: 'text-red-600 bg-red-50' }
  ];

  const filteredOrders = SELLER_ORDERS.filter(order => {
    const matchesTab = activeTab === 'Hepsi' || order.status === activeTab;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const toggleSelectOrder = (id) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter(o => o !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(o => o.id));
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Yeni': return 'bg-blue-100 text-blue-700';
      case 'Hazırlanıyor': return 'bg-amber-100 text-amber-700';
      case 'Kargoya Verildi': return 'bg-purple-100 text-purple-700';
      case 'Tamamlandı': return 'bg-green-100 text-green-700';
      case 'İade Talebi': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleExportExcel = () => {
    const headers = ['Sipariş No', 'Müşteri', 'Tarih', 'Tutar', 'Ödeme', 'Durum', 'Adres'];
    const rows = SELLER_ORDERS.map(o => [
      o.id,
      o.customer,
      o.date,
      o.total,
      o.payment,
      o.status,
      o.address
    ]);

    const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(';')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Siparis_Raporu_${new Date().toLocaleDateString()}.csv`;
    link.click();
    toast.success('Sipariş raporu hazırlandı ve indiriliyor.');
  };

  const handleDailyPrint = () => {
    window.print();
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="max-w-[1400px] mx-auto print:max-w-none">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 print:hidden">
            <div>
              <h1 className="text-3xl font-black text-stone-900 dark:text-white flex items-center gap-3">
                <ShoppingBag className="w-8 h-8 text-blue-600" />
                Sipariş Yönetimi
              </h1>
              <p className="text-stone-500 dark:text-stone-400 font-medium mt-1">Siparişlerinizi takip edin, onaylayın ve kargolayın.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handleExportExcel}
                className="flex items-center gap-2 bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 px-4 py-2.5 rounded-xl text-sm font-bold text-stone-700 dark:text-stone-300 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
              >
                <Download className="w-4 h-4" />
                Rapor Al
              </button>
              <button 
                onClick={handleDailyPrint}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 active:scale-95"
              >
                <Printer className="w-4 h-4" />
                Günlük Çıktı Al
              </button>
            </div>
          </div>

        {/* Filters & Actions Card */}
        <div className="bg-white dark:bg-stone-900 rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-stone-800 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id 
                    ? 'bg-stone-900 text-white dark:bg-white dark:text-black shadow-lg shadow-stone-900/10' 
                    : 'text-stone-500 hover:bg-gray-50 dark:hover:bg-stone-800'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100 dark:bg-stone-800'}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input 
                  type="text"
                  placeholder="Sipariş veya müşteri ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-stone-800 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <button className="p-2.5 bg-gray-50 dark:bg-stone-800 rounded-xl text-stone-500 hover:text-blue-600 transition-all border border-gray-100 dark:border-stone-800">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedOrders.length > 0 && (
          <div className="bg-blue-600 text-white p-4 rounded-2xl mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in slide-in-from-top-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6" />
              <span className="font-bold">{selectedOrders.length} Sipariş Seçildi</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-bold transition-all">Siparişi Onayla</button>
              <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-bold transition-all">Kargoya Ver</button>
              <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-bold transition-all">Fatura Oluştur</button>
              <button 
                onClick={() => setSelectedOrders([])}
                className="px-4 py-2 text-white/80 hover:text-white text-sm font-bold"
              >
                İptal
              </button>
            </div>
          </div>
        )}

        {/* Orders Table/List */}
        <div className="bg-white dark:bg-stone-900 rounded-[2rem] shadow-xl border border-gray-100 dark:border-stone-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#fcfdfe] dark:bg-stone-900 border-b border-gray-100 dark:border-stone-800">
                <tr>
                  <th className="px-6 py-5 w-10">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-5 text-xs font-black text-stone-400 uppercase tracking-widest">Sipariş</th>
                  <th className="px-6 py-5 text-xs font-black text-stone-400 uppercase tracking-widest">Müşteri</th>
                  <th className="px-6 py-5 text-xs font-black text-stone-400 uppercase tracking-widest">Ürünler</th>
                  <th className="px-6 py-5 text-xs font-black text-stone-400 uppercase tracking-widest">Tutar</th>
                  <th className="px-6 py-5 text-xs font-black text-stone-400 uppercase tracking-widest">Durum</th>
                  <th className="px-6 py-5 text-xs font-black text-stone-400 uppercase tracking-widest text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-stone-800/50">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-stone-800/30 transition-all group cursor-pointer">
                    <td className="px-6 py-6" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleSelectOrder(order.id)}
                      />
                    </td>
                    <td className="px-6 py-6" onClick={() => setDetailModal({ show: true, order })}>
                      <div className="flex flex-col">
                        <span className="font-black text-sm text-stone-900 dark:text-white">#{order.id}</span>
                        <span className="text-[10px] text-stone-400 font-bold uppercase flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" /> {order.date}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6 font-bold text-sm text-stone-700 dark:text-stone-300" onClick={() => setDetailModal({ show: true, order })}>{order.customer}</td>
                    <td className="px-6 py-6" onClick={() => setDetailModal({ show: true, order })}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-stone-800">
                          <img src={order.items[0].image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold truncate max-w-[150px] dark:text-gray-200">{order.items[0].name}</span>
                          <span className="text-[10px] text-stone-400 font-bold">{order.items.length > 1 ? `+${order.items.length - 1} ürün daha` : '1 Ürün'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 font-black text-sm text-stone-900 dark:text-white" onClick={() => setDetailModal({ show: true, order })}>₺{order.total.toLocaleString()}</td>
                    <td className="px-6 py-6" onClick={() => setDetailModal({ show: true, order })}>
                      <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-6" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        {order.status === 'Yeni' && (
                          <>
                            <button className="p-2 bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 rounded-xl transition-all shadow-sm" title="Onayla">
                              <CheckCircle2 className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => setRejectModal({ show: true, orderId: order.id })}
                              className="p-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 rounded-xl transition-all shadow-sm" 
                              title="Reddet"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        {order.status === 'Hazırlanıyor' && (
                          <button 
                            onClick={() => setShippingModal({ show: true, orderId: order.id })}
                            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 rounded-xl transition-all shadow-sm" 
                            title="Kargoya Ver"
                          >
                            <Truck className="w-5 h-5" />
                          </button>
                        )}
                        <button 
                          onClick={() => generateInvoicePDF(order)}
                          className="p-2 bg-gray-50 text-stone-500 hover:text-blue-600 dark:bg-stone-800 rounded-xl transition-all shadow-sm" 
                          title="Fatura Oluştur"
                        >
                          <FileText className="w-5 h-5" />
                        </button>
                        <button className="p-2 bg-gray-50 text-stone-500 hover:text-stone-900 dark:bg-stone-800 rounded-xl transition-all shadow-sm">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-gray-50 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-stone-300" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white">Henüz sipariş yok</h3>
              <p className="text-stone-500 dark:text-stone-400 mt-2">Seçili kriterlere uygun sipariş bulunamadı.</p>
            </div>
          )}

          {/* Pagination */}
          <div className="px-6 py-4 bg-[#fcfdfe] dark:bg-stone-900 border-t border-gray-100 dark:border-stone-800 flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">1 - {filteredOrders.length} / {SELLER_ORDERS.length} Sipariş</span>
            <div className="flex gap-2">
              <button disabled className="p-2 bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-lg text-stone-300 disabled:opacity-50 transition-all">
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
              <button className="p-2 bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-lg text-stone-600 hover:bg-gray-50 transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Action Footer for New Orders Notification */}
      <div className="fixed bottom-8 right-8 animate-bounce">
         <div className="bg-blue-600 text-white p-4 rounded-3xl shadow-2xl flex items-center gap-4 cursor-pointer hover:bg-blue-700 transition-all">
            <div className="relative">
              <Bell className="w-6 h-6" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-blue-600 rounded-full"></div>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest leading-none">Yeni Bildirim</p>
              <p className="font-bold text-xs mt-1">1 Onay Bekleyen Sipariş</p>
            </div>
         </div>
      </div>

    {/* Shipping Modal */}
    {shippingModal.show && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
        <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 dark:border-stone-800 animate-in zoom-in-95">
          <div className="p-8 pb-4">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
              <Truck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-stone-900 dark:text-white mb-2">Kargoya Ver</h2>
            <p className="text-stone-500 text-sm font-medium">#{shippingModal.orderId} için kargo bilgilerini girin.</p>
          </div>
          
          <div className="p-8 pt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Kargo Firması</label>
              <select className="w-full px-5 py-4 bg-gray-50 dark:bg-stone-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold appearance-none">
                {carriers.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Takip Numarası</label>
              <input 
                type="text"
                placeholder="Örn: TR12345678"
                className="w-full px-5 py-4 bg-gray-50 dark:bg-stone-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setShippingModal({ show: false, orderId: null })}
                className="flex-1 py-4 px-6 border border-gray-100 dark:border-stone-800 rounded-2xl font-bold text-stone-500 hover:bg-gray-50 transition-all font-bold"
              >
                Vazgeç
              </button>
              <button className="flex-1 py-4 px-6 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all">
                Onayla
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Reject Modal */}
    {rejectModal.show && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
        <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 dark:border-stone-800 animate-in zoom-in-95">
          <div className="p-8 pb-4 text-center">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-6 mx-auto">
              <XCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-stone-900 dark:text-white mb-2">Siparişi Reddet</h2>
            <p className="text-stone-500 text-sm font-medium">#{rejectModal.orderId} nolu siparişi reddetmek üzeresiniz.</p>
          </div>
          
          <div className="p-8 pt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest text-center block">Red Nedeni</label>
              <textarea 
                rows="3"
                placeholder="Müşteriye iletilecek açıklama..."
                className="w-full px-5 py-4 bg-gray-50 dark:bg-stone-800 border-none rounded-2xl focus:ring-2 focus:ring-red-500 font-bold resize-none"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setRejectModal({ show: false, orderId: null })}
                className="flex-1 py-4 px-6 border border-gray-100 dark:border-stone-800 rounded-2xl font-bold text-stone-500 hover:bg-gray-50 transition-all"
              >
                Geri Dön
              </button>
              <button className="flex-1 py-4 px-6 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 shadow-lg shadow-red-500/30 transition-all">
                Siparişi İptal Et
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    {/* Order Detail Modal (Slide-over) */}
    {detailModal.show && detailModal.order && (
      <div className="fixed inset-0 z-[60] flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in transition-all">
        <div 
          className="w-full max-w-xl bg-white dark:bg-stone-900 h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="p-8 border-b border-gray-100 dark:border-stone-800 flex items-center justify-between bg-gray-50/50 dark:bg-stone-900/50">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-black text-stone-900 dark:text-white">Sipariş Detayı</h2>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${getStatusStyle(detailModal.order.status)}`}>
                  {detailModal.order.status}
                </span>
              </div>
              <p className="text-stone-500 text-sm font-medium">Sipariş No: #{detailModal.order.id} • {detailModal.order.date}</p>
            </div>
            <button 
              onClick={() => setDetailModal({ show: false, order: null })}
              className="p-3 bg-white dark:bg-stone-800 rounded-2xl border border-gray-100 dark:border-stone-800 shadow-sm hover:bg-gray-50 transition-all active:scale-95"
            >
              <XCircle className="w-6 h-6 text-stone-400" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            
            {/* Customer & Shipping Section */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Müşteri Bilgisi
                </h3>
                <div>
                  <p className="font-black text-stone-900 dark:text-white">{detailModal.order.customer}</p>
                  <p className="text-sm text-stone-500 font-medium mt-1">basak@example.com</p>
                  <p className="text-sm text-stone-500 font-medium">+90 555 123 45 67</p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                  <Truck className="w-3 h-3 text-blue-500" /> Teslimat Adresi
                </h3>
                <p className="text-sm text-stone-700 dark:text-stone-300 font-bold leading-relaxed">
                  {detailModal.order.address}
                </p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="p-6 bg-gray-50 dark:bg-stone-800/50 rounded-3xl border border-gray-100 dark:border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white dark:bg-stone-800 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-stone-700">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase">Ödeme Tipi</p>
                  <p className="font-bold text-stone-900 dark:text-white">{detailModal.order.payment}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-stone-400 uppercase">Toplam Tutar</p>
                <p className="text-xl font-black text-blue-600">₺{detailModal.order.total.toLocaleString()}</p>
              </div>
            </div>

            {/* Product List */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest">Sipariş Edilen Ürünler ({detailModal.order.items.length})</h3>
              <div className="space-y-3">
                {detailModal.order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-white dark:bg-stone-800 rounded-3xl border border-gray-100 dark:border-stone-800 shadow-sm group hover:border-blue-100 transition-all">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-100 dark:border-stone-700 shadow-inner flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-stone-900 dark:text-white line-clamp-1">{item.name}</h4>
                      <div className="flex items-center gap-4 mt-1 text-[11px] font-bold text-stone-500 uppercase">
                        <span>Adet: {item.quantity}</span>
                        <span>Fiyat: ₺{item.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-right font-black text-stone-900 dark:text-white">
                      ₺{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Modal Footer (Actions) */}
          <div className="p-8 border-t border-gray-100 dark:border-stone-800 grid grid-cols-2 gap-4">
            {detailModal.order.status === 'Yeni' ? (
              <>
                <button className="py-4 bg-red-50 text-red-600 hover:bg-red-100 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Siparişi Reddet</button>
                <button className="py-4 bg-stone-900 text-white dark:bg-white dark:text-black rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95">Siparişi Onayla</button>
              </>
            ) : detailModal.order.status === 'Hazırlanıyor' ? (
              <button className="col-span-2 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3">
                <Truck className="w-5 h-5" /> Kargoya Teslim Et
              </button>
            ) : (
              <button 
                onClick={() => generateInvoicePDF(detailModal.order)}
                className="col-span-2 py-4 border border-gray-100 dark:border-stone-800 text-stone-600 dark:text-gray-300 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3"
              >
                <FileText className="w-5 h-5" /> Fatura İndir
              </button>
            )}
          </div>

        </div>
      </div>
    )}
    </div>
  );
};

export default OrderManagement;
