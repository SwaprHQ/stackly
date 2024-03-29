import { useContext } from 'react';

import { AnalyticsContext } from '../analytics';

/**
 * Use analytics context
 * @returns
 */
export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within a AnalyticsProvider');
  }

  return context;
}
