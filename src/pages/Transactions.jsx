import React, { useState, useMemo } from 'react';
import { Search, Trash2, Edit3, Receipt, Calendar, ArrowUpDown } from 'lucide-react';
import { deleteTransaction, updateTransaction } from '../services/transactions';
import { AddExpenseModal } from '../components/transaction/AddExpenseModal';

export function Transactions({ user, transactions = [], refreshData, showToast }) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [editingTx, setEditingTx] = useState(null);

  // Extract unique category names for filtering
  const categories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.categoryName).filter(Boolean));
    return Array.from(set);
  }, [transactions]);

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        tx.merchant?.toLowerCase().includes(search.toLowerCase()) ||
        tx.note?.toLowerCase().includes(search.toLowerCase()) ||
        tx.amount?.toString().includes(search);
      const matchesCategory = categoryFilter === 'ALL' || tx.categoryName === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [transactions, search, categoryFilter]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this transaction?')) {
      try {
        await deleteTransaction(user.uid, id);
        refreshData();
        showToast('Transaction deleted', 'success');
      } catch (e) {
        showToast('Failed to delete transaction', 'error');
      }
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      await updateTransaction(user.uid, editingTx.id, updatedData);
      setEditingTx(null);
      refreshData();
      showToast('Transaction updated', 'success');
    } catch (e) {
      showToast('Failed to update transaction', 'error');
    }
  };

  return (
    <div className="space-y-5 md:space-y-6 animate-fade-in w-full pb-8">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-3xl font-extrabold text-white tracking-tight">Transaction History</h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">View, search, and manage your logged expenses</p>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-[#141824] p-3 rounded-2xl md:rounded-3xl border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search merchant, notes, amount..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#181F2E] rounded-xl text-xs md:text-sm text-white placeholder-slate-500 border border-slate-800/80 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 bg-[#181F2E] rounded-xl text-xs md:text-sm text-slate-200 border border-slate-800/80 focus:outline-none focus:border-indigo-500"
        >
          <option value="ALL">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Mobile Card Layout (No horizontal scrolling) */}
      <div className="md:hidden space-y-2.5">
        {filtered.map((tx) => (
          <div
            key={tx.id}
            className="bg-[#141824] rounded-2xl p-4 border border-slate-800/80 flex items-center justify-between"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold flex-shrink-0"
                style={{
                  backgroundColor: `${tx.categoryColor || '#6366F1'}20`,
                  color: tx.categoryColor || '#6366F1'
                }}
              >
                <Receipt className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1 pr-2">
                <h4 className="text-sm font-bold text-white truncate">{tx.merchant}</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                  <span className="truncate">{tx.categoryName}</span>
                  <span>•</span>
                  <span className="flex-shrink-0">{tx.date}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="text-right">
                <div className="text-sm font-black text-white">
                  ₹{Number(tx.amount).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={() => setEditingTx(tx)}
                  className="p-1.5 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-slate-800 transition"
                  title="Edit"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(tx.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block bg-[#141824] rounded-3xl border border-slate-800 overflow-hidden shadow-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/80 bg-[#181F2E]/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-4 px-6">Merchant & Notes</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6 text-right">Amount</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filtered.map((tx) => (
              <tr key={tx.id} className="hover:bg-[#181F2E]/40 transition">
                <td className="py-4 px-6">
                  <div className="font-bold text-white text-sm">{tx.merchant}</div>
                  {tx.note && <div className="text-slate-400 text-xs mt-0.5">{tx.note}</div>}
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#181F2E] border border-slate-800 text-slate-200">
                    {tx.categoryName}
                  </span>
                </td>
                <td className="py-4 px-6 text-slate-400 font-medium">{tx.date}</td>
                <td className="py-4 px-6 text-right font-extrabold text-sm text-white">
                  ₹{Number(tx.amount).toLocaleString('en-IN')}
                </td>
                <td className="py-4 px-6 text-right space-x-1">
                  <button
                    onClick={() => setEditingTx(tx)}
                    className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800/80 rounded-xl transition"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(tx.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-xl transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-12 bg-[#141824] rounded-2xl border border-slate-800 text-slate-500 text-xs">
          No transactions found matching your criteria.
        </div>
      )}

      {/* Edit Modal */}
      {editingTx && (
        <AddExpenseModal
          isOpen={!!editingTx}
          onClose={() => setEditingTx(null)}
          initialData={editingTx}
          onConfirm={handleUpdate}
        />
      )}
    </div>
  );
}