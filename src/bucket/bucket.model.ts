import { Document, Schema, model } from 'mongoose';
import { ServerError } from '../utils/errors/application.error';
import { IBucket } from './bucket.interface';
import { MongoError } from 'mongodb';
import { KeyAlreadyExistsError } from '../utils/errors/client.error';
import { NextFunction } from 'connect';

const MiB = 1024;
const GiB = 1024 * MiB;
export const bucketSchema: Schema = new Schema(
  {
    ownerID: {
      type: String,
      required: true,
      unique: true,
    },
    quota: {
      type: Number,
      required: true,
      default: 100 * GiB,
    },
    used: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ******* SAME AS FILE *******//
// handleE11000 is called when there is a duplicateKey Error
const handleE11000 = function (error: MongoError, _: any, next: NextFunction) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new KeyAlreadyExistsError(this.key));
  } else {
    next();
  }
};

bucketSchema.post('save', handleE11000);
bucketSchema.post('update', handleE11000);
bucketSchema.post('findOneAndUpdate', handleE11000);

bucketSchema.post('save', (error: MongoError, _: any, next: NextFunction) => {
  if (error.name === 'MongoError') {
    next(new ServerError(error.message));
  }
  next(error);
});

// ***************************//

export const bucketModel = model<IBucket & Document>('buckets', bucketSchema);
