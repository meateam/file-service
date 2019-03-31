import * as mongoose from 'mongoose';
import { ServerError } from '../errors/application.error';
import { IFile } from './files.interface';

const ObjectId = mongoose.Schema.Types.ObjectId;

export const fileSchema: mongoose.Schema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    mimeType: {
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
      required: true,
    },
    ancestors: {
      type: [ObjectId],
      ref: 'File',
      default: [],
    },
    children: {
      type: [ObjectId],
      ref: 'File',
      default: [],
    },
  },
  {
    timestamps: true,
  });

fileSchema.post('save', (error, doc, next) => {
  next(new ServerError(error.message));
});

export const fileModel = mongoose.model<IFile & mongoose.Document>('File', fileSchema);
