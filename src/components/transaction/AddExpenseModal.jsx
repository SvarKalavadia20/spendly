import React, { useState, useEffect } from 'react';
import { X, Check, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { DEFAULT_CATEGORIES } from '../../config/categories';
import { parseTransactionText } from '../../services/transactionParser';

export function AddExpenseModal({ isOpen, onClose, initialData, onConfirm }) {
  const [rawText, setRawText] = useState('');
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [categoryId, setCategoryId] = useState('cat_food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount ? String(initialData.amount) : '');
      setMerchant(initialData.merchant || '');
      setCategoryId(initialData.categoryId || 'cat_food');
      setDate(initialData.date || new Date().toISOString().split('T')[0]);
      setNote(initialData.note || '');
      setRawText('');
    } else {
      setAmount('');
      setMerchant('');
      setCategoryId('cat_food');
      setDate(new Date().toISOString().split('T')[0]);
      setNote('');
      setRawText('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleInstantParse = (e) => {
    e.preventDefault();
    if (!rawText.trim()) return;
    const parsed = parseTransactionText(rawText);
    if (parsed && parsed.amount) {
      setAmount(String(parsed.amount));
      setMerchant(parsed.merchant);
      setCategoryId(parsed.categoryId);
      if (parsed.date) setDate(parsed.date);
      setNote(parsed.note);
      setRawText('');
    }
  };

  const handleSave = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;

    const selectedCat = DEFAULT_CATEGORIES.find((c) => c.id === categoryId) || DEFAULT_CATEGORIES[0];

    onConfirm({
      amount: numAmount,
      merchant: merchant.trim() || 'General Expense',
      categoryId: selectedCat.id,
      categoryName: selectedCat.name,
      categoryColor: selectedCat.color,
      categoryIcon: selectedCat.icon,
      date,
      note: note.trim() || merchant.trim(),
      type: 'expense',
      currency: 'INR'
    });
  };

  const currentCategory = DEFAULT_CATEGORIES.find((c) => c.id === categoryId) || DEFAULT_CATEGORIES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#121622] rounded-t-[32px] sm:rounded-[32px] p-6 text-white border border-slate-800 shadow-2xl animate-modal-up max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-300 hover:bg-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold tracking-tight text-slate-200">
            {initialData ? 'Review Expense' : 'Log Expense'}
          </span>
          <button
            onClick={handleSave}
            disabled={!amount || Number(amount) <= 0}
            className="w-9 h-9 rounded-full bg-indigo-600 disabled:opacity-30 disabled:hover:bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition"
          >
            <Check className="w-4 h-4" />
          </button>
        </div>

        {/* Natural Language Micro-Input within Modal */}
        <form onSubmit={handleInstantParse} className="mt-4 relative">
          <input
            type="text"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Type '500 Starbucks' to auto-fill..."
            className="w-full bg-[#181F2E] text-xs font-medium px-3.5 py-2.5 pr-9 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-200 placeholder-slate-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 text-indigo-400 hover:text-indigo-300 p-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Large Amount Field */}
        <div className="py-6 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Expense Amount</span>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <span className="text-3xl font-bold text-indigo-400">₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="bg-transparent text-4xl font-extrabold focus:outline-none w-48 text-center text-white placeholder-slate-700"
              autoFocus={!initialData}
            />
          </div>
        </div>

        {/* Structured Editable Fields */}
        <div className="space-y-3">
          <div className="bg-[#181F2E] p-3 rounded-2xl border border-slate-800/80">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Merchant / Place</label>
            <input
              type="text"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="e.g. Zomato, Amazon, Metro"
              className="w-full bg-transparent text-sm font-semibold mt-1 focus:outline-none text-slate-100 placeholder-slate-600"
            />
          </div>

          <div className="bg-[#181F2E] p-3 rounded-2xl border border-slate-800/80 flex items-center justify-between">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category</label>
              <div className="text-xs font-bold text-slate-200 mt-1 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentCategory.color }} />
                {currentCategory.name}
              </div>
            </div>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="bg-[#242C3F] text-xs font-semibold px-3 py-1.5 rounded-xl text-slate-200 border border-slate-700 outline-none"
            >
              {DEFAULT_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#181F2E] p-3 rounded-2xl border border-slate-800/80">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold mt-1 focus:outline-none text-slate-200"
              />
            </div>
            <div className="bg-[#181F2E] p-3 rounded-2xl border border-slate-800/80">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Note</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional description"
                className="w-full bg-transparent text-xs font-medium mt-1 focus:outline-none text-slate-200 placeholder-slate-600"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={!amount || Number(amount) <= 0}
          className="w-full mt-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-2xl text-xs font-bold tracking-wide transition shadow-lg shadow-indigo-600/20"
        >
          Confirm & Save Expense
        </button>

      </div>
    </div>
  );
}