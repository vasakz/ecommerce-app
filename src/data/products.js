import deri1 from '../assets/deri-1.jpeg';
import deri2 from '../assets/deri-2.jpeg';
import deri3 from '../assets/deri-3.jpeg';
import deri4 from '../assets/deri-4.jpeg';
import deri5 from '../assets/deri-5.jpeg';
import deri6 from '../assets/deri-6.jpeg';
import deri7 from '../assets/deri-7.jpeg';
import deri8 from '../assets/deri-8.jpeg';
import deri9 from '../assets/deri-9.jpeg';
import deri10 from '../assets/deri-10.jpeg';
import deri11 from '../assets/deri-11.jpeg';
import deri12 from '../assets/deri-12.jpeg';

import phone1 from '../assets/phone-1.jpeg';
import phone2 from '../assets/phone-2.jpeg';
import phone3 from '../assets/phone-3.jpeg';
import hphone1 from '../assets/hphone-1.jpeg';
import hphone2 from '../assets/hphone-2.jpeg';
import phone4 from '../assets/phone-4.jpeg';
import phone5 from '../assets/phone-5.jpeg';
import phone6 from '../assets/phone-6.jpeg';
import phone7 from '../assets/phone-7.jpeg';
import koz1 from '../assets/koz-1.jpeg';
import koz2 from '../assets/koz-2.jpeg';
import koz3 from '../assets/koz-3.jpeg';
import koz4 from '../assets/koz-4.jpeg';
import koz5 from '../assets/koz-5.jpeg';
import koz6 from '../assets/koz-6.jpeg';
import koz7 from '../assets/koz-7.jpeg';
import ak1 from '../assets/ak-1.jpeg';
import ak2 from '../assets/ak-2.jpeg';
import ak3 from '../assets/ak-3.jpeg';
import ak4 from '../assets/ak-4.jpeg';
import ak5 from '../assets/ak-5.jpeg';
import clock1 from '../assets/clock-1.jpeg';
import clock2 from '../assets/clock-2.jpeg';
import clock5 from '../assets/clock-5.jpeg';

export const CATEGORY_BANNERS = {
  'Çantalar': 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80',
  'Ayakkabılar': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
  'Aksesuarlar': 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80',
  'Ev & Yaşam': 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
  'Giyim': 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80',
  'Elektronik': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=80',
  'Yeni Gelenler': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80',
  'Kampanyalar': 'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?auto=format&fit=crop&w=1200&q=80',
  'Genel': 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80'
};

export const CATEGORY_TREE = {
  'Çantalar': ['Sırt Çantası', 'Omuz Çantası', 'Evrak Çantası', 'Postacı Çantası', 'Erkek Cüzdan', 'Kadın Cüzdan', 'Kartlık', 'Pasaport Kılıfı'],
  'Ayakkabılar': ['Klasik Ayakkabı', 'Bot', 'Loafer', 'Sneaker'],
  'Aksesuarlar': ['Anahtarlık', 'Bileklik', 'Saat Kordonu', 'Gözlük Kılıfı'],
  'Ev & Yaşam': ['Deri Sümen', 'Bardak Altlığı', 'Mousepad', 'Dekoratif'],
  'Giyim': ['Tişört', 'Pantolon', 'Ceket', 'Elbise', 'Klasik Kemer', 'Spor Kemer', 'Örgü Kemer'],
  'Elektronik': ['Telefon', 'Bilgisayar', 'Tablet', 'Kamera', 'Kulaklık'],
  'Yeni Gelenler': ['En Yeni Tasarımlar'],
  'Kampanyalar': ['Fırsat Ürünleri']
};

export const SELLERS = ['Atölye', 'Premium Craft', 'Deri Sanat', 'Resmi Satıcı'];

export const BRANDS = {
  'Çantalar': ['Derin Sanat', 'El İzi', 'Atölye', 'Premium Craft'],
  'Ayakkabılar': ['Deri Sanat', 'El İzi'],
  'Aksesuarlar': ['Atölye', 'Premium Craft'],
  'Ev & Yaşam': ['Derin Sanat', 'Atölye'],
  'Giyim': ['Nike', 'Mavi', 'Zara', 'Adidas', 'El İzi', 'Atölye'],
  'Elektronik': ['Apple', 'Sony', 'Canon', 'Nikon', 'Samsung'],
  'Yeni Gelenler': ['Atölye'],
  'Kampanyalar': ['Atölye']
};

export const ALL_BRANDS = [...new Set(Object.values(BRANDS).flat())];

export const COLORS = [
  { id: 'black', class: 'bg-black', name: 'Siyah' },
  { id: 'white', class: 'bg-white', border: 'border-gray-200', name: 'Beyaz' },
  { id: 'red', class: 'bg-red-500', name: 'Kırmızı' },
  { id: 'blue', class: 'bg-blue-500', name: 'Mavi' },
  { id: 'brown', class: 'bg-amber-800', name: 'Kahverengi' },
  { id: 'tan', class: 'bg-amber-500', name: 'Taba' },
];

const SUB_IMAGES = {
  'Sırt Çantası': deri1,
  'Omuz Çantası': deri2,
  'Evrak Çantası': deri3,
  'Postacı Çantası': deri4,

  'Erkek Cüzdan': deri5,
  'Kadın Cüzdan': deri6,
  'Kartlık': deri7,
  'Pasaport Kılıfı': deri8,

  'Klasik Kemer': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
  'Spor Kemer': 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
  'Örgü Kemer': 'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?auto=format&fit=crop&w=600&q=80',

  'Klasik Ayakkabı': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
  'Bot': 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=600&q=80',
  'Loafer': 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80',
  'Sneaker': 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80',

  'Anahtarlık': deri9,
  'Bileklik': deri10,
  'Saat Kordonu': deri11,
  'Gözlük Kılıfı': deri12,

  'Deri Sümen': 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80',
  'Bardak Altlığı': 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80',
  'Mousepad': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80',
  'Dekoratif': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',

  'Tişört': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
  'Pantolon': 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80',
  'Ceket': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
  'Elbise': 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=600&q=80',

  'Telefon': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
  'Bilgisayar': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80',
  'Tablet': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80',
  'Kamera': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
  'Kulaklık': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',

  'En Yeni Tasarımlar': deri1,
  'Fırsat Ürünleri': deri5,
};

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const ADJECTIVES = ['Lüks', 'Hakiki', 'Özel Tasarım', 'Klasik', 'Modern', 'Vintage', 'El İşçiliği'];

// Build products ONCE at module level so they never re-randomize
export const MOCK_PRODUCTS = Array.from({ length: 120 }).map((_, idx) => {
  const category = getRandom(Object.keys(CATEGORY_TREE));
  const subcategory = getRandom(CATEGORY_TREE[category]);
  const brand = getRandom(BRANDS[category]);
  const adjective = getRandom(ADJECTIVES);

  return {
    id: idx + 1,
    name: `${adjective} ${brand} ${subcategory} ${idx + 1}`,
    price: Math.floor(Math.random() * 5000) + 100,
    oldPrice: 0, // computed in detail page
    rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
    reviews: Math.floor(Math.random() * 1000),
    image: SUB_IMAGES[subcategory] || deri1,
    category,
    subcategory,
    brand,
    seller: getRandom(SELLERS),
    isNew: Math.random() > 0.8,
    isFreeShipping: Math.random() > 0.5,
    isFastDelivery: Math.random() > 0.7,
    color: getRandom(COLORS).id,
    size: getRandom(['S', 'M', 'L', 'XL']),
    gender: getRandom(['Erkek', 'Kadın', 'Unisex']),
    description: '',
    features: [],
    images: [],
    colors: [],
    sizes: [],
  };
});

// Post-process products to fill in structured data
MOCK_PRODUCTS.forEach(p => {
  p.oldPrice = Math.floor(p.price * 1.25);
  p.description = `Özel olarak tasarlanan bu ${p.brand} markalı ${p.subcategory}, benzersiz şıklığı ve üstün kalitesiyle dikkat çekiyor. ${p.isFreeShipping ? 'Ücretsiz kargo avantajıyla hemen sahip olabilirsiniz.' : ''}`;
  p.features = [
    'Orijinal Ürün Garantisi',
    `${p.brand} Kalitesi`,
    '14 Gün İade Hakkı',
    'Güvenilir Teslimat',
  ];
  const angles = MOCK_PRODUCTS
    .filter(q => q.subcategory === p.subcategory && q.id !== p.id)
    .map(q => q.image)
    .slice(0, 3);
  p.images = [p.image, ...angles, p.image].slice(0, 4);
  p.colors = COLORS;
  p.sizes = [
    { name: 'S', inStock: true },
    { name: 'M', inStock: true },
    { name: 'L', inStock: Math.random() > 0.3 },
    { name: 'XL', inStock: true },
  ];
});

// Home page featured products — added directly to the catalog
const HOME_PRODUCTS = [
  // ── Telefonlar ──
  { id: 201, name: 'Apple iPhone 15 Pro Max', price: 67000, oldPrice: 75000, rating: 4.8, reviews: 1240, image: phone1, category: 'Elektronik', subcategory: 'Telefon', brand: 'Apple', seller: 'Resmi Satıcı', isNew: true, isFreeShipping: true, isFastDelivery: true, color: 'black', size: 'M', gender: 'Unisex', images: [phone1, phone2, phone3], description: 'Apple iPhone 15 Pro Max, A17 Pro çipiyle güçlendirilmiş en gelişmiş iPhone modeli. Titanyum gövde ve 48 MP kamera sistemiyle fotoğrafçılığı yeniden tanımlar.', features: ['A17 Pro Çip', '48 MP Kamera', 'Titanyum Gövde', 'USB-C Bağlantı', '5G Destekli'], colors: COLORS, sizes: [{ name: 'M', inStock: true }] },
  { id: 202, name: 'Sony WH-1000XM5 Kulaklık', price: 12000, oldPrice: 14500, rating: 4.7, reviews: 820, image: hphone1, category: 'Elektronik', subcategory: 'Kulaklık', brand: 'Sony', seller: 'Premium Craft', isNew: false, isFreeShipping: true, isFastDelivery: false, color: 'black', size: 'M', gender: 'Unisex', images: [hphone1, hphone2], description: 'Sony WH-1000XM5, endüstrinin en iyi aktif gürültü engelleme özelliğine sahip premium kulaklık. 30 saate kadar pil ömrüyle kesintisiz müzik deneyimi.', features: ['Aktif Gürültü Engelleme', '30 Saat Pil', 'Hi-Res Audio', 'Hızlı Şarj'], colors: COLORS, sizes: [{ name: 'M', inStock: true }] },
  { id: 203, name: 'Samsung Galaxy S24 Ultra', price: 56000, oldPrice: 62000, rating: 4.6, reviews: 940, image: phone4, category: 'Elektronik', subcategory: 'Telefon', brand: 'Samsung', seller: 'Resmi Satıcı', isNew: true, isFreeShipping: true, isFastDelivery: true, color: 'black', size: 'M', gender: 'Unisex', images: [phone4, phone5], description: 'Samsung Galaxy S24 Ultra, yapay zeka destekli kamera sistemi ve entegre S Pen kalemiyle iş ve yaratıcılığı bir araya getiriyor.', features: ['200 MP Kamera', 'S Pen Entegre', 'Yapay Zeka', 'Snapdragon 8 Gen 3'], colors: COLORS, sizes: [{ name: 'M', inStock: true }] },
  { id: 204, name: 'Xiaomi 14 Pro', price: 9000, oldPrice: 11000, rating: 4.4, reviews: 670, image: phone6, category: 'Elektronik', subcategory: 'Telefon', brand: 'Sony', seller: 'Premium Craft', isNew: false, isFreeShipping: false, isFastDelivery: true, color: 'white', size: 'M', gender: 'Unisex', images: [phone6, phone7], description: 'Xiaomi 14 Pro, Leica kamera işbirliğiyle mühendislik harikası bir akıllı telefon. Snapdragon 8 Gen 3 ile olağanüstü performans.', features: ['Leica Kamera', 'Snapdragon 8 Gen 3', '120W Hızlı Şarj', '50W Kablosuz Şarj'], colors: COLORS, sizes: [{ name: 'M', inStock: true }] },
  // ── Kozmetik ──
  { id: 211, name: 'Mac Lipliner Ruj Seti', price: 450, oldPrice: 580, rating: 4.5, reviews: 340, image: koz1, category: 'Giyim', subcategory: 'Tişört', brand: 'Mavi', seller: 'Premium Craft', isNew: false, isFreeShipping: true, isFastDelivery: false, color: 'red', size: 'M', gender: 'Kadın', images: [koz1, koz2], description: 'MAC imzalı uzun süre kalıcı ruj ve dudak kalemi seti. Canlı ve mat renk seçenekleriyle her tarza uygun.', features: ['Uzun Süre Kalıcı', '12 Saat Formül', 'Nem Desteği', 'Vegan Formül'], colors: COLORS, sizes: [{ name: 'M', inStock: true }] },
  { id: 212, name: 'Loreal Paris Fondöten', price: 320, oldPrice: 420, rating: 4.3, reviews: 512, image: koz3, category: 'Giyim', subcategory: 'Elbise', brand: 'Mavi', seller: 'Atölye', isNew: false, isFreeShipping: false, isFastDelivery: false, color: 'tan', size: 'M', gender: 'Kadın', images: [koz3, koz4, koz5], description: "L'Oreal Paris tam kapasiteli fondöten, cildinizin doğal görünümünü korurken pürüzsüz bir kaplama sağlar. SPF 30 koruma içerir.", features: ['SPF 30', 'Su Geçirmez', '24 Saat Kalıcı', 'Doğal Görünüm'], colors: COLORS, sizes: [{ name: 'M', inStock: true }] },
  { id: 213, name: 'Nivea Cilt Bakım Seti', price: 280, oldPrice: 350, rating: 4.2, reviews: 280, image: koz6, category: 'Giyim', subcategory: 'Pantolon', brand: 'Adidas', seller: 'Premium Craft', isNew: false, isFreeShipping: true, isFastDelivery: false, color: 'white', size: 'M', gender: 'Kadın', images: [koz6], description: 'Nivea çift etkili cilt bakım seti. Nemlendirici krem ve temizleyici sütü içeren bu set, cildinizi koruyor ve besliyor.', features: ['Derin Nemlendirme', 'Hassas Cilt Uyumlu', 'Paraben İçermez', 'Dermatoloji Test'], colors: COLORS, sizes: [{ name: 'M', inStock: true }] },
  { id: 214, name: 'Mac Göz Farı Paleti', price: 550, oldPrice: 680, rating: 4.6, reviews: 390, image: koz7, category: 'Giyim', subcategory: 'Ceket', brand: 'Zara', seller: 'Resmi Satıcı', isNew: true, isFreeShipping: true, isFastDelivery: true, color: 'brown', size: 'M', gender: 'Kadın', images: [koz7], description: 'MAC imzalı 24 renk göz farı paleti. Işıltılı ve mat tonların birleşimi ile gündüz ve gece makyajı için mükemmel renk uyumu.', features: ['24 Renk', 'Uzun Kalıcı', 'Yüksek Pigmentasyon', 'Ayna İçerir'], colors: COLORS, sizes: [{ name: 'M', inStock: true }] },
  // ── Aksesuarlar & Saatler ──
  { id: 221, name: 'Atölye Deri Bileklik Set', price: 850, oldPrice: 1100, rating: 4.7, reviews: 210, image: ak1, category: 'Aksesuarlar', subcategory: 'Bileklik', brand: 'Atölye', seller: 'Atölye', isNew: true, isFreeShipping: true, isFastDelivery: true, color: 'brown', size: 'M', gender: 'Unisex', images: [ak1, ak2, ak3], description: 'El işçiliği hakiki deri bileklik seti. Paslanmaz çelik kaplama detaylarıyla her kıyafete uyum sağlayan zarif aksesuar.', features: ['Hakiki Deri', 'El İşçiliği', 'Ayarlanabilir', 'Paslanmaz Çelik'], colors: COLORS, sizes: [{ name: 'S', inStock: true }, { name: 'M', inStock: true }, { name: 'L', inStock: true }] },
  { id: 222, name: 'Klasik Mekanik Saat', price: 2500, oldPrice: 3200, rating: 4.8, reviews: 185, image: clock1, category: 'Aksesuarlar', subcategory: 'Bileklik', brand: 'Premium Craft', seller: 'Premium Craft', isNew: false, isFreeShipping: true, isFastDelivery: false, color: 'black', size: 'M', gender: 'Erkek', images: [clock1, clock2], description: 'İsviçre mekanizmasına sahip klasik mekanik saat. Safir kristal cam ve paslanmaz çelik kasa ile mükemmel bir zaman ölçer.', features: ['İsviçre Mekanizması', 'Safir Kristal', '50M Su Geçirmezlik', '2 Yıl Garanti'], colors: COLORS, sizes: [{ name: 'M', inStock: true }] },
  { id: 223, name: 'Deri Anahtarlık & Aksesuar', price: 650, oldPrice: 820, rating: 4.4, reviews: 320, image: ak4, category: 'Aksesuarlar', subcategory: 'Anahtarlık', brand: 'Atölye', seller: 'Atölye', isNew: false, isFreeShipping: false, isFastDelivery: false, color: 'tan', size: 'M', gender: 'Unisex', images: [ak4, ak5], description: 'Hakiki deri anahtarlık ve mini aksesuar seti. Minimalist tasarımı ile şıklığı pratiklikle buluşturuyor.', features: ['Hakiki Deri', 'Metal Kaplama', 'Kompakt Tasarım', 'Hediye Kutulu'], colors: COLORS, sizes: [{ name: 'M', inStock: true }] },
  { id: 224, name: 'Spor Kronometreli Saat', price: 1800, oldPrice: 2300, rating: 4.5, reviews: 275, image: clock5, category: 'Aksesuarlar', subcategory: 'Bileklik', brand: 'Premium Craft', seller: 'Resmi Satıcı', isNew: true, isFreeShipping: true, isFastDelivery: true, color: 'black', size: 'M', gender: 'Erkek', images: [clock5, clock1], description: 'Spor ve günlük kullanım için ideal kronometreli saat. Silikon kayışı ve ışıltılı kadranı ile karanlıkta okunabilir.', features: ['Kronometre', 'Silikon Kayış', 'Karanlıkta Parlayan', '100M Su Geçirmez'], colors: COLORS, sizes: [{ name: 'M', inStock: true }] },
];

// Push HOME_PRODUCTS into the main array with unique IDs
HOME_PRODUCTS.forEach(p => MOCK_PRODUCTS.push(p));
