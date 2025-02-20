import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Editor from './components/Editor';
import Homepage from './components/Homepage';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/editor" element={
          <div className="min-h-screen bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white transition-colors duration-200">
            <div className="max-w-screen-lg mx-auto px-4">
              <Editor />
            </div>
          </div>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;