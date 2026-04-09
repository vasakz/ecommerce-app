import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';

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
import SaticiKayit from './pages/Satici/SaticiKayit'
import AtolyeUrunDetay from './pages/Atolye/AtolyeUrunDetay';

// Seller Pages
import ProductManagement from './pages/Seller/ProductManagement'
import AddProduct from './pages/Seller/AddProduct'

// Layout
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

function Layout() {
  const location = useLocation()

  const hideFooterRoutes = ['/kayit-ol', '/giris-yap']
  const hideNavbarRoutes = ['/satici-kayit', '/satici-panel', '/satici-giris']

  const shouldHideFooter = hideFooterRoutes.includes(location.pathname)
  const shouldHideNavbar = hideNavbarRoutes.some(r => location.pathname.startsWith(r))

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        {/* Ana Sayfa */}
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/kayit-ol" element={<Register />} />
        <Route path="/giris-yap" element={<Login />} />

        {/* Atölye */}
        <Route path="/atolye" element={<Atolye />} />
        <Route path="/atolyeler" element={<AtolyelerListesi />} />
        <Route path="/atolye-urun/:id" element={<AtolyeUrunDetay />} />
        
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
         
        {/* Satici*/}
        <Route path="/satici-kayit" element={<SaticiKayit />} />
        

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!shouldHideFooter && !shouldHideNavbar && <Footer />}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      {/* Toaster bileşeni*/}
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: "'Inter', sans-serif", 
          },
        }}
      />
      <Layout />
    </BrowserRouter>
  )
}

export default App