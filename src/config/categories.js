export const DEFAULT_CATEGORIES = [
  { id: 'cat_food', name: 'Food & Dining', icon: 'Utensils', color: '#F97316', type: 'expense' },
  { id: 'cat_shopping', name: 'Shopping', icon: 'ShoppingBag', color: '#EC4899', type: 'expense' },
  { id: 'cat_transport', name: 'Transportation', icon: 'Car', color: '#3B82F6', type: 'expense' },
  { id: 'cat_bills', name: 'Bills & Utilities', icon: 'Zap', color: '#EAB308', type: 'expense' },
  { id: 'cat_entertainment', name: 'Entertainment', icon: 'Film', color: '#A855F7', type: 'expense' },
  { id: 'cat_health', name: 'Health & Fitness', icon: 'Activity', color: '#10B981', type: 'expense' },
  { id: 'cat_travel', name: 'Travel', icon: 'Plane', color: '#06B6D4', type: 'expense' },
  { id: 'cat_education', name: 'Education', icon: 'BookOpen', color: '#6366F1', type: 'expense' },
  { id: 'cat_personal', name: 'Personal Care', icon: 'Smile', color: '#14B8A6', type: 'expense' },
  { id: 'cat_finance', name: 'Investments & Finance', icon: 'TrendingUp', color: '#84CC16', type: 'expense' },
  { id: 'cat_other_exp', name: 'Other Expense', icon: 'MoreHorizontal', color: '#64748B', type: 'expense' },
  { id: 'cat_salary', name: 'Salary', icon: 'Wallet', color: '#22C55E', type: 'income' },
  { id: 'cat_freelance', name: 'Freelance / Side Gig', icon: 'Laptop', color: '#0EA5E9', type: 'income' },
  { id: 'cat_invest_inc', name: 'Investment Returns', icon: 'LineChart', color: '#8B5CF6', type: 'income' },
  { id: 'cat_cashback', name: 'Cashback & Rewards', icon: 'Gift', color: '#F59E0B', type: 'income' },
  { id: 'cat_other_inc', name: 'Other Income', icon: 'ArrowDownLeft', color: '#10B981', type: 'income' }
];

export const KEYWORD_CATEGORY_MAP = {
  // Food & Dining
  zomato: 'cat_food', swiggy: 'cat_food', starbucks: 'cat_food', mcdonalds: 'cat_food',
  kfc: 'cat_food', burger: 'cat_food', pizza: 'cat_food', dinner: 'cat_food',
  lunch: 'cat_food', breakfast: 'cat_food', cafe: 'cat_food', restaurant: 'cat_food',
  groceries: 'cat_food', grocery: 'cat_food', dmart: 'cat_food', blinkit: 'cat_food',
  zepto: 'cat_food', instamart: 'cat_food', chai: 'cat_food', coffee: 'cat_food',
  
  // Shopping
  amazon: 'cat_shopping', flipkart: 'cat_shopping', myntra: 'cat_shopping', ajio: 'cat_shopping',
  shirt: 'cat_shopping', shoes: 'cat_shopping', clothes: 'cat_shopping', headphones: 'cat_shopping',
  electronics: 'cat_shopping', zara: 'cat_shopping', hnm: 'cat_shopping',
  
  // Transportation
  uber: 'cat_transport', ola: 'cat_transport', rapido: 'cat_transport', metro: 'cat_transport',
  fuel: 'cat_transport', petrol: 'cat_transport', diesel: 'cat_transport', auto: 'cat_transport',
  cab: 'cat_transport', parking: 'cat_transport', toll: 'cat_transport',
  
  // Bills & Utilities
  rent: 'cat_bills', electricity: 'cat_bills', water: 'cat_bills', wifi: 'cat_bills',
  internet: 'cat_bills', airtel: 'cat_bills', jio: 'cat_bills', recharge: 'cat_bills',
  maintenance: 'cat_bills', gas: 'cat_bills', cylinder: 'cat_bills',
  
  // Entertainment
  netflix: 'cat_entertainment', spotify: 'cat_entertainment', prime: 'cat_entertainment',
  movie: 'cat_entertainment', cinema: 'cat_entertainment', pvr: 'cat_entertainment',
  steam: 'cat_entertainment', hotstar: 'cat_entertainment', youtube: 'cat_entertainment',
  
  // Health
  apollo: 'cat_health', pharmacy: 'cat_health', medicine: 'cat_health', doctor: 'cat_health',
  hospital: 'cat_health', gym: 'cat_health', cult: 'cat_health', clinic: 'cat_health',

  // Income
  salary: 'cat_salary', dividend: 'cat_invest_inc', interest: 'cat_invest_inc',
  freelance: 'cat_freelance', stipend: 'cat_freelance', cashback: 'cat_cashback'
};