import * as winston from 'winston';
import * as os from 'os';
import * as Elasticsearch from 'winston-elasticsearch';
import { confLogger, serviceName } from '../config';

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
 * @param more - additional optional information.
 */
export const log = (severity: Severity, name: string, description: string, traceID?: string, user?: string, more?: any) => {
  logger.log(severity, { name, description, traceID, user, ...more });
};

export enum Severity {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  SILLY = 'silly',
}
