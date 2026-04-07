import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home/Home'
import NotFound from './pages/NotFound/NotFound'
import Register from './pages/Auth/Register/Register'
import Login from './pages/Auth/Login/Login'
import Atolye from './pages/Atolye/Atolye'

import Cart from './pages/Cart/Cart'
import Favorites from './pages/Favorites/Favorites'
import Payment from './pages/Payment/Payment'

import Products from './pages/Products/Products'
import ProductDetail from './pages/ProductDetail/ProductDetail'
import Kampanyalar from './pages/Kampanyalar/Kampanyalar'
import KampanyaDetail from './pages/Kampanyalar/KampanyaDetail'

import ProductManagement from './pages/Seller/ProductManagement'
import AddProduct from './pages/Seller/AddProduct'

import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

function Layout() {
  const location = useLocation()
  const footerGizle = ['/kayit-ol', '/giris-yap']

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kayit-ol" element={<Register />} />
        <Route path="/giris-yap" element={<Login />} />
        <Route path="/atolye" element={<Atolye />} />
        <Route path="/sepet" element={<Cart />} />
        <Route path="/odeme" element={<Payment />} />
        <Route path="/odeme/" element={<Payment />} />
        <Route path="/sepetim/odeme" element={<Payment />} />
        <Route path="/begendiklerim" element={<Favorites />} />

        <Route path="/urunler" element={<Products />} />
        <Route path="/urunler/:id" element={<ProductDetail />} />
        <Route path="/kampanyalar" element={<Kampanyalar />} />
        <Route path="/kampanyalar/:id" element={<KampanyaDetail />} />

        {/* Seller Routes */}
        <Route path="/satici/urunler" element={<ProductManagement />} />
        <Route path="/satici/urun-ekle" element={<AddProduct />} />
        <Route path="/satici/urun-duzenle/:id" element={<AddProduct />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      {!footerGizle.includes(location.pathname) && <Footer />}
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