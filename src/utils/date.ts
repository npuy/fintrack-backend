/**
 * Normalizes a date to midnight in UTC, removing any time components.
 * @param date Original date to normalize.
 * @returns New Date instance set to 00:00:00.000 UTC of the same day.
 */
export function formatDateToUTCMidnight(date: Date): Date {
  const formattedDate = new Date(date);
  formattedDate.setUTCHours(0, 0, 0, 0);
  return formattedDate;
}
