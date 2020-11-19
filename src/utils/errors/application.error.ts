import * as grpc from 'grpc';
import { type } from 'os';
import { error } from 'winston';

/**
 * ApplicationError is an Error class implementing grpc.ServiceError.
 * The class is originally based of Google's GRPC `Status` type.
 * `Status` type defines a logical error model that is suitable for
 * different programming environments, including REST APIs and RPC APIs. It is
 * used by [gRPC](https://github.com/grpc). Each `Status` message contains
 * three pieces of data: error code, error message, and error details.
 *
 * You can find out more about this error model and how to work with it in the
 * [API Design Guide](https://cloud.google.com/apis/design/errors).
 *
 * Unfortunately, the node's grpc package implements grpc.ServiceError
 * differently from the Google's status code, as can be seen in the Interface.
 * Therefore the client should pay attention to deserialize the status object
 * of this service correctly.
*/
export class ApplicationError extends Error implements grpc.ServiceError {
  public code: grpc.status;
  public details: string; // Originally message in Google's status.proto
  public metadata: grpc.Metadata; //  Similar to details in Google's status.proto
  public name: string;
  public stack: string; // The stack when the error was thrown.
  public message: string;

  constructor(code?: number, details?: string, metadata?: grpc.Metadata) {
    super();

    this.code = code || grpc.status.UNKNOWN;
    this.name = grpc.status[this.code];
    this.details = details || 'unknown application error';
    this.message = this.details;

    // creates the .stack property on the object. The value is a string representing
    // the location in the code at which Error.captureStackTrace() was called.
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ServerError extends ApplicationError {
  constructor(details?: string, metadata?: grpc.Metadata) {
    super(grpc.status.INTERNAL, details || 'server side error');
  }
}

export class ClientError extends ApplicationError {
  constructor(code?: number, message?: string, metadata?: grpc.Metadata) {
    super(code || grpc.status.INVALID_ARGUMENT, message || 'client side error');
  }
}

export function validateGrpcError(err : Error | ApplicationError) : ApplicationError {
  if ('details' in err) {
    return err;
  }
  return new ApplicationError(grpc.status.UNKNOWN, err.message);
}
