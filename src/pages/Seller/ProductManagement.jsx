import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Copy, 
  Eye, 
  EyeOff, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  ChevronRight,
  TrendingUp,
  Package,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { toast } from 'react-toastify';

// Mock data based on user requirements
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Klasik Deri Ceket',
    category: 'Giyim',
    brand: 'ModaZen',
    price: 1250,
    discountedPrice: 999,
    stock: 45,
    status: 'Published', // Yayında
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=300',
    sales: 12,
    rating: 4.8
  },
  {
    id: 2,
    name: 'Kablosuz Kulaklık G7',
    category: 'Elektronik',
    brand: 'TechPro',
    price: 850,
    discountedPrice: null,
    stock: 0,
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=300',
    sales: 156,
    rating: 4.5
  },
  {
    id: 3,
    name: 'Minimalist Kol Saati',
    category: 'Aksesuar',
    brand: 'TimeLess',
    price: 450,
    discountedPrice: 399,
    stock: 12,
    status: 'Under Review', // İncelemede
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=300',
    sales: 0,
    rating: 0
  },
  {
    id: 4,
    name: 'Ham Pamuk T-shirt',
    category: 'Giyim',
    brand: 'EcoWear',
    price: 120,
    discountedPrice: null,
    stock: 100,
    status: 'Draft', // Taslak
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=300',
    sales: 0,
    rating: 0
  },
  {
    id: 5,
    name: 'Akıllı Ev Kamerası',
    category: 'Elektronik',
    brand: 'SecureHome',
    price: 1100,
    discountedPrice: null,
    stock: 5,
    status: 'Rejected', // Reddedildi
    rejectReason: 'Düşük çözünürlüklü görseller.',
    image: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?auto=format&fit=crop&q=80&w=300',
    sales: 0,
    rating: 0
  }
];

const STATUS_LABELS = {
  Published: { label: 'Yayında', icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
  'Under Review': { label: 'İncelemede', icon: <Clock className="w-4 h-4" />, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  Draft: { label: 'Taslak', icon: <FileText className="w-4 h-4" />, color: 'text-gray-600 bg-gray-50 dark:bg-gray-800' },
  Rejected: { label: 'Reddedildi', icon: <AlertCircle className="w-4 h-4" />, color: 'text-red-600 bg-red-50 dark:bg-red-900/20' }
};

const ProductManagement = () => {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showBulkAction, setShowBulkAction] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.brand.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [products, filterStatus, searchTerm]);

  const stats = useMemo(() => {
    return {
      total: products.length,
      published: products.filter(p => p.status === 'Published').length,
      pending: products.filter(p => p.status === 'Under Review').length,
      lowStock: products.filter(p => p.stock < 10).length
    };
  }, [products]);

  const toggleProductStatus = (id) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newStatus = p.status === 'Published' ? 'Draft' : 'Published';
        toast.info(`Ürün durumu "${newStatus === 'Published' ? 'Yayında' : 'Pasif'}" olarak güncellendi`);
        return { ...p, status: newStatus };
      }
      return p;
    }));
  };

  const copyProduct = (product) => {
    const newProduct = {
      ...product,
      id: Math.max(...products.map(p => p.id)) + 1,
      name: `${product.name} (Kopya)`,
      status: 'Draft',
      sales: 0,
      rating: 0
    };
    setProducts([newProduct, ...products]);
    toast.success('Ürün başarıyla kopyalandı');
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(filteredProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const bulkUpdatePrice = () => {
    const amount = prompt('Seçili ürünlere eklenecek/çıkarılacak fiyat farkı (örn: +10 veya -10):');
    if (!amount) return;
    
    setProducts(prev => prev.map(p => {
      if (selectedProducts.includes(p.id)) {
        const val = parseInt(amount);
        return { ...p, price: Math.max(0, p.price + val) };
      }
      return p;
    }));
    toast.success('Seçili ürünlerin fiyatları güncellendi');
  };

  const bulkUpdateStock = () => {
    const amount = prompt('Seçili ürünlerin yeni stok adedi:');
    if (amount === null) return;
    
    const val = parseInt(amount);
    if (isNaN(val)) return;

    setProducts(prev => prev.map(p => {
      if (selectedProducts.includes(p.id)) {
        return { ...p, stock: val };
      }
      return p;
    }));
    toast.success('Seçili ürünlerin stokları güncellendi');
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-white flex items-center gap-3">
            <Package className="w-8 h-8 text-amber-600" />
            Ürün Yönetimi
            </h1>
            <p className="text-stone-500 dark:text-stone-400 mt-1">Mağazanızdaki ürünleri buradan yönetebilirsiniz.</p>
          </div>
          <Link 
            to="/satici/urun-ekle"
            className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/25 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Yeni Ürün Ekle
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Toplam Ürün', value: stats.total, icon: <Package className="text-amber-500" />, trend: '+3', isPositive: true },
            { label: 'Yayında', value: stats.published, icon: <CheckCircle2 className="text-green-500" />, trend: '+1', isPositive: true },
            { label: 'Onay Bekleyen', value: stats.pending, icon: <Clock className="text-orange-500" />, trend: '0', isPositive: true },
            { label: 'Kritik Stok', value: stats.lowStock, icon: <AlertTriangle className="text-red-500" />, trend: '+2', isPositive: false },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-gray-100 dark:border-stone-800 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-gray-50 dark:bg-stone-800 rounded-lg">
                  {React.cloneElement(stat.icon, { className: 'w-6 h-6' })}
                </div>
                <div className={`flex items-center gap-0.5 text-xs font-bold ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
                </div>
              </div>
              <h3 className="text-stone-500 dark:text-stone-400 text-sm font-medium">{stat.label}</h3>
              <p className="text-2xl font-bold text-stone-900 dark:text-white mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-gray-100 dark:border-stone-800 shadow-xl overflow-hidden">
          
          {/* Toolbar */}
          <div className="p-6 border-b border-gray-100 dark:border-stone-800">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <input 
                    type="text" 
                    placeholder="Ürün adı veya marka ara..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-stone-800 border-none rounded-xl focus:ring-2 focus:ring-amber-500 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {['All', 'Published', 'Under Review', 'Draft', 'Rejected'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border
                        ${filterStatus === status 
                          ? 'bg-stone-900 dark:bg-white text-white dark:text-black border-stone-900 dark:border-white' 
                          : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-gray-200 dark:border-stone-700 hover:border-stone-400'}`}
                    >
                      {status === 'All' ? 'Tümü' : STATUS_LABELS[status].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedProducts.length > 0 && (
                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4">
                  <span className="text-sm font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-3 py-1.5 rounded-lg border border-amber-100 dark:border-amber-800">
                    {selectedProducts.length} Seçildi
                  </span>
                  <div className="h-8 w-[1px] bg-gray-200 dark:bg-stone-700 mx-1"></div>
                  <button 
                    onClick={bulkUpdatePrice}
                    className="p-2 text-stone-600 dark:text-stone-400 hover:bg-gray-100 dark:hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                    title="Fiyat Güncelle"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span className="hidden sm:inline">Toplu Fiyat</span>
                  </button>
                  <button 
                    onClick={bulkUpdateStock}
                    className="p-2 text-stone-600 dark:text-stone-400 hover:bg-gray-100 dark:hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                    title="Stok Güncelle"
                  >
                    <Package className="w-4 h-4" />
                    <span className="hidden sm:inline">Toplu Stok</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-stone-800/50 text-stone-400 text-[11px] font-bold uppercase tracking-widest">
                  <th className="px-6 py-4 w-12 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      onChange={handleSelectAll}
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    />
                  </th>
                  <th className="px-6 py-4">Ürün Bilgisi</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Fiyat</th>
                  <th className="px-6 py-4">Stok</th>
                  <th className="px-6 py-4">Durum</th>
                  <th className="px-6 py-4 text-center">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-stone-800">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/30 dark:hover:bg-stone-800/30 transition-colors group">
                    <td className="px-6 py-5 text-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectOne(product.id)}
                      />
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                          <img src={product.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold text-stone-900 dark:text-white truncate group-hover:text-amber-600 transition-colors">
                            {product.name}
                          </span>
                          <span className="text-[11px] text-stone-500 font-medium uppercase">{product.brand}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-semibold text-stone-600 dark:text-stone-400 bg-gray-100 dark:bg-stone-800 px-2 py-1 rounded-md">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-stone-900 dark:text-white">
                          {product.price.toLocaleString('tr-TR')} ₺
                        </span>
                        {product.discountedPrice && (
                          <span className="text-[10px] text-red-500 font-bold line-through">
                            {product.discountedPrice.toLocaleString('tr-TR')} ₺
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className={`text-sm font-bold ${product.stock < 10 ? 'text-red-500' : 'text-stone-700 dark:text-stone-300'}`}>
                          {product.stock} Adet
                        </span>
                        <div className="w-16 h-1 w-full bg-gray-100 dark:bg-stone-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${product.stock < 10 ? 'bg-red-500' : 'bg-green-500'}`} 
                            style={{ width: `${Math.min(100, product.stock)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-transparent ${STATUS_LABELS[product.status].color}`}>
                        {STATUS_LABELS[product.status].icon}
                        {STATUS_LABELS[product.status].label}
                      </div>
                      {product.status === 'Rejected' && (
                        <p className="text-[10px] text-red-500 mt-1 font-medium italic max-w-[150px] truncate" title={product.rejectReason}>
                          Sebep: {product.rejectReason}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <Link 
                          to={`/satici/urun-duzenle/${product.id}`}
                          className="p-2 text-stone-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all inline-flex"
                          title="Düzenle"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => copyProduct(product)}
                          className="p-2 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all"
                          title="Kopyala"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => toggleProductStatus(product.id)}
                          className={`p-2 rounded-lg transition-all ${product.status === 'Published' ? 'text-stone-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20' : 'text-emerald-500 hover:bg-emerald-50' }`}
                          title={product.status === 'Published' ? 'Pasif Yap' : 'Aktif Yap'}
                        >
                          {product.status === 'Published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <div className="relative group/more">
                           <button className="p-2 text-stone-400 hover:text-stone-900 dark:hover:text-white rounded-lg transition-all">
                              <MoreVertical className="w-4 h-4" />
                           </button>
                           <div className="absolute right-0 top-full mt-1 hidden group-hover/more:block z-20 bg-white dark:bg-stone-800 shadow-xl border border-gray-100 dark:border-stone-700 rounded-xl overflow-hidden min-w-[140px]">
                              <button onClick={() => toast.error('Silme işlemi onay gerektirir')} className="w-full px-4 py-2.5 text-left text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-2">
                                <Trash2 className="w-4 h-4" /> Sil
                              </button>
                           </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-gray-50 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-stone-300" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white">Sonuç bulunamadı</h3>
              <p className="text-stone-500 mt-1 max-w-xs mx-auto">Arama kriterlerinize uygun ürün bulunamadı. Lütfen filtreleri kontrol edin.</p>
            </div>
          )}

          {/* Table Footer / Pagination */}
          <div className="p-6 bg-gray-50/50 dark:bg-stone-800/30 border-t border-gray-100 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">
              Görüntülenen: <span className="text-stone-900 dark:text-white">{filteredProducts.length}</span> / {products.length} Ürün
            </span>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-400 cursor-not-allowed">
                Geri
              </button>
              <button className="px-4 py-2 bg-stone-900 dark:bg-white text-white dark:text-black border border-stone-800 rounded-xl text-xs font-bold active:scale-95 transition-all">
                1
              </button>
              <button className="px-4 py-2 bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-600 hover:border-black transition-all">
                İleri
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductManagement;
