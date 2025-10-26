import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/auth'

export default function Navbar(){
  const {user, logout} = useAuth()
  const nav = useNavigate()
  return (
    <header className="backdrop-blur-sm border-b border-white/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">AI</div>
          <div className="text-white font-extrabold">InterviewAI</div>
        </div>
        <nav className="flex items-center gap-4 text-white">
          <Link to="/" className="hover:underline">Home</Link>
          {user && <Link to="/dashboard" className="hover:underline">Dashboard</Link>}
          {user && <Link to="/results/last" className="hover:underline">Results</Link>}
          {!user && <Link to="/auth" className="px-3 py-1 bg-white/10 rounded">Login / Sign up</Link>}
          {user && <button onClick={()=>{logout(); nav('/')}} className="px-3 py-1 bg-white/10 rounded">Sign out</button>}
        </nav>
      </div>
    </header>
  )
}