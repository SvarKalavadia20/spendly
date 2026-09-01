import React from 'react';
import { DEFAULT_CATEGORIES } from '../config/categories';
import { AlertCircle } from 'lucide-react';

export function Budgets({ transactions = [] }) {
  // Demo baseline budgets against current month actuals
  const budgetLimits = {
    cat_food: 10000,
    cat_shopping: 8000,
    cat_transport: 4000,
    cat_bills: 15000,
    cat_entertainment: 3000
  };

  const currentMonthExpenses = transactions.reduce((acc, t) => {
    if (t.type === 'expense') {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + Number(t.amount);
    }
    return acc;
  }, {});

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Monthly Budgets</h1>
        <p className="text-sm text-slate-500">Track category spending limits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(budgetLimits).map(([catId, limit]) => {
          const cat = DEFAULT_CATEGORIES.find((c) => c.id === catId);
          const spent = currentMonthExpenses[catId] || 0;
          const percentage = Math.min(Math.round((spent / limit) * 100), 100);
          const isOver = spent > limit;

          return (
            <div key={catId} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-900 dark:text-white">{cat?.name || 'Category'}</span>
                <span className="text-sm font-semibold text-slate-500">
                  ₹{spent.toLocaleString('en-IN')} / ₹{limit.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isOver ? 'bg-rose-500' : percentage > 80 ? 'bg-amber-500' : 'bg-indigo-600'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              {isOver && (
                <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-rose-500">
                  <AlertCircle className="w-3.5 h-3.5" /> Budget exceeded
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}