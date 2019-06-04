/**
 * This file contains extended errors for the application.
 */

export class ApplicationError extends Error {
  public code: number;

  constructor(message?: string, code?: number) {
    super();

    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || 'UNKNOWN';
    this.code = code || 2;
  }
}

export class ServerError extends ApplicationError {
  constructor(message?: string, code?: number) {
    super(message || 'UNKNOWN: server side error', code || 2);
  }
}

export class ClientError extends ApplicationError {
  constructor(message?: string, code?: number) {
    super(message || 'INVALID_ARGUMENT: client side error', code || 3);
  }
}
