import React from 'react'
import { loadSessions } from '../utils/data'
import { MdOutlineAssessment, MdOutlineStarBorder, MdTrendingUp } from 'react-icons/md';
import { BsCheckCircle } from 'react-icons/bs';

export default function Dashboard(){
  const sessions = loadSessions()
  const total = sessions.length
  const average = total ? Math.round(sessions.reduce((s,a)=>s+a.score,0)/total) : 0
  const best = sessions.reduce((b,a)=> a.score>b? a.score: b, 0)
 const lastScore = sessions[0]?.score || 0;
const secondToLastScore = sessions[1]?.score || lastScore;
const recentChange = lastScore - secondToLastScore;


  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Progress Dashboard</h2>
        <div className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-5 bg-white rounded-lg shadow flex items-center gap-4">
          <MdOutlineAssessment className="text-4xl text-blue-500"/>
          <div>
            <div className="text-sm text-gray-500">Total Interviews</div>
            <div className="text-2xl font-bold text-gray-800">{total}</div>
          </div>
        </div>
        <div className="p-5 bg-white rounded-lg shadow flex items-center gap-4">
          <MdOutlineStarBorder className="text-4xl text-blue-500"/>
          <div>
            <div className="text-sm text-gray-500">Average Score</div>
            <div className="text-2xl font-bold text-gray-800">{average}</div>
          </div>
        </div>
        <div className="p-5 bg-white rounded-lg shadow flex items-center gap-4">
          <BsCheckCircle className="text-4xl text-blue-500"/>
          <div>
            <div className="text-sm text-gray-500">Best Score</div>
            <div className="text-2xl font-bold text-gray-800">{best}</div>
          </div>
        </div>
        <div className="p-5 bg-white rounded-lg shadow flex items-center gap-4">
          <MdTrendingUp className={`text-4xl ${recentChange > 0 ? 'text-green-500' : 'text-red-500'}`}/>
          <div>
            <div className="text-sm text-gray-500">Recent Change</div>
            <div className={`text-2xl font-bold ${recentChange > 0 ? 'text-green-600' : 'text-red-600'}`}>{recentChange}</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="font-semibold text-lg text-gray-800 mb-2">Score Progress Over Time</h3>
        <p className="text-sm text-gray-500 mb-4">View how your score has changed over the last 5 sessions.</p>
        <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
          [Placeholder for Chart]
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold text-lg text-gray-800 mb-4">Performance by Domain</h3>
        <p className="text-sm text-gray-500 mb-4">View your average score across different interview domains.</p>
        
        {/* Placeholder for Domain Performance */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="font-medium text-gray-700">Software Development</div>
            <div className="w-40 bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{width: '74%'}}></div>
            </div>
            <div className="text-gray-600">74</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="font-medium text-gray-700">Data Science</div>
            <div className="w-40 bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{width: '62%'}}></div>
            </div>
            <div className="text-gray-600">62</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="font-medium text-gray-700">Marketing</div>
            <div className="w-40 bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{width: '71%'}}></div>
            </div>
            <div className="text-gray-600">71</div>
          </div>
        </div>
      </div>
    </div>
  )
}