import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { baseModelName, collectionName, discriminatorKey } from "./config"

interface IBaseFile {
    fileModel: string;
}

const baseFileOptions = { timestamps: true, collection: collectionName, discriminatorKey: discriminatorKey };
const BaseFileModel = mongoose.model<Document & IBaseFile>(baseModelName, new mongoose.Schema({}, baseFileOptions));

export default BaseFileModel;
