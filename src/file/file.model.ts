import { Schema, model, Document } from 'mongoose';
import { ServerError } from '../utils/errors/application.error';
import { IFile } from './file.interface';
import { UniqueIndexExistsError } from '../utils/errors/client.error';
import { MongoError } from 'mongodb';
import { NextFunction } from 'connect';

const ObjectId = Schema.Types.ObjectId;

export const fileSchema: Schema = new Schema(
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
    parent: {
      type: ObjectId,
      ref: 'File',
      default: null,
    },
    bucket: {
      type: String,
      required: false,
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

fileSchema.index({ name: 1, parent: 1, ownerID: 1 }, { unique: true });

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
    const retMessage : string = getMongoErrorIndex(error);
    next(new UniqueIndexExistsError(retMessage));
  } else {
    next();
  }
};

/**
 * Extracts the unique fields names and values thrown by the duplicate key error.
 * @param error - the mongo error thrown.
 * @return string with the unique fields names and values.
 */
function getMongoErrorIndex(error: MongoError) : string {
  // Extract the fields names in the MongoError
  const fieldsRegex : RegExp = new RegExp(/index\:\ (?:.*\.)?\$?(?:([_a-z0-9]*)(?:_\d*)|([_a-z0-9]*))\s*dup key/i);
  const fieldsMatch : RegExpMatchArray =  error.message.match(fieldsRegex);
  let indexName : string = fieldsMatch[1] || fieldsMatch[2];

  // Prettify fields names
  indexName = indexName.replace(new RegExp('_1_', 'g'), ', ');

  // Rxtract the fields values of the error thrown
  const valuesRE : RegExp = new RegExp(/{(.*?)}/);
  const valuesMatch : RegExpMatchArray = error.message.match(valuesRE);
  let values : string = valuesMatch[0];

  // Prettify fields values
  values = values.replace(new RegExp(' : ', 'g'), ' ');

  return `${indexName} : ${values}`;
}

fileSchema.post('save', handleE11000);
fileSchema.post('update', handleE11000);
fileSchema.post('findOneAndUpdate', handleE11000);
fileSchema.post('updateOne', handleE11000);
fileSchema.post('insertMany', handleE11000);

fileSchema.post('save', (error: MongoError, _: any, next: NextFunction) => {
  if (error.name === 'MongoError') {
    next(new ServerError(error.message));
  }
  next(error);
});

export const fileModel = model<IFile & Document>('File', fileSchema);
