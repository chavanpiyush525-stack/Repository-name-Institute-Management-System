// Runtime environment configuration template
// Environment variables will be substituted at container startup
window.env = {
  apiUrl: '${API_URL}',
  publicApiUrl: '${PUBLIC_API_URL}',
  enableAnalytics: '${ENABLE_ANALYTICS}' === 'true',
  enableServiceWorker: '${ENABLE_SERVICE_WORKER}' === 'true',
  logLevel: '${LOG_LEVEL}',
  enableErrorTracking: '${ENABLE_ERROR_TRACKING}' === 'true'
};