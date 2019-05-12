import mongoose from 'mongoose';
import { ServerError } from '../utils/errors/application.error';
import { IFile } from './file.interface';
import { KeyAlreadyExistsError } from '../utils/errors/client.error';
import { MongoError } from 'mongodb';
import { NextFunction } from 'connect';

const ObjectId = mongoose.Schema.Types.ObjectId;

export const fileSchema: mongoose.Schema = new mongoose.Schema(
  {
    key: {
      type: String,
      sparse: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    ownerID: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 0,
    },
    isRootFolder: {
      type: Boolean,
      default: false,
    },
    parent: {
      type: ObjectId,
      ref: 'File',
      default: null,
    },
    bucket: {
      type: String,
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
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
  });

fileSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

fileSchema.virtual('displayName')
.set(function () {
  this.displayName = this.name.split('.')[0];
}) .get(function ()  {
  return (`${this.name.split('.')[0]}`);
});

fileSchema.virtual('fullExtension')
.set(function () {
  this.fullExtension = this.name.split('.').splice(1).join('.');
}) .get(function ()  {
  return (`${this.name.split('.').splice(1).join('.')}`);
});

// handleE11000 is called when there is a duplicateKey Error
const handleE11000 = function (error: MongoError, res: any, next: any) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new KeyAlreadyExistsError(this.key));
  } else {
    next();
  }
};

fileSchema.post('save', handleE11000);
fileSchema.post('update', handleE11000);
fileSchema.post('findOneAndUpdate', handleE11000);
fileSchema.post('insertMany', handleE11000);

fileSchema.post('save', (error: MongoError, _: any, next: NextFunction) => {
  if (error.name === 'MongoError') {
    next(new ServerError(error.message));
  }
  next(error);
});

export const fileModel = mongoose.model<IFile & mongoose.Document>('File', fileSchema);
