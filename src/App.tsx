import React from 'react';
import Editor from './components/Editor';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-3 tracking-tight">WYSIWYG Editor</h1>
        <p className="text-lg text-gray-600 leading-relaxed">A powerful rich text editor with advanced formatting options and AI assistance.</p>
      </div>
      <Editor />
    </div>
  );
}

export default App;