type DB = {
  confType: string;
  name: string;
  host: string;
};

const dev: DB = {
  confType: 'dev',
  name: 'devDB',
  host: 'localhost'
};

const prod: DB = {
  confType: 'prod',
  name: 'prodDB',
  host: 'mongo'
};

const testing: DB = {
  confType: 'testing',
  name: 'testingDB',
  host: 'localhost'
};

function getDB(confType: string) : DB {
  switch (confType) {
    case dev.confType:
      return dev;
    case prod.confType:
      return prod;
    case testing.confType:
      return testing;
    default:
      return dev;
  }
}

// the port for binding the server
export const bindAddress: string = process.env.BIND_ADDRESS || '0.0.0.0:8080';
export const debugMode: boolean = process.env.DEBUG_MODE === 'true';

const esHost: string = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';
const esUser: string = process.env.ELASTICSEARCH_USER || '';
const esPass: string = process.env.ELASTICSEARCH_PASSWORD || '';
export const confLogger = {
  options: {
    hosts: esHost && esHost.split(','),
    // Might be auth instead, not sure.
    httpAuth: `${esUser}:${esPass}`,
  },
  indexPrefix: process.env.LOG_INDEX || 'kdrive',
};

// Used for the APM agent
export const secretToken: string = process.env.APM_SECRET_TOKEN || '';
export const serviceName: string = process.env.FS_APM_SERVICE_NAME || 'file-service';
export const verifyServerCert: boolean = process.env.ELASTIC_APM_VERIFY_SERVER_CERT === 'true';
export const apmURL: string = process.env.ELASTIC_APM_SERVER_URL || 'http://localhost:8200';
export const userQuotaLimit: string = process.env.USER_QUOTA_LIMIT || '10';

export const nodeEnv: string = process.env.NODE_ENV || 'dev';
export const database: DB = getDB(nodeEnv);

export const autoIndex: string = process.env.FS_AUTO_INDEX || 'false';

// example: 'mongodb://user:pw@host1.com:27017,host2.com:27017,host3.com:27017/testdb'
export const mongoConnectionString : string =
  process.env.MONGO_HOST || `mongodb://${database.host}:27017/${database.name}`;
export const connectionRetries : string = process.env.RECONNECT_ATTEMPTS || '5';
export const reconnectTimeout : string = process.env.RECONNECT_TIMEOUT || '2000';
