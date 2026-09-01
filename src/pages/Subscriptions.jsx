import React from 'react';
import { Sparkles, Calendar } from 'lucide-react';

const SUBSCRIPTION_DATA = [
  { id: 1, name: 'Netflix Premium', amount: 649, cadence: 'Monthly', nextDate: '2026-09-15' },
  { id: 2, name: 'Spotify Individual', amount: 119, cadence: 'Monthly', nextDate: '2026-09-03' },
  { id: 3, name: 'YouTube Premium', amount: 149, cadence: 'Monthly', nextDate: '2026-09-20' },
  { id: 4, name: 'Amazon Prime', amount: 1499, cadence: 'Yearly', nextDate: '2027-01-10' }
];

export function Subscriptions() {
  const monthlyTotal = SUBSCRIPTION_DATA.reduce((acc, s) => {
    return acc + (s.cadence === 'Monthly' ? s.amount : Math.round(s.amount / 12));
  }, 0);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Recurring Subscriptions</h1>
          <p className="text-sm text-slate-500">Keep track of ongoing digital services</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-950/50 px-4 py-2 rounded-2xl border border-indigo-100 dark:border-indigo-800">
          <span className="text-xs font-semibold text-indigo-500 uppercase">Monthly Burn</span>
          <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">₹{monthlyTotal}/mo</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SUBSCRIPTION_DATA.map((sub) => (
          <div key={sub.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">{sub.name}</h4>
                <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" /> Next: {sub.nextDate}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-extrabold text-slate-900 dark:text-white">₹{sub.amount}</div>
              <div className="text-xs text-slate-400">{sub.cadence}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}