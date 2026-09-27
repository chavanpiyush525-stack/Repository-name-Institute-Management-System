export const environment = {
  production: false,
  apiUrl: 'https://staging-api.institute.com/api',
  publicApiUrl: 'https://staging-api.institute.com/api/public',
  enableAnalytics: true,
  enableServiceWorker: false,
  logLevel: 'warn',
  cacheTimeout: 1800000, // 30 minutes
  maxRetries: 3,
  enableErrorTracking: true,
  version: '1.0.0-staging',
  buildTimestamp: new Date().toISOString()
};