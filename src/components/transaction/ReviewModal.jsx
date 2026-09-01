import React, { useState, useEffect } from 'react';
import { X, Check, Calendar, Clock, ChevronRight, Calculator, HelpCircle, Sparkles } from 'lucide-react';
import { DEFAULT_CATEGORIES } from '../../config/categories';

export function ReviewModal({ isOpen, onClose, parsedData, onConfirm }) {
  const [activeTab, setActiveTab] = useState('expense'); // 'expense' | 'income' | 'transfer'
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [categoryId, setCategoryId] = useState('cat_shopping');
  const [selectedTag, setSelectedTag] = useState('');

  const tags = [
    { label: 'vacation', icon: '🌴' },
    { label: 'amazon', icon: '📦' },
    { label: 'business', icon: '💼' }
  ];

  useEffect(() => {
    if (parsedData) {
      setAmount(parsedData.amount ? String(parsedData.amount) : '');
      setMerchant(parsedData.merchant || '');
      setCategoryId(parsedData.categoryId || 'cat_shopping');
      setActiveTab(parsedData.type || 'expense');
    }
  }, [parsedData]);

  if (!isOpen) return null;

  const currentCategory = DEFAULT_CATEGORIES.find((c) => c.id === categoryId) || DEFAULT_CATEGORIES[0];

  const handleSave = () => {
    if (!amount || Number(amount) <= 0) return;
    onConfirm({
      amount: parseFloat(amount),
      merchant: merchant || 'General Entry',
      categoryId: currentCategory.id,
      categoryName: currentCategory.name,
      categoryColor: currentCategory.color,
      categoryIcon: currentCategory.icon,
      type: activeTab,
      note: selectedTag ? `#${selectedTag}` : merchant,
      date: parsedData?.date || new Date().toISOString().split('T')[0],
      currency: 'INR'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#121622] rounded-t-[32px] sm:rounded-[32px] p-6 text-white border border-slate-800 shadow-2xl animate-modal-up max-h-[92vh] overflow-y-auto">
        
        {/* Top Action Bar */}
        <div className="flex items-center justify-between pb-4">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-300 hover:bg-slate-700/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-base font-bold tracking-tight">Add transaction</span>
          <button
            onClick={handleSave}
            className="w-10 h-10 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700/60 transition"
          >
            <Check className="w-5 h-5" />
          </button>
        </div>

        {/* Segmented Pill Tabs */}
        <div className="bg-[#1A202E] p-1 rounded-2xl flex items-center my-4 border border-slate-800/80">
          {['expense', 'income', 'transfer'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-[#283144] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Date & Time Row */}
        <div className="flex items-center justify-between text-xs font-medium text-slate-300 py-3 px-1 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-400" />
            <span>31 Aug 2026</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" />
            <span>10:46 PM</span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="py-5 border-b border-slate-800/60">
          <span className="text-xs text-slate-400 font-medium">Amount</span>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-sky-400">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="bg-transparent text-3xl font-extrabold focus:outline-none w-48 text-white placeholder-slate-600"
                autoFocus
              />
            </div>
            <button className="w-9 h-9 rounded-full bg-[#1A202E] flex items-center justify-center text-slate-400 hover:text-white">
              <Calculator className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Selector Field */}
        <div className="py-4 border-b border-slate-800/60 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Category</span>
            <div className="text-sm font-semibold mt-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentCategory.color }} />
              {currentCategory.name}
            </div>
          </div>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="bg-[#1A202E] text-xs font-semibold px-3 py-2 rounded-xl text-slate-300 border border-slate-700/60 outline-none"
          >
            {DEFAULT_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Mode */}
        <div className="py-4 border-b border-slate-800/60 flex items-center justify-between cursor-pointer hover:opacity-90">
          <div>
            <span className="text-xs text-slate-400 font-medium">Payment mode</span>
            <div className="text-sm font-semibold mt-1 flex items-center gap-2 text-slate-200">
              <span>💵</span> Cash
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        {/* Merchant / Description */}
        <div className="py-4 border-b border-slate-800/60">
          <span className="text-xs text-slate-400 font-medium">Merchant / Note</span>
          <input
            type="text"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            placeholder="e.g. Myntra, Starbucks"
            className="w-full bg-transparent text-sm font-semibold mt-1 focus:outline-none text-slate-200 placeholder-slate-600"
          />
        </div>

        {/* Tags Section */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Add tags</span>
            <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => setSelectedTag(selectedTag === tag.label ? '' : tag.label)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition ${
                  selectedTag === tag.label
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'bg-[#1A202E] text-slate-400 border border-slate-800/80 hover:bg-slate-800'
                }`}
              >
                <span>{tag.icon}</span> {tag.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}