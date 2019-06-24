
import * as winston from 'winston';
import * as os from 'os';
const Elasticsearch = require('winston-elasticsearch');
import { confLogger } from './config';

const indexTemplateMapping = require('winston-elasticsearch/index-template-mapping.json');
indexTemplateMapping.index_patterns = `${confLogger.indexPrefix}-*`;

export const logger = winston.createLogger({
  defaultMeta: { service: 'file.fileService', hostname: os.hostname() },
});

if (confLogger.elasticsearch) {
  console.log('elastic');
  const elasticsearch = new Elasticsearch({
    indexPrefix: confLogger.indexPrefix,
    level: 'verbose',
    clientOpts: confLogger.elasticsearch,
    bufferLimit: 100,
    ensureMappingTemplate: true,
    mappingTemplate: indexTemplateMapping,
  });
  logger.add(elasticsearch);
} else {
  const winstonConsole = new winston.transports.Console({
    level: 'silly',
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.json(),
    ),
  });
  logger.add(winstonConsole);
}

export const log = (severity: string, name: string, description: string, correlationId?: string, user?: string, more?: any) => {
  logger.log(severity, { name, description, correlationId, user, ...more });
};
