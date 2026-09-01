import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PieChart, Receipt, Settings, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { name: 'Overview', path: '/', icon: Home },
  { name: 'Analytics', path: '/analysis', icon: PieChart },
  { name: 'History', path: '/history', icon: Receipt },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar({ onOpenAdd }) {
  const { logout, user } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-800/80 bg-[#0E121B] min-h-screen p-5 justify-between fixed left-0 top-0 bottom-0 z-30">
      <div>
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-600/30">
            S
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-white block">Spendly</span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Expense Tracker</span>
          </div>
        </div>

        {/* Global Desktop Add Expense Button */}
        <button
          onClick={onOpenAdd}
          className="w-full mb-6 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Expense</span>
        </button>

        {/* Nav Links */}
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User profile footer */}
      <div className="border-t border-slate-800/80 pt-4 px-1">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              'SK'
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-200 truncate">{user?.displayName || 'User'}</p>
            <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-semibold text-rose-400 hover:bg-rose-950/20 rounded-xl transition"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>
    </aside>
  );
}