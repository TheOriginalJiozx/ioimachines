import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Services from './pages/Services'
import AdminLogin from './pages/AdminLogin'
import Nav from './components/Nav'
import Footer from './components/Footer'
import './App.css'

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/admin" element={<AdminLogin />} />
      </Routes>
      <Footer />
    </>
  )
}
