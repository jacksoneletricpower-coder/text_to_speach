import React from 'react';
import { Mic } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="py-8 text-center px-4">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-200">
            <Mic size={28} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Vozify</h1>
        </div>
        <p className="text-slate-500 font-medium">
          Transforme texto em fala profissional com IA de ponta.
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 pb-12">
           {children}
      </main>
      
      {/* Footer */}
      <footer className="py-6 text-center text-slate-400 text-sm border-t border-slate-200 mt-auto">
        &copy; {new Date().getFullYear()} Vozify - Powered by Gemini AI
      </footer>
    </div>
  );
};
