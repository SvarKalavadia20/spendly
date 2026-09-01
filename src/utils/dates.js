import { format, parseISO, isToday, isYesterday, isValid } from 'date-fns';

/**
 * Returns a human-friendly relative or formatted date
 */
export function formatDisplayDate(dateString) {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  
  if (!isValid(date)) return dateString;

  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  
  return format(date, 'MMM d, yyyy');
}

/**
 * Sanitizes and guarantees yyyy-MM-dd format for HTML date inputs
 */
export function toInputDateFormat(date = new Date()) {
  return format(date, 'yyyy-MM-dd');
}