import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { IBaseFile } from '../file.interface';
import { baseModelName, collectionName, discriminatorKey } from './config';


const baseFileOptions = { timestamps: true, collection: collectionName, discriminatorKey };
const BaseFileModel = mongoose.model<Document & IBaseFile>(baseModelName, new mongoose.Schema({}, baseFileOptions));

export default BaseFileModel;
