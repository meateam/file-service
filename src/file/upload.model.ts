import mongoose from 'mongoose';
import { ServerError } from '../utils/errors/application.error';
import { IUpload } from './upload.interface';
import { MongoError } from 'mongodb';
import { KeyAlreadyExistsError } from '../utils/errors/client.error';

export const uploadSchema: mongoose.Schema = new mongoose.Schema(
  {
    uploadID: {
      type: String,
      required: false,
    },
    key: {
      type: String,
    },
    bucket: {
      type: String,
    },
    name: {
      type: String,
      required: true
    }
  }
);

uploadSchema.index({ key: 1, bucket: 1 }, { unique: true });

// ******* SAME AS FILE *******//
// handleE11000 is called when there is a duplicateKey Error
const handleE11000 = function (error: MongoError, res: any, next: any) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new KeyAlreadyExistsError(this.key));
  } else {
    next();
  }
};

uploadSchema.post('save', handleE11000);
uploadSchema.post('update', handleE11000);
uploadSchema.post('findOneAndUpdate', handleE11000);

uploadSchema.post('save', (error, doc, next) => {
  if (error.name === 'MongoError') {
    next(new ServerError(error.message));
  }
  next(error);
});

// ***************************//

export const uploadModel = mongoose.model<IUpload & mongoose.Document>('Upload', uploadSchema);
