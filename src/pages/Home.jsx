import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/auth'
import interviewWallpaper from '../assets/AI Interview Practice Portal Illustration.png'; // Make sure this path is correct

export default function Home(){
  const nav = useNavigate()
  const {user} = useAuth()
  function goStart(){ 
    const domain = document.getElementById('domain').value
    const count = document.getElementById('count').value
    sessionStorage.setItem('ai_domain', domain)
    sessionStorage.setItem('ai_count', count)
    nav(user?'/interview':'/auth')
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <section className="text-center my-4">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-white">Master Your Next Interview</h1>
        <p className="mb-4 opacity-90 max-w-xl mx-auto text-white/90 text-sm">Practice with AI-powered interviews, get detailed feedback, and track your progress.</p>
      </section>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/10 p-4 rounded-xl text-white backdrop-blur-sm shadow-md">
          <h3 className="font-semibold mb-1 text-base">Voice Practice</h3>
          <p className="text-xs">Practice speaking with realistic voice interactions and get feedback on delivery.</p>
        </div>
        <div className="bg-white/10 p-4 rounded-xl text-white backdrop-blur-sm shadow-md">
          <h3 className="font-semibold mb-1 text-base">AI Evaluation</h3>
          <p className="text-xs">Get personalized suggestions and strengths/weaknesses.</p>
        </div>
        <div className="bg-white/10 p-4 rounded-xl text-white backdrop-blur-sm shadow-md">
          <h3 className="font-semibold mb-1 text-base">Progress Tracking</h3>
          <p className="text-xs">Monitor improvements over time with a dashboard.</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl bg-white/90 p-6 rounded-xl shadow-2xl flex items-center gap-6">
        <div className="w-1/2">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Start Your Practice Interview</h2>
          <p className="text-xs text-slate-600 mb-4">Choose domain and number of questions. You must be logged in to start.</p>
          <div className="grid grid-cols-1 gap-3">
            <select id="domain" className="p-2 border rounded-md text-slate-800 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
              <option>Software Development</option>
              <option>Data Science</option>
              <option>Product Management</option>
              <option>Marketing</option>
            </select>
            <select id="count" className="p-2 border rounded-md text-slate-800 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" defaultValue="5">
              <option value="3">3 Questions (Quick)</option>
              <option value="5">5 Questions (Standard)</option>
              <option value="8">8 Questions (Comprehensive)</option>
              <option value="10">10 Questions (Full)</option>
            </select>
            <button onClick={goStart} className="bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold px-4 py-2 rounded-md shadow-lg hover:from-purple-700 hover:to-blue-600 transition-colors duration-300">Start Interview</button>
          </div>
        </div>
        <div className="w-1/2 hidden md:block">
          <img src={interviewWallpaper} alt="interview wallpaper" className="rounded-lg shadow-lg" />
        </div>
      </div>
    </div>
  )
}