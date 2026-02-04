import React from 'react';
import { AudioWaveform, MessageSquareText } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="py-10 text-center px-4 bg-white border-b border-slate-100 mb-6 shadow-sm">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="group relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl text-white shadow-xl shadow-indigo-200/50 overflow-hidden transition-transform hover:scale-105 hover:rotate-1">
            <MessageSquareText size={24} className="absolute top-3 left-3 opacity-30 transform -scale-x-100" />
            <AudioWaveform size={32} className="relative z-10" />
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
          </div>
          <div className="flex flex-col items-start">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Vozify
            </h1>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                Text to Speech
              </span>
            </div>
          </div>
        </div>
        <p className="text-slate-500 font-medium text-lg max-w-lg mx-auto leading-relaxed">
          Transforme texto em fala profissional com IA de ponta.
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 pb-12">
           {children}
      </main>
      
      {/* Footer */}
      <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-200 mt-auto bg-white">
        <p>&copy; {new Date().getFullYear()} Vozify. Powered by Gemini AI.</p>
      </footer>
    </div>
  );
};