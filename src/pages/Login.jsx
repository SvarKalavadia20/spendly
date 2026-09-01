import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Sparkles, Zap } from 'lucide-react';

export function Login() {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-indigo-500/5 text-center">
        
        {/* Brand Icon */}
        <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-3xl mx-auto shadow-xl shadow-indigo-600/30">
          S
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-6">Spendly</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
          Your finances, simplified. Track expenses effortlessly by simply typing or speaking.
        </p>

        {/* Feature Highlights */}
        <div className="my-8 space-y-3 text-left">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <Zap className="w-5 h-5 text-indigo-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Natural language entry & voice input</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <Sparkles className="w-5 h-5 text-pink-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Smart contextual categorization</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Encrypted user-isolated database</span>
          </div>
        </div>

        {/* Google Authentication Trigger */}
        <button
          onClick={loginWithGoogle}
          className="w-full py-3.5 px-4 bg-slate-900 hover:bg-black dark:bg-white dark:text-slate-900 text-white font-bold rounded-2xl transition flex items-center justify-center gap-3 shadow-lg"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

      </div>
    </div>
  );
}