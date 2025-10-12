// src/App.jsx (No further changes needed, it is perfect!)

import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Interview from './pages/Interview'
import Results from './pages/Results'
import Dashboard from './pages/Dashboard'
import Instructions from './pages/Instructions'   // ✅ IMPORTED
import { AuthProvider } from './utils/auth'

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen text-white">
        <Navbar />
        <main className="px-4 md:px-8 lg:px-20 py-10">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/auth' element={<Auth />} />
            <Route path='/instructions' element={<Instructions />} /> {/* ✅ DEFINED */}
            <Route path='/interview' element={<Interview />} />
            <Route path='/results/:id' element={<Results />} />
            <Route path='/dashboard' element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}