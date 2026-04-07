import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

// Pages
import Home from './pages/Home/Home'
import NotFound from './pages/NotFound/NotFound'
import Register from './pages/Auth/Register/Register'
import Login from './pages/Auth/Login/Login'
import Atolye from './pages/Atolye/Atolye'
import AtolyelerListesi from './pages/Atolye/AtolyelerListesi'
import Cart from './pages/Cart/Cart'
import Favorites from './pages/Favorites/Favorites'
import Payment from './pages/Payment/Payment'
import Products from './pages/Products/Products'
import ProductDetail from './pages/ProductDetail/ProductDetail'
import Kampanyalar from './pages/Kampanyalar/Kampanyalar'
import KampanyaDetail from './pages/Kampanyalar/KampanyaDetail'
import Profile from './pages/Profile/Profile'

// Seller Pages
import ProductManagement from './pages/Seller/ProductManagement'
import AddProduct from './pages/Seller/AddProduct'

// Layout
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

function Layout() {
  const location = useLocation()

  const hideFooterRoutes = ['/kayit-ol', '/giris-yap']
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname)

  return (
    <>
      <Navbar />

      <Routes>
        {/* Ana Sayfa */}
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/kayit-ol" element={<Register />} />
        <Route path="/giris-yap" element={<Login />} />

        {/* Atölye */}
        <Route path="/atolye" element={<Atolye />} />
        <Route path="/atolyeler" element={<AtolyelerListesi />} />

        {/* Sepet & Ödeme */}
        <Route path="/sepet" element={<Cart />} />
        <Route path="/odeme" element={<Payment />} />
        <Route path="/sepetim/odeme" element={<Payment />} />

        {/* Favoriler */}
        <Route path="/begendiklerim" element={<Favorites />} />

        {/* Ürünler */}
        <Route path="/urunler" element={<Products />} />
        <Route path="/urunler/:id" element={<ProductDetail />} />

        {/* Kampanyalar */}
        <Route path="/kampanyalar" element={<Kampanyalar />} />
        <Route path="/kampanyalar/:id" element={<KampanyaDetail />} />

        {/* Profil */}
        <Route path="/profil" element={<Profile />} />

        {/* Seller */}
        <Route path="/satici/urunler" element={<ProductManagement />} />
        <Route path="/satici/urun-ekle" element={<AddProduct />} />
        <Route path="/satici/urun-duzenle/:id" element={<AddProduct />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!shouldHideFooter && <Footer />}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}

export default App