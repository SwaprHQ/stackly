import { useEffect, useState } from 'react';

import { loadFathom } from './fathom';
import { AnalyticsContext, IAnalyticsContext } from './analytics.context';
import { Fathom } from './fathom.types';

export interface AnalyticsProviderProps {
  children: React.ReactNode;
}

/**
 * AnalyticsProvider: provides the analytics context to the application
 */
export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const [fathom, setFathom] = useState<Fathom>();
  // Load the fathom site information
  useEffect(() => {
    const siteId = process.env.REACT_APP_FATHOM_SITE_ID;
    const siteScriptURL = process.env.REACT_APP_FATHOM_SITE_SCRIPT_URL;

    if (!siteId) {
      console.warn('REACT_APP_FATHOM_SITE_ID not set, skipping Fathom analytics');
      return;
    }

    loadFathom(siteId, siteScriptURL)
      .then(() => {
        setFathom(window.fathom);
      })
      .catch((error: Error) => {
        console.error('Error loading Fathom analytics', error);
      });
  }, []);

  return (
    <AnalyticsContext.Provider
      value={
        {
          fathom,
        } as IAnalyticsContext
      }
    >
      {children}
    </AnalyticsContext.Provider>
  );
}
