/**
 * Format a number as currency
 * @param value - The number to format
 * @returns Formatted currency string (e.g. "$1,234,567")
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format a number with commas
 * @param value - The number to format
 * @returns Formatted number string (e.g. "1,234,567")
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

/**
 * Format a number as a percentage
 * @param value - The number to format (e.g. 0.05 for 5%)
 * @returns Formatted percentage string (e.g. "5%")
 */
export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}; 