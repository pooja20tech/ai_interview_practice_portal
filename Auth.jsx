import React, { useState } from 'react'
import { useAuth } from '../utils/auth'
import { useNavigate } from 'react-router-dom'

export default function Auth() {
  const [flipped, setFlipped] = useState(false)
  const { login } = useAuth()
  const nav = useNavigate()

  // ------------------- Login -------------------
  async function handleLogin(e) {
    e.preventDefault()
    const fm = new FormData(e.target)
    const email = fm.get('email')
    const pass = fm.get('password')

    if (!email && !pass) return alert('Please enter your email and password.')
    if (!email || !email.includes('@')) return alert('Please enter a valid email address.')
    if (!pass) return alert('Please enter your password.')

    try {
      const res = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      })

      const data = await res.json()

      if (res.ok) {
        alert('Login successful! Welcome ' + data.name)
        login({ email, name: data.name, token: data.token }) // store JWT in auth
        nav('/interview')
      } else {
        alert('Login failed: ' + data.message)
      }
    } catch (err) {
      console.error(err)
      alert('Login failed: ' + err.message)
    }
  }

  // ------------------- Signup -------------------
  async function handleSignup(e) {
    e.preventDefault()
    const fm = new FormData(e.target)
    const name = fm.get('name')
    const email = fm.get('email')
    const pass = fm.get('password')

    if (!name && !email && !pass) return alert('Please complete all fields.')
    if (!name) return alert('Please enter your full name.')
    if (!email || !email.includes('@')) return alert('Please enter a valid email address.')
    if (!pass) return alert('Please enter a password.')

    try {
      const res = await fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass })
      })

      const data = await res.json()

      if (res.ok) {
        alert('Signup successful!')
        login({ email, name }) // store in auth
        nav('/interview')
      } else {
        alert('Signup failed: ' + data.message)
      }
    } catch (err) {
      console.error(err)
      alert('Signup failed: ' + err.message)
    }
  }

  return (
    <div className="max-w-4xl mx-auto text-slate-900">
      <div className="mb-6 text-white flex items-center gap-4">
        <div className="text-2xl font-extrabold">InterviewAI</div>
        <div className="text-white/80">Sign in or create an account to continue</div>
      </div>

      <div className="auth-wrap mx-auto">
        <div className={'auth-card ' + (flipped ? 'flipped' : '')}>
          <div className="auth-face auth-front" style={{ display: 'flex' }}>
            <div className="left-panel" style={{ flex: 1, color: 'white' }}>
              <h3 className="text-2xl font-semibold mb-2">Welcome Back!</h3>
              <p className="text-sm max-w-sm text-white/90">To keep connected with us please login with your personal info to start interview practice.</p>
              <div className="mt-6">
                <button onClick={() => setFlipped(true)} className="bg-white/10 text-white px-6 py-2 rounded">Sign In</button>
              </div>
            </div>

            <div className="right-panel" style={{ flex: 1 }}>
              <h3 className="text-2xl font-semibold mb-2">Create Account</h3>
              <p className="text-sm text-slate-600 mb-4">or use your email for registration</p>
              <form onSubmit={handleSignup} className="space-y-3">
                <input name="name" placeholder="Full name" className="w-full p-3 border rounded text-slate-900 bg-gray-100 input-focus" />
                <input name="email" placeholder="Email" className="w-full p-3 border rounded text-slate-900 bg-gray-100 input-focus" />
                <input name="password" type="password" placeholder="Password" className="w-full p-3 border rounded text-slate-900 bg-gray-100 input-focus" />
                <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white p-3 rounded">Sign Up</button>
              </form>
            </div>
          </div>

          <div className="auth-face auth-back" style={{ display: 'flex' }}>
            <div className="left-panel" style={{ flex: 1, color: 'white', background: 'linear-gradient(180deg,#ffffff08,#ffffff04)' }}>
              <h3 className="text-2xl font-semibold mb-2">Sign in to InterviewAI</h3>
              <p className="text-sm max-w-sm text-white/90">Enter your personal details and start your journey with us.</p>
              <form onSubmit={handleLogin} className="space-y-3 mt-6 w-full">
                <input name="email" placeholder="Email" className="w-full p-3 border rounded text-slate-900 bg-gray-100 input-focus" />
                <input name="password" type="password" placeholder="Password" className="w-full p-3 border rounded text-slate-900 bg-gray-100 input-focus" />
                <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white p-3 rounded">Sign In</button>
              </form>
            </div>
            <div className="right-panel flex flex-col items-center justify-center p-8 text-center" style={{ flex: 1 }}>
              <h3 className="text-3xl font-bold mb-4">Hello, Friend!</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-xs">Enter your personal details and start your journey with us.</p>
              <div className="mt-6">
                <button onClick={() => setFlipped(false)} className="bg-gray-200 text-gray-800 px-6 py-2 rounded">Sign Up</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
