# 🛍️ E-Ticaret Web Uygulaması

Modern ve kullanıcı dostu bir e-ticaret platformu. Müşteri, satıcı ve admin panellerini içeren tam kapsamlı bir web uygulaması.

## 🚀 Teknolojiler

- **React + Vite** — Hızlı ve modern frontend geliştirme
- **Tailwind CSS** — Utility-first CSS framework
- **Firebase** — Backend ve veritabanı
- **Redux Toolkit** — State yönetimi
- **React Router DOM** — Sayfa yönlendirme
- **React Hook Form + Yup** — Form yönetimi ve doğrulama
- **Axios + TanStack React Query** — API istekleri
- **React Toastify** — Bildirimler

## 📁 Proje Yapısı
```
src/
├── assets/           → Görseller ve ikonlar
├── components/       → Tekrar kullanılabilir bileşenler
│   ├── common/       → Button, Input, Modal
│   ├── layout/       → Navbar, Footer, Sidebar
│   └── ui/           → Card, Badge, Spinner
├── pages/            → Sayfalar
├── store/            → Redux store ve slice'lar
├── services/         → Firebase ve API işlemleri
├── hooks/            → Custom hook'lar
├── utils/            → Yardımcı fonksiyonlar
└── constants/        → Sabit değerler
```

## ⚙️ Kurulum
```bash
# Projeyi klonla
git clone https://github.com/vasakz/ecommerce-app.git

# Klasöre gir
cd ecommerce-app

# Paketleri yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

## 🌿 Branch Yapısı

- **main** — Kararlı, canlıya hazır kod
- **basakco** — Aktif geliştirme branch'i

## 📌 Özellikler

- 🛒 Ürün listeleme ve detay sayfası
- 🛍️ Sepet yönetimi
- 👤 Müşteri / Satıcı / Admin panelleri
- 🔐 Firebase Authentication ile giriş sistemi
- 📦 Sipariş ve kargo takibi
- 💳 Ödeme sistemi
- 🌙 Dark / Light mod
