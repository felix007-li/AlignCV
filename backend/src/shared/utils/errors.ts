/**
 * Custom error classes for application-wide error handling
 * All errors extend AppError for consistent error handling
 */

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true,
    public details?: unknown
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(400, message, true, details)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(401, message)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden') {
    super(403, message)
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found`)
  }
}

export class PaymentError extends AppError {
  constructor(message: string, details?: unknown) {
    super(402, message, true, details)
  }
}

export class StripeWebhookError extends AppError {
  constructor(message: string, details?: unknown) {
    super(400, message, true, details)
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string, details?: unknown) {
    super(503, `${service} service error: ${message}`, true, details)
  }
}

export class FileProcessingError extends AppError {
  constructor(message: string, details?: unknown) {
    super(400, message, true, details)
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: unknown) {
    super(500, `Database error: ${message}`, false, details)
  }
}
