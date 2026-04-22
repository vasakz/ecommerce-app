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
  ChevronDown,
  Hammer,
  Maximize2,
  Brush,
  FileText,
  Image as ImageIcon,
  DollarSign,
  Package,
  History,
  ShieldCheck,
  Sparkles,
  Scissors
} from 'lucide-react';
import { toast } from 'react-toastify';

const ATOLYE_CATEGORIES = ['Deri', 'Mutfak & Sofra', 'Ev Yaşam & Dekor', 'Tekstil & Giyim', 'Oyuncak & Çocuk'];
const ATOLYE_SUB_CATEGORIES = {
  'Deri': ['Çanta & Cüzdan', 'Kemer & Aksesuar', 'Deri Defter Kapağı'],
  'Mutfak & Sofra': ['Ahşap Mutfak Gereçleri', 'El Yapımı Seramik', 'Doğal Taş Sunumluk'],
  'Ev Yaşam & Dekor': ['Mum & Oda Kokusu', 'Makrome & Dokuma', 'El Yapımı Yastık', 'Duvar Dekoru'],
  'Tekstil & Giyim': ['Örgü & Tığ İşi', 'Ismarlama Dikiş', 'El Boyaması Kumaş'],
  'Oyuncak & Çocuk': ['Amigurumi Oyuncak', 'Ahşap Oyun Seti', 'Bez Bebek']
};

const AddAtolyeProduct = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [activeStep, setActiveStep] = useState(1);
  const [showSummary, setShowSummary] = useState(false);
  const [formData, setFormData] = useState(null);

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      customizableOptions: [
        { label: 'İsim/Harf Kazıma', price: '100', type: 'text' },
        { label: 'Premium Hediye Paketi', price: '50', type: 'note' }
      ],
      productionType: 'handmade',
      leadTime: '3-5'
    }
  });

  const selectedCategory = watch('category');

  const { fields: customizationFields, append: appendCustom, remove: removeCustom } = useFieldArray({
    control,
    name: "customizableOptions"
  });

  const onSubmit = (data) => {
    setFormData({ ...data, images });
    setShowSummary(true);
  };

  const handleFinalSubmit = () => {
    console.log('Workshop Product Created:', formData);
    toast.success('Atölye ürününüz başarıyla oluşturuldu!');
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
    { id: 1, label: 'Tasarım Bilgisi', icon: <Hammer className="w-5 h-5" /> },
    { id: 2, label: 'Atölye Detayları', icon: <Sparkles className="w-5 h-5" /> },
    { id: 3, label: 'Özelleştirme', icon: <Scissors className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors group"
          >
            <div className="p-2 bg-white rounded-lg border border-stone-200 shadow-sm group-hover:bg-stone-50">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs">Geri Dön</span>
          </button>
          
          <div className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-2">
            <ShieldCheck size={12} /> ATÖLYE ÖZEL PANELİ
          </div>
        </div>

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-serif text-stone-900 mb-3 tracking-tight">Yeni Atölye Tasarımı Ekle</h1>
          <p className="text-stone-500 font-medium">Zanaatkar elinden çıkan eserleri hikayesiyle birlikte sergileyin.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-12 px-4">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div 
                className={`flex flex-col items-center gap-2 transition-all duration-300 ${activeStep >= step.id ? 'scale-110' : 'opacity-40'}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all ${activeStep >= step.id ? 'bg-amber-600 text-white shadow-amber-600/30' : 'bg-white text-stone-400'}`}>
                  {step.icon}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${activeStep >= step.id ? 'text-amber-700' : 'text-stone-400'}`}>{step.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-[2px] w-12 sm:w-20 mx-4 transition-all duration-500 ${activeStep > step.id ? 'bg-amber-600' : 'bg-stone-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Step 1: Basic Artisan Info */}
          {activeStep === 1 && (
            <div className="bg-white rounded-3xl border border-stone-100 shadow-xl p-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="col-span-full space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Tasarım Adı</label>
                  <input 
                    {...register("name", { required: "İsim zorunludur" })}
                    type="text" 
                    placeholder="Örn: İsme Özel Vintage Deri Çanta"
                    className="w-full px-6 py-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 transition-all font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Kategori</label>
                  <div className="relative">
                    <select 
                      {...register("category", { required: "Kategori seçiniz" })}
                      className="w-full px-6 py-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 font-medium appearance-none"
                    >
                      <option value="">Seçin</option>
                      {ATOLYE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 w-5 h-5" />
                  </div>
                </div>

                <div className={`space-y-2 transition-all duration-300 ${selectedCategory ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                  <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Alt Kategori</label>
                  <div className="relative">
                    <select 
                      {...register("subCategory", { required: selectedCategory ? "Alt kategori seçiniz" : false })}
                      className="w-full px-6 py-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 font-medium appearance-none"
                    >
                      <option value="">Alt Kategori Seçin</option>
                      {selectedCategory && ATOLYE_SUB_CATEGORIES[selectedCategory]?.map(sc => (
                        <option key={sc} value={sc}>{sc}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-amber-600/50 w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Taban Fiyat (Başlayan Fiyat)</label>
                  <div className="relative">
                    <input 
                       {...register("basePrice", { required: true })}
                       type="number" 
                       placeholder="0.00"
                       className="w-full pl-12 pr-6 py-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 font-bold"
                    />
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-400 font-bold">₺</div>
                  </div>
                </div>

                <div className="col-span-full space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Tasarım Hikayesi (Müşteriyi Etkileyin)</label>
                  <textarea 
                    {...register("story")}
                    rows={4}
                    placeholder="Bu ürün nasıl ortaya çıktı? Hangi duyguları temsil ediyor?.."
                    className="w-full px-6 py-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 font-medium resize-none shadow-inner"
                  />
                </div>
              </div>

              <div className="mt-12 flex justify-end">
                <button 
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="bg-amber-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-amber-700 transition-all flex items-center gap-3 shadow-lg group"
                >
                  Sonraki Adım
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Workshop Details */}
          {activeStep === 2 && (
            <div className="bg-white rounded-3xl border border-stone-100 shadow-xl p-8 animate-fade-in">
              
              <div className="mb-10">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4 block">Tasarım Görselleri</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {images.map((img) => (
                    <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden group border-2 border-stone-100">
                      <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(img.id)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  {images.length < 10 && (
                    <label className="aspect-square rounded-2xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-all text-stone-400 hover:text-amber-600">
                      <input type="file" multiple className="hidden" onChange={handleImageUpload} accept="image/*" />
                      <Upload size={24} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Eseri Yükle</span>
                    </label>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2 mb-2">
                    <Maximize2 size={16} className="text-amber-600" /> Üretim Limitleri (Cm)
                  </h3>
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-1">
                       <label className="text-[10px] font-bold text-stone-400 uppercase">Minimum</label>
                       <input {...register("minSize")} type="number" placeholder="10" className="w-full p-4 bg-stone-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500 text-sm font-bold" />
                    </div>
                    <div className="flex-1 space-y-1">
                       <label className="text-[10px] font-bold text-stone-400 uppercase">Maximum</label>
                       <input {...register("maxSize")} type="number" placeholder="100" className="w-full p-4 bg-stone-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500 text-sm font-bold" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2 mb-2">
                    <History size={16} className="text-amber-600" /> Tahmini Üretim Süresi
                  </h3>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase">Kaç İş Günü?</label>
                    <input {...register("leadTime")} type="text" placeholder="Örn: 3-5 İş Günü" className="w-full p-4 bg-stone-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500 text-sm font-bold" />
                  </div>
                </div>
              </div>

              <div className="space-y-2 col-span-full">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                   <Brush size={14} className="text-amber-600" /> Bakım Önerileri & Kılavuz
                </label>
                <textarea 
                  {...register("careGuidelines")}
                  rows={3}
                  placeholder="Müşteriye bu tasarımı nasıl koruması gerektiğini anlatın..."
                  className="w-full px-6 py-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 font-medium resize-none shadow-inner"
                />
              </div>

              <div className="mt-12 flex justify-between">
                <button type="button" onClick={() => setActiveStep(1)} className="px-8 py-4 text-stone-500 hover:text-stone-900 font-bold flex items-center gap-2 transition-all">
                   <ArrowLeft size={18} /> Geri
                </button>
                <button type="button" onClick={() => setActiveStep(3)} className="bg-amber-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-amber-700 transition-all flex items-center gap-3 shadow-lg">
                  Sonraki Adım <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Customization Options */}
          {activeStep === 3 && (
            <div className="bg-white rounded-3xl border border-stone-100 shadow-xl p-8 animate-fade-in">
              
              <div className="mb-10">
                <div className="flex items-center justify-between border-b border-stone-50 pb-4 mb-6">
                  <h3 className="text-sm font-black text-stone-800 uppercase tracking-widest flex items-center gap-2">
                    <Plus size={18} className="text-amber-600" /> Özelleştirme Servisleri
                  </h3>
                  <button 
                    type="button" 
                    onClick={() => appendCustom({ label: '', price: '0', type: 'text' })}
                    className="text-[10px] font-black tracking-widest bg-amber-50 text-amber-700 px-4 py-2 rounded-full hover:bg-amber-100 transition-all"
                  >
                    + SERVİS EKLE
                  </button>
                </div>

                <div className="space-y-4">
                  {customizationFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-12 gap-4 items-end bg-stone-50 p-6 rounded-2xl animate-fade-in relative group transition-all hover:bg-stone-100/50">
                      <div className="col-span-12 md:col-span-6 space-y-2">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Servis / Seçenek Adı</label>
                        <input {...register(`customizableOptions.${index}.label`)} placeholder="Örn: İsim Kazıma" className="w-full p-4 bg-white border border-stone-100 rounded-xl focus:ring-2 focus:ring-amber-500 text-sm font-bold" />
                      </div>
                      <div className="col-span-8 md:col-span-4 space-y-2">
                         <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Ek Ücret</label>
                         <div className="relative">
                            <input {...register(`customizableOptions.${index}.price`)} type="number" placeholder="0" className="w-full pl-10 pr-4 py-4 bg-white border border-stone-100 rounded-xl focus:ring-2 focus:ring-amber-500 text-sm font-bold" />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-xs">₺</div>
                         </div>
                      </div>
                      <div className="col-span-4 md:col-span-2 flex justify-end">
                        <button type="button" onClick={() => removeCustom(index)} className="p-4 text-stone-300 hover:text-red-500 transition-all group-hover:scale-110">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-inner shrink-0 rotate-12">
                   <Hammer className="text-amber-500 w-10 h-10" />
                </div>
                <div>
                   <h4 className="text-lg font-black text-amber-900 mb-2 tracking-tight flex items-center gap-2 italic uppercase">
                      Zanaatkar Onayı & Süreç
                   </h4>
                   <p className="text-amber-700/80 text-xs font-medium leading-relaxed">
                      Atölye ürünleri standart siparişlerden farklı değerlendirilir. Her parça el yapımı olduğu için girilen **'Hazırlanış Süresi'** müşteri için kritiktir. Yanıltıcı süreler mağaza puanınızı olumsuz etkileyebilir.
                   </p>
                </div>
              </div>

              <div className="mt-12 flex justify-between">
                <button type="button" onClick={() => setActiveStep(2)} className="px-8 py-4 text-stone-500 hover:text-stone-900 font-bold flex items-center gap-2">
                   <ArrowLeft size={18} /> Geri
                </button>
                <button type="submit" className="bg-amber-600 text-white px-12 py-4 rounded-2xl font-bold hover:bg-amber-700 transition-all flex items-center gap-3 shadow-xl shadow-amber-600/10">
                  <Package size={20} className="text-white" /> Atölye Tasarımını Yayınla
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Summary Modal (Brief) */}
      {showSummary && formData && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xl animate-fade-in">
          <div className="bg-white rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl flex flex-col border border-stone-200 animate-scale-in">
            <div className="p-8 pb-0 flex justify-between items-start">
               <div>
                 <h2 className="text-2xl font-black text-stone-900 uppercase italic tracking-tight">Tasarım <span className="text-amber-500">Özeti</span></h2>
                 <p className="text-stone-400 text-[10px] font-bold tracking-[0.2em] uppercase mt-1">Yayınlanmadan Önce Son Kontrol</p>
               </div>
               <Hammer className="text-stone-100 w-24 h-24 absolute -right-2 -top-2" />
            </div>

            <div className="p-8 space-y-6">
               <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100 space-y-4">
                  <div className="flex justify-between items-center border-b border-stone-200/50 pb-3">
                    <span className="text-[10px] font-black text-stone-400 uppercase">Tasarım</span>
                    <span className="text-sm font-black text-stone-900">{formData.name}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-stone-200/50 pb-3">
                    <span className="text-[10px] font-black text-stone-400 uppercase">Kategori / Alt</span>
                    <span className="text-sm font-black text-stone-600">{formData.category} / {formData.subCategory}</span>
                  </div>
                  <div className="flex justify-between items-center text-amber-600">
                    <span className="text-[10px] font-black uppercase">Başlayan Fiyat</span>
                    <span className="text-xl font-black italic">{formData.basePrice} TL</span>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                    <p className="text-[9px] font-black text-stone-400 uppercase mb-1">Teslimat</p>
                    <p className="text-xs font-bold text-stone-800">{formData.leadTime}</p>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                    <p className="text-[9px] font-black text-stone-400 uppercase mb-1">Limit</p>
                    <p className="text-xs font-bold text-stone-800">{formData.minSize}cm - {formData.maxSize}cm</p>
                  </div>
               </div>
            </div>

            <div className="p-8 bg-stone-50 flex gap-4">
               <button onClick={() => setShowSummary(false)} className="flex-1 py-5 px-6 border border-stone-200 rounded-2xl font-black text-xs text-stone-400 uppercase tracking-widest hover:bg-white transition-all">Düzenle</button>
               <button onClick={handleFinalSubmit} className="flex-[2] py-5 px-6 bg-amber-600 text-white rounded-2xl font-black text-xs tracking-[0.2em] uppercase hover:bg-amber-700 transition-all shadow-xl shadow-amber-600/20">Yayınla</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAtolyeProduct;
