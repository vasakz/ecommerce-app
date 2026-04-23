import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';

// Pages
import Home from './pages/Home/Home'
import NotFound from './pages/NotFound/NotFound'
import Register from './pages/Auth/Register/Register'
import Login from './pages/Auth/Login/Login'
import ForgotPassword from './pages/Auth/ForgotPassword/ForgotPassword'
import Atolye from './pages/Atolye/Atolye'
import AtolyelerListesi from './pages/Atolye/AtolyelerListesi'
import AtolyeDetay from './pages/Atolye/AtolyeDetay'
import Cart from './pages/Cart/Cart'
import Favorites from './pages/Favorites/Favorites'
import Payment from './pages/Payment/Payment'
import Products from './pages/Products/Products'
import ProductDetail from './pages/ProductDetail/ProductDetail'
import Kampanyalar from './pages/Kampanyalar/Kampanyalar'
import KampanyaDetail from './pages/Kampanyalar/KampanyaDetail'
import Profile from './pages/Profile/Profile'
import MyOrders from './pages/Orders/MyOrders'
import OrderDetail from './pages/Orders/OrderDetail'
import OrderAction from './pages/Orders/OrderAction'
import Support from './pages/Support/Support'
import SaticiKayit from './pages/Satici/SaticiKayit'
import SaticiProfil from './pages/Satici/SaticiProfil'
import AtolyeUrunDetay from './pages/Atolye/AtolyeUrunDetay';

// Seller Pages
import ProductManagement from './pages/Seller/ProductManagement'
import OrderRequests from './pages/Seller/OrderRequests'
import AddProduct from './pages/Seller/AddProduct'
import OrderManagement from './pages/Seller/OrderManagement'
import StoreCalendar from './pages/Seller/StoreCalendar'
import StatisticsDashboard from './pages/Seller/StatisticsDashboard'
import FinancialManagement from './pages/Seller/FinancialManagement'
import ShippingManagement from './pages/Seller/ShippingManagement'
import AddAtolyeProduct from './pages/Seller/AddAtolyeProduct'

// Admin Pages
import AdminLogin from './pages/Admin/AdminLogin'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminUsers from './pages/Admin/AdminUsers'
import AdminOrders from './pages/Admin/AdminOrders'
import AdminProducts from './pages/Admin/AdminProducts'
import AdminSellers from './pages/Admin/AdminSellers'
import AdminLayout from './pages/Admin/AdminLayout'

// Layout
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

function Layout() {
  const location = useLocation()

  const hideFooterRoutes = ['/kayit-ol', '/giris-yap', '/sifremi-unuttum']
  const hideNavbarRoutes = ['/satici-kayit', '/satici-panel', '/satici-giris', '/admin']

  const shouldHideFooter = hideFooterRoutes.includes(location.pathname)
  const shouldHideNavbar = hideNavbarRoutes.some(r =>
    location.pathname.startsWith(r)
  )

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        {/* Ana Sayfa */}
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/kayit-ol" element={<Register />} />
        <Route path="/giris-yap" element={<Login />} />
        <Route path="/sifremi-unuttum" element={<ForgotPassword />} />

        {/* Atölye */}
        <Route path="/atolye" element={<Atolye />} />
        <Route path="/atolyeler" element={<AtolyelerListesi />} />
        <Route path="/atolyeler/:id" element={<AtolyeDetay />} />
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

        {/* Siparişler */}
        <Route path="/siparislerim" element={<MyOrders />} />
        <Route path="/siparislerim/:id" element={<OrderDetail />} />
        <Route path="/siparislerim/:id/islem" element={<OrderAction />} />

        {/* Destek */}
        <Route path="/destek" element={<Support />} />

        {/* Seller */}
        <Route path="/satici/urunler" element={<ProductManagement />} />
        <Route path="/satici/urun-ekle" element={<AddProduct />} />
        <Route path="/satici/atolye-urun-ekle" element={<AddAtolyeProduct />} />
        <Route path="/satici/urun-duzenle/:id" element={<AddProduct />} />
        <Route path="/satici/siparisler" element={<OrderManagement />} />
        <Route path="/satici/talepler" element={<OrderRequests />} />
        <Route path="/satici/takvim" element={<StoreCalendar />} />
        <Route path="/satici/istatistikler" element={<StatisticsDashboard />} />
        <Route path="/satici/finans" element={<FinancialManagement />} />
        <Route path="/satici/kargo" element={<ShippingManagement />} />

        {/* Satici */}
        <Route path="/satici-kayit" element={<SaticiKayit />} />
        <Route path="/satici/profil/:id" element={<SaticiProfil />} />

        {/* Admin */}
        <Route path="/admin/giris" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="kullanicilar" element={<AdminUsers />} />
          <Route path="siparisler" element={<AdminOrders />} />
          <Route path="urunler" element={<AdminProducts />} />
          <Route path="saticilar" element={<AdminSellers />} />
        </Route>

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