import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PieChart, Receipt, Settings, Plus } from 'lucide-react';

export function MobileNav({ onOpenAdd }) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0D14]/95 backdrop-blur-2xl border-t border-slate-800/80">
      <nav className="relative grid grid-cols-5 items-center px-4 py-3 max-w-md mx-auto">
        
        {/* 1. Overview */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-all ${
              isActive ? 'text-indigo-400 font-semibold' : 'text-slate-500'
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span>Overview</span>
        </NavLink>

        {/* 2. Analytics */}
        <NavLink
          to="/analysis"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-all ${
              isActive ? 'text-indigo-400 font-semibold' : 'text-slate-500'
            }`
          }
        >
          <PieChart className="w-5 h-5" />
          <span>Analytics</span>
        </NavLink>

        {/* 3. Center Floating Indigo + Button with Glow */}
        <div className="flex justify-center items-center">
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center justify-center">
            {/* Ambient Indigo Glow */}
            <div className="absolute w-14 h-14 rounded-full bg-indigo-500/25 blur-md pointer-events-none" />

            {/* Indigo Action Button */}
            <button
              type="button"
              onClick={onOpenAdd}
              className="relative w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white flex items-center justify-center shadow-[0_4px_16px_rgba(99,102,241,0.35)] border-4 border-[#0A0D14] transition-all"
              aria-label="Add expense"
            >
              <Plus className="w-7 h-7 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* 4. History */}
        <NavLink
          to="/history"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-all ${
              isActive ? 'text-indigo-400 font-semibold' : 'text-slate-500'
            }`
          }
        >
          <Receipt className="w-5 h-5" />
          <span>History</span>
        </NavLink>

        {/* 5. Settings */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-all ${
              isActive ? 'text-indigo-400 font-semibold' : 'text-slate-500'
            }`
          }
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </NavLink>

      </nav>
    </div>
  );
}