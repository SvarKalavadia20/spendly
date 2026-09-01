/**
 * Strict validator for incoming parsed or edited transaction payloads
 */
export function validateTransactionPayload(tx) {
  const errors = [];

  if (!tx) {
    return { isValid: false, errors: ['Transaction data is missing'] };
  }

  const amount = Number(tx.amount);
  if (isNaN(amount) || amount <= 0) {
    errors.push('Amount must be a positive number greater than 0');
  }

  if (!tx.merchant || typeof tx.merchant !== 'string' || tx.merchant.trim().length === 0) {
    errors.push('Merchant name is required');
  }

  if (tx.merchant && tx.merchant.length > 80) {
    errors.push('Merchant name exceeds 80 characters limit');
  }

  if (!['expense', 'income'].includes(tx.type)) {
    errors.push('Transaction type must be either "expense" or "income"');
  }

  if (!tx.date || isNaN(Date.parse(tx.date))) {
    errors.push('A valid date is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}