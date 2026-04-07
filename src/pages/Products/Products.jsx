import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  Heart, 
  Search, 
  ChevronDown, 
  Filter, 
  Grid3X3, 
  X, 
  Star,
  ShoppingBag,
  Truck,
  Zap,
  ChevronRight
} from 'lucide-react';

import {
  MOCK_PRODUCTS,
  COLORS,
  BRANDS,
  ALL_BRANDS,
  SELLERS,
  CATEGORY_TREE,
  CATEGORY_BANNERS,
} from '../../data/products';
import { addToFavorites } from '../../store/slices/favoritesSlice';


const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [gridCols, setGridCols] = useState(3);
  const [sortBy, setSortBy] = useState('best-seller');
  const dispatch = useDispatch();
  
  // URL'den State okuma fonksiyonları
  const getArrayParam = (key) => searchParams.getAll(key);
  
  // State from URL
  const selectedCategory = searchParams.get('category') || '';
  const selectedSubcategories = getArrayParam('subcategory');
  const selectedBrands = getArrayParam('brand');
  const selectedColors = getArrayParam('color');
  const selectedSizes = getArrayParam('size');
  const selectedSellers = getArrayParam('seller');
  const selectedGenders = getArrayParam('gender');
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minRating = Number(searchParams.get('rating') || 0);
  const isFreeShipping = searchParams.get('freeShipping') === 'true';
  const isFastDelivery = searchParams.get('fastDelivery') === 'true';
  const searchQuery = searchParams.get('q') || '';

  // Parametre Güncelleme Fonksiyonu
  const updateParams = (key, value, isArray = false) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (isArray) {
      if (newParams.getAll(key).includes(value)) {
        // Remove item if already exists via filtering
        const allVals = newParams.getAll(key).filter(v => v !== value);
        newParams.delete(key);
        allVals.forEach(v => newParams.append(key, v));
      } else {
        newParams.append(key, value);
      }
    } else {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  // computed filtered products
  const filteredProducts = useMemo(() => {
    let result = [...MOCK_PRODUCTS];

    if (searchQuery) result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    if (selectedCategory) result = result.filter(p => p.category === selectedCategory);
    if (selectedSubcategories.length > 0) result = result.filter(p => selectedSubcategories.includes(p.subcategory));
    if (selectedBrands.length > 0) result = result.filter(p => selectedBrands.includes(p.brand));
    if (selectedColors.length > 0) result = result.filter(p => selectedColors.includes(p.color));
    if (selectedSizes.length > 0) result = result.filter(p => selectedSizes.includes(p.size));
    if (selectedSellers.length > 0) result = result.filter(p => selectedSellers.includes(p.seller));
    if (selectedGenders.length > 0) result = result.filter(p => selectedGenders.includes(p.gender));
    
    if (minPrice) result = result.filter(p => p.price >= Number(minPrice));
    if (maxPrice) result = result.filter(p => p.price <= Number(maxPrice));
    if (minRating > 0) result = result.filter(p => p.rating >= minRating);
    
    if (isFreeShipping) result = result.filter(p => p.isFreeShipping);
    if (isFastDelivery) result = result.filter(p => p.isFastDelivery);

    if (sortBy === 'price-asc') result.sort((a,b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a,b) => b.price - a.price);
    else if (sortBy === 'newest') result.sort((a,b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));

    return result;
  }, [searchParams, sortBy]);

  // UI Tags
  const activeFilters = useMemo(() => {
    let list = [];
    if (selectedCategory) list.push({ key: 'category', value: selectedCategory, label: `Kategori: ${selectedCategory}` });
    selectedSubcategories.forEach(s => list.push({ key: 'subcategory', value: s, label: s, isArray: true }));
    selectedBrands.forEach(b => list.push({ key: 'brand', value: b, label: b, isArray: true }));
    selectedColors.forEach(c => list.push({ key: 'color', value: c, label: COLORS.find(col => col.id === c)?.name || c, isArray: true }));
    selectedSizes.forEach(s => list.push({ key: 'size', value: s, label: `Beden: ${s}`, isArray: true }));
    selectedSellers.forEach(s => list.push({ key: 'seller', value: s, label: s, isArray: true }));
    selectedGenders.forEach(g => list.push({ key: 'gender', value: g, label: g, isArray: true }));
    if (minPrice) list.push({ key: 'minPrice', value: '', label: `Min ${minPrice}₺` });
    if (maxPrice) list.push({ key: 'maxPrice', value: '', label: `Max ${maxPrice}₺` });
    if (minRating > 0) list.push({ key: 'rating', value: '', label: `${minRating}+ Puan` });
    if (isFreeShipping) list.push({ key: 'freeShipping', value: '', label: `Kargo Bedava` });
    if (isFastDelivery) list.push({ key: 'fastDelivery', value: '', label: `Hızlı Teslimat` });
    return list;
  }, [searchParams]);

  const availableBrands = selectedCategory ? BRANDS[selectedCategory] : ALL_BRANDS;
  const availableSubcategories = selectedCategory ? CATEGORY_TREE[selectedCategory] : [];

  return (
    <div className="bg-gray-50 dark:bg-stone-900 min-h-screen pb-12 transition-colors duration-300">
      
      {/* Category Banner */}
      <div className="relative w-full h-48 md:h-64 overflow-hidden bg-black mb-8">
        <img 
          src={selectedCategory ? CATEGORY_BANNERS[selectedCategory] : CATEGORY_BANNERS['Genel']} 
          alt="Category Banner" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
          <h1 className="text-4xl font-extrabold tracking-wider uppercase drop-shadow-lg">
            {selectedCategory || 'TÜM ÜRÜNLER'}
          </h1>
          <p className="mt-2 text-lg font-medium opacity-90 drop-shadow">
            Kusursuz Seçenekleri Keşfedin
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 text-gray-900 dark:text-gray-100">
        
        {/* Upper Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b dark:border-gray-800">
          <div>
            <nav className="flex text-sm text-gray-500 dark:text-gray-400 mb-2 items-center gap-2">
              <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">Ana Sayfa</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {selectedCategory || 'Tüm Ürünler'}
              </span>
            </nav>
            <p className="text-sm font-semibold">{filteredProducts.length} <span className="text-gray-500 font-normal">ürün bulundu</span></p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0 flex-wrap">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Arama yap..." 
                value={searchQuery}
                onChange={(e) => updateParams('q', e.target.value)}
                className="pl-10 pr-4 py-2 bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 text-gray-900 dark:text-gray-100"
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <div className="flex items-center gap-1 border dark:border-stone-700 rounded-lg p-1 bg-white dark:bg-stone-800">
              {[3, 4, 5].map(col => (
                <button
                  key={col}
                  onClick={() => setGridCols(col)}
                  className={`p-1.5 rounded ${gridCols === col ? 'bg-gray-100 dark:bg-stone-700 shadow text-black dark:text-white' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
              ))}
            </div>
            
            <div className="relative">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-lg px-4 py-2 pr-10 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm font-medium"
              >
                <option value="best-seller">Akıllı Sıralama</option>
                <option value="price-asc">En Düşük Fiyat</option>
                <option value="price-desc">En Yüksek Fiyat</option>
                <option value="newest">En Yeniler</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-sm text-gray-500 font-medium">Seçili Filtreler:</span>
            {activeFilters.map((filter, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 bg-gray-200 dark:bg-stone-800 px-3 py-1 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-300">
                {filter.label}
                <button onClick={() => updateParams(filter.key, filter.value, filter.isArray)} className="hover:text-red-500 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button onClick={clearAllFilters} className="text-xs font-bold text-red-500 hover:underline ml-2 uppercase tracking-wider">
              Hepsini Temizle
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-8 bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded-2xl p-6 self-start sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
            
            {/* Kategoriler */}
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4 border-b pb-2 dark:border-stone-800">Kategoriler</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => updateParams('category', '')}
                  className={`block text-sm text-left w-full hover:text-blue-600 transition-colors ${!selectedCategory ? 'font-bold text-blue-600' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  Tüm Kategoriler
                </button>
                {Object.keys(CATEGORY_TREE).map(cat => (
                  <button 
                    key={cat}
                    onClick={() => updateParams('category', cat)}
                    className={`block text-sm text-left w-full hover:text-blue-600 transition-colors ${selectedCategory === cat ? 'font-bold text-blue-600' : 'text-gray-600 dark:text-gray-400'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Alt Kategoriler (if category selected) */}
            {availableSubcategories.length > 0 && (
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider mb-4 border-b pb-2 dark:border-stone-800">Alt Kategoriler</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                  {availableSubcategories.map(sub => (
                    <label key={sub} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={selectedSubcategories.includes(sub)}
                        onChange={() => updateParams('subcategory', sub, true)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white">{sub}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Fiyat */}
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4 border-b pb-2 dark:border-stone-800">Fiyat Aralığı</h3>
              <div className="flex gap-2 items-center">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={minPrice}
                  onChange={e => updateParams('minPrice', e.target.value)}
                  className="w-full border dark:border-stone-700 bg-gray-50 dark:bg-stone-800 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                />
                <span className="text-gray-400">-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={maxPrice}
                  onChange={e => updateParams('maxPrice', e.target.value)}
                  className="w-full border dark:border-stone-700 bg-gray-50 dark:bg-stone-800 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
            </div>

            {/* Marka */}
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4 border-b pb-2 dark:border-stone-800">Markalar</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                {availableBrands.map(brand => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedBrands.includes(brand)}
                      onChange={() => updateParams('brand', brand, true)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Kargo ve Teslimat */}
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4 border-b pb-2 dark:border-stone-800">Teslimat & Kargo</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={isFreeShipping}
                    onChange={() => updateParams('freeShipping', isFreeShipping ? '' : 'true')}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                  />
                  <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300 font-medium">
                    <Truck className="w-4 h-4 text-green-500" /> Ücretsiz Kargo
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={isFastDelivery}
                    onChange={() => updateParams('fastDelivery', isFastDelivery ? '' : 'true')}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                  />
                  <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300 font-medium">
                    <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Hızlı Teslimat
                  </div>
                </label>
              </div>
            </div>

            {/* Satıcı */}
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4 border-b pb-2 dark:border-stone-800">Satıcı</h3>
              <div className="space-y-2">
                {SELLERS.map(seller => (
                  <label key={seller} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedSellers.includes(seller)}
                      onChange={() => updateParams('seller', seller, true)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white">{seller}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Puan */}
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4 border-b pb-2 dark:border-stone-800">Müşteri Puanı</h3>
              <div className="space-y-2">
                {[4, 3, 2, 1].map(rating => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="rating" 
                      checked={minRating === rating}
                      onChange={() => updateParams('rating', rating.toString())}
                      className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                    />
                    <div className="flex items-center text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < rating ? 'fill-current' : 'text-gray-300'}`} />
                      ))}
                      <span className="text-gray-500 dark:text-gray-400 ml-2 text-xs font-medium">& Üzeri</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Renk */}
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4 border-b pb-2 dark:border-stone-800">Renk</h3>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((color) => (
                  <button 
                    key={color.id} 
                    title={color.name}
                    onClick={() => updateParams('color', color.id, true)}
                    className={`w-7 h-7 rounded-full border shadow-sm transition-transform flex items-center justify-center
                      ${color.class} ${color.border || 'border-transparent'}
                      ${selectedColors.includes(color.id) ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-stone-900 scale-110' : 'hover:scale-110'}`}
                  >
                  </button>
                ))}
              </div>
            </div>

            {/* Beden & Cinsiyet */}
            {(selectedCategory === 'Çantalar' || selectedCategory === 'Ayakkabılar' || selectedCategory === 'Giyim' || !selectedCategory) && (
              <>
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider mb-4 border-b pb-2 dark:border-stone-800">Cinsiyet</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Erkek', 'Kadın', 'Unisex'].map(g => (
                      <button 
                        key={g}
                        onClick={() => updateParams('gender', g, true)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors
                          ${selectedGenders.includes(g) ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'border-gray-200 dark:border-stone-700 hover:border-blue-600 text-gray-600 dark:text-gray-300'}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider mb-4 border-b pb-2 dark:border-stone-800">Beden</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                      <button 
                        key={size}
                        onClick={() => updateParams('size', size, true)}
                        className={`h-9 rounded border flex items-center justify-center text-xs font-bold transition-colors
                          ${selectedSizes.includes(size) ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black' : 'border-gray-200 dark:border-stone-700 hover:border-black dark:hover:border-white text-gray-700 dark:text-gray-300'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

          </aside>

          {/* Product Grid Area */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="py-24 text-center bg-white dark:bg-stone-900 border border-gray-100 dark:border-stone-800 rounded-3xl">
                <Filter className="w-16 h-16 text-gray-200 dark:text-stone-700 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Eyvah, sonuç bulamadık!</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">Seçtiğiniz filtrelere uyan bir ürün maalesef şu an stoklarımızda yok. Farklı filtreler denemeye ne dersiniz?</p>
                <button 
                  onClick={clearAllFilters}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                >
                  Filtreleri Temizle
                </button>
              </div>
            ) : (
              <div 
                className="grid gap-6 transition-all duration-300"
                style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
              >
                {filteredProducts.map(product => (
                  <div key={product.id} className="group relative rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-stone-800 bg-white dark:bg-stone-800 flex flex-col h-full">
                    <Link to={`/urunler/${product.id}`} className="block relative aspect-square md:aspect-[4/5] overflow-hidden bg-gray-50 dark:bg-stone-900">
                      
                      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                        {product.isNew && (
                          <span className="bg-black dark:bg-white text-white dark:text-black text-[10px] font-extrabold px-2 py-1 rounded shadow-md w-max">
                            YENİ ÜRÜN
                          </span>
                        )}
                        {product.isFastDelivery && (
                          <span className="bg-yellow-400 text-yellow-900 text-[10px] font-extrabold px-2 py-1 rounded shadow-md w-max flex items-center gap-1">
                            <Zap className="w-3 h-3 fill-yellow-900" /> HIZLI TESLİMAT
                          </span>
                        )}
                      </div>

                      <button 
                        onClick={() => {
                          dispatch(addToFavorites({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            category: product.category,
                            image: product.image
                          }));
                          toast.success('Beğendiklere eklendi');
                        }}
                        className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-gray-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                      >
                        <Heart className="w-5 h-5" />
                      </button>
                      
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    </Link>
                    
                    <div className="p-5 flex flex-col flex-1">
                      {/* Name & Details Stacked */}
                      <div className="mb-3">
                        <Link to={`/urunler/${product.id}`} className="font-bold text-gray-900 dark:text-gray-100 line-clamp-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-tight uppercase tracking-tight text-sm">
                          {product.name}
                        </Link>
                        <p className="text-[11px] font-medium text-stone-500 dark:text-stone-400 mt-1 line-clamp-1 italic">
                          {product.brand} • {product.subcategory}
                        </p>
                      </div>
                      
                      {/* Price and Stars Side-by-Side (at the bottom of info) */}
                      <div className="mt-auto pt-3 border-t border-gray-50 dark:border-stone-800/50">
                        <div className="flex items-center justify-between gap-2">
                          {/* Price Area */}
                          <div className="flex flex-col">
                            {product.isFreeShipping && (
                              <div className="text-[9px] text-green-600 dark:text-green-500 font-bold mb-0.5 flex items-center gap-0.5">
                                <Truck className="w-2.5 h-2.5" /> Bedava
                              </div>
                            )}
                            <div className="text-lg font-black text-gray-900 dark:text-white tracking-tighter">
                              {product.price.toLocaleString('tr-TR')} <span className="text-xs font-semibold text-gray-500">₺</span>
                            </div>
                          </div>

                          {/* Rating/Stars next to price */}
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-1 bg-stone-50 dark:bg-stone-800 px-2 py-1 rounded-lg border border-gray-100/50 dark:border-stone-700/50 shadow-sm">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span className="text-[10px] font-bold text-gray-700 dark:text-gray-200">{product.rating}</span>
                            </div>
                            <span className="text-[9px] font-medium text-gray-400">({product.reviews} Yorum)</span>
                          </div>
                        </div>

                        {/* Quick View / Add to Cart Link area */}
                        <div className="mt-4 flex items-center justify-between">
                          <Link 
                            to={`/urunler/${product.id}`}
                            className="text-[10px] font-black text-stone-800 dark:text-stone-200 hover:text-blue-600 transition-colors uppercase tracking-[0.15em] border-b border-stone-200 dark:border-stone-700 pb-0.5"
                          >
                            İncele
                          </Link>
                          <button className="p-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-amber-500 dark:hover:bg-amber-500 dark:hover:text-white transition-all transform active:scale-95 shadow-md">
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
