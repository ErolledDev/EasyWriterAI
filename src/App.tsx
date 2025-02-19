import React from 'react';
import Editor from './components/Editor';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white transition-colors duration-200">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="mb-16 text-center py-8">
            <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100">The Editor Framework</h1>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              A headless, framework-agnostic text editor that's focused on stability and reliability.
            </p>
          </div>
          <Editor />
        </div>
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}

export default App;