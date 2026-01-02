/**
 * Converts a decimal amount to an integer representation (cents) for safe storage.
 * @param amount Monetary amount in standard units (e.g., dollars).
 * @returns Amount rounded to the nearest cent as an integer.
 */
export function formatAmountForStorage(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Converts an integer amount in cents to its decimal representation for display.
 * @param amountInCents Monetary amount expressed in cents.
 * @returns Amount in standard units (e.g., dollars) as a decimal.
 */
export function formatAmountForDisplay(amountInCents: number): number {
  return amountInCents / 100;
}
