import { describe, it, expect } from 'vitest';
import { parseTransactionText } from '../src/services/transactionParser';

describe('Transaction Natural Language Parser', () => {
  it('correctly parses standard expense syntax with currency', () => {
    const result = parseTransactionText('500 rupees at Zomato');
    expect(result.amount).toBe(500);
    expect(result.merchant.toLowerCase()).toBe('zomato');
    expect(result.categoryName).toBe('Food & Dining');
    expect(result.type).toBe('expense');
  });

  it('correctly parses historical relative dates', () => {
    const result = parseTransactionText('Bought shirt for 1800 from Myntra yesterday');
    expect(result.amount).toBe(1800);
    expect(result.merchant.toLowerCase()).toBe('myntra');
    expect(result.categoryName).toBe('Shopping');
    expect(result.type).toBe('expense');
  });

  it('correctly extracts and tags income strings', () => {
    const result = parseTransactionText('Received 45000 salary');
    expect(result.amount).toBe(45000);
    expect(result.type).toBe('income');
    expect(result.categoryName).toBe('Salary');
  });
});