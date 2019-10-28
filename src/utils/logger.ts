import * as winston from 'winston';
import * as os from 'os';
import * as Elasticsearch from 'winston-elasticsearch';
import * as grpc from 'grpc';
import apm from 'elastic-apm-node';
import * as _ from 'lodash';
import { confLogger, serviceName, debugMode } from '../config';
import { statusToString, validateGrpcError } from './errors/grpc.status';
import { ApplicationError } from './errors/application.error';

// index pattern for the logger
const indexTemplateMapping = require('winston-elasticsearch/index-template-mapping.json');
indexTemplateMapping.index_patterns = `${confLogger.indexPrefix}-*`;

export const logger: winston.Logger = winston.createLogger({
  defaultMeta: { service: serviceName, hostname: os.hostname() },
});

// configure logger
const elasticsearch = new Elasticsearch.default({
  indexPrefix: confLogger.indexPrefix,
  level: 'verbose',
  clientOpts: confLogger.options,
  bufferLimit: 100,
  messageType: 'log',
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
export const log = (level: Severity, message: string, name: string, traceID?: string, meta?: object) => {
  // Console logs for debugging only.
  if (debugMode) {
    if (traceID) {
      console.log(`level: ${level}, message: ${message}, name: ${name}, traceID: ${traceID}, meta:`);
    } else {
      console.log(`level: ${level}, message: ${message}, name: ${name}, meta:`);
    }
    if (meta) {
      console.log(meta);
    }
  }
  logger.log(level, message, { ...meta, traceID, method: name });
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
      const reqInfo: object = extractReqLog(call.request);
      log(Severity.INFO, 'request', func.name, traceID, reqInfo);

      const res = await func(call, callback);
      apm.endTransaction(statusToString(grpc.status.OK));
      const resInfo: object = extractResLog(res);
      log(Severity.INFO, 'response', func.name, traceID, resInfo);
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

/**
 * extracts the wanted information for the logger from the response.
 * for example: extracts only the file ids from the returned array of files.
 * @param res - the result of the method called in file.grpc
 */
function extractResLog(res: any): object {
  if (res) {
    const logInfo = _.cloneDeep(res);
    if (res.files) {
      const ids: {id: string}[] = [];
      for (let i = 0 ; i < res.files.length ; i++) {
        ids[i] = res.files[i].id;
      }
      logInfo.files = { ids, length: ids.length };
    }
    return logInfo;
  }
}

/**
 * extracts the wanted information for the logger from the request.
 * for example: extracts only relevant fields in the queryFile.
 * @param req - the call.request received in the service.
 */
function extractReqLog(req: any): object {
  const logInfo: any = _.cloneDeep(req);
  const query: any = {};
  if (req.queryFile) {
    const ignoreFields = ['size', 'createdAt', 'updatedAt', 'children'];
    if (req.queryFile['size']) {
      if (req.queryFile['size'].toString() !== '0') {
        query['size'] = Number(req.queryFile['size']);
      }
    }
    for (const prop in req.queryFile) {
      if (req.queryFile[prop] && !ignoreFields.includes(prop)) {
        query[prop] = req.queryFile[prop];
      }
    }
  }
  logInfo.queryFile = query;
  return logInfo;
}
