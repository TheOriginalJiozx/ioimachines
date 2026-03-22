import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { useAppState } from './state/useAppState'

import Nav from './components/Nav'
import Footer from './components/Footer'
import './App.css'

const Home = lazy(() => import('./pages/Home'))
const Services = lazy(() => import('./pages/Services'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const CaseStudies = lazy(() => import('./pages/CaseStudies'))
const Contact = lazy(() => import('./pages/Contact'))
const About = lazy(() => import('./pages/About'))
const FeasibilityStudy = lazy(() => import('./pages/FeasibilityStudy'))
const TurnkeySolutions = lazy(() => import('./pages/TurnkeySolutions'))
const IPCoreLicensing = lazy(() => import('./pages/IPCoreLicensing'))

export default function App() {
  const location = useLocation()
  const { adminToken } = useAppState()

  if (adminToken && location.pathname === '/admin') return <Navigate to='/' replace />

  return (
    <>
      <Nav />
      <Suspense fallback={<div aria-live="polite" className="max-w-6xl mx-auto px-6 py-8">Loading…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/services/feasibility-study" element={<FeasibilityStudy />} />
          <Route path="/services/turnkey-solutions" element={<TurnkeySolutions />} />
          <Route path="/services/ip-core-licensing" element={<IPCoreLicensing />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  )
}
