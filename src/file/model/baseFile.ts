import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { baseModelName } from "./config"

interface IBaseFile {
    fileModel: string;
}

const baseFileOptions = { timestamps: true, collection: 'File', discriminatorKey: 'fileModel' };
const BaseFileModel = mongoose.model<Document & IBaseFile>(baseModelName, new mongoose.Schema({}, baseFileOptions));

export default BaseFileModel;
