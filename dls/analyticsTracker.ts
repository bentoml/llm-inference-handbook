declare global {
  interface Window {
    gtag?: (command: 'event', eventName: string, properties?: object) => void;
  }
}

class AnalyticsTracker {
  track(eventName: string, properties: Record<string, string> = {}): void {
    if (typeof window === 'undefined') return;

    window.gtag?.('event', eventName, properties);
  }
}

const analyticsTracker = new AnalyticsTracker();

export default analyticsTracker;
