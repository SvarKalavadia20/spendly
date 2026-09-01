import React, { useState, useRef } from 'react';
import { Mic, ArrowRight, Sparkles } from 'lucide-react';

export function QuickExpenseInput({ onParseRequest, onStartVoice }) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onParseRequest(inputValue.trim(), 'text');
    setInputValue('');
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-6">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-xl shadow-indigo-500/5 transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500"
      >
        <div className="flex items-center pl-3 text-indigo-600 dark:text-indigo-400">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder='Try "500 rupees at Zomato" or "1800 shirt from Myntra yesterday"... (Press N to focus)'
          className="w-full px-4 py-3.5 bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none text-base md:text-lg font-medium"
        />

        <div className="flex items-center gap-2 pr-1">
          <button
            type="button"
            onClick={onStartVoice}
            title="Speak transaction"
            className="p-3 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Mic className="w-5 h-5" />
          </button>

          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="flex items-center justify-center p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white rounded-xl transition-all shadow-md shadow-indigo-600/20"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}