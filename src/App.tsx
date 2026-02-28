/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  Loader2,
  ClipboardCheck,
  Award,
  Target,
  Layout,
  Cpu
} from 'lucide-react';
import Markdown from 'react-markdown';
import { analyzeResume } from './services/geminiService';
import { cn } from './lib/utils';

export default function App() {
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError('Please paste your resume content first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeResume(resumeText);
      if (result) {
        setAnalysis(result);
        // Scroll to results after a short delay to allow rendering
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        setError('Failed to analyze resume. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during analysis. Please check your connection and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResumeText('');
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <Cpu className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Elite<span className="text-emerald-600">AI</span> Resume
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
            <span className="flex items-center gap-1.5"><Target className="w-4 h-4" /> ATS Optimized</span>
            <span className="flex items-center gap-1.5"><Award className="w-4 h-4" /> Expert Insights</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left Column: Input */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl"
              >
                Optimize Your Career <br />
                <span className="text-emerald-600">With AI Precision.</span>
              </motion.h1>
              <p className="text-lg text-gray-600 max-w-md">
                Paste your resume below. Our elite AI strategist will analyze it against industry standards and ATS algorithms.
              </p>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    Resume Content
                  </div>
                  <button 
                    onClick={handleReset}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Clear Text
                  </button>
                </div>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here (e.g., Experience, Skills, Education)..."
                  className="w-full h-[400px] p-6 text-gray-700 placeholder:text-gray-300 focus:outline-none resize-none font-mono text-sm leading-relaxed"
                />
                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                  <button
                    onClick={handleAnalyze}
                    disabled={isLoading || !resumeText.trim()}
                    className={cn(
                      "w-full py-4 px-6 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg",
                      isLoading || !resumeText.trim() 
                        ? "bg-gray-400 cursor-not-allowed" 
                        : "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] shadow-emerald-200"
                    )}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing with AI...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Analyze Resume
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 text-sm"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </motion.div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7" ref={resultRef}>
            <AnimatePresence mode="wait">
              {!analysis && !isLoading ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-gray-200 rounded-3xl bg-white/50"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Search className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Ready for Analysis</h3>
                  <p className="text-gray-500 max-w-xs">
                    Your detailed report will appear here once you click the analyze button.
                  </p>
                </motion.div>
              ) : isLoading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center p-12 space-y-8"
                >
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-emerald-100 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">Processing Resume</h3>
                    <p className="text-gray-500 animate-pulse">Our AI is scanning for keywords, skills, and impact metrics...</p>
                  </div>
                  <div className="w-full max-w-md space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-4 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ x: '-100%' }}
                          animate={{ x: '100%' }}
                          transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                          className="h-full w-1/2 bg-emerald-200"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-3xl border border-gray-200 shadow-2xl shadow-gray-200/50 overflow-hidden"
                >
                  <div className="p-8 md:p-12">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                        <ClipboardCheck className="text-emerald-600 w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Analysis Report</h2>
                        <p className="text-sm text-gray-500">Generated by Elite AI Strategist</p>
                      </div>
                    </div>

                    <div className="prose prose-emerald max-w-none 
                      prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900
                      prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-100
                      prose-p:text-gray-600 prose-p:leading-relaxed
                      prose-li:text-gray-600
                      prose-strong:text-gray-900
                      markdown-body
                    ">
                      <Markdown>{analysis || ''}</Markdown>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Analysis complete and verified
                      </div>
                      <button 
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-all active:scale-95"
                      >
                        <TrendingUp className="w-4 h-4" />
                        Export Report
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span className="font-bold tracking-tight text-gray-900">EliteAI</span>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Elite AI Resume Strategist. Powered by Gemini 3.1 Pro.
          </p>
        </div>
      </footer>
    </div>
  );
}
