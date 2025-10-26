/**
 * Retry utility for handling transient failures
 * @param {Function} operation - Async function to retry
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} delay - Base delay in milliseconds between retries
 * @returns {Promise} Result of the operation
 */
export async function withRetry(operation, maxRetries = 3, delay = 1000) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Only retry on specific transient errors
      const transientErrors = ['EPIPE', 'ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND'];
      const isTransient = transientErrors.includes(error.code) ||
                         error.message.toLowerCase().includes('timeout') ||
                         error.message.toLowerCase().includes('connection');

      if (isTransient && attempt < maxRetries) {
        // Exponential backoff with jitter
        const backoffDelay = delay * Math.pow(2, attempt - 1) + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        continue;
      }

      // Don't retry on permanent errors (validation, processing, etc.)
      throw error;
    }
  }

  throw lastError;
}