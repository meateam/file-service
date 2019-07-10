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

const esHost: string = process.env.LOGGER_ELASTICSEARCH || 'http://localhost:9200';
export const confLogger = {
  elasticsearch: esHost && {
    hosts: esHost.split(','),
  },
  indexPrefix: process.env.LOGGER_ELASTICSEARCH_PREFIX || 'kdrive',
};

// Used for the APM agent
export const secretToken: string = process.env.APM_SECRET_TOKEN || '';
export const serviceName: string = process.env.FS_APM_SERVICE_NAME || 'file-service';
export const verifyServerCert: boolean = process.env.ELASTIC_APM_VERIFY_SERVER_CERT === 'true';
export const apmURL: string = process.env.ELASTIC_APM_SERVER_URL || 'http://localhost:8200';

// the port for binding the server
export const rpcPort: string = process.env.RPC_PORT || '8080';

export const nodeEnv: string = process.env.NODE_ENV || 'dev';
export const database: DB = getDB(nodeEnv);

// example: 'mongodb://user:pw@host1.com:27017,host2.com:27017,host3.com:27017/testdb'
export const mongoConnectionString : string =
  process.env.MONGO_HOST || `mongodb://${database.host}:27017/${database.name}`;
