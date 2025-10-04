import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Interview from './pages/Interview'
import Results from './pages/Results'
import Dashboard from './pages/Dashboard'
import { AuthProvider } from './utils/auth'

export default function App(){
  return (
    <AuthProvider>
      <div className="min-h-screen text-white">
        <Navbar />
        <main className="px-4 md:px-8 lg:px-20 py-10">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/auth' element={<Auth />} />
            <Route path='/interview' element={<Interview />} />
            <Route path='/results/:id' element={<Results />} />
            <Route path='/dashboard' element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}