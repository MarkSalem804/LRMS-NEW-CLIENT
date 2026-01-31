/**
 * Utility function to merge Tailwind CSS classes
 * This is a required utility for shadcn/ui components
 *
 * Combines clsx and tailwind-merge to handle class conflicts properly
 */

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names and resolves Tailwind CSS conflicts
 * @param {...any} inputs - Class names or class name objects
 * @returns {string} Merged class names
 *
 * @example
 * cn("px-2 py-1", "px-4") // Returns "py-1 px-4" (px-2 is overridden)
 * cn("bg-red-500", { "bg-blue-500": true }) // Returns "bg-blue-500"
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
