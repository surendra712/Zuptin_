import { useEffect } from 'react';
import { track } from '@vercel/analytics';

const AnalyticsTest = () => {
  useEffect(() => {
    // Test custom event tracking
    const testAnalytics = () => {
      track('page_view_test', {
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
      });
    };

    // Track page view after component mounts
    testAnalytics();

    // Track when user interacts with the page
    const handleClick = () => {
      track('user_interaction', {
        action: 'click',
        page: window.location.pathname,
      });
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default AnalyticsTest;