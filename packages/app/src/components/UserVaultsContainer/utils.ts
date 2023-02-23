
/**
 * Format number of hours to a string with the correct unit.
 * Less than 24 hours should be shown in hours.
 * More than 24 hours should be shown in days.
 * More than 7 days should be shown in weeks.
 * More than 4 weeks should be shown in months.
 * @param hours number of hours
 */
export function formatHours(hours: number) {
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }

  if (hours < 168) {
    return `${Math.round(hours / 24)} day${hours > 24 ? 's' : ''}`;
  }

  if (hours < 672) {
    return `${Math.round(hours / 168)} week${hours > 168 ? 's' : ''}`;
  }

  return `${Math.round(hours / 672)} month${hours > 672 ? 's' : ''}`;
}
