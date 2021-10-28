import { Schema, model, Document } from 'mongoose';
import { ServerError } from '../utils/errors/application.error';
import { IFile } from './file.interface';
import { UniqueIndexExistsError, FileExistsWithSameName, FileParentAppIDNotEqual } from '../utils/errors/client.error';
import { MongoError } from 'mongodb';
import { NextFunction } from 'connect';

const ObjectId = Schema.Types.ObjectId;

export const shortcutSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        parent: {
            type: ObjectId,
            required: true,
        },
        fileID: {
            type: String,
            required: true,
        },

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

shortcutSchema.index({ name: 1, parent: 1, fileID: 1 }, { unique: false });
shortcutSchema.index({ key: 1, bucket: 1 }, { unique: true, sparse: true });

shortcutSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

shortcutSchema.virtual('displayName')
    .set(function () {
        this.displayName = this.name ? this.name.split('.')[0] : '';
    }).get(function () {
        return (`${this.name ? this.name.split('.')[0] : ''}`);
    });

shortcutSchema.virtual('fullExtension')
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

shortcutSchema.pre('updateOne', async function (next: NextFunction) {
    const fileID = this.getQuery().fileID;
    const update = this.getUpdate();

    const updatedParent = update.$set && update.$set.parent;
    const updatedName = update.$set && update.$set.name;
    const query: any = { name: updatedName, parent: updatedParent };

    if (!updatedParent) {
        query.fileID = fileID;
    }

    const existingFile = await shortcutModel.findOne(query);

    if (existingFile && existingFile.id !== this.getQuery()._id.toString()) {
        next(new FileExistsWithSameName());
    } else {
        next();
    }
});

shortcutSchema.pre('save', async function (next: NextFunction) {
    const name = (<any>this).name;
    const parent = (<any>this).parent;
    const fileID = (<any>this).fileID;

    const parentFile = await shortcutModel.findById(parent);

    const query: any = { name, parent, fileID };
    if (!parent) {
        query.fileID = fileID;
    }

    const existingFile = await shortcutModel.findOne(query);

    if (parentFile && parentFile.fileID !== fileID) {
        next(new FileParentAppIDNotEqual());
    } else if (existingFile && !existingFile.float) {
        next(new FileExistsWithSameName());
    } else {
        next();
    }
});

shortcutSchema.post('save', handleE11000);
shortcutSchema.post('update', handleE11000);
shortcutSchema.post('findOneAndUpdate', handleE11000);
shortcutSchema.post('updateOne', handleE11000);
shortcutSchema.post('insertMany', handleE11000);

shortcutSchema.post('save', (error: MongoError, _: any, next: NextFunction) => {
    if (error.name === 'MongoError') {
        next(new ServerError(error.message || error.errmsg));
    }
    next(error);
});

export const shortcutModel = model<IFile & Document>('ShortcutFile', shortcutSchema);
