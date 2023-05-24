import { events } from '../analytics';
import { useAnalytics } from './useAnalytics';

export const useSimpleAnalyticsEvent = () => {
  const { fathom } = useAnalytics();

  const trackEvent = (eventName: string) => {
    if (!window.fathom) {
      return console.error('Fathom site not found', { fathom: window.fathom });
    }

    const eventId = events[eventName];

    if (!eventId) {
      return console.error(`Event ID for (${eventName}) not found`);
    }

    fathom.trackGoal(eventId, 0);
  };

  return trackEvent;
};
