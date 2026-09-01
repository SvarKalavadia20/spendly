import { format, subDays, parseISO, isValid } from 'date-fns';
import { DEFAULT_CATEGORIES, KEYWORD_CATEGORY_MAP } from '../config/categories';

/**
 * Natural Language Transaction Parser
 * Pure deterministic parser supporting amounts, dates, types, and smart categorization.
 */
export function parseTransactionText(input, customRules = {}) {
  if (!input || typeof input !== 'string') {
    return null;
  }

  const cleanText = input.trim();
  const lowerText = cleanText.toLowerCase();

  // 1. Determine Transaction Type (Income vs Expense)
  const incomeKeywords = ['salary', 'received', 'got', 'cashback', 'credited', 'freelance stipend', 'refund'];
  const isIncome = incomeKeywords.some((kw) => lowerText.includes(kw));
  const type = isIncome ? 'income' : 'expense';

  // 2. Extract Amount
  // Matches ₹500, Rs. 500, 500rs, 25,000, 500.50, etc.
  let amount = null;
  const amountRegex = /(?:₹|rs\.?|inr)?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?)\s*(?:rupees|rs|bucks|inr)?/i;
  
  // Look for standalone numbers if prefixed regex doesn't match cleanly
  const tokens = lowerText.split(/\s+/);
  let parsedAmountStr = null;

  for (const token of tokens) {
    const match = token.replace(/,/g, '').match(/^(?:₹|rs\.?)?(\d+(?:\.\d{1,2})?)(?:rs)?$/i);
    if (match && !isNaN(parseFloat(match[1]))) {
      parsedAmountStr = match[1];
      break;
    }
  }

  if (!parsedAmountStr) {
    const generalMatch = cleanText.replace(/,/g, '').match(/(\d+(?:\.\d{1,2})?)/);
    if (generalMatch) {
      parsedAmountStr = generalMatch[1];
    }
  }

  if (parsedAmountStr) {
    amount = parseFloat(parsedAmountStr);
  }

  // 3. Extract Date
  let transactionDate = format(new Date(), 'yyyy-MM-dd');
  if (lowerText.includes('yesterday')) {
    transactionDate = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  } else if (lowerText.includes('day before yesterday')) {
    transactionDate = format(subDays(new Date(), 2), 'yyyy-MM-dd');
  } else if (lowerText.includes('last friday')) {
    const today = new Date();
    const day = today.getDay();
    const diff = (day >= 5 ? day - 5 : 7 - (5 - day)) || 7;
    transactionDate = format(subDays(today, diff), 'yyyy-MM-dd');
  }

  // 4. Extract Merchant & Note
  const wordsToRemove = [
    'rupees', 'rupee', 'rs', 'inr', 'spent', 'paid', 'bought', 'on', 'at',
    'for', 'from', 'to', 'yesterday', 'today', 'got', 'received', 'a', 'an', 'the'
  ];

  const filteredWords = tokens.filter((word) => {
    const isNum = !isNaN(parseFloat(word.replace(/[₹,]/g, '')));
    return !isNum && !wordsToRemove.includes(word);
  });

  let merchant = 'General Merchant';
  let note = cleanText;

  if (filteredWords.length > 0) {
    merchant = filteredWords[0].charAt(0).toUpperCase() + filteredWords[0].slice(1);
    note = filteredWords.join(' ');
  }

  // 5. Intelligent Category Assignment (User Rules > Keyword Dictionary > Fallback)
  let matchedCategoryId = null;

  // Check learned custom rules first
  for (const [mKey, catId] of Object.entries(customRules)) {
    if (lowerText.includes(mKey.toLowerCase())) {
      matchedCategoryId = catId;
      break;
    }
  }

  // Check keyword dictionary
  if (!matchedCategoryId) {
    for (const [kw, catId] of Object.entries(KEYWORD_CATEGORY_MAP)) {
      if (lowerText.includes(kw)) {
        matchedCategoryId = catId;
        break;
      }
    }
  }

  if (!matchedCategoryId) {
    matchedCategoryId = isIncome ? 'cat_other_inc' : 'cat_other_exp';
  }

  const categoryObj = DEFAULT_CATEGORIES.find((c) => c.id === matchedCategoryId) || DEFAULT_CATEGORIES[0];

  return {
    amount: amount || 0,
    currency: 'INR',
    merchant: merchant,
    categoryId: categoryObj.id,
    categoryName: categoryObj.name,
    categoryColor: categoryObj.color,
    categoryIcon: categoryObj.icon,
    date: transactionDate,
    type: type,
    note: note,
    confidence: {
      amount: amount ? 0.98 : 0.2,
      merchant: merchant !== 'General Merchant' ? 0.9 : 0.5,
      category: matchedCategoryId !== 'cat_other_exp' ? 0.95 : 0.6,
      date: 1.0
    }
  };
}