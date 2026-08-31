import { clsx, type ClassValue } from 'clsx'

/** Merge conditional class names — thin wrapper around clsx for readability. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
