// src/utils/sentry.ts
export const initSentry = () => {
    if (process.env.REACT_APP_SENTRY_DSN) {
      import('@sentry/react').then((Sentry) => {
        Sentry.init({
          dsn: process.env.REACT_APP_SENTRY_DSN,
          environment: process.env.REACT_APP_ENVIRONMENT || 'development',
          tracesSampleRate: 1.0,
        });
      });
    }
  };