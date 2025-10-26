/**
 * Custom error classes for specific error types with standardized codes
 */

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.errorCode = 'VALIDATION_ERROR';
  }
}

export class ProcessingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ProcessingError';
    this.statusCode = 422;
    this.errorCode = 'PROCESSING_ERROR';
  }
}

export class StorageError extends Error {
  constructor(message) {
    super(message);
    this.name = 'StorageError';
    this.statusCode = 507;
    this.errorCode = 'STORAGE_FULL';
  }
}

export class FileTooLargeError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FileTooLargeError';
    this.statusCode = 413;
    this.errorCode = 'FILE_TOO_LARGE';
  }
}

export class RateLimitError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RateLimitError';
    this.statusCode = 429;
    this.errorCode = 'RATE_LIMIT_EXCEEDED';
  }
}