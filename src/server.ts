import express from 'express';
import * as bodyParser from 'body-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';
import session from 'express-session';
import cors from 'cors';
import { config } from './config';
import { RPC, serviceNames } from './file/file.rpc';
import { GrpcHealthCheck, HealthCheckResponse } from 'grpc-ts-health-check';

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
    const rpcServer: RPC = new RPC(config.rpc_port);

    const mongoHost = process.env.MONGO_HOST || config.db.host;
    await mongoose.connect(
      `mongodb://${mongoHost}:${config.db.port}/${config.db.name}`,
      { useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false },
      (err) => {
        if(!err){
          setHealthStatus(rpcServer, HealthCheckResponse.ServingStatus.SERVING);
        } else {
          setHealthStatus(rpcServer, HealthCheckResponse.ServingStatus.NOT_SERVING);
        }
      }
    );

    const db = mongoose.connection;
    db.on('connected', () => {
      setHealthStatus(rpcServer, HealthCheckResponse.ServingStatus.SERVING);
    });
    db.on('error', () => {
      setHealthStatus(rpcServer, HealthCheckResponse.ServingStatus.NOT_SERVING);
    });
    db.on('disconnected', () => {
      setHealthStatus(rpcServer, HealthCheckResponse.ServingStatus.NOT_SERVING);
    });

    // Insures you don't run the server twice
    if (!module.parent) {
      rpcServer.server.start();
    }
  }

}

if (!module.parent) {
  new Server().app;
}

function setHealthStatus(server: RPC, status: number) : void {
  for(let i = 0 ; i < serviceNames.length ; i++){
    server.grpcHealthCheck.setStatus(serviceNames[i], status);
  }
}
