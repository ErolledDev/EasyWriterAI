import React from 'react';
import Editor from './components/Editor';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Tiptap Editor</h1>
        <p className="text-gray-600">A powerful rich text editor with AI assistance</p>
      </div>
      <Editor />
    </div>
  );
}

export default App;