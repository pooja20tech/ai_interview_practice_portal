import React, { useState } from 'react' // Import useState
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/auth'
import interviewWallpaper from '../assets/AI Interview Practice Portal Illustration.png'; // Make sure this path is correct

// Data structure for dynamic specializations
const specializations = {
  'Software Development': ['Frontend', 'Backend', 'Full Stack', 'MERN Stack', 'Mobile Development'],
  'DevOps': ['AWS DevOps', 'Azure DevOps', 'Kubernetes', 'CI/CD Pipelines', 'Infrastructure as Code (IaC)'],
  'Data Science': ['Machine Learning', 'Data Analysis', 'Data Engineering', 'Big Data', 'Business Intelligence'],
};

export default function Home(){
  const nav = useNavigate()
  const {user} = useAuth()
  
  // State to manage the selected domain
  const [selectedDomain, setSelectedDomain] = useState('Software Development');

  function goStart(){ 
    const domain = document.getElementById('domain').value
    const specialization = document.getElementById('specialization')?.value || ''; // Get specialization
    const skills = document.getElementById('skills')?.value || ''; // Get Key Skills
    const experience = document.getElementById('experience')?.value || ''; // Get Years of Experience
    const count = document.getElementById('count').value
    
    // Save all values to session storage
    sessionStorage.setItem('ai_domain', domain)
    sessionStorage.setItem('ai_specialization', specialization) // New item
    sessionStorage.setItem('ai_skills', skills) // ADDED: Key Skills
    sessionStorage.setItem('ai_experience', experience) // ADDED: Years of Experience
    sessionStorage.setItem('ai_count', count)
    
    nav(user?'/interview':'/auth')
  }

  // Handler to update the selected domain state
  const handleDomainChange = (e) => {
    setSelectedDomain(e.target.value);
  };

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
          <p className="text-xs text-slate-600 mb-4">Let's tailor your mock interview - choose your domain and get started!npm run dev</p>
          <div className="grid grid-cols-1 gap-3">
            
            {/* Domain Dropdown */}
            <select 
              id="domain" 
              className="p-2 border rounded-md text-slate-800 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={selectedDomain} // Control value with state
              onChange={handleDomainChange} // Update state on change
            >
              <option value="Software Development">Software Development</option>
              <option value="DevOps">DevOps</option>
              <option value="Data Science">Data Science</option>
            </select>
            
            {/* Specialization Dropdown (Dynamically rendered) */}
            {selectedDomain && specializations[selectedDomain] && (
              <select 
                id="specialization" 
                className="p-2 border rounded-md text-slate-800 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {specializations[selectedDomain].map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            )}

            {/* ADDED: Key Skills Input (Text Field) */}
            <input 
              id="skills"
              placeholder="Key Skills (comma separated)"
              type="text"
              className="p-2 border rounded-md text-slate-800 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />

            {/* ADDED: Years of Experience Input (Number Field) */}
            <input 
              id="experience"
              placeholder="Years of Experience"
              type="number"
              min="0"
              className="p-2 border rounded-md text-slate-800 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />

            {/* Questions Count Dropdown */}
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