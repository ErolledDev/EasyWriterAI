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
  Award,
  Users,
  Globe,
  Shield,
  Laptop,
  MessageSquare,
  FileText,
  Coffee
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
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Features</a>
              <a href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Testimonials</a>
              <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</a>
              <a href="https://github.com/yourusername/easywriterai" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
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
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 dark:from-purple-500/5 dark:to-blue-500/5" />
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 mb-8">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Beta Release - Free to Use</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8">
            <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Write Smarter,
              <br />
              Not Harder
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            Transform your writing experience with our powerful, AI-powered editor.
            Get intelligent suggestions, perfect your tone, and create content faster than ever.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/editor"
              className="inline-flex items-center gap-2 px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <Wand2 className="w-5 h-5" />
              Try EasyWriterAI Free
            </Link>
            <a
              href="https://github.com/yourusername/easywriterai"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-all duration-200"
            >
              <Github className="w-5 h-5" />
              Star on GitHub
            </a>
          </div>

          {/* Social Proof */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-purple-500">10k+</span>
              <span className="text-gray-600 dark:text-gray-400">Active Users</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-blue-500">4.9/5</span>
              <span className="text-gray-600 dark:text-gray-400">User Rating</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-purple-500">1M+</span>
              <span className="text-gray-600 dark:text-gray-400">Documents Created</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-blue-500">99.9%</span>
              <span className="text-gray-600 dark:text-gray-400">Uptime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 bg-gray-50 dark:bg-[#111] border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            Everything you need for modern content creation
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Assistance */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Writing</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Enhance your content with intelligent suggestions, rewrites, and improvements powered by advanced AI.
              </p>
            </div>

            {/* Framework Agnostic */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Puzzle className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Framework Agnostic</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Works with any JavaScript framework. Built on top of ProseMirror for reliability and extensibility.
              </p>
            </div>

            {/* Developer Friendly */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Code2 className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Developer Friendly</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Extensive API, TypeScript support, and comprehensive documentation for seamless integration.
              </p>
            </div>

            {/* Real-time Collaboration */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Collaboration</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Work together in real-time with your team. See changes instantly as they happen.
              </p>
            </div>

            {/* Global Access */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Access</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access your documents from anywhere. Cloud-based storage keeps your content safe and accessible.
              </p>
            </div>

            {/* Enterprise Security */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-indigo-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Bank-grade encryption and security measures keep your data protected at all times.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            Loved by writers worldwide
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80"
                  alt="Sarah Johnson"
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Content Creator</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "EasyWriterAI has transformed my content creation process. The AI suggestions are incredibly helpful, and the interface is a joy to use."
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
                  alt="David Chen"
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                  <h4 className="font-semibold">David Chen</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Technical Writer</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "The code block support and markdown export features are perfect for technical documentation. Best editor I've used."
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
                  alt="Emma Davis"
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                  <h4 className="font-semibold">Emma Davis</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Marketing Manager</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "The tone adjustment features help us maintain consistent brand voice across all our content. It's like having a writing assistant."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-gray-50 dark:bg-[#111] border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            Simple, transparent pricing
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold mb-4">Free</h3>
              <p className="text-4xl font-bold mb-6">$0<span className="text-lg text-gray-600 dark:text-gray-400">/mo</span></p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Basic editor features</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>5 AI suggestions/day</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Export to PDF & HTML</span>
                </li>
              </ul>
              <Link
                to="/editor"
                className="block w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 text-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-purple-500 p-8 rounded-xl border border-purple-400 transform scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Pro</h3>
              <p className="text-4xl font-bold mb-6 text-white">$15<span className="text-lg text-purple-200">/mo</span></p>
              <ul className="space-y-4 mb-8 text-white">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>All Free features</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Unlimited AI suggestions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Advanced formatting</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Link
                to="/editor"
                className="block w-full py-2 px-4 bg-white text-purple-500 text-center rounded-lg hover:bg-purple-50 transition-colors"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Enterprise Tier */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
              <p className="text-4xl font-bold mb-6">Custom</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>All Pro features</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Dedicated support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>SLA guarantee</span>
                </li>
              </ul>
              <a
                href="mailto:enterprise@easywriterai.com"
                className="block w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 text-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Contact Sales
              </a>
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
            Join thousands of writers who have already improved their workflow with EasyWriterAI.
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Features</a> </li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Community</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Partners</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Privacy</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Terms</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Security</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Feather className="w-6 h-6 text-purple-500" />
                <Sparkles className="w-3 h-3 text-blue-500 absolute -top-1 -right-1" />
              </div>
              <span className="text-xl font-bold">EasyWriterAI</span>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <MessageSquare className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <FileText className="w-5 h-5" />
              </a>
              <a href="https://github.com/yourusername/easywriterai" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Coffee className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} EasyWriterAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;