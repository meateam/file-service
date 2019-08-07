import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { database } from '../config';

dotenv.config({ path: '.env' });

(<any>mongoose).Promise = Promise;

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

before(async () => {
  const mongoHost = process.env.MONGO_HOST || database.host;
  await mongoose.connect(
    `mongodb://${mongoHost}:27017/file`,
    { useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false }
  );
  console.log(`mongo connection: mongodb://${mongoHost}:27017/file`);
});

after((done) => {
  mongoose.connection.close();
  done();
});
