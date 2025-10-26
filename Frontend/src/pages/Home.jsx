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

const SAMPLE_QUESTIONS = {
  'Software Development': {
    'Frontend': [
      "What is the virtual DOM in React?",
      "Explain the difference between CSS Grid and Flexbox.",
      "What are hooks in React?",
      "How do you optimize a React application?",
      "Explain event bubbling in JavaScript."
    ],
    'Backend': [
      "What is REST and how do you design RESTful APIs?",
      "Explain middleware in Express.js.",
      "What is the difference between SQL and NoSQL databases?",
      "How do you handle authentication and authorization?",
      "What is caching and why is it important?"
    ],
    'Full Stack': [
      "Explain how frontend and backend communicate.",
      "What is MVC architecture?",
      "How do you manage state in a full-stack app?",
      "Explain API versioning.",
      "How do you handle error logging in full-stack apps?"
    ],
    'MERN Stack': [
      "What is the MERN stack?",
      "Explain CRUD operations in MongoDB.",
      "How does Express handle routing?",
      "How do you connect React frontend with Node backend?",
      "What is JWT and how is it used in MERN apps?"
    ],
    'Mobile Development': [
      "What is the difference between native and cross-platform apps?",
      "Explain the lifecycle of a React Native component.",
      "How do you optimize performance in mobile apps?",
      "What is asynchronous programming in mobile apps?",
      "How do you handle offline data in mobile apps?"
    ]
  },
  'DevOps': {
    'AWS DevOps': [
      "Explain EC2, S3, and Lambda in AWS.",
      "What is CloudFormation?",
      "How do you set up CI/CD pipelines in AWS?",
      "Explain auto-scaling in AWS.",
      "What is IAM and how do you manage roles?"
    ],
    'Azure DevOps': [
      "What are Azure Pipelines?",
      "Explain Infrastructure as Code (IaC) in Azure.",
      "How do you monitor resources in Azure?",
      "What is Azure DevTest Labs?",
      "How do you implement CI/CD in Azure DevOps?"
    ],
    'Kubernetes': [
      "What is a pod in Kubernetes?",
      "Explain services in Kubernetes.",
      "What is a deployment?",
      "How do you scale an application in Kubernetes?",
      "What are ConfigMaps and Secrets?"
    ],
    'CI/CD Pipelines': [
      "What is the purpose of CI/CD?",
      "Explain Jenkins pipelines.",
      "How do you test a CI/CD pipeline?",
      "What is GitHub Actions?",
      "How do you deploy automatically to staging?"
    ],
    'IaC': [
      "What is Terraform?",
      "Explain the concept of state in Terraform.",
      "How do you version infrastructure?",
      "What are modules in IaC?",
      "How do you roll back infrastructure changes?"
    ]
  },
  'Data Science': {
    'Machine Learning': [
      "What is supervised vs unsupervised learning?",
      "Explain overfitting and underfitting.",
      "What is a confusion matrix?",
      "How do you choose hyperparameters?",
      "What is cross-validation?"
    ],
    'Data Analysis': [
      "Explain data cleaning steps.",
      "What are descriptive statistics?",
      "How do you handle missing data?",
      "Explain correlation vs causation.",
      "What is exploratory data analysis (EDA)?"
    ],
    'Data Engineering': [
      "What is ETL?",
      "Explain data pipelines.",
      "What is data warehousing?",
      "How do you optimize SQL queries?",
      "What is schema design?"
    ],
    'Big Data': [
      "What is Hadoop?",
      "Explain MapReduce.",
      "What is Spark?",
      "How do you handle large datasets?",
      "What is distributed computing?"
    ],
    'Business Intelligence': [
      "What is BI and its purpose?",
      "Explain dashboards and KPIs.",
      "What is data visualization?",
      "How do you track metrics for decision making?",
      "What is ETL in BI context?"
    ]
  }
}


export default function Home(){
  const nav = useNavigate()
  const {user} = useAuth()
  
  // State to manage the selected domain
  const [selectedDomain, setSelectedDomain] = useState('Software Development');

  async function goStart() { 
  const domain = document.getElementById('domain').value;
  const specialization = document.getElementById('specialization')?.value || '';
  const skills = document.getElementById('skills')?.value || '';
  const experience = document.getElementById('experience')?.value || '';
  const count = document.getElementById('count').value;

    const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
  
  // Save to session storage
  sessionStorage.setItem('ai_domain', domain);
  sessionStorage.setItem('ai_specialization', specialization);
  sessionStorage.setItem('ai_skills', JSON.stringify(skillsArray)); // save as JSON
  sessionStorage.setItem('ai_experience', experience);
  sessionStorage.setItem('ai_count', count);

  // Create request body for Flask backend
  const requestData = {
  domain,
  subdomain: specialization,
  skills: skillsArray, // <-- currently sending raw string, should send array
  experience,
  question_count: parseInt(count)
};


  try {
    const response = await fetch("http://127.0.0.1:5000/api/interview/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Something went wrong!");
      return;
    }

    // Store the received questions for use in Interview.js
    sessionStorage.setItem('ai_questions', JSON.stringify(data.questions));

    // Navigate to interview page
    nav(user ? '/interview' : '/auth');
  } catch (error) {
    console.error("Error fetching questions:", error);
    alert("Server not responding. Please try again later.");
  }
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