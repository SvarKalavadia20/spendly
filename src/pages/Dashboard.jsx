import React, { useMemo, useState } from 'react';
import { Calendar, TrendingUp, Receipt, ArrowRight, Mic } from 'lucide-react';
import { calculateDashboardMetrics } from '../utils/calculations';

export function Dashboard({ user, transactions = [], onQuickAdd, onOpenAdd, onStartVoice }) {
  const metrics = useMemo(() => calculateDashboardMetrics(transactions), [transactions]);
  const recentTransactions = transactions.slice(0, 6);
  const [inputVal, setInputVal] = useState('');

  const handleBarSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    onQuickAdd(inputVal.trim());
    setInputVal('');
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in w-full">
      
      {/* Top Header with Mic Button */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 font-medium">Financial Overview</span>
          <h1 className="text-xl md:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.displayName?.split(' ')[0] || 'there'} 👋
          </h1>
        </div>
        
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onStartVoice}
            className="w-10 h-10 rounded-2xl bg-[#141824] hover:bg-[#1C2333] border border-slate-800 text-indigo-400 flex items-center justify-center transition active:scale-95 shadow-sm"
            title="Voice Input"
          >
            <Mic className="w-4 h-4" />
          </button>
          <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700/80 flex items-center justify-center font-bold text-xs text-slate-200 overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              user?.displayName?.[0] || 'S'
            )}
          </div>
        </div>
      </div>

      {/* Natural Language Quick-Add Bar */}
      <form
        onSubmit={handleBarSubmit}
        className="bg-[#141824] rounded-2xl md:rounded-3xl p-2.5 md:p-3 flex items-center border border-slate-800 shadow-md focus-within:border-indigo-500/80 transition-all w-full"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="What did you spend? (e.g. 500 at Zomato, 1200 groceries at DMart...)"
          className="w-full bg-transparent px-3 py-2 text-xs md:text-sm font-medium focus:outline-none text-white placeholder-slate-500"
        />
        <button
          type="button"
          onClick={onStartVoice}
          className="p-2 text-slate-400 hover:text-indigo-400 transition mr-1"
          title="Speak expense"
        >
          <Mic className="w-4 h-4" />
        </button>
        <button
          type="submit"
          disabled={!inputVal.trim()}
          className="px-4 py-2.5 bg-indigo-600 disabled:opacity-30 hover:bg-indigo-500 text-white rounded-xl md:rounded-2xl text-xs font-bold flex items-center gap-1.5 transition flex-shrink-0"
        >
          <span>Log</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Landscape Grid on Desktop: Hero Metric + Sub-KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-[#161C2C] to-[#0E131F] rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>This Month's Outflow</span>
              <span className="text-[11px] text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                {metrics.currentMonthTxCount} Total Transactions
              </span>
            </div>
            <div className="text-3xl md:text-5xl font-black text-white mt-3 tracking-tight">
              ₹{metrics.currentMonthSpending.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 pt-5 border-t border-slate-800/80">
            <div>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" /> Today's Spending
              </span>
              <div className="text-lg md:text-2xl font-extrabold text-white mt-1">
                ₹{metrics.todaySpending.toLocaleString('en-IN')}
              </div>
            </div>
            <div>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-slate-500" /> Daily Burn Rate
              </span>
              <div className="text-lg md:text-2xl font-extrabold text-white mt-1">
                ₹{metrics.avgDailySpending.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#141824] rounded-3xl p-6 border border-slate-800 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Quick Insights</h3>
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#1A2030] border border-slate-800/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Top Category</span>
                <p className="text-sm font-bold text-slate-200 mt-0.5">
                  {metrics.categoryBreakdown[0]?.name || 'None'}
                </p>
                <span className="text-[11px] text-indigo-400">
                  {metrics.categoryBreakdown[0] ? `₹${metrics.categoryBreakdown[0].total.toLocaleString('en-IN')} logged` : 'No logs yet'}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#1A2030] border border-slate-800/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Total Recorded</span>
                <p className="text-sm font-bold text-slate-200 mt-0.5">{transactions.length} items</p>
                <span className="text-[11px] text-emerald-400">Active synced ledger</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#141824] rounded-3xl p-6 border border-slate-800 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs md:text-sm font-bold text-slate-300 uppercase tracking-wider">Recent Expenses</h3>
          <button
            onClick={onOpenAdd}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>+ Add New</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recentTransactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-[#181F2E] rounded-2xl p-4 border border-slate-800/60 flex items-center justify-between hover:bg-[#1C2538] transition"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold flex-shrink-0"
                  style={{
                    backgroundColor: `${tx.categoryColor || '#6366F1'}20`,
                    color: tx.categoryColor || '#6366F1'
                  }}
                >
                  <Receipt className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs md:text-sm font-bold text-white truncate">{tx.merchant}</h4>
                  <span className="text-[10px] md:text-[11px] text-slate-400 block truncate">
                    {tx.categoryName} · {tx.date}
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm md:text-base font-extrabold text-white">
                  ₹{Number(tx.amount).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          ))}

          {recentTransactions.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500 text-xs">
              No expenses recorded yet.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}