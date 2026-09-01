import React, { useEffect, useState, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';
import { fetchTransactions, addTransaction } from './services/transactions';
import { fetchMerchantRules, saveMerchantRule } from './services/merchantRules';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { AddExpenseModal } from './components/transaction/AddExpenseModal';
import { VoiceListeningModal } from './components/input/VoiceListeningModal';
import { parseTransactionText } from './services/transactionParser';

import { Dashboard } from './pages/Dashboard';
import { Analysis } from './pages/Analysis';
import { Transactions } from './pages/Transactions';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';

export default function App() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState([]);
  const [merchantRules, setMerchantRules] = useState({});
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [prefilledData, setPrefilledData] = useState(null);

  const loadUserData = useCallback(async () => {
    if (!user) return;
    try {
      const [txs, rules] = await Promise.all([
        fetchTransactions(user.uid),
        fetchMerchantRules(user.uid),
      ]);
      setTransactions(txs);
      setMerchantRules(rules);
    } catch (err) {
      showToast('Could not load transactions', 'error');
    }
  }, [user, showToast]);

  useEffect(() => {
    if (user) loadUserData();
  }, [user, loadUserData]);

  // Handle typed natural language input
  const handleQuickAdd = (text) => {
    const parsed = parseTransactionText(text, merchantRules);
    setPrefilledData(parsed);
    setIsAddModalOpen(true);
  };

  // Handle spoken natural language input from mic
  const handleVoiceComplete = (transcript) => {
    setIsVoiceOpen(false);
    const parsed = parseTransactionText(transcript, merchantRules);
    setPrefilledData(parsed);
    setIsAddModalOpen(true);
  };

  const handleConfirmTransaction = async (finalData) => {
    try {
      await addTransaction(user.uid, finalData);
      if (finalData.merchant && finalData.categoryId) {
        await saveMerchantRule(user.uid, finalData.merchant, finalData.categoryId);
      }
      setIsAddModalOpen(false);
      setPrefilledData(null);
      loadUserData();
      showToast(`Logged ₹${finalData.amount} for ${finalData.merchant}`, 'success');
    } catch (err) {
      showToast('Failed to save transaction', 'error');
    }
  };

  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 flex flex-col md:flex-row">
      <Sidebar onOpenAdd={() => {
        setPrefilledData(null);
        setIsAddModalOpen(true);
      }} />

      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-10 pb-28 md:pb-10 max-w-7xl mx-auto w-full">
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                user={user}
                transactions={transactions}
                onQuickAdd={handleQuickAdd}
                onStartVoice={() => setIsVoiceOpen(true)}
                onOpenAdd={() => {
                  setPrefilledData(null);
                  setIsAddModalOpen(true);
                }}
              />
            }
          />
          <Route path="/analysis" element={<Analysis transactions={transactions} />} />
          <Route
            path="/history"
            element={
              <Transactions
                user={user}
                transactions={transactions}
                refreshData={loadUserData}
                showToast={showToast}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <Settings
                user={user}
                transactions={transactions}
                refreshData={loadUserData}
                showToast={showToast}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <MobileNav onOpenAdd={() => {
        setPrefilledData(null);
        setIsAddModalOpen(true);
      }} />

      {/* Voice Recognition Modal */}
      <VoiceListeningModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onTranscriptComplete={handleVoiceComplete}
      />

      {/* Add / Review Expense Modal */}
      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setPrefilledData(null);
        }}
        initialData={prefilledData}
        onConfirm={handleConfirmTransaction}
      />
    </div>
  );
}