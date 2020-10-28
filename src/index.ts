import mongoose from 'mongoose';
import { HealthCheckResponse } from 'grpc-ts-health-check';
import { FileServer, serviceNames } from './server';
import { mongoConnectionString, bindAddress, connectionRetries, reconnectTimeout, autoIndex } from './config';
import { log, Severity, getCurrTraceId } from './utils/logger';

// Ensures you don't run the server twice
if (!module.parent) {
  initServer();
}

async function initServer() {
  const fileServer: FileServer = new FileServer(bindAddress);
  await initMongo(fileServer);
  fileServer.server.start();
}

async function initMongo(fileServer: FileServer) {
  await startConnectionAttempts(fileServer);
  const db = mongoose.connection;

  db.on('connected', () => {
    log(Severity.INFO, `connected to ${mongoConnectionString}`, 'connectDB');
    setHealthStatus(fileServer, HealthCheckResponse.ServingStatus.SERVING);
  });
  db.on('error', (err) => {
    log(Severity.ERROR, 'mongo connection error!', 'connectDB', getCurrTraceId(), err);
    setHealthStatus(fileServer, HealthCheckResponse.ServingStatus.NOT_SERVING);
  });
  db.on('disconnected', () => {
    log(Severity.ERROR, 'mongo disconnected', 'connectDB');
    setHealthStatus(fileServer, HealthCheckResponse.ServingStatus.NOT_SERVING);
  });
}

/**
 * Attempts to connect to mongo connectionRetries times.
 * Waits reconnectTimeout ms bewteen attempts.
 * @param fileServer - the server trying to connect.
 */
async function startConnectionAttempts(fileServer: FileServer) {

  log(Severity.INFO, `connecting to ${mongoConnectionString}`, 'connectDB');

  const retries = parseInt(connectionRetries, 10);
  const timeout = parseInt(reconnectTimeout, 10);

  for (let i  = 1 ; i <= retries ; i++) {
    let connectionRes: {success: boolean, error: Error} = await connect();
    if (!connectionRes.success) {
      log(Severity.ERROR, `mongo connection retry (${i}/${retries})`, 'connectDB', getCurrTraceId(),
          { errMsg: connectionRes.error.message, stack: connectionRes.error.stack }
      );
      setHealthStatus(fileServer, HealthCheckResponse.ServingStatus.NOT_SERVING);
      await sleep(timeout);
      connectionRes = await connect();
    } else {
      log(Severity.INFO, `connected to ${mongoConnectionString}`, 'connectDB');
      setHealthStatus(fileServer, HealthCheckResponse.ServingStatus.SERVING);
      break;
    }
  }

}

/**
 * Connects to mongo with mongoConnectionString.
 */
async function connect(): Promise<{success: boolean, error: Error}> {
  let success: boolean = false;
  let error: Error = null;
  await mongoose.connect(
    mongoConnectionString,
    { useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false, autoIndex: autoIndex === 'true' },
    async (err) => {
      if (!err) {
        success = true;
      } else {
        success = false;
        error = err;
      }
    });
  return { success, error };
}

function setHealthStatus(server: FileServer, status: number) : void {
  for (let i = 0 ; i < serviceNames.length ; i++) {
    server.grpcHealthCheck.setStatus(serviceNames[i], status);
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
