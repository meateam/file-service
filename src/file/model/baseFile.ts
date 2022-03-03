import * as mongoose from 'mongoose';
import { IBaseFile } from '../file.interface';
import { baseModelName, collectionName, discriminatorKey } from './config';

const baseFileOptions = { discriminatorKey, timestamps: true, collection: collectionName, };
const BaseFileModel = mongoose.model<mongoose.Document & IBaseFile>(baseModelName, new mongoose.Schema({}, baseFileOptions));

export default BaseFileModel;
