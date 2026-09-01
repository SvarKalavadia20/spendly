import { useMemo } from 'react';

/**
 * Checks for high probability duplicates in the recent transaction dataset.
 */
export function checkDuplicateTransaction(candidate, existingTransactions) {
  if (!candidate || !existingTransactions?.length) return null;

  const candidateAmount = Number(candidate.amount);
  const candidateMerchant = candidate.merchant?.trim().toLowerCase();
  const candidateDate = candidate.date;

  return existingTransactions.find((tx) => {
    const isSameAmount = Number(tx.amount) === candidateAmount;
    const isSameMerchant = tx.merchant?.trim().toLowerCase() === candidateMerchant;
    const isSameDate = tx.date === candidateDate;
    return isSameAmount && isSameMerchant && isSameDate;
  });
}