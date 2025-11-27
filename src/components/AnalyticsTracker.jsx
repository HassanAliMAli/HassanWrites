import { useAnalytics } from '@/hooks/useAnalytics';

const AnalyticsTracker = () => {
    useAnalytics(); // Triggers pageview on location change
    return null;
};

export default AnalyticsTracker;
