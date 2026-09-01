import Papa from 'papaparse';

export function exportToCSV(transactions, filename = 'spendly_export.csv') {
  if (!transactions || !transactions.length) return;

  const data = transactions.map((t) => ({
    Date: t.date,
    Merchant: t.merchant,
    Category: t.categoryName,
    Amount: t.amount,
    Type: t.type,
    Currency: t.currency || 'INR',
    Note: t.note || ''
  }));

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function parseCSVFile(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data.map((row) => ({
          date: row.Date || row.date || new Date().toISOString().split('T')[0],
          merchant: row.Merchant || row.merchant || 'Imported Entry',
          categoryName: row.Category || row.category || 'Other Expense',
          categoryId: 'cat_other_exp',
          amount: parseFloat(row.Amount || row.amount || 0),
          type: (row.Type || row.type || 'expense').toLowerCase(),
          note: row.Note || row.note || 'CSV Import',
          currency: row.Currency || row.currency || 'INR'
        })).filter(t => t.amount > 0);

        resolve(parsed);
      },
      error: (error) => reject(error)
    });
  });
}