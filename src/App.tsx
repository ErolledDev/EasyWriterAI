import React from 'react';
import Editor from './components/Editor';

function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-[90rem] mx-auto px-8 py-16">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h1 className="text-5xl font-bold mb-6 text-gray-100">The Editor Framework</h1>
          <p className="text-xl text-gray-300">
            A headless, framework-agnostic text editor that's focused on stability and reliability.
          </p>
        </div>
        <Editor />
      </div>
    </div>
  );
}

export default App;