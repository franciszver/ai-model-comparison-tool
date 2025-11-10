import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

/**
 * Merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(amount);
}

/**
 * Format large numbers with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format date
 */
export function formatDate(date: string | Date): string {
  return format(new Date(date), 'PPp');
}

/**
 * Format relative time
 */
export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Format duration in milliseconds
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Get model display name
 */
export function getModelDisplayName(modelId: string): string {
  const parts = modelId.split('/');
  return parts[parts.length - 1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Get provider name from model ID
 */
export function getProviderName(modelId: string): string {
  const parts = modelId.split('/');
  if (parts.length > 1) {
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  }
  return 'Unknown';
}


