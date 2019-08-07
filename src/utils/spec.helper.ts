import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { database, mongoConnectionString } from '../config';

dotenv.config({ path: '.env' });

(<any>mongoose).Promise = Promise;

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

before(async () => {
  await mongoose.connect(
    mongoConnectionString,
    { useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false }
  );
  console.log(`mongo connection: ${mongoConnectionString}`);
});

after((done) => {
  mongoose.connection.close();
  done();
});
