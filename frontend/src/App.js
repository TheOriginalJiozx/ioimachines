import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Home from './pages/Home'
import Services from './pages/Services'
import AdminLogin from './pages/AdminLogin'
import Nav from './components/Nav'
import Footer from './components/Footer'
import CaseStudies from './pages/CaseStudies'
import './App.css'

export default function App() {
  const location = useLocation()
  const [token] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null))

  if (token && location.pathname === '/admin') return <Navigate to='/' replace />

  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/case-studies" element={<CaseStudies />} />
      </Routes>
      <Footer />
    </>
  )
}
