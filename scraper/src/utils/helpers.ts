/**
 * Parse price string to number.
 * Handles formats: ₹599, $12.99, Rs. 599, 599.00, etc.
 */
export function parsePrice(priceStr: string | null | undefined): number | null {
  if (!priceStr) return null;
  const cleaned = priceStr.replace(/[^0-9.,]/g, "").replace(/,/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Calculate discount percentage.
 */
export function calcDiscount(currentPrice: number, originalPrice: number): number {
  if (!currentPrice || !originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100 * 100) / 100;
}

/**
 * Retry an async function with exponential backoff.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      if (attempt === maxRetries) throw err;
      console.warn(`  Attempt ${attempt} failed: ${err.message}. Retrying in ${delayMs * attempt}ms...`);
      await sleep(delayMs * attempt);
    }
  }
  throw new Error("Retry failed");
}

/**
 * Sleep for a given duration.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Log with timestamp.
 */
export function log(message: string, level: "INFO" | "WARN" | "ERROR" = "INFO"): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`);
}
