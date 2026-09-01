import React from 'react';
import { LogOut, User, Mail, Shield, Trash2, Database, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Settings({ user, transactions = [], refreshData, showToast }) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Successfully signed out', 'success');
    } catch (err) {
      showToast('Failed to sign out', 'error');
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in w-full pb-10">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-3xl font-extrabold text-white tracking-tight">Settings</h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">Manage your account credentials and app preferences</p>
      </div>

      {/* Account Info Card */}
      <div className="bg-[#141824] rounded-3xl p-6 border border-slate-800 shadow-md">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Account Profile</h3>
        
        <div className="flex items-center gap-4 pb-5 border-b border-slate-800/80">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-extrabold text-lg">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover rounded-2xl" />
            ) : (
              user?.displayName?.[0] || 'U'
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm md:text-base font-bold text-white truncate">{user?.displayName || 'Spendly Member'}</h4>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5 truncate">
              <Mail className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span>{user?.email}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="p-3 bg-[#181F2E] rounded-2xl border border-slate-800/60">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Entries</span>
            <div className="text-sm md:text-base font-extrabold text-white mt-0.5">
              {transactions.length} Expenses
            </div>
          </div>
          <div className="p-3 bg-[#181F2E] rounded-2xl border border-slate-800/60">
            <span className="text-[10px] uppercase font-bold text-slate-400">Sync Status</span>
            <div className="text-sm md:text-base font-extrabold text-emerald-400 mt-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Cloud Live
            </div>
          </div>
        </div>
      </div>

      {/* Preferences & System */}
      <div className="bg-[#141824] rounded-3xl p-6 border border-slate-800 shadow-md space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Preferences</h3>
        
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#181F2E] border border-slate-800/60">
          <div className="flex items-center gap-3">
            <Moon className="w-4 h-4 text-indigo-400" />
            <div>
              <div className="text-xs md:text-sm font-bold text-slate-200">Dark Theme</div>
              <div className="text-[10px] text-slate-500">Obsidian dynamic high-contrast UI</div>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
            Active
          </span>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#181F2E] border border-slate-800/60">
          <div className="flex items-center gap-3">
            <Database className="w-4 h-4 text-indigo-400" />
            <div>
              <div className="text-xs md:text-sm font-bold text-slate-200">Currency</div>
              <div className="text-[10px] text-slate-500">Default tracking currency</div>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-300 bg-slate-800 px-3 py-1 rounded-xl">
            INR (₹)
          </span>
        </div>
      </div>

      {/* Danger & Sign Out Section */}
      <div className="bg-[#141824] rounded-3xl p-6 border border-slate-800 shadow-md">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Session</h3>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full py-3.5 px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs md:text-sm flex items-center justify-center gap-2.5 transition active:scale-[0.98]"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Account</span>
        </button>
      </div>
    </div>
  );
}