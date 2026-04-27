import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { toast } from 'react-hot-toast';
import { addToFavorites, removeFromFavorites } from '../../store/slices/favoritesSlice';
import { 
  Heart, 
  Share2, 
  Star, 
  Truck, 
  ShieldCheck, 
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';

import { MOCK_PRODUCTS, COLORS } from '../../data/products';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.favorites.items);
  const isFavorited = favorites.some(item => item.id === Number(id));
  
  const productData = MOCK_PRODUCTS.find(p => p.id === Number(id)) || MOCK_PRODUCTS[0];
  
  const SIMILAR_PRODUCTS = MOCK_PRODUCTS
    .filter(p => p.category === productData.category && p.id !== productData.id)
    .slice(0, 4);
  
  const alternativeAngles = MOCK_PRODUCTS
    .filter(p => p.subcategory === productData.subcategory && p.id !== productData.id)
    .map(p => p.image);

  const MOCK_PRODUCT = {
    ...productData,
    oldPrice: Math.floor(productData.price * 1.25),
    description: `Özel olarak tasarlanan bu ${productData.brand} markalı ${productData.subcategory}, benzersiz şıklığı ve üstün kalitesiyle dikkat çekiyor. Zanaatkarlarımız tarafından özenle hazırlanan bu parça, gardırobunuzun en değerli üyelerinden biri olmaya aday.`,
    features: [
      "Sınırlı Üretim Özel Tasarım",
      `${productData.brand} El İşçiliği`,
      "Premium Malzeme Kalitesi",
      "Sürdürülebilir Üretim Teknikleri",
      "Kişiye Özel Uyum Seçenekleri"
    ],
    images: [
      productData.image,
      ...alternativeAngles,
    ].slice(0, 4).length < 4 ? [productData.image, productData.image, productData.image, productData.image] : [productData.image, ...alternativeAngles].slice(0, 4),
    colors: COLORS,
    sizes: [
      { name: 'S', inStock: true },
      { name: 'M', inStock: true },
      { name: 'L', inStock: false },
      { name: 'XL', inStock: true },
    ]
  };

  const [mainImage, setMainImage] = React.useState(MOCK_PRODUCT.images[0]);
  const [selectedColor, setSelectedColor] = React.useState(COLORS.find(c => c.id === productData.color) || COLORS[0]);
  const [selectedSize, setSelectedSize] = React.useState(MOCK_PRODUCT.sizes[1]);
  const [quantity, setQuantity] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState('description');
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    setMainImage(productData.image);
    setSelectedColor(COLORS.find(c => c.id === productData.color) || COLORS[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, productData.image, productData.color]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const toggleFavorite = () => {
    if (isFavorited) {
      dispatch(removeFromFavorites(MOCK_PRODUCT.id));
      toast.success('Favorilerden çıkarıldı');
    } else {
      dispatch(addToFavorites({
        id: MOCK_PRODUCT.id,
        name: MOCK_PRODUCT.name,
        price: MOCK_PRODUCT.price,
        category: MOCK_PRODUCT.category,
        image: MOCK_PRODUCT.image
      }));
      toast.success('Favorilere eklendi');
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb - Clean & Minimal */}
        <nav className="flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-stone-400 mb-10 overflow-x-auto whitespace-nowrap hide-scrollbar">
          <Link to="/" className="hover:text-stone-900 transition-colors">Ana Sayfa</Link>
          <ChevronRight size={12} className="text-stone-300" />
          <Link to={`/urunler?category=${productData.category}`} className="hover:text-stone-900 transition-colors">{productData.category}</Link>
          <ChevronRight size={12} className="text-stone-300" />
          <span className="text-stone-900 font-bold">{productData.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* ── SOL: GÖRSELLER ── */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex flex-col-reverse md:flex-row gap-4">
              {/* Thumbnails */}
              <div className="flex md:flex-col gap-3 overflow-x-auto md:w-20 lg:w-24 no-scrollbar">
                {MOCK_PRODUCT.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${mainImage === img ? 'border-amber-500 scale-95 shadow-lg shadow-amber-500/10' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Main Image with Zoom Effect */}
              <div 
                className="relative flex-1 aspect-[4/5] bg-stone-50 rounded-3xl overflow-hidden shadow-2xl shadow-stone-200/50 cursor-zoom-in border border-stone-100 group"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                <img 
                  src={mainImage} 
                  alt={MOCK_PRODUCT.name} 
                  className={`w-full h-full object-cover transition-transform duration-500 ${isZoomed ? 'scale-[2.5]' : 'scale-100'}`}
                  style={isZoomed ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : {}}
                />
                <button 
                  onClick={toggleFavorite}
                  className={`absolute top-6 right-6 p-4 rounded-full backdrop-blur-md transition-all shadow-xl active:scale-95 ${isFavorited ? 'bg-amber-500 text-white shadow-amber-500/20' : 'bg-white/80 text-stone-400 hover:text-amber-500 shadow-stone-900/10'}`}
                >
                  <Heart size={24} className={isFavorited ? 'fill-current' : ''} />
                </button>
              </div>
            </div>
          </div>

          {/* ── SAĞ: ÜRÜN BİLGİLERİ ── */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-px bg-amber-500"></div>
                <Link to={`/marka/${MOCK_PRODUCT.brand}`} className="text-[10px] font-black tracking-[0.3em] uppercase text-amber-600 hover:text-amber-700 transition-colors">
                  {MOCK_PRODUCT.brand}
                </Link>
              </div>
              <h1 className="text-4xl lg:text-5xl font-serif text-stone-900 leading-tight tracking-tight">
                {MOCK_PRODUCT.name}
              </h1>
              
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-amber-500">
                  <Star size={18} className="fill-current" />
                  <span className="text-stone-900 font-bold text-lg">{MOCK_PRODUCT.rating}</span>
                </div>
                <div className="w-px h-4 bg-stone-200"></div>
                <button className="text-stone-400 text-sm font-medium hover:text-stone-900 hover:underline transition-colors">
                  {MOCK_PRODUCT.reviews} Değerlendirme
                </button>
              </div>
            </div>

            <div className="flex items-baseline gap-4 mb-10">
              <p className="text-5xl font-bold text-stone-900 tracking-tighter">
                {MOCK_PRODUCT.price.toLocaleString('tr-TR')} ₺
              </p>
              {MOCK_PRODUCT.oldPrice && (
                <span className="text-xl text-stone-400 line-through decoration-amber-500/30">
                  {MOCK_PRODUCT.oldPrice.toLocaleString('tr-TR')} ₺
                </span>
              )}
              <div className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-amber-100 flex items-center gap-1.5 animate-pulse">
                İndirim %24
              </div>
            </div>

            {/* Renk Seçimi */}
            <div className="mb-10">
              <div className="flex justify-between mb-4 items-center">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-stone-400">Renk</h3>
                <span className="text-xs font-bold text-stone-900">{selectedColor.name}</span>
              </div>
              <div className="flex gap-4">
                {MOCK_PRODUCT.colors.map(color => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color)}
                    className={`p-1 rounded-full border-2 transition-all hover:scale-110 ${selectedColor.id === color.id ? 'border-amber-500 shadow-lg shadow-amber-500/10' : 'border-transparent'}`}
                  >
                    <div className={`w-10 h-10 rounded-full shadow-inner ${color.class}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Beden Seçimi */}
            <div className="mb-10">
              <div className="flex justify-between mb-4 items-center">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-stone-400">Beden Seçimi</h3>
                <button className="text-xs font-bold text-amber-600 hover:underline">Beden Tablosu</button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {MOCK_PRODUCT.sizes.map(size => (
                  <button
                    key={size.name}
                    disabled={!size.inStock}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      h-14 rounded-2xl text-xs font-bold tracking-widest transition-all
                      ${!size.inStock ? 'opacity-30 cursor-not-allowed bg-stone-50 text-stone-400 border border-stone-100 line-through' : ''}
                      ${selectedSize.name === size.name && size.inStock 
                        ? 'bg-amber-500 text-white shadow-xl shadow-amber-500/20 active:scale-95' 
                        : 'bg-white border border-stone-200 text-stone-600 hover:border-amber-300 hover:text-amber-600'}
                    `}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              {/* Adet Kontrolü */}
              <div className="flex items-center justify-between border border-stone-200 rounded-2xl px-2 h-16 bg-stone-50 min-w-[140px]">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-stone-400 hover:text-stone-900 hover:bg-white rounded-xl transition-all active:scale-90"
                >
                  <Minus size={18} />
                </button>
                <span className="font-bold text-lg text-stone-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-stone-400 hover:text-stone-900 hover:bg-white rounded-xl transition-all active:scale-90"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Ana Buton */}
              <button 
                onClick={() => {
                  dispatch(addToCart({
                    id: MOCK_PRODUCT.id,
                    isim: MOCK_PRODUCT.name,
                    fiyat: `${MOCK_PRODUCT.price} ₺`,
                    image: MOCK_PRODUCT.image,
                    color: selectedColor.name,
                    size: selectedSize.name,
                    quantity: quantity
                  }));
                  toast.success('Ürün sepete eklendi', {
                    style: { background: '#1c1917', color: '#fff', borderRadius: '12px' },
                    iconTheme: { primary: '#d97706', secondary: '#fff' }
                  });
                }}
                className="flex-1 bg-amber-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:bg-amber-700 active:scale-95 shadow-2xl shadow-amber-600/20"
              >
                <ShoppingBag size={20} />
                Sepete Ekle
              </button>
            </div>

            {/* Güven Rozetleri */}
            <div className="bg-stone-50 border border-stone-100 rounded-3xl p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-amber-600">
                  <Truck size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-stone-900">Premium Teslimat</h4>
                  <p className="text-xs text-stone-500 font-medium mt-1">Özel sigortalı paketleme ve 24 saatte kargolama.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-emerald-600">
                  <ShieldCheck size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-stone-900">Güvenceli Alışveriş</h4>
                  <p className="text-xs text-stone-500 font-medium mt-1">14 gün koşulsuz iade ve orijinal ürün garantisi.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── DETAYLAR & DEĞERLENDİRMELER ── */}
        <div className="mt-24">
          <div className="flex border-b border-stone-100 gap-12 overflow-x-auto no-scrollbar mb-12">
            {[
              { id: 'description', label: 'Ürün Hikayesi' },
              { id: 'features', label: 'Özellikler' },
              { id: 'reviews', label: `Yorumlar (${MOCK_PRODUCT.reviews})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-6 text-xs font-black uppercase tracking-[0.3em] whitespace-nowrap transition-all relative ${activeTab === tab.id ? 'text-stone-900' : 'text-stone-300 hover:text-stone-500'}`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-amber-500 rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          <div className="max-w-4xl min-h-[300px]">
            {activeTab === 'description' && (
              <div className="animate-fadeIn">
                <h3 className="text-3xl font-serif text-stone-900 mb-6">Detaylı Bilgi</h3>
                <p className="text-stone-600 leading-relaxed text-lg mb-8 italic">"{MOCK_PRODUCT.description}"</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                  <div className="flex gap-4 p-6 bg-stone-50 rounded-3xl">
                    <Info className="flex-shrink-0 text-amber-500" />
                    <p className="text-sm text-stone-600 leading-relaxed">Ürünün uzun ömürlü olması için kuru temizleme önerilir. Direkt güneş ışığından uzak tutunuz.</p>
                  </div>
                  <div className="flex gap-4 p-6 bg-amber-50 rounded-3xl">
                    <Clock className="flex-shrink-0 text-amber-600" />
                    <p className="text-sm text-amber-800 leading-relaxed font-medium">Bu ürün tamamen el işçiliği olduğu için sevk süresi 2 iş günü sürmektedir.</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'features' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                {MOCK_PRODUCT.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-white border border-stone-100 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-200 transition-all group">
                    <div className="w-2 h-2 rounded-full bg-amber-500 group-hover:scale-150 transition-transform" />
                    <span className="text-sm font-bold text-stone-800 uppercase tracking-widest">{feature}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-12 animate-fadeIn">
                <div className="flex flex-col sm:flex-row items-center gap-10 bg-gradient-to-br from-stone-900 to-stone-800 p-10 rounded-[3rem] text-white shadow-2xl">
                  <div className="text-center">
                    <div className="text-7xl font-serif text-amber-400 mb-2">{MOCK_PRODUCT.rating}</div>
                    <div className="flex text-amber-400 justify-center mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={20} className={i < 4 ? 'fill-current' : ''} />
                      ))}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-stone-400">GENEL PUAN</div>
                  </div>
                  <div className="flex-1 w-full space-y-3">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-xs font-bold text-stone-400 w-4">{star}</span>
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-500 rounded-full" 
                            style={{ width: star === 5 ? '85%' : star === 4 ? '20%' : '5%' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* User Reviews */}
                <div className="space-y-6">
                  <div className="p-8 bg-white border border-stone-100 rounded-[2rem] shadow-sm relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform duration-700">
                      <Star size={100} />
                    </div>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center font-black text-stone-400 shadow-inner">AH</div>
                        <div>
                          <h4 className="font-bold text-stone-900 text-lg">Ahmet Yılmaz</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <ShieldCheck size={10} /> Onaylı Satın Alım
                            </span>
                            <span className="text-[10px] text-stone-400 font-bold">2 GÜN ÖNCE</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} className="fill-current" />)}
                      </div>
                    </div>
                    <p className="text-stone-600 leading-relaxed text-lg relative z-10 italic">
                      "Ürün gerçekten çok kaliteli, zanaatkarların dokunuşu her halinden belli. Derisinin kokusu harika ve kesinlikle uzun yıllar kullanabileceğim bir parça. Paketleme ise sanat eseri gibiydi."
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── ÖNERİLEN ÜRÜNLER ── */}
        <div className="mt-32">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-px bg-amber-500"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600">Sizin İçin</span>
              </div>
              <h2 className="text-4xl font-serif text-stone-900">Benzer Koleksiyonlar</h2>
            </div>
            <Link to="/urunler" className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-all">
              TÜMÜNÜ GÖR <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {SIMILAR_PRODUCTS.map(product => (
              <Link key={product.id} to={`/urunler/${product.id}`} className="group block relative">
                <div className="aspect-[3/4] overflow-hidden rounded-3xl bg-stone-50 border border-stone-100 relative shadow-md group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(addToCart({
                          id: product.id,
                          isim: product.name,
                          fiyat: `${product.price} ₺`,
                          image: product.image
                        }));
                        toast.success('Sepete eklendi');
                      }}
                      className="w-full bg-white text-stone-900 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 hover:bg-amber-500 hover:text-white"
                    >
                      HIZLI EKLE
                    </button>
                  </div>
                </div>
                <div className="mt-6 space-y-1">
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">{product.brand}</p>
                  <h3 className="font-serif text-lg text-stone-800 line-clamp-1 group-hover:text-amber-600 transition-colors">{product.name}</h3>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xl font-bold text-stone-900">{product.price.toLocaleString('tr-TR')} ₺</span>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={12} className="fill-current" />
                      <span className="text-[10px] font-bold text-stone-500">{product.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
