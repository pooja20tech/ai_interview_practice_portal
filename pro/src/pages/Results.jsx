import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadSessions } from '../utils/data';

export default function Results(){
  const {id} = useParams();
  const nav = useNavigate();
  const sessions = loadSessions();
  let session = null;
  if(id === 'last') session = sessions[0];
  else session = sessions.find(s=>s.id===id);
  if(!session) return <div className="max-w-2xl mx-auto bg-white p-6 rounded">No results found</div>;

  return (
    <div className="max-w-5xl mx-auto bg-gray-100 p-6 rounded-xl shadow-lg text-slate-900">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Interview Results</h2>
        <button onClick={()=>nav('/dashboard')} className="text-sm border px-3 py-1 rounded bg-white shadow">Back</button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-inner mb-6 text-center">
        <h3 className="text-xl font-bold mb-2">Interview Results</h3>
        <div className="text-5xl font-extrabold text-teal-600">{session.score} / 100</div>
        <div className="text-sm text-gray-600 mt-2">Domain: {session.domain}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white rounded-xl shadow border">
          <div className="text-xs text-gray-500">Tone</div>
          <div className="text-2xl font-bold text-teal-600">{session.tone} / 100</div>
        </div>
        <div className="p-4 bg-white rounded-xl shadow border">
          <div className="text-xs text-gray-500">Confidence</div>
          <div className="text-2xl font-bold text-teal-600">{session.confidence} / 100</div>
        </div>
        <div className="p-4 bg-white rounded-xl shadow border">
          <div className="text-xs text-gray-500">Clarity</div>
          <div className="text-2xl font-bold text-teal-600">{session.clarity} / 100</div>
        </div>
        <div className="p-4 bg-white rounded-xl shadow border">
          <div className="text-xs text-gray-500">Content</div>
          <div className="text-2xl font-bold text-teal-600">{session.content} / 100</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="font-semibold mb-3">Detailed Feedback</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-bold text-sm mb-2 text-green-600">Strengths</h4>
            <ul className="list-disc ml-4 text-sm text-gray-700 space-y-1">
              <li>{session.strengths?.length > 0 ? session.strengths[0] : 'Good pace and tone throughout.'}</li>
              <li>{session.strengths?.length > 1 ? session.strengths[1] : 'Good use of specific examples.'}</li>
              <li>{session.strengths?.length > 2 ? session.strengths[2] : 'Clear and concise responses.'}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-2 text-red-600">Areas for Improvement</h4>
            <ul className="list-disc ml-4 text-sm text-gray-700 space-y-1">
              <li>{session.improvements?.length > 0 ? session.improvements[0] : 'Elaborate more on specific skills or technologies.'}</li>
              <li>{session.improvements?.length > 1 ? session.improvements[1] : 'Reduce the use of filler words like "um" and "uh".'}</li>
              <li>{session.improvements?.length > 2 ? session.improvements[2] : 'Expand on your project experiences with more detail.'}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Detailed Question Analysis</h3>
        {session.questions.map((q,i)=> (
          <div key={i} className="mb-3 p-3 border rounded bg-white">
            <div className="text-sm font-medium">Question {i+1}</div>
            <div className="text-sm text-gray-700 mt-1">{q}</div>
            <div className="text-sm text-gray-500 mt-2">Your answer: {session.answers[i] ? (
              <div className="flex items-center gap-3">
                <audio controls src={session.answers[i].dataUrl}></audio>
                <a href={session.answers[i].dataUrl} download={`answer_${session.id}_${i}.webm`} className="text-sm text-purple-600">Download</a>
              </div>
            ) : 'No recording'}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold mb-2">Overall Feedback</h3>
        <p className="text-sm text-gray-700">
          Your overall performance was strong. You showed good understanding of the topics. You provided relevant examples and demonstrated your experience well. To improve, consider working on the areas mentioned above to further enhance your interview skills.
        </p>
      </div>
    </div>
  )
}