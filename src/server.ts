import express from 'express';
import * as bodyParser from 'body-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';
import session from 'express-session';
import cors from 'cors';
import { config } from './config';
import { RPC } from './file/file.rpc';

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
    const mongoHost = process.env.MONGO_HOST || config.db.host;
    await mongoose.connect(
      `mongodb://${mongoHost}:${config.db.port}/${config.db.name}`,
      { useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false }
    );

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
  }

  private listen() {
    const rpcServer: RPC = new RPC(config.rpc_port);

    // Insures you don't run the server twice
    if (!module.parent) {
      rpcServer.server.start();
    }
  }

}

if (!module.parent) {
  new Server().app;
}
