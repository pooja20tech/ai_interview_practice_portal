import React from "react";
// 🎯 Import useNavigate from react-router-dom
import { useNavigate } from "react-router-dom"; 

// 🎯 Component no longer needs the 'onStart' prop
const Instructions = () => {
    // 🎯 Initialize the hook for navigation
    const navigate = useNavigate();

    // 🎯 Define the internal function to handle the button click
    const handleStartInterview = () => {
        // Navigate to the Interview page
        navigate('/interview'); 
    };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">
          Interview Guidelines
        </h1>

        <p className="text-gray-600 mb-6">
          Please read all the instructions carefully before starting your
          interview. Once you proceed, you’ll begin answering your questions.
        </p>

        <ul className="text-left list-disc list-inside text-gray-700 space-y-2 mb-8">
          <li>This interview is system-based — no camera access is required.</li>
          <li>
            Please allow microphone access .
          </li>
          <li>Ensure a stable internet connection throughout the process.</li>
          <li>
            Do not refresh or close the browser window once the interview has
            started.
          
           
          </li>
          <li>
            Make sure you are in a quiet environment with minimal background
            noise.
          </li>
          <li>Read each question carefully before submitting your response.</li>
          <li>
            Your answers will be automatically saved and analyzed after you
            complete the test.
          </li>
          <li>Click “Start Interview” only when you are ready to begin.</li>
        </ul>

        <button
          onClick={handleStartInterview} // 🎯 Use the internal handler
          className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition-all"
        >
          I Understand, Start Interview
        </button>
      </div>
    </div>
  );
};

export default Instructions;