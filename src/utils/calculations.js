import { parseISO, isSameMonth, isSameDay, startOfMonth, subMonths } from 'date-fns';

export function calculateDashboardMetrics(transactions = []) {
  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const prevMonthStart = startOfMonth(subMonths(now, 1));

  let todaySpending = 0;
  let currentMonthSpending = 0;
  let prevMonthSpending = 0;
  let totalIncome = 0;
  let currentMonthTxCount = 0;

  const categoryTotals = {};

  transactions.forEach((tx) => {
    const txDate = parseISO(tx.date);
    const amount = Number(tx.amount) || 0;

    if (tx.type === 'income') {
      if (isSameMonth(txDate, now)) {
        totalIncome += amount;
      }
      return;
    }

    // Expense calculations
    if (isSameDay(txDate, now)) {
      todaySpending += amount;
    }

    if (isSameMonth(txDate, now)) {
      currentMonthSpending += amount;
      currentMonthTxCount++;

      const catName = tx.categoryName || 'Other';
      categoryTotals[catName] = (categoryTotals[catName] || 0) + amount;
    } else if (isSameMonth(txDate, prevMonthStart)) {
      prevMonthSpending += amount;
    }
  });

  const daysPassedInMonth = now.getDate() || 1;
  const avgDailySpending = Math.round(currentMonthSpending / daysPassedInMonth);

  const momChange = prevMonthSpending === 0
    ? 0
    : Math.round(((currentMonthSpending - prevMonthSpending) / prevMonthSpending) * 100);

  const categoryBreakdown = Object.entries(categoryTotals).map(([name, total]) => ({
    name,
    total,
    percentage: currentMonthSpending > 0 ? Math.round((total / currentMonthSpending) * 100) : 0
  })).sort((a, b) => b.total - a.total);

  return {
    todaySpending,
    currentMonthSpending,
    prevMonthSpending,
    totalIncome,
    netBalance: totalIncome - currentMonthSpending,
    avgDailySpending,
    currentMonthTxCount,
    momChange,
    categoryBreakdown
  };
}