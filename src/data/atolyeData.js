// src/data/atolyeData.js

import deri1 from '../assets/deri-1.jpeg'
import deri2 from '../assets/deri-2.jpeg'
import deri3 from '../assets/deri-3.jpeg'
import deri4 from '../assets/deri-4.jpeg'
import deri5 from '../assets/deri-5.jpeg'
import deri6 from '../assets/deri-6.jpeg'
import deri7 from '../assets/deri-7.jpeg'
import deri8 from '../assets/deri-8.jpeg'
import deri9 from '../assets/deri-9.jpeg'
import deri10 from '../assets/deri-10.jpeg'
import deri11 from '../assets/deri-11.jpeg'
import deri12 from '../assets/deri-12.jpeg'

import seramikKupa from '../assets/seramik-kupa.jpg'
import deriCuzdan from '../assets/deri-cuzdan.jpg'
import ahsapTahta from '../assets/ahsap-tahta.jpg'
import oyuncakTavsan from '../assets/oyuncak-tavsan.jpg'

import ketenYastik from '../assets/keten-yastik.jpg'
import kumasCanta from '../assets/kumas-canta.jpg'
import makromeSusu from '../assets/makrome-susu.jpg'
import mumSeti from '../assets/mum-seti.jpg'

import deriAtolye1 from '../assets/deri-atolye1.jpg'
import terzi from '../assets/terzi.jpeg'
import oyuncak1 from '../assets/oyuncak1.jpg'

export const urunler = [
  { id: 'u-001', isim: 'DERİ ÇANTA NO.1', fiyat: '1200TL', kategori: 'Deri', altKategori: 'Çanta & Cüzdan', gorseller: [deri1, deri2, deri3, deri4] },
  { id: 'u-002', isim: 'DERİ ÇANTA NO.2', fiyat: '950TL',  kategori: 'Deri', altKategori: 'Çanta & Cüzdan', gorseller: [deri5, deri6, deri7] },
  { id: 'u-003', isim: 'DERİ ÇANTA NO.3', fiyat: '1100TL', kategori: 'Deri', altKategori: 'Çanta & Cüzdan', gorseller: [deri8, deri9, deri10] },
  { id: 'u-004', isim: 'DERİ ÇANTA NO.4', fiyat: '850TL',  kategori: 'Deri', altKategori: 'Çanta & Cüzdan', gorseller: [deri11, deri12] },
]

export const cokSatanlar = [
  { id: 'cs-001', isim: 'EL YAPIMI SERAMİK KUPA', fiyat: '450TL', kategori: 'Mutfak & Sofra', altKategori: 'El Yapımı Seramik', gorseller: [seramikKupa] },
  { id: 'cs-002', isim: 'VINTAGE DERİ CÜZDAN', fiyat: '600TL', kategori: 'Deri', altKategori: 'Çanta & Cüzdan', gorseller: [deriCuzdan] },
  { id: 'cs-003', isim: 'AHŞAP KESME TAHTASI', fiyat: '850TL', kategori: 'Mutfak & Sofra', altKategori: 'Ahşap Mutfak Gereçleri', gorseller: [ahsapTahta] },
  { id: 'cs-004', isim: 'AMİGURUMİ TAVŞAN', fiyat: '350TL', kategori: 'Oyuncak & Çocuk', altKategori: 'Amigurumi Oyuncak', gorseller: [oyuncakTavsan] },
]

export const yeniTasarimlar = [
  { id: 'yt-001', isim: 'KETEN YASTIK KILIFI', fiyat: '300TL', kategori: 'Ev Yaşam & Dekor', altKategori: 'El Yapımı Yastık', gorseller: [ketenYastik] },
  { id: 'yt-002', isim: 'ÖZEL DİKİM KUMAŞ ÇANTA', fiyat: '750TL', kategori: 'Tekstil & Giyim', altKategori: 'Ismarlama Dikiş', gorseller: [kumasCanta] },
  { id: 'yt-003', isim: 'MAKROME DUVAR SÜSÜ', fiyat: '550TL', kategori: 'Ev Yaşam & Dekor', altKategori: 'Makrome & Dokuma', gorseller: [makromeSusu] },
  { id: 'yt-004', isim: 'DOĞAL MUM SETİ', fiyat: '400TL', kategori: 'Ev Yaşam & Dekor', altKategori: 'Mum & Oda Kokusu', gorseller: [mumSeti] },
]

export const kampanyalar = [
  { baslik: 'YAZ KOLEKSİYONU', altBaslik: '%30\'a Kadar İndirim', aciklama: 'Seçili deri çanta ve aksesuarlarda yaz sezonu indirimleri başladı.', renk: 'from-amber-900 to-stone-800', rozet: 'SINIRLI SÜRE', rozetRenk: 'bg-amber-500', gorsel: deriAtolye1 },
  { baslik: 'İLK SİPARİŞİNE ÖZEL', altBaslik: '%15 İndirim Kodu', aciklama: 'ATOLYE15 koduyla ilk siparişinde anında indirim kazan.', renk: 'from-teal-900 to-stone-800', rozet: 'YENİ ÜYE', rozetRenk: 'bg-teal-500', gorsel: oyuncak1 },
  { baslik: 'ÖZEL DİKİM HAFTALARI', altBaslik: 'Ücretsiz Kargo + Hediye Paket', aciklama: 'Terzihane koleksiyonunda bu hafta tüm siparişlerde ücretsiz kargo.', renk: 'from-rose-900 to-stone-800', rozet: 'BU HAFTA', rozetRenk: 'bg-rose-500', gorsel: terzi },
]

export const kategoriler = [
  { baslik: 'Deri', renk: 'text-stone-800', alt: ['Çanta & Cüzdan', 'Kemer & Aksesuar', 'Deri Defter Kapağı'], vitrinId: 'bu-hafta' },
  { baslik: 'Mutfak & Sofra', renk: 'text-amber-700', alt: ['Ahşap Mutfak Gereçleri', 'El Yapımı Seramik'], vitrinId: 'cok-satanlar' },
  { baslik: 'Ev Yaşam & Dekor', renk: 'text-teal-700', alt: ['Mum & Oda Kokusu', 'Makrome & Dokuma', 'El Yapımı Yastık'], vitrinId: 'yeni-tasarimlar' },
  { baslik: 'Tekstil & Giyim', renk: 'text-rose-700', alt: ['Örgü & Tığ İşi', 'Ismarlama Dikiş'], vitrinId: null },
  { baslik: 'Oyuncak & Çocuk', renk: 'text-rose-700', alt: ['Amigurumi Oyuncak', 'Ahşap Oyun Seti'], vitrinId: null },
]

export const atolyelerVerisi = [
  { id: 'mila-deri', isim: 'Mila Vintage Deri', kategori: 'Deri', lokasyon: 'İstanbul', puan: '4.9', degerlendirmeSayisi: 128, avatar: deriAtolye1, heroBanner: deriAtolye1, heroBannerAlt: 'Mila Vintage Deri Atölye', aciklama: 'Derinin yaşanmışlığını ve karakterini yansıtan koleksiyonlarımız...', urunler: urunler },
  { id: 'ozel-dikim', isim: 'Özel Dikim Terzihanesi', kategori: 'Tekstil & Giyim', lokasyon: 'İzmir', puan: '4.7', degerlendirmeSayisi: 85, avatar: terzi, heroBanner: terzi, heroBannerAlt: 'Özel Dikim Terzihanesi', aciklama: 'Milimetrik hesaplamalar, usta işi tebeşir çizgileri...', urunler: yeniTasarimlar },
  { id: 'amigurumi', isim: 'Amigurumi Tales', kategori: 'Oyuncak & Çocuk', lokasyon: 'Ankara', puan: '5.0', degerlendirmeSayisi: 240, avatar: oyuncak1, heroBanner: oyuncak1, heroBannerAlt: 'Amigurumi Tales Atölye', aciklama: 'Çocuklar ve ruhu çocuk kalanlar için organik pamuk iplerle örülmüş...', urunler: [ cokSatanlar[3] ] }
]