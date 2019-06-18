/**
 *
 */

type Config = {
  rpc_port: string;
  conf_type: string;
  server: string;
  port: number;
  db: {
    host: string,
    port: string,
    name: string,
  },
};

const testing: Config = {
  rpc_port: process.env.RPC_PORT || '8080',
  conf_type: 'testing',
  server: 'http://localhost',
  port: 9000,
  db: {
    host: process.env.MONGO_HOST || 'localhost',
    port: '27017',
    name: 'testingDB',
  },
};

const dev: Config = {
  rpc_port: process.env.RPC_PORT || '8080',
  conf_type: 'dev',
  server: 'http://40.115.124.214',
  port: 9000,
  db: {
    host: process.env.MONGO_HOST || 'localhost',
    port: '27017',
    name: 'devDB',
  },
};

// Change to Production Environment
const prod: Config = {
  rpc_port: process.env.RPC_PORT || '8080',
  conf_type: 'prod',
  server: 'https://seal.blue.com',
  port: 9000,
  db: {
    host: process.env.MONGO_HOST || 'mongo',
    port: '27017',
    name: 'prodDB',
  },
};

function getConfig(confType: string) : Config {
  switch (confType) {
    case dev.conf_type:
      return dev;
    case prod.conf_type:
      return prod;
    case testing.conf_type:
      return testing;
    default:
      return dev;
  }
}

export const config : Config = getConfig(process.env.NODE_ENV || dev.conf_type);
// example: 'mongodb://user:pw@host1.com:27017,host2.com:27017,host3.com:27017/testdb'
export const connectionString : string =
  process.env.MONGO_CONNECTION_STRING ||
  `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`;
