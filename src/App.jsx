import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home/Home'
import NotFound from './pages/NotFound/NotFound'
import Register from './pages/Auth/Register/Register'
import Login from './pages/Auth/Login/Login'
import Atolye from './pages/Atolye/Atolye'
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