import mongoose from 'mongoose';
import { ServerError } from '../utils/errors/application.error';
import { IFile } from './file.interface';

const ObjectId = mongoose.Schema.Types.ObjectId;

export const fileSchema: mongoose.Schema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true,
    },
    fullName: {
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
    parent: {
      type: [ObjectId],
      ref: 'File',
      default: [],
    },
    bucket: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  });

fileSchema.post('save', (error, doc, next) => {
  next(new ServerError(error.message));
});

fileSchema.virtual('id').get(() => {
  return this._id;
});

fileSchema.virtual('displayName').get(() => {
  return this.fullName.split('.')[0];
});

fileSchema.virtual('fullExtension').get(() => {
  return this.fullName.split('.').splice(1).join('.');
});

export const fileModel = mongoose.model<IFile & mongoose.Document>('File', fileSchema);
