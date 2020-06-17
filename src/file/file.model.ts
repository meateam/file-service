import { Schema, model, Document } from 'mongoose';
import { ServerError } from '../utils/errors/application.error';
import { IFile } from './file.interface';
import { UniqueIndexExistsError, FileExistsWithSameName } from '../utils/errors/client.error';
import { MongoError } from 'mongodb';
import { NextFunction } from 'connect';

const ObjectId = Schema.Types.ObjectId;

export const fileSchema: Schema = new Schema(
  {
    key: {
      type: String,
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
    parent: {
      type: ObjectId,
      ref: 'File',
      default: null,
    },
    bucket: {
      type: String,
      required: false,
    },
    float: {
      type: Boolean,
      required: false,
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
  }
);

fileSchema.index({ name: 1, parent: 1, ownerID: 1 }, { unique: false });
fileSchema.index({ key: 1, bucket: 1 }, { unique: true, sparse: true });

fileSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

fileSchema.virtual('displayName')
  .set(function () {
    this.displayName = this.name ? this.name.split('.')[0] : '';
  }).get(function () {
    return (`${this.name ? this.name.split('.')[0] : ''}`);
  });

fileSchema.virtual('fullExtension')
  .set(function () {
    this.fullExtension = this.name ? this.name.split('.').splice(1).join('.') : '';
  }).get(function () {
    return (`${this.name ? this.name.split('.').splice(1).join('.') : ''}`);
  });

/**
 * handleE11000 is called when there is a duplicateKey Error.
 * @param error
 * @param _
 * @param next
 */
function handleE11000(error: MongoError, _: any, next: NextFunction) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new UniqueIndexExistsError(error.message || error.errmsg));
  } else if (error.name === 'INVALID_ARGUMENT') {
    next(error);
  } else {
    next();
  }
}

fileSchema.pre('updateOne', async function (next: NextFunction) {
  const ownerID = this.getQuery().ownerID;

  const update = this.getUpdate();

  const updatedParent = update.$set && update.$set.parent;
  const updatedName = update.$set && update.$set.name;
  const query: any = { name: updatedName, parent: updatedParent };

  if (!updatedParent) {
    query.ownerID = ownerID;
  }

  const existingFile = await fileModel.findOne(query);

  if (existingFile && existingFile.id !== this.getQuery()._id.toString() && !existingFile.float) {
    next(new FileExistsWithSameName());
  } else {
    next();
  }
});

fileSchema.pre('save', async function (next: NextFunction) {
  const name = (<any>this).name;
  const parent = (<any>this).parent;
  const ownerID = (<any>this).ownerID;

  const query: any = { name, parent };
  if (!parent) {
    query.ownerID = ownerID;
  }

  const existingFile = await fileModel.findOne(query);
  if (existingFile && !existingFile.float) {
    next(new FileExistsWithSameName());
  } else {
    next();
  }
});

fileSchema.post('save', handleE11000);
fileSchema.post('update', handleE11000);
fileSchema.post('findOneAndUpdate', handleE11000);
fileSchema.post('updateOne', handleE11000);
fileSchema.post('insertMany', handleE11000);

fileSchema.post('save', (error: MongoError, _: any, next: NextFunction) => {
  if (error.name === 'MongoError') {
    next(new ServerError(error.message || error.errmsg));
  }
  next(error);
});

export const fileModel = model<IFile & Document>('File', fileSchema);
