import mongoose from 'mongoose';
import { mongoConnectionString, rpcPort, nodeEnv } from './config';
import { FileServer, serviceNames } from './server';
import { HealthCheckResponse } from 'grpc-ts-health-check';

async function initServer() {
  const fileServer: FileServer = new FileServer(rpcPort);
  await connectDB(fileServer);
  fileServer.server.start();
}

async function connectDB(fileServer: FileServer) {
  await mongoose.connect(
    mongoConnectionString,
    { useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false },
    (err) => {
      if (!err) {
        setHealthStatus(fileServer, HealthCheckResponse.ServingStatus.SERVING);
      } else {
        setHealthStatus(fileServer, HealthCheckResponse.ServingStatus.NOT_SERVING);
      }
    });

  const db = mongoose.connection;
  db.on('connected', () => {
    setHealthStatus(fileServer, HealthCheckResponse.ServingStatus.SERVING);
  });
  db.on('error', () => {
    setHealthStatus(fileServer, HealthCheckResponse.ServingStatus.NOT_SERVING);
  });
  db.on('disconnected', () => {
    setHealthStatus(fileServer, HealthCheckResponse.ServingStatus.NOT_SERVING);
  });
}

// Ensures you don't run the server twice
if (!module.parent) {
  initServer();
}

function setHealthStatus(server: FileServer, status: number) : void {
  for (let i = 0 ; i < serviceNames.length ; i++) {
    server.grpcHealthCheck.setStatus(serviceNames[i], status);
  }
}
