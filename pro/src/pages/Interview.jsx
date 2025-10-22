import React, {useEffect, useRef, useState} from 'react'
import { useAuth } from '../utils/auth'
import { useNavigate } from 'react-router-dom'
import { saveSession } from '../utils/data'

const BANKS = {
  'Software Development': [
    'Tell me about yourself and your experience in software development.',
    'Describe a challenging technical problem you solved recently.',
    'How do you approach debugging a complex issue in production.',
    'Explain your experience with REST APIs.',
    'How do you ensure code quality and testing.'
  ],
  'Data Science': [
    'How do you approach a new data problem end-to-end?',
    'Explain bias-variance tradeoff with an example.',
    'Describe a project where you improved model performance.',
    'How do you validate a ML model in production?',
    'Explain feature engineering steps for tabular data.'
  ],
  'Product Management': [
    'How do you prioritize features?',
    'Tell me about a time you handled stakeholder conflict.',
    'Describe your process for user research.',
    'How do you measure product success?',
    'Explain writing a product requirements document.'
  ],
  'Marketing': [
    'How do you design a marketing funnel?',
    'Describe a campaign you led and its results.',
    'How do you measure ROI for marketing activities?',
    'Explain A/B testing in marketing context.',
    'How do you segment audiences?'
  ]
}

export default function Interview(){
  const {user} = useAuth()
  const nav = useNavigate()
  useEffect(()=>{ if(!user) nav('/auth') },[user])

  const selDomain = sessionStorage.getItem('ai_domain') || 'Software Development'
  const selCount = parseInt(sessionStorage.getItem('ai_count') || '5',10)
  const bank = BANKS[selDomain] || BANKS['Software Development']
  const questions = Array.from({length: selCount}, (_,i)=> bank[i % bank.length])

  const [idx,setIdx] = useState(0)
  const [answers,setAnswers] = useState({}) // stores {idx: {dataUrl, size, type} }
  const [recording,setRecording] = useState(false)
  const [mediaSupported,setMediaSupported] = useState(true)
  const recorderRef = useRef(null)
  const chunksRef = useRef([])

  useEffect(()=>{ if(!navigator.mediaDevices) setMediaSupported(false) },[])

  async function startRecording(){
    if(!navigator.mediaDevices) return setMediaSupported(false)
    const stream = await navigator.mediaDevices.getUserMedia({audio:true})
    const mr = new MediaRecorder(stream)
    chunksRef.current = []
    mr.ondataavailable = e => { if(e.data.size>0) chunksRef.current.push(e.data) }
    mr.onstop = async () => {
      const blob = new Blob(chunksRef.current, {type: 'audio/webm'})
      const reader = new FileReader()
      reader.onload = ()=>{
        const dataUrl = reader.result
        setAnswers(a=>({...a, [idx]: {dataUrl, size: blob.size, type: blob.type}}))
      }
      reader.readAsDataURL(blob)
      stream.getTracks().forEach(t=>t.stop())
    }
    recorderRef.current = mr
    mr.start()
    setRecording(true)
  }

  function stopRecording(){
    if(recorderRef.current && recorderRef.current.state !== 'inactive'){
      recorderRef.current.stop()
      setRecording(false)
    }
  }

  function toggleRec(){ if(recording) stopRecording(); else startRecording() }

  function prev(){ setIdx(i=> Math.max(0,i-1)) }
  function next(){
    if(idx < questions.length-1) setIdx(i=>i+1)
    else finish()
  }
  function finish(){
    const id = 's_'+Date.now()
    const score = Math.floor(60 + Math.random()*35)
    const tone = Math.floor(60 + Math.random()*40)
    const clarity = Math.floor(70 + Math.random()*30)
    const content = Math.floor(55 + Math.random()*45)
    const session = { id, user: user.email, date: new Date().toISOString(), questions, answers, score, tone, clarity, content, domain: selDomain }
    saveSession(session)
    nav('/results/'+id)
  }

  const progress = Math.round(((idx+1)/questions.length)*100)

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow text-slate-900">
      <div className="flex items-center justify-between mb-4">
        <button onClick={()=>nav('/')} className="text-sm border px-3 py-1 rounded">Exit Interview</button>
        <div className="text-sm text-gray-600">Question {idx+1} of {questions.length}</div>
      </div>

      <div className="h-2 bg-gray-200 rounded mb-6">
        <div style={{width:progress+'%'}} className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded"></div>
      </div>

      <div className="mb-4 p-4 bg-indigo-50 border rounded">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold">Question {idx+1}</h3>
          <button className="text-sm border px-2 py-1 rounded">Listen</button>
        </div>
        <p className="mt-2">{questions[idx]}</p>
      </div>

      <div className="mb-6 p-6 bg-indigo-50 border rounded text-center">
        {!mediaSupported && <div className="text-red-600">Audio recording not supported in this browser.</div>}
        <p className="mb-4 text-sm text-gray-600">Your Response — click the button to start recording</p>
        <button onClick={toggleRec} className={"w-24 h-24 rounded-full flex items-center justify-center mx-auto transition-all " + (recording ? 'bg-red-500 text-white scale-95' : 'bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:scale-105')}>
          {recording ? 'Stop' : 'Rec'}
        </button>
        <p className="mt-3 text-sm text-gray-500">{answers[idx] ? 'Saved answer — you can play it in Results' : (recording ? 'Recording...' : 'Click to start recording')}</p>
      </div>

      <div className="flex justify-between">
        <button onClick={prev} disabled={idx===0} className="px-4 py-2 border rounded disabled:opacity-50">Previous</button>
        <button onClick={next} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded">{idx<questions.length-1 ? 'Next Question' : 'Finish Interview'}</button>
      </div>
    </div>
  )
}