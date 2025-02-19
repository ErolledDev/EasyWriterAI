import React from 'react';
import Editor from './components/Editor';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">WYSIWYG Editor</h1>
        <p className="text-gray-600">A powerful rich text editor with formatting options.</p>
      </div>
      <Editor />
    </div>
  );
}

export default App;