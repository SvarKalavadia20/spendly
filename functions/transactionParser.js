const DEFAULT_CATEGORIES = [
  { id: 'cat_food', name: 'Food & Dining', color: '#6366F1', keywords: ['zomato', 'swiggy', 'mcdonalds', 'starbucks', 'kfc', 'burger', 'pizza', 'restaurant', 'cafe', 'tea', 'coffee', 'lunch', 'dinner', 'breakfast'] },
  { id: 'cat_shopping', name: 'Shopping', color: '#EC4899', keywords: ['amazon', 'flipkart', 'myntra', 'zara', 'h&m', 'clothes', 'shoes', 'mall'] },
  { id: 'cat_groceries', name: 'Groceries', color: '#10B981', keywords: ['dmart', 'blinkit', 'zepto', 'instamart', 'bigbasket', 'grocery', 'milk', 'vegetables', 'fruits'] },
  { id: 'cat_transport', name: 'Transport & Fuel', color: '#F59E0B', keywords: ['uber', 'ola', 'rapido', 'metro', 'petrol', 'diesel', 'fuel', 'cab', 'auto', 'toll'] },
  { id: 'cat_bills', name: 'Bills & Utilities', color: '#3B82F6', keywords: ['electricity', 'wifi', 'broadband', 'recharge', 'airtel', 'jio', 'rent', 'water'] },
  { id: 'cat_entertainment', name: 'Entertainment', color: '#8B5CF6', keywords: ['netflix', 'spotify', 'prime', 'movie', 'cinema', 'hotstar', 'steam'] },
  { id: 'cat_other', name: 'Other', color: '#64748B', keywords: [] }
];

export function parseTransactionText(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return {
      amount: 0,
      merchant: 'General Expense',
      categoryId: 'cat_other',
      categoryName: 'Other',
      categoryColor: '#64748B',
      date: new Date().toISOString().split('T')[0],
      note: '',
      type: 'expense'
    };
  }

  const cleaned = rawText.trim();
  const amountMatch = cleaned.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d{1,2})?)/i);
  const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;

  let remainingText = cleaned
    .replace(/(?:₹|rs\.?|inr)\s*\d+(?:\.\d{1,2})?/gi, '')
    .replace(/\b\d+(?:\.\d{1,2})?\b/, '')
    .replace(/\b(spent|paid|at|for|on|rupees|bucks|in)\b/gi, '')
    .trim();

  const merchant = remainingText.length > 0 ? remainingText : 'Quick Expense';

  const lowerText = cleaned.toLowerCase();
  let matchedCat = DEFAULT_CATEGORIES.find(cat => 
    cat.keywords.some(k => lowerText.includes(k))
  ) || DEFAULT_CATEGORIES.find(c => c.id === 'cat_other');

  return {
    amount,
    merchant,
    categoryId: matchedCat.id,
    categoryName: matchedCat.name,
    categoryColor: matchedCat.color,
    date: new Date().toISOString().split('T')[0],
    note: cleaned,
    type: 'expense',
    createdAt: new Date().toISOString()
  };
}