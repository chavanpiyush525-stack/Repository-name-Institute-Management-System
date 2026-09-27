export const environment = {
  production: true,
  apiUrl: '/api',
  publicApiUrl: '/api/public',
  enableAnalytics: true,
  enableServiceWorker: true,
  logLevel: 'error',
  cacheTimeout: 3600000, // 1 hour
  maxRetries: 5,
  enableErrorTracking: true,
  version: '1.0.0',
  buildTimestamp: new Date().toISOString()
};