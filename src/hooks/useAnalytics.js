import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export const useAnalytics = () => {
    const location = useLocation();

    const trackEvent = useCallback(async (type, data = {}) => {
        try {
            await fetch('/api/analytics/collect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    ...data,
                    meta: {
                        path: window.location.pathname,
                        referrer: document.referrer,
                        userAgent: navigator.userAgent,
                        ...data.meta
                    }
                })
            });
        } catch {
            // Error handled silently
        }
    }, []);

    useEffect(() => {
        trackEvent('pageview');
    }, [location.pathname, trackEvent]);

    return { trackEvent };
};
