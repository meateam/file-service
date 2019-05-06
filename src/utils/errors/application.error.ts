/**
 * This file contains extended errors for the application.
 */

export class ApplicationError extends Error {
  public code: number;

  constructor(message?: string, code?: number) {
    super();

    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || 'undefined Application Error';
    this.code = code || 500;
  }
}

export class ServerError extends ApplicationError {
  constructor(message?: string, code?: number) {
    super(message || 'internal Server Error', code || 500);
  }
}

export class ClientError extends ApplicationError {
  constructor(message?: string, code?: number) {
    super(message || 'client Side Error', code || 400);
  }
}
