import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Wand2, 
  Sparkles, 
  Code2, 
  Feather, 
  Zap, 
  Box, 
  Puzzle, 
  Brain,
  Github,
  ArrowRight,
  CheckCircle2,
  Star,
  Award
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Feather className="w-6 h-6 text-purple-500" />
                <Sparkles className="w-3 h-3 text-blue-500 absolute -top-1 -right-1" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                EasyWriterAI
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a href="https://github.com/yourusername/easywriterai" 
                 className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <ThemeToggle />
              <Link 
                to="/editor"
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                Try Editor <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 mb-8">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Beta Release - Free to Use</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Headless WYSIWYG with
            <br />
            Intelligent AI Assistance
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            Transform your writing experience with our powerful, framework-agnostic editor
            powered by advanced AI capabilities. Built for developers, designed for everyone.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/editor"
              className="inline-flex items-center gap-2 px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <Wand2 className="w-5 h-5" />
              Try EasyWriterAI
            </Link>
            <a
              href="https://github.com/yourusername/easywriterai"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-all duration-200"
            >
              <Github className="w-5 h-5" />
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-[#111] border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            Everything you need for modern content creation
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Assistance */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Writing</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Enhance your content with intelligent suggestions, rewrites, and improvements powered by advanced AI.
              </p>
            </div>

            {/* Framework Agnostic */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Puzzle className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Framework Agnostic</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Works with any JavaScript framework. Built on top of ProseMirror for reliability and extensibility.
              </p>
            </div>

            {/* Developer Friendly */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Developer Friendly</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Extensive API, TypeScript support, and comprehensive documentation for seamless integration.
              </p>
            </div>

            {/* Real-time Collaboration */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Optimized for performance with real-time updates and smooth interactions.
              </p>
            </div>

            {/* Customizable */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
                <Box className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fully Customizable</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Extensive styling options and modular architecture for complete control over the editor.
              </p>
            </div>

            {/* Open Source */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
                <Github className="w-6 h-6 text-indigo-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">MIT Licensed</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Free and open-source under the MIT license. Use it in commercial projects without restrictions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            Why Choose EasyWriterAI?
          </h2>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <Feather className="w-8 h-8 text-purple-500" />
                  <Sparkles className="w-4 h-4 text-blue-500 absolute -top-1 -right-1" />
                </div>
                <h3 className="text-2xl font-bold">EasyWriterAI</h3>
              </div>

              <ul className="space-y-4">
                {[
                  'Built-in AI assistance',
                  'Modern, intuitive interface',
                  'Real-time collaboration ready',
                  'Framework agnostic',
                  'TypeScript first',
                  'MIT License',
                  'Free during beta',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <Box className="w-8 h-8 text-gray-400" />
                <h3 className="text-2xl font-bold">Traditional Editors</h3>
              </div>

              <ul className="space-y-4">
                {[
                  'Limited or no AI features',
                  'Dated user interfaces',
                  'Complex setup required',
                  'Framework specific',
                  'JavaScript only',
                  'Restrictive licenses',
                  'Expensive pricing',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <Star className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-500 via-purple-600 to-blue-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
            Ready to transform your writing experience?
          </h2>
          <p className="text-xl text-purple-100 mb-12">
            Join the beta and get free access to all features while we perfect the experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/editor"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-lg transition-all duration-200 transform hover:scale-105 hover:bg-purple-50"
            >
              <Wand2 className="w-5 h-5" />
              Try Now - It's Free
            </Link>
            <a
              href="https://github.com/yourusername/easywriterai"
              className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-lg transition-all duration-200 hover:bg-purple-700"
            >
              <Star className="w-5 h-5" />
              Star on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-white dark:bg-[#0A0A0A] border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Feather className="w-6 h-6 text-purple-500" />
                <Sparkles className="w-3 h-3 text-blue-500 absolute -top-1 -right-1" />
              </div>
              <span className="text-xl font-bold">EasyWriterAI</span>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Documentation
              </a>
              <a href="https://github.com/yourusername/easywriterai" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                GitHub
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                License
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} EasyWriterAI. Released under the MIT License.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;