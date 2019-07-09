import mongoose from 'mongoose';
import { mongoConnectionString, rpcPort } from './config';
import { FileServer, serviceNames } from './file/file.rpc';
import { HealthCheckResponse } from 'grpc-ts-health-check';

export class Server {
  public listener: any;

  constructor(testing = false) {
    if (!testing) {
      this.connectDB();
    }
  }

  public static bootstrap(): Server {
    return new Server();
  }

  // Connect mongoose to our database
  private async connectDB() {
    const fileServer: FileServer = new FileServer(rpcPort);

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

    // Ensures you don't run the server twice
    if (!module.parent) {
      fileServer.server.start();
    }
  }
}

if (!module.parent) {
  new Server();
}

function setHealthStatus(server: FileServer, status: number) : void {
  for (let i = 0 ; i < serviceNames.length ; i++) {
    server.grpcHealthCheck.setStatus(serviceNames[i], status);
  }
}
