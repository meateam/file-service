import express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import morgan from 'morgan';
import * as path from 'path';
import { config } from './config';
// import * as fs from 'fs';
import * as https from 'https';
import session from 'express-session';
import cors from 'cors';

import { RPC } from './file/file.rpc';
// const privateKey = fs.readFileSync('wildcard.key', 'utf8');
// const certificate = fs.readFileSync('wildcard.pem', 'utf8');
// const credentials = { key: privateKey, cert: certificate };

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
      this.listen();
    }
  }

  public static bootstrap(): Server {
    return new Server();
  }

  private createApplication(): void {
    this.app = express();
  }

  private configApplication(): void {
    this.app.use(cors({ credentials: true, origin: true }));
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(session({
      secret: 'seal',
      resave: true,
      saveUninitialized: true
    }));
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
      next();
    });
  }

  private log() {
    this.app.use(morgan('tiny'));  // 'combined' for more info
  }

  private async connectDB() {
    // Connect mongoose to our database
    await mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`);
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
      console.log('DB IS CONNECTED!');
    });
  }

  private listen() {
    const rpcPort = '50051';
    const rpcServer: RPC = new RPC(rpcPort);

    // Insures you don't run the server twice
    if (!module.parent) {
      console.log('Starting RPC server');
      rpcServer.server.start();
    }
  }

}

if (!module.parent) {
  new Server().app;
}
