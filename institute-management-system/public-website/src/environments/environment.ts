export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  publicApiUrl: 'http://localhost:8080/api/public',
  enableAnalytics: false,
  enableServiceWorker: false,
  logLevel: 'debug',
  cacheTimeout: 300000, // 5 minutes
  maxRetries: 3,
  enableErrorTracking: false,
  version: '1.0.0-dev',
  buildTimestamp: new Date().toISOString()
};