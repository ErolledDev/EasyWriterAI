import React from 'react';
import Editor from './components/Editor';

function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="mb-16 text-center py-8">
        <h1 className="text-5xl font-bold mb-6 text-gray-100">The Editor Framework</h1>
        <p className="text-xl text-gray-300">
          A headless, framework-agnostic text editor that's focused on stability and reliability.
        </p>
      </div>
      <Editor />
    </div>
  );
}

export default App;