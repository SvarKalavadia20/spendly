import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Receipt, 
  ChevronLeft, 
  ChevronRight,
  PieChart as PieIcon,
  BarChart3
} from 'lucide-react';
import { 
  format, 
  parseISO, 
  isSameMonth, 
  subMonths 
} from 'date-fns';

const CHART_COLORS = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#38BDF8', '#8B5CF6', '#F43F5E', '#14B8A6'];

export function Analysis({ transactions = [] }) {
  const [activeTab, setActiveTab] = useState('categories'); // 'categories' | 'monthly'
  const [selectedMonthOffset, setSelectedMonthOffset] = useState(0);

  // 1. Gather all unique category names across all transactions
  const allCategoryNames = useMemo(() => {
    const set = new Set();
    transactions.forEach((t) => {
      if (t.type === 'expense' && t.categoryName) {
        set.add(t.categoryName);
      }
    });
    return Array.from(set);
  }, [transactions]);

  // Map each category to a consistent color
  const categoryColorMap = useMemo(() => {
    const map = {};
    allCategoryNames.forEach((cat, idx) => {
      map[cat] = CHART_COLORS[idx % CHART_COLORS.length];
    });
    return map;
  }, [allCategoryNames]);

  // 2. Build multi-category stacked data for the past 6 months
  const monthlyTrends = useMemo(() => {
    const list = [];
    for (let i = 5; i >= 0; i--) {
      const targetDate = subMonths(new Date(), i);
      const monthKey = format(targetDate, 'yyyy-MM');
      const displayLabel = format(targetDate, 'MMM yy');

      let totalExpense = 0;
      let txCount = 0;
      const monthCategoryTotals = {};

      // Initialize all categories to 0 for balanced stacking
      allCategoryNames.forEach((cat) => {
        monthCategoryTotals[cat] = 0;
      });

      transactions.forEach((tx) => {
        if (tx.type === 'expense' && tx.date) {
          const txDate = parseISO(tx.date);
          if (isSameMonth(txDate, targetDate)) {
            const amt = Number(tx.amount) || 0;
            const cat = tx.categoryName || 'Other';
            monthCategoryTotals[cat] = (monthCategoryTotals[cat] || 0) + amt;
            totalExpense += amt;
            txCount += 1;
          }
        }
      });

      list.push({
        key: monthKey,
        month: displayLabel,
        total: totalExpense,
        count: txCount,
        rawDate: targetDate,
        ...monthCategoryTotals
      });
    }
    return list;
  }, [transactions, allCategoryNames]);

  // 3. High-level aggregate KPIs
  const aggregateMetrics = useMemo(() => {
    const totalSpent = monthlyTrends.reduce((sum, m) => sum + m.total, 0);
    const avgMonthly = Math.round(totalSpent / (monthlyTrends.length || 1));

    let highestMonth = { month: 'N/A', total: 0 };
    let lowestMonth = { month: 'N/A', total: Infinity };

    monthlyTrends.forEach((m) => {
      if (m.total > highestMonth.total) highestMonth = m;
      if (m.total < lowestMonth.total && m.total > 0) lowestMonth = m;
    });

    if (lowestMonth.total === Infinity) lowestMonth = { month: 'N/A', total: 0 };

    const currentMonthTotal = monthlyTrends[5]?.total || 0;
    const prevMonthTotal = monthlyTrends[4]?.total || 0;
    const momChange = prevMonthTotal > 0 
      ? Math.round(((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100) 
      : 0;

    return { totalSpent, avgMonthly, highestMonth, lowestMonth, momChange, currentMonthTotal };
  }, [monthlyTrends]);

  // 4. Drill-down data for currently inspected month
  const activeMonthDate = subMonths(new Date(), selectedMonthOffset);
  const activeMonthLabel = format(activeMonthDate, 'MMMM yyyy');

  const selectedMonthTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (tx.type !== 'expense' || !tx.date) return false;
      return isSameMonth(parseISO(tx.date), activeMonthDate);
    });
  }, [transactions, activeMonthDate]);

  const selectedMonthCategoryBreakdown = useMemo(() => {
    const catMap = {};
    let monthTotal = 0;

    selectedMonthTransactions.forEach((tx) => {
      const cat = tx.categoryName || 'Other';
      const amt = Number(tx.amount) || 0;
      catMap[cat] = (catMap[cat] || 0) + amt;
      monthTotal += amt;
    });

    return Object.entries(catMap).map(([name, amount]) => ({
      name,
      amount,
      percentage: monthTotal > 0 ? ((amount / monthTotal) * 100).toFixed(1) : 0,
      color: categoryColorMap[name] || '#6366F1'
    })).sort((a, b) => b.amount - a.amount);
  }, [selectedMonthTransactions, categoryColorMap]);

  const selectedMonthTotal = selectedMonthTransactions.reduce((acc, tx) => acc + (Number(tx.amount) || 0), 0);

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in w-full pb-8">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-extrabold text-white tracking-tight">Spending Analysis</h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            {activeTab === 'categories' ? 'Category distribution breakdown' : 'Month-over-month multi-color category trends'}
          </p>
        </div>

        {/* View Toggle */}
        <div className="bg-[#141824] p-1 rounded-2xl flex items-center border border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'categories' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Category Share</span>
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'monthly' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Monthly Trends</span>
          </button>
        </div>
      </div>

      {/* View 1: Category Share Page */}
      {activeTab === 'categories' && (
        <div className="space-y-6 animate-fade-in">
          {/* Month Navigator Header */}
          <div className="bg-[#141824] rounded-2xl p-3.5 flex items-center justify-between border border-slate-800/80">
            <button
              onClick={() => setSelectedMonthOffset((prev) => prev + 1)}
              className="p-1.5 bg-[#181F2E] hover:bg-[#20293D] rounded-xl text-slate-300 transition"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                Inspecting Scope
              </span>
              <h4 className="text-sm md:text-base font-extrabold text-white mt-0.5">{activeMonthLabel}</h4>
            </div>
            <button
              disabled={selectedMonthOffset <= 0}
              onClick={() => setSelectedMonthOffset((prev) => Math.max(0, prev - 1))}
              className="p-1.5 bg-[#181F2E] hover:bg-[#20293D] disabled:opacity-30 rounded-xl text-slate-300 transition"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Donut Chart */}
            <div className="bg-[#141824] rounded-3xl p-6 md:p-8 border border-slate-800 shadow-md flex flex-col items-center justify-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 self-start mb-4">
                Distribution ({activeMonthLabel})
              </h3>
              <div className="h-64 md:h-72 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={selectedMonthCategoryBreakdown}
                      dataKey="amount"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={3}
                    >
                      {selectedMonthCategoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                      contentStyle={{
                        backgroundColor: '#121622',
                        borderColor: '#242C3F',
                        borderRadius: '16px',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center pointer-events-none">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total</span>
                  <div className="text-xl md:text-2xl font-black text-white">
                    ₹{selectedMonthTotal.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            {/* Category Breakdown List */}
            <div className="bg-[#141824] rounded-3xl p-6 md:p-8 border border-slate-800 shadow-md space-y-3 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Category Breakdown
                </h3>
                <div className="space-y-2.5">
                  {selectedMonthCategoryBreakdown.map((cat) => (
                    <div
                      key={cat.name}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-[#181F2E] border border-slate-800/60"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                        <span className="text-xs md:text-sm font-bold text-slate-200">{cat.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs md:text-sm font-extrabold text-white">
                          ₹{cat.amount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] md:text-xs text-slate-500 ml-2 font-medium">
                          ({cat.percentage}%)
                        </span>
                      </div>
                    </div>
                  ))}

                  {selectedMonthCategoryBreakdown.length === 0 && (
                    <div className="text-center py-10 text-xs text-slate-500">
                      No expense data recorded in {activeMonthLabel}.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Multi-Color Stacked Monthly Trends Page */}
      {activeTab === 'monthly' && (
        <div className="space-y-6 animate-fade-in">
          {/* 4 Analytics Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            <div className="bg-[#141824] p-4 md:p-5 rounded-3xl border border-slate-800 shadow-sm">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400 block">
                6-Month Total
              </span>
              <div className="text-lg md:text-2xl font-black text-white mt-1">
                ₹{aggregateMetrics.totalSpent.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Across all periods</span>
            </div>

            <div className="bg-[#141824] p-4 md:p-5 rounded-3xl border border-slate-800 shadow-sm">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Monthly Average
              </span>
              <div className="text-lg md:text-2xl font-black text-white mt-1">
                ₹{aggregateMetrics.avgMonthly.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-indigo-400 mt-1 block">Mean burn rate</span>
            </div>

            <div className="bg-[#141824] p-4 md:p-5 rounded-3xl border border-slate-800 shadow-sm">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Peak Month
              </span>
              <div className="text-lg md:text-2xl font-black text-rose-400 mt-1 truncate">
                ₹{aggregateMetrics.highestMonth.total.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block truncate">
                {aggregateMetrics.highestMonth.month} highest
              </span>
            </div>

            <div className="bg-[#141824] p-4 md:p-5 rounded-3xl border border-slate-800 shadow-sm">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400 block">
                MoM Change
              </span>
              <div className="text-lg md:text-2xl font-black text-white mt-1 flex items-center gap-1">
                {aggregateMetrics.momChange >= 0 ? (
                  <span className="text-rose-400 flex items-center">
                    <ArrowUpRight className="w-4 h-4" />+{aggregateMetrics.momChange}%
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center">
                    <ArrowDownRight className="w-4 h-4" />{aggregateMetrics.momChange}%
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">vs previous month</span>
            </div>
          </div>

          {/* Multi-Colored Stacked Bar Chart */}
          <div className="bg-[#141824] rounded-3xl p-5 md:p-7 border border-slate-800 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
              <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-300">
                Monthly Breakdown by Category
              </h3>
              
              {/* Category Color Legend */}
              <div className="flex flex-wrap gap-2.5">
                {allCategoryNames.map((name) => (
                  <div key={name} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: categoryColorMap[name] || '#6366F1' }}
                    />
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-72 md:h-88 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#242C3F" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: '#1E2538' }}
                    contentStyle={{
                      backgroundColor: '#121622',
                      borderColor: '#242C3F',
                      borderRadius: '16px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                    formatter={(value, name) => [
                      `₹${Number(value).toLocaleString('en-IN')}`,
                      name
                    ]}
                  />
                  {/* Stacking each category on top of each other */}
                  {allCategoryNames.map((catName, index) => (
                    <Bar
                      key={catName}
                      dataKey={catName}
                      name={catName}
                      stackId="a"
                      fill={categoryColorMap[catName]}
                      radius={index === allCategoryNames.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0]}
                      barSize={38}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Month Inspector Navigator */}
          <div className="bg-[#141824] rounded-3xl p-5 md:p-7 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between pb-5 border-b border-slate-800/80">
              <button
                onClick={() => setSelectedMonthOffset((prev) => prev + 1)}
                className="p-2 bg-[#181F2E] hover:bg-[#20293D] rounded-xl text-slate-300 transition"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block">
                  Inspecting Month
                </span>
                <h4 className="text-base md:text-xl font-extrabold text-white mt-0.5">{activeMonthLabel}</h4>
              </div>
              <button
                disabled={selectedMonthOffset <= 0}
                onClick={() => setSelectedMonthOffset((prev) => Math.max(0, prev - 1))}
                className="p-2 bg-[#181F2E] hover:bg-[#20293D] disabled:opacity-30 rounded-xl text-slate-300 transition"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              <div className="p-4 rounded-2xl bg-[#181F2E] border border-slate-800/60">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Incurred</span>
                <div className="text-xl font-extrabold text-white mt-1">
                  ₹{selectedMonthTotal.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#181F2E] border border-slate-800/60">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Logged Expenses</span>
                <div className="text-xl font-extrabold text-white mt-1">
                  {selectedMonthTransactions.length}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#181F2E] border border-slate-800/60">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Daily Burn</span>
                <div className="text-xl font-extrabold text-white mt-1">
                  ₹{Math.round(selectedMonthTotal / 30).toLocaleString('en-IN')} / day
                </div>
              </div>
            </div>

            {/* Expenses List */}
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Expenses in {activeMonthLabel}
            </h5>
            <div className="space-y-2">
              {selectedMonthTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-[#181F2E] rounded-2xl p-3.5 border border-slate-800/60 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs"
                      style={{
                        backgroundColor: `${categoryColorMap[tx.categoryName] || '#6366F1'}20`,
                        color: categoryColorMap[tx.categoryName] || '#6366F1'
                      }}
                    >
                      <Receipt className="w-4 h-4" />
                    </div>
                    <div>
                      <h6 className="text-xs md:text-sm font-bold text-white">{tx.merchant}</h6>
                      <span className="text-[10px] text-slate-400">{tx.categoryName} • {tx.date}</span>
                    </div>
                  </div>
                  <div className="text-sm font-extrabold text-white">
                    ₹{Number(tx.amount).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}

              {selectedMonthTransactions.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-500 bg-[#181F2E]/40 rounded-2xl border border-slate-800/40">
                  No expenses recorded in {activeMonthLabel}.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}