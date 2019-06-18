import express from 'express';
import * as bodyParser from 'body-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';
import session from 'express-session';
import cors from 'cors';
import { config, mongoConnectionString } from './config';
import { FileServer, serviceNames } from './file/file.rpc';
import { HealthCheckResponse } from 'grpc-ts-health-check';

export class Server {
  public app: express.Application;
  public listener: any;

  constructor(testing = false) {
    this.createApplication();
    this.configApplication();
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

    if (!testing) {
      this.connectDB();
      this.log();
    }
  }

  public static bootstrap(): Server {
    return new Server();
  }

  private createApplication(): void {
    this.app = express();
  }

  // using cors, body parsers and sessions
  private configApplication(): void {
    this.app.use(cors({ credentials: true, origin: true }));
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(session({
      secret: 'seal',
      resave: true,
      saveUninitialized: true
    }));
    this.app.use((_, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
      next();
    });
  }

  private log() {
    this.app.use(morgan('tiny'));
  }

  // Connect mongoose to our database
  private async connectDB() {
    const fileServer: FileServer = new FileServer(config.rpc_port);

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
  new Server().app;
}

function setHealthStatus(server: FileServer, status: number) : void {
  for (let i = 0 ; i < serviceNames.length ; i++) {
    server.grpcHealthCheck.setStatus(serviceNames[i], status);
  }
}
