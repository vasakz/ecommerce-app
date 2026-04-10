import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
  ArrowLeft, 
  Upload, 
  Trash2, 
  Plus, 
  Info, 
  ChevronRight, 
  Box, 
  Truck, 
  Tag, 
  Layers, 
  CheckCircle2,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  DollarSign,
  Maximize,
  Package
} from 'lucide-react';
import { toast } from 'react-toastify';

const CATEGORIES = ['Giyim', 'Elektronik', 'Kozmetik', 'Aksesuar', 'Ev & Yaşam', 'Spor'];
const SUB_CATEGORIES = {
  'Giyim': ['Tişört', 'Pantolon', 'Elbise', 'Ceket', 'Hırka', 'Etek'],
  'Elektronik': ['Telefon', 'Bilgisayar', 'Aksesuar', 'Kulaklık', 'Saat'],
  'Kozmetik': ['Makyaj', 'Cilt Bakımı', 'Parfüm', 'Saç Bakımı'],
  'Aksesuar': ['Takı', 'Çanta', 'Cüzdan', 'Kemer', 'Gözlük'],
  'Ev & Yaşam': ['Dekorasyon', 'Mutfak', 'Aydınlatma', 'Tekstil'],
  'Spor': ['Ayakkabı', 'Ekipman', 'Giyim', 'Besin Takviyesi']
};
const BRANDS = ['ModaZen', 'TechPro', 'TimeLess', 'EcoWear', 'SecureHome', 'Diğer'];
const COLOR_OPTIONS = ['Siyah', 'Beyaz', 'Lacivert', 'Kırmızı', 'Mavi', 'Bej', 'Gri', 'Yeşil', 'Sarı'];
const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'Standart', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

const AddProduct = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [activeStep, setActiveStep] = useState(1);
  const [showSummary, setShowSummary] = useState(false);
  const [formData, setFormData] = useState(null);

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      variants: [{ color: '', size: '', stock: '' }],
      tags: '',
      status: 'Under Review'
    }
  });

  const selectedCategory = watch('category');

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants"
  });

  const onSubmit = (data) => {
    setFormData({ ...data, images });
    setShowSummary(true);
  };

  const handleFinalSubmit = () => {
    console.log('Final Product Data:', formData);
    toast.success('Ürün başarıyla oluşturuldu ve onaya gönderildi!');
    setTimeout(() => navigate('/satici/urunler'), 2000);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const steps = [
    { id: 1, label: 'Temel Bilgiler', icon: <FileText className="w-5 h-5" /> },
    { id: 2, label: 'Görsel & Varyant', icon: <Layers className="w-5 h-5" /> },
    { id: 3, label: 'Kargo & Detay', icon: <Truck className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/satici/urunler')}
            className="flex items-center gap-2 text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors group"
          >
            <div className="p-2 bg-white dark:bg-stone-900 rounded-lg border border-gray-100 dark:border-stone-800 shadow-sm group-hover:bg-gray-50 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm">Ürün Listesine Dön</span>
          </button>
          
          <div className="flex items-center gap-2">
             <div className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${activeStep === 3 ? 'bg-green-500 text-white border-green-500' : 'bg-white dark:bg-stone-900 text-stone-500 border-gray-100 dark:border-stone-800'}`}>
                {activeStep === 3 ? 'Hazır!' : 'Yayına Alınacak'}
             </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-stone-900 dark:text-white mb-3 tracking-tight">Yeni Ürün Ekle</h1>
          <p className="text-stone-500 dark:text-stone-400 font-medium">Satışa başlamak için ürün detaylarını doldurun.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-12 px-4">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div 
                className={`flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 ${activeStep >= step.id ? 'scale-110' : 'opacity-40'}`}
                onClick={() => setActiveStep(step.id)}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all ${activeStep >= step.id ? 'bg-blue-600 text-white shadow-blue-500/30' : 'bg-white dark:bg-stone-800 text-stone-400'}`}>
                  {step.icon}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${activeStep >= step.id ? 'text-blue-600' : 'text-stone-400'}`}>{step.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-[2px] w-12 sm:w-20 mx-4 transition-all duration-500 ${activeStep > step.id ? 'bg-blue-600' : 'bg-gray-200 dark:bg-stone-800'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Step 1: Basic Info */}
          {activeStep === 1 && (
            <div className="bg-white dark:bg-stone-900 rounded-3xl border border-gray-100 dark:border-stone-800 shadow-xl p-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Ürün Adı */}
                <div className="col-span-full space-y-2">
                  <label className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                    Ürün Adı <Info className="w-3 h-3 text-stone-400" />
                  </label>
                  <input 
                    {...register("name", { required: "Ürün adı zorunludur" })}
                    type="text" 
                    placeholder="Örn: Klasik Deri Ceket"
                    className={`w-full px-5 py-4 bg-gray-50 dark:bg-stone-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium ${errors.name ? 'ring-2 ring-red-500' : ''}`}
                  />
                  {errors.name && <span className="text-[10px] text-red-500 font-bold uppercase">{errors.name.message}</span>}
                </div>

                {/* Marka Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-widest">Marka</label>
                  <select 
                    {...register("brand", { required: "Marka seçiniz" })}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-stone-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium appearance-none"
                  >
                    <option value="">Marka Seçin</option>
                    {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                {/* Kategori Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-widest">Kategori</label>
                  <select 
                    {...register("category", { required: "Kategori seçiniz" })}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-stone-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium appearance-none"
                  >
                    <option value="">Kategori Seçin</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Alt Kategori Selection */}
                <div className={`space-y-2 transition-all duration-300 ${selectedCategory ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                  <label className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-widest text-[#7c3aed]">Alt Kategori</label>
                  <select 
                    {...register("subCategory", { required: selectedCategory ? "Alt kategori seçiniz" : false })}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-stone-800 border-none rounded-2xl focus:ring-2 focus:ring-[#7c3aed] font-medium appearance-none border border-[#7c3aed]/20"
                  >
                    <option value="">Alt Kategori Seçin</option>
                    {selectedCategory && SUB_CATEGORIES[selectedCategory]?.map(sc => (
                      <option key={sc} value={sc}>{sc}</option>
                    ))}
                  </select>
                </div>

                {/* Fiyat ve İndirimli Fiyat */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                     Normal Fiyat <DollarSign className="w-3 h-3 text-emerald-500" />
                  </label>
                  <div className="relative">
                    <input 
                       {...register("price", { required: true })}
                       type="number" 
                       placeholder="0.00"
                       className="w-full pl-12 pr-5 py-4 bg-gray-50 dark:bg-stone-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium appearance-none no-spinner"
                    />
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 font-bold">₺</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-widest">İndirimli Fiyat (Opsiyonel)</label>
                  <div className="relative">
                    <input 
                       {...register("discountedPrice")}
                       type="number" 
                       placeholder="0.00"
                       className="w-full pl-12 pr-5 py-4 bg-gray-50 dark:bg-stone-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium appearance-none no-spinner"
                    />
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 font-bold">₺</div>
                  </div>
                </div>

                {/* Açıklama */}
                <div className="col-span-full space-y-2">
                  <label className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-widest">Ürün Açıklaması</label>
                  <textarea 
                    {...register("description")}
                    rows={6}
                    placeholder="Ürününüzün özelliklerini ve detaylarını buraya yazın..."
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-stone-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium resize-none"
                  />
                </div>
              </div>

              <div className="mt-12 flex justify-end">
                <button 
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="bg-stone-900 dark:bg-white text-white dark:text-black px-10 py-4 rounded-2xl font-bold hover:bg-stone-800 dark:hover:bg-gray-100 transition-all flex items-center gap-3 shadow-lg group active:scale-95"
                >
                  Sonraki Adım
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Images and Variants */}
          {activeStep === 2 && (
            <div className="bg-white dark:bg-stone-900 rounded-3xl border border-gray-100 dark:border-stone-800 shadow-xl p-8 animate-in fade-in slide-in-from-bottom-4">
              
              {/* Görsel Yükleme */}
              <div className="mb-12">
                <label className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-widest mb-4 block">Ürün Görselleri (En az 1 tane)</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {images.map((img) => (
                    <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-gray-100 dark:border-stone-800 group">
                      <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {images.length < 8 && (
                    <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 dark:border-stone-800 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-500 hover:bg-blue-50/10 transition-all text-stone-400 hover:text-blue-600 group">
                      <input type="file" multiple className="hidden" onChange={handleImageUpload} accept="image/*" />
                      <div className="p-3 bg-gray-50 dark:bg-stone-800 rounded-xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest">Görsel Ekle</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Varyant Tanımlama */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-stone-800 pb-4">
                  <label className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                    Varyantlar (Renk, Beden vb.) <Layers className="w-3 h-3 text-blue-500" />
                  </label>
                  <button 
                    type="button"
                    onClick={() => append({ color: '', size: '', stock: '' })}
                    className="flex items-center gap-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                  >
                    <Plus className="w-4 h-4" /> Yeni Varyant
                  </button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-12 gap-x-4 gap-y-2 items-end p-5 bg-gray-50 dark:bg-stone-800 rounded-2xl animate-in fade-in slide-in-from-top-2">
                      <div className="col-span-12 sm:col-span-4 space-y-2">
                        <label className="text-[10px] font-bold text-stone-400 uppercase">Renk</label>
                        <select 
                          {...register(`variants.${index}.color`)}
                          className="w-full px-4 py-3 bg-white dark:bg-stone-900 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-bold appearance-none"
                        >
                          <option value="">Seçiniz</option>
                          {COLOR_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="col-span-12 sm:col-span-3 space-y-2">
                        <label className="text-[10px] font-bold text-stone-400 uppercase">Beden / Özellik</label>
                        <select 
                          {...register(`variants.${index}.size`)}
                          className="w-full px-4 py-3 bg-white dark:bg-stone-900 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-bold appearance-none"
                        >
                          <option value="">Seçiniz</option>
                          {SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="col-span-8 sm:col-span-3 space-y-2">
                        <label className="text-[10px] font-bold text-stone-400 uppercase">Stok Adedi</label>
                        <input 
                          {...register(`variants.${index}.stock`)}
                          type="number"
                          placeholder="0"
                          className="w-full px-4 py-3 bg-white dark:bg-stone-900 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-bold"
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2 pb-0.5 flex justify-end">
                        <button 
                          type="button"
                          onClick={() => remove(index)}
                          className="p-3 bg-white dark:bg-stone-900 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all shadow-sm active:scale-90"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 flex justify-between">
                <button 
                   type="button"
                   onClick={() => setActiveStep(1)}
                   className="px-8 py-4 text-stone-500 hover:text-black dark:text-stone-400 dark:hover:text-white font-bold transition-colors flex items-center gap-2 group"
                >
                   <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
                   Geri
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="bg-stone-900 dark:bg-white text-white dark:text-black px-10 py-4 rounded-2xl font-bold hover:bg-stone-800 dark:hover:bg-gray-100 transition-all flex items-center gap-3 shadow-lg group active:scale-95"
                >
                  Sonraki Adım
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Shipping & Tags */}
          {activeStep === 3 && (
            <div className="bg-white dark:bg-stone-900 rounded-3xl border border-gray-100 dark:border-stone-800 shadow-xl p-8 animate-in fade-in slide-in-from-bottom-4">
              
              {/* Kargo Bilgileri */}
              <div className="mb-12">
                <h3 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-stone-800 pb-4">
                   Kargo ve Paketleme Bilgisi <Maximize className="w-4 h-4 text-orange-500" />
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-stone-400 uppercase">Ağırlık (kg)</label>
                      <input 
                        {...register("weight")}
                        type="number"
                        step="0.1"
                        placeholder="0.5"
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-stone-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-stone-400 uppercase">Boyutlar (G x Y x D cm)</label>
                      <input 
                        {...register("dimensions")}
                        placeholder="20x30x10"
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-stone-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold"
                      />
                   </div>
                   <div className="space-y-2">
                       <label className="text-[10px] font-bold text-stone-400 uppercase">Hazırlanış Süresi (Gün)</label>
                       <input 
                        {...register("leadTime")}
                        type="number"
                        placeholder="2"
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-stone-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold"
                      />
                   </div>
                </div>
              </div>

              {/* Etiketler */}
              <div className="mb-12">
                <h3 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-stone-800 pb-4">
                   Arama Anahtar Kelimeleri / Etiketler <Tag className="w-4 h-4 text-purple-500" />
                </h3>
                <div className="space-y-2">
                  <textarea 
                    {...register("tags")}
                    rows={3}
                    placeholder="Kelimeleri virgül ile ayırın (Örn: deri, ceket, kışlık, siyah)"
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-stone-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium resize-none shadow-inner"
                  />
                  <p className="text-[10px] text-stone-400 font-bold px-2 italic">Arama sonuçlarında üst sıralarda çıkmak için alakalı kelimeler ekleyin.</p>
                </div>
              </div>

              {/* Durum Seçimi (Hidden or internal but exposed for demo) */}
              <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-950 flex flex-col sm:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-4 text-blue-600">
                    <div className="p-3 bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-blue-100 dark:border-blue-900">
                       <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                       <h4 className="text-sm font-bold tracking-tight">Onaya Gönderilmeye Hazır</h4>
                       <p className="text-[11px] font-medium opacity-80">Ürününüz admin panelinde incelenecektir.</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase text-stone-500 tracking-widest">Durum:</span>
                    <div className="px-4 py-2 bg-white dark:bg-stone-800 text-blue-600 rounded-xl text-xs font-black shadow-sm border border-blue-50 dark:border-blue-900">
                       İNCELENİYOR
                    </div>
                 </div>
              </div>

              <div className="mt-12 flex justify-between">
                <button 
                   type="button"
                   onClick={() => setActiveStep(2)}
                   className="px-8 py-4 text-stone-500 hover:text-black dark:text-stone-400 dark:hover:text-white font-bold transition-colors flex items-center gap-2 group"
                >
                   <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
                   Geri
                </button>
                <button 
                  type="submit"
                  className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-3 shadow-lg shadow-blue-500/30 group active:scale-95"
                >
                  <Package className="w-5 h-5" />
                  Ürünü Kaydet ve Bitir
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Summary Modal */}
      {showSummary && formData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-stone-800 animate-in zoom-in-95 duration-300">
            
            <div className="p-8 border-b border-gray-100 dark:border-stone-800 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-stone-900 dark:text-white">Ürün Özeti</h2>
                <p className="text-stone-500 font-medium text-sm">Lütfen bilgileri son kez kontrol edin.</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8 bg-gray-50/50 dark:bg-stone-950/30">
              
              {/* Product Info Card */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white dark:bg-stone-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-stone-800">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Ürün Adı</p>
                  <p className="font-bold text-stone-900 dark:text-white line-clamp-1">{formData.name}</p>
                </div>
                <div className="bg-white dark:bg-stone-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-stone-800">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Kategori / Alt Kategori</p>
                  <p className="font-bold text-stone-900 dark:text-white">{formData.category} / {formData.subCategory}</p>
                </div>
                <div className="bg-white dark:bg-stone-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-stone-800">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Fiyat</p>
                  <p className="font-bold text-emerald-500">₺{formData.price}</p>
                </div>
                <div className="bg-white dark:bg-stone-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-stone-800">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Marka</p>
                  <p className="font-bold text-stone-900 dark:text-white">{formData.brand}</p>
                </div>
              </div>

              {/* Images Preview */}
              <div>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 px-2">Yüklenen Görseller ({formData.images.length})</p>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {formData.images.map(img => (
                    <img key={img.id} src={img.url} className="w-20 h-20 object-cover rounded-2xl flex-shrink-0 border border-gray-100 dark:border-stone-800 shadow-sm" alt="Preview" />
                  ))}
                </div>
              </div>

              {/* Variants */}
              <div>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 px-2">Varyantlar</p>
                <div className="bg-white dark:bg-stone-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-stone-800 shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-stone-900/50 text-stone-400 text-[10px] uppercase font-black tracking-widest">
                      <tr>
                        <th className="px-5 py-3">Renk</th>
                        <th className="px-5 py-3">Beden</th>
                        <th className="px-5 py-3">Stok</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-stone-900">
                      {formData.variants.map((v, i) => (
                        <tr key={i} className="text-stone-900 dark:text-gray-200">
                          <td className="px-5 py-3 font-bold">{v.color || '-'}</td>
                          <td className="px-5 py-3 font-bold">{v.size || '-'}</td>
                          <td className="px-5 py-3 font-bold">{v.stock || '0'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tags & Shipping Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-amber-50/50 dark:bg-amber-900/10 p-5 rounded-3xl border border-amber-100 dark:border-amber-900/30">
                  <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Tag className="w-3 h-3" /> Anahtar Kelimeler
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.tags.split(',').map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-white dark:bg-stone-800 rounded-lg text-[10px] font-bold text-stone-600 dark:text-stone-400 border border-amber-100 dark:border-stone-700">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-3xl border border-blue-100 dark:border-blue-900/30">
                  <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Truck className="w-3 h-3" /> Lojistik Bilgileri
                  </p>
                  <p className="text-xs font-bold text-stone-700 dark:text-stone-300">Ağırlık: {formData.weight} kg</p>
                  <p className="text-xs font-bold text-stone-700 dark:text-stone-300">Boyutlar: {formData.dimensions} cm</p>
                </div>
              </div>

              {/* Approval Guidelines */}
              <div className="bg-red-50/50 dark:bg-red-900/5 p-6 rounded-3xl border border-red-100/50 dark:border-red-900/20">
                <h4 className="flex items-center gap-2 text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-widest mb-3">
                  <AlertCircle className="w-4 h-4" /> Önemli: Onay Süreci Bilgilendirmesi
                </h4>
                <ul className="text-[11px] space-y-2 text-stone-600 dark:text-stone-400 font-medium">
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-red-400 mt-1.5" />
                    <span>Hatalı veya abartılı **anahtar kelime** kullanımı ürünün engellenmesine sebep olabilir.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-red-400 mt-1.5" />
                    <span>Lojistik boyutlarının (G x Y x D) yanlış girilmesi durumunda kargo aşamasında ek ücretler doğabilir.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-red-400 mt-1.5" />
                    <span>Yanıltıcı veya düşük kaliteli ürün görselleri onay sürecini uzatabilir veya reddedilmeyle sonuçlanabilir.</span>
                  </li>
                </ul>
              </div>

            </div>

            <div className="p-8 border-t border-gray-100 dark:border-stone-800 bg-white dark:bg-stone-900 flex gap-4">
              <button 
                onClick={() => setShowSummary(false)}
                className="flex-1 py-4 px-6 border border-gray-200 dark:border-stone-800 rounded-2xl font-bold text-stone-500 hover:bg-gray-50 dark:hover:bg-stone-800 transition-all active:scale-95"
              >
                Düzenle
              </button>
              <button 
                onClick={handleFinalSubmit}
                className="flex-[2] py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Onayla ve Kaydet
                <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
