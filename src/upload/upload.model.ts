import { Schema, Document, model } from 'mongoose';
import { ServerError } from '../utils/errors/application.error';
import { IUpload } from './upload.interface';
import { MongoError } from 'mongodb';
import { UniqueIndexExistsError } from '../utils/errors/client.error';
import { NextFunction } from 'connect';

export const uploadSchema: Schema = new Schema(
  {
    uploadID: {
      type: String,
      required: false,
    },
    key: {
      type: String,
      required: true,
    },
    bucket: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    parent: {
      type: String,
      default: null,
      required: false,
    },
    ownerID: {
      type: String,
      required: false,
    },
    size: {
      type: Number,
      required: true,
      default: 0,
    },
    isUpdate: { // Relevant for updates
      type: Boolean,
      required: false,
      default: false
    },
    fileID: { // Relevant for updates
      type: String,
      required: false
    }
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    }
  }
);

uploadSchema.index({ key: 1, bucket: 1 }, { unique: true });

// ******* SAME AS FILE *******//
// handleE11000 is called when there is a duplicateKey Error
const handleE11000 = function (error: MongoError, _: any, next: NextFunction) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new UniqueIndexExistsError(this.key));
  } else {
    next();
  }
};

uploadSchema.post('save', handleE11000);
uploadSchema.post('update', handleE11000);
uploadSchema.post('findOneAndUpdate', handleE11000);

uploadSchema.post('save', (error: MongoError, _: any, next: NextFunction) => {
  if (error.name === 'MongoError') {
    next(new ServerError(error.message));
  }
  next(error);
});

// ***************************//

export const uploadModel = model<IUpload & Document>('Upload', uploadSchema);
