import * as winston from 'winston';
import * as os from 'os';
import * as Elasticsearch from 'winston-elasticsearch';
import * as grpc from 'grpc';
import apm from 'elastic-apm-node';
import { confLogger, serviceName } from '../config';
import { statusToString, validateGrpcError } from './errors/grpc.status';
import { ApplicationError } from './errors/application.error';

// index pattern for the logger
const indexTemplateMapping = require('winston-elasticsearch/index-template-mapping.json');
indexTemplateMapping.index_patterns = `${confLogger.indexPrefix}-*`;

export const logger = winston.createLogger({
  defaultMeta: { service: serviceName, hostname: os.hostname() },
});

// configure logger
const elasticsearch = new Elasticsearch.default({
  indexPrefix: confLogger.indexPrefix,
  level: 'verbose',
  clientOpts: confLogger.elasticsearch,
  bufferLimit: 100,
  ensureMappingTemplate: true,
  mappingTemplate: indexTemplateMapping,
});
logger.add(elasticsearch);

/**
 * logs the data with its given parameters.
 * @param severity - the kind of log created.
 * @param name - name of the log. in our case, the function called.
 * @param description - description in text.
 * @param traceID - id to correlate to if there are several logs with some connection.
 * @param user - the user requesting for the service.
 * @param meta - additional optional information.
 */
export const log = (level: Severity, name: string, message: string, traceID?: string, meta?: object) => {
  logger.log({ level, name, message, traceID, ...meta });
};

export enum Severity {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  SILLY = 'silly',
}

  /**
   * wraps all of the service methods, creating the transaction for the apm and the logger,
   * and sends them to the elastic server.
   * @param func - the method called and wrapped.
   */
export function wrapper(func: Function) :
  (call: grpc.ServerUnaryCall<Object>, callback: grpc.requestCallback<Object>) => Promise<void> {
  return async (call: grpc.ServerUnaryCall<Object>, callback: grpc.requestCallback<Object>) => {
    try {
      const traceparent: grpc.MetadataValue[] = call.metadata.get('elastic-apm-traceparent');
      const transOptions = (traceparent.length > 0) ? { childOf: traceparent[0].toString() } : {};
      apm.startTransaction(`/file.FileService/${func.name}`, 'request', transOptions);
      const traceID: string = getCurrTraceId();
      log(Severity.INFO, func.name, 'request', traceID, call.request);

      const res = await func(call, callback);

      apm.endTransaction(statusToString(grpc.status.OK));
      log(Severity.INFO, func.name, 'response', traceID, res);
      callback(null, res);
    } catch (err) {
      const validatedErr : ApplicationError = validateGrpcError(err);
      log(Severity.ERROR, func.name, err.message, getCurrTraceId());
      apm.endTransaction(validatedErr.name);
      callback(validatedErr);
    }
  };
}

export function getCurrTraceId() : string {
  try {
    return apm.currentTransaction.traceparent.split('-')[1];
  } catch (err) {
    // Should never get here. The log is set after apm starts.
    return '';
  }
}
