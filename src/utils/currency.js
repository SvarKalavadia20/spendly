/**
 * Formats a numeric value into a localized currency string
 * Defaults to INR (₹) with Indian Numbering System (Lakhs/Crores)
 */
export function formatCurrency(amount, currencyCode = 'INR') {
  const numericAmount = Number(amount) || 0;
  
  if (currencyCode === 'INR') {
    return `₹${numericAmount.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: Number.isInteger(numericAmount) ? 0 : 2
    })}`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 2
  }).format(numericAmount);
}