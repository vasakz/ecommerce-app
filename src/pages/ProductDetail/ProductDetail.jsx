import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
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
  ShoppingBag
} from 'lucide-react';

import { MOCK_PRODUCTS, COLORS } from '../../data/products';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.favorites.items);
  
  const productData = MOCK_PRODUCTS.find(p => p.id === Number(id)) || MOCK_PRODUCTS[0];
  
  const SIMILAR_PRODUCTS = MOCK_PRODUCTS
    .filter(p => p.category === productData.category && p.id !== productData.id)
    .slice(0, 4);
  
  // Find other images in the same subcategory to use as mock "alternative angles"
  const alternativeAngles = MOCK_PRODUCTS
    .filter(p => p.subcategory === productData.subcategory && p.id !== productData.id)
    .map(p => p.image);

  const MOCK_PRODUCT = {
    ...productData,
    oldPrice: Math.floor(productData.price * 1.25),
    description: `Özel olarak tasarlanan bu ${productData.brand} markalı ${productData.subcategory}, benzersiz şıklığı ve üstün kalitesiyle dikkat çekiyor. ${productData.isFreeShipping ? 'Ücretsiz kargo avantajıyla hemen sahip olabilirsiniz.' : ''}`,
    features: [
      "Orijinal Ürün Garantisi",
      `${productData.brand} Kalitesi`,
      "14 Gün İade Hakkı",
      "Güvenilir Teslimat"
    ],
    // Use the main image, plus 3 from the same specific category/subcategory
    images: [
      productData.image,
      ...alternativeAngles,
      productData.image,
      productData.image
    ].slice(0, 4),
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
  const [zoomStyle, setZoomStyle] = React.useState({ display: 'none' });

  React.useEffect(() => {
    setMainImage(productData.image);
    setSelectedColor(COLORS.find(c => c.id === productData.color) || COLORS[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, productData.image, productData.color]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  return (
    <div className="container mx-auto px-4 py-8 text-gray-900 dark:text-gray-100">
      {/* Breadcrumb */}
      <nav className="flex text-sm text-gray-500 dark:text-gray-400 mb-8 items-center gap-2">
        <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">Ana Sayfa</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to={`/urunler?category=${productData.category}`} className="hover:text-black dark:hover:text-white transition-colors">{productData.category}</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to={`/urunler?category=${productData.category}&subcategory=${productData.subcategory}`} className="hover:text-black dark:hover:text-white transition-colors">{productData.subcategory}</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 dark:text-gray-100 font-medium">{productData.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 mb-16">
        {/* Left: Image Gallery */}
        <div className="w-full lg:w-1/2 flex flex-col md:flex-row-reverse gap-4">
          
          {/* Main Image with Zoom */}
          <div className="flex-1 relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border">
            <div 
              className="absolute inset-0 cursor-crosshair z-10"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            />
            <img 
              src={mainImage} 
              alt={MOCK_PRODUCT.name} 
              className="w-full h-full object-cover"
            />
            {/* Zoom Overlay */}
            <div 
              className="absolute inset-0 pointer-events-none bg-no-repeat transition-opacity duration-200"
              style={{
                backgroundImage: `url(${mainImage})`,
                backgroundSize: '200%',
                opacity: zoomStyle.display === 'block' ? 1 : 0,
                ...zoomStyle
              }}
            />
          </div>

          {/* Thumbnails */}
          <div className="flex md:flex-col gap-4 overflow-x-auto md:w-24 flex-shrink-0 hide-scrollbar pb-2 md:pb-0">
            {MOCK_PRODUCT.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setMainImage(img)}
                className={`w-20 h-20 md:w-full md:h-24 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${mainImage === img ? 'border-black opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <Link to={`/marka/${MOCK_PRODUCT.brand}`} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                {MOCK_PRODUCT.brand}
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{MOCK_PRODUCT.name}</h1>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => dispatch(addToFavorites({
                  id: MOCK_PRODUCT.id,
                  name: MOCK_PRODUCT.name,
                  price: MOCK_PRODUCT.price,
                  category: MOCK_PRODUCT.category,
                  image: MOCK_PRODUCT.image
                }))}
                className="p-3 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors"
              >
                <Heart className="w-6 h-6" />
              </button>
              <button className="p-3 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center text-yellow-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(MOCK_PRODUCT.rating) ? 'fill-current' : 'text-gray-300'}`} />
              ))}
              <span className="text-gray-900 font-bold ml-2">{MOCK_PRODUCT.rating}</span>
            </div>
            <span className="text-gray-500 text-sm underline cursor-pointer hover:text-black">
              {MOCK_PRODUCT.reviews} Değerlendirme
            </span>
          </div>

          {/* Price */}
          <div className="mt-6 flex items-baseline gap-4">
            <span className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">{MOCK_PRODUCT.price} ₺</span>
            {MOCK_PRODUCT.oldPrice && (
              <span className="text-xl text-gray-500 dark:text-gray-400 line-through">{MOCK_PRODUCT.oldPrice} ₺</span>
            )}
            <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-bold px-2 py-1 rounded text-sm">
              %24 İndirim
            </span>
          </div>

          <hr className="my-8 border-gray-200 dark:border-gray-800" />

          {/* Variants */}
          <div className="space-y-6">
            {/* Color */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Renk Seçimi</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">{selectedColor.name}</span>
              </div>
              <div className="flex gap-3">
                {MOCK_PRODUCT.colors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 rounded-full border-2 ${selectedColor.name === color.name ? 'border-black p-1' : 'border-transparent'}`}
                  >
                    <span className={`block w-full h-full rounded-full ${color.class}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900">Beden / Çeşit</h3>
                <button className="text-sm text-blue-600 hover:underline">Beden Tablosu</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {MOCK_PRODUCT.sizes.map(size => (
                  <button
                    key={size.name}
                    disabled={!size.inStock}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      px-6 py-3 rounded-xl border text-sm font-medium transition-all
                      ${!size.inStock ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-stone-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-stone-700 line-through' : ''}
                      ${selectedSize.name === size.name && size.inStock ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black shadow-lg' : 'border-gray-300 dark:border-stone-700 hover:border-black dark:hover:border-white text-gray-700 dark:text-gray-300 bg-white dark:bg-stone-900'}
                    `}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            {/* Quantity */}
            <div className="flex items-center border border-gray-300 rounded-xl px-2 h-14 bg-white">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Action Buttons */}
            <button 
              onClick={() => dispatch(addToCart({
                id: MOCK_PRODUCT.id,
                isim: MOCK_PRODUCT.name,
                fiyat: `${MOCK_PRODUCT.price} ₺`,
                image: MOCK_PRODUCT.image
              }))}
              className="flex-1 bg-black text-white hover:bg-gray-800 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-xl shadow-black/20"
            >
              <ShoppingBag className="w-6 h-6" />
              Sepete Ekle
            </button>
            <button className="flex-1 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold text-lg flex items-center justify-center transition-transform active:scale-95 shadow-xl shadow-blue-600/20">
              Hemen Satın Al
            </button>
          </div>

          {/* Seller Info & Trust Badges */}
          <div className="mt-8 bg-gray-50 dark:bg-stone-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 dark:text-gray-400 text-sm">Satıcı:</span>
              <Link to={`/satici/${MOCK_PRODUCT.seller}`} className="font-bold text-blue-600 hover:underline flex items-center gap-2">
                {MOCK_PRODUCT.seller}
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded font-semibold items-center flex gap-1">
                  <Star className="w-3 h-3 fill-current" /> 9.8
                </span>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3 text-gray-700">
                <Truck className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Bugün Kargoda</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">14 Gün İade Garantisi</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs Layout */}
      <div className="mt-16 border-t pt-8">
        <div className="flex gap-8 border-b mb-8 overflow-x-auto hide-scrollbar">
          {[
            { id: 'description', label: 'Ürün Açıklaması' },
            { id: 'features', label: 'Özellikler' },
            { id: 'reviews', label: `Değerlendirmeler (${MOCK_PRODUCT.reviews})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 font-semibold text-lg whitespace-nowrap transition-colors relative ${activeTab === tab.id ? 'text-black' : 'text-gray-400 hover:text-gray-700'}`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-black rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        <div className="prose max-w-none min-h-[200px] mb-16">
          {activeTab === 'description' && (
            <div className="text-gray-700 leading-relaxed text-lg">
              <p>{MOCK_PRODUCT.description}</p>
              <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>
          )}
          {activeTab === 'features' && (
            <ul className="space-y-4 max-w-2xl">
              {MOCK_PRODUCT.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="font-medium text-gray-800">{feature}</span>
                </li>
              ))}
            </ul>
          )}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-yellow-50 p-6 rounded-2xl max-w-md">
                <div className="text-5xl font-black text-yellow-600">{MOCK_PRODUCT.rating}</div>
                <div>
                  <div className="flex text-yellow-500 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < 4 ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                  <div className="text-sm font-medium text-gray-600">{MOCK_PRODUCT.reviews} değerlendirme test edildi</div>
                </div>
              </div>
              
              <div className="border rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">AH</div>
                    <div>
                      <h4 className="font-bold text-gray-900">Ahmet Y.</h4>
                      <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Onaylı Satın Alım
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">2 gün önce</span>
                </div>
                <div className="flex text-yellow-400 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-gray-700">Ürün gerçekten çok kaliteli, el işçiliği olduğu her halinden belli. Derisinin dokusu harika ve kesinlikle uzun yıllar kullanabileceğim bir parça. Tavsiye ederim.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Similar Products Recommendation */}
      <div className="mt-16 mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Bunlar da İlgini Çekebilir</h2>
          <Link to="/urunler" className="text-blue-600 font-medium hover:underline flex items-center gap-1">
            Tümünü Gör <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {SIMILAR_PRODUCTS.map(product => (
            <Link key={product.id} to={`/urunler/${product.id}`} className="group block bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="aspect-[4/5] overflow-hidden relative bg-gray-50">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(addToFavorites({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      category: product.category,
                      image: product.image
                    }));
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur text-gray-400 hover:text-red-500 hover:bg-white transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5">
                <h3 className="font-medium text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors mb-2">{product.name}</h3>
                <div className="flex items-center gap-1 text-sm text-yellow-500 mb-3">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-gray-600 font-medium">{product.rating}</span>
                </div>
                <div className="text-lg font-bold text-gray-900">{product.price} ₺</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
