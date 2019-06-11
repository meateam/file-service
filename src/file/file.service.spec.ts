import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import mongoose from 'mongoose';
import { IFile } from './file.interface';
import { FileService, FolderContentType } from './file.service';
import { ServerError, ClientError } from '../utils/errors/application.error';
import { FileExistsWithSameName, KeyAlreadyExistsError, FileNotFoundError } from '../utils/errors/client.error';
import { IUpload } from './upload.interface';
import { uploadModel } from './upload.model';
import { fileModel } from './file.model';
import { promises } from 'fs';

const expect: Chai.ExpectStatic = chai.expect;
const should = chai.should();
chai.use(chaiAsPromised);

const KEY = mongoose.Types.ObjectId().toHexString();
const KEY2 = mongoose.Types.ObjectId().toHexString();
const KEY3 = mongoose.Types.ObjectId().toHexString();
const KEY4 = mongoose.Types.ObjectId().toHexString();
const REVERSE_KEY = KEY.split('').reverse().join('');
const USER = {
  id: '123456',
  firstName: 'Avi',
  lastName: 'Ron',
  mail: 'aviron@gmail.com'
};
const size = 420;
const bucket = 'bucket';

const testUpload = {
  key: mongoose.Types.ObjectId().toHexString(),
  name: 'UploadName.txt',
  uploadID: 'UPLOAD_ID_TEST',
  bucket : 'BUCKET_TEST',
};

describe('File Logic', () => {

  before(async () => {
    // Remove files from DB
    const collections = ['files', 'uploads'];
    for (const i in collections) {
      mongoose.connection.db.createCollection(collections[i], (err) => {});
    }
    await mongoose.connection.collections['files'].createIndex({ name: 1, parent: 1, ownerID: 1 }, { unique: true });
    await mongoose.connection.collections['uploads'].createIndex({ key: 1, bucket: 1 }, { unique: true });
  });

  beforeEach(async () => {
    const removeCollectionPromises = [];
    for (const i in mongoose.connection.collections) {
      removeCollectionPromises.push(mongoose.connection.collections[i].deleteMany({}));
    }
    await Promise.all(removeCollectionPromises);
  });

  describe('#hashKey', () => {
    it('should reverse a given string', () => {
      const str = 'abcd1234';
      const result = FileService.hashKey(str);
      expect(result).to.equal('4321dcba');
    });
  });

  describe('#generateKey', () => {
    it('should return a string', () => {
      const key = FileService.generateKey();
      expect(key).to.exist;
      expect(key).to.be.a('string');
    });
  });

  describe('#createUpload', () => {
    it('should return a new upload', async () => {
      const newUpload: IUpload =
      await FileService.createUpload(testUpload.key, testUpload.bucket, testUpload.name, USER.id, null).should.eventually.exist;
      expect(newUpload).to.exist;
      expect(newUpload.bucket).to.be.equal(testUpload.bucket);
      expect(newUpload.name).to.be.equal(testUpload.name);
      expect(newUpload.key).to.be.equal(testUpload.key);
    });

    it('should throw an error when {key, bucket} already exist', async () => {
      await FileService.createUpload(testUpload.key, testUpload.bucket, 'name1',  USER.id, null)
      .should.eventually.exist;
      await FileService.createUpload(testUpload.key, testUpload.bucket, 'name1',  USER.id, null)
      .should.eventually.be.rejectedWith(KeyAlreadyExistsError);
    });

    it('should throw an error when {ownerID, parent, name} already exist', async () => {
      uploadModel.on('index', async () => { // <-- Wait for model's indexes to finish
        const newUpload1: IUpload =
        await FileService.createUpload(testUpload.key, testUpload.bucket, 'name1',  USER.id, null)
        .should.eventually.exist;
        const newUpload2: IUpload =
        await FileService.createUpload(KEY2, 'BUCKET2', 'name1',  USER.id, null)
        .should.eventually.be.rejectedWith(KeyAlreadyExistsError);
      });
    });

    it('should not throw an error when key already exists but bucket not', async () => {
      uploadModel.on('index', async () => { // <-- Wait for model's indexes to finish
        const newUpload1: IUpload =
        await FileService.createUpload(testUpload.key, testUpload.bucket, 'name1',  USER.id, null)
        .should.eventually.exist;
        const newUpload2: IUpload =
        await FileService.createUpload(testUpload.key, 'BUCKET2', 'name2',  '654321', null)
        .should.not.eventually.exist;
      });
    });

    it('should throw an error if file with the same name, ownerID and parent exists', async () => {
      await FileService.create({ size, bucket }, 'file.txt', USER.id, 'text', KEY, KEY2);
      await FileService.createUpload(KEY3, bucket, 'file.txt',  USER.id, KEY)
      .should.eventually.be.rejectedWith(FileExistsWithSameName);
    });

  });

  describe('#updateUploadID', () => {
    it('should update upload id', async () => {
      await FileService.createUpload(testUpload.key, testUpload.bucket, testUpload.name, USER.id, null);
      await FileService.updateUpload(testUpload.uploadID, testUpload.key, testUpload.bucket);
      const myUpload = await FileService.getUploadById(testUpload.uploadID);
      expect(myUpload).to.exist;
      expect(myUpload.bucket).to.be.equal(testUpload.bucket);
      expect(myUpload.name).to.be.equal(testUpload.name);
      expect(myUpload.key).to.be.equal(testUpload.key);
    });
  });

  describe('#deleteUpload', () => {
    it('should delete an existing upload', async () => {
      await FileService.createUpload(testUpload.key, testUpload.bucket, testUpload.name, USER.id, null);
      await FileService.updateUpload(testUpload.uploadID, testUpload.key, testUpload.bucket);
      const myUpload = await FileService.getUploadById(testUpload.uploadID);
      expect(myUpload).to.exist;
      expect(myUpload.uploadID).to.be.equal(testUpload.uploadID);
      expect(myUpload.bucket).to.be.equal(testUpload.bucket);
      expect(myUpload.name).to.be.equal(testUpload.name);
      expect(myUpload.key).to.be.equal(testUpload.key);

      await FileService.deleteUpload(testUpload.uploadID);

      await FileService.getUploadById(testUpload.uploadID)
      .should.eventually.be.rejectedWith(ClientError, 'upload not found');
    });
  });

  describe('#createFile', () => {
    it('should throw an error when key is not sent with file', async () => {
      await FileService.create({ size, bucket }, 'myFolder', USER.id, 'Text')
      .should.eventually.be.rejectedWith(ServerError, 'No key sent');
    });

    it('should not throw an error if key is not sent with a folder', async () => {
      await FileService.create({ size, bucket }, 'myFolder', USER.id, FolderContentType).should.eventually.exist;
    });

    it('should throw error: same owner, folder and filename', async () => {
      await FileService.create({ size, bucket }, 'myFile', USER.id, 'Text', null, KEY).should.eventually.exist;
      await FileService.create({ size , bucket }, 'myFile', USER.id, 'Other', null, KEY2)
      .should.eventually.be.rejectedWith(KeyAlreadyExistsError);
    });

    it('should not throw error: same folder and filename, different owner', async () => {
      await FileService.create({ size, bucket }, 'myFile', USER.id, 'Text', null, KEY).should.eventually.exist;
      await FileService.create({ size , bucket }, 'myFile', '654321', 'Other', null, KEY2).should.eventually.exist;
    });

    it('should create a file', async () => {
      const file: IFile = await FileService.create(
        { size, bucket }, 'file.txt', USER.id, 'text', KEY2, KEY);
      expect(file).to.exist;
      expect(file).to.have.property('createdAt');
      expect(file.id).to.equal(REVERSE_KEY);
      expect(file.key).to.equal(KEY);
      expect(file.displayName).to.equal('file');
      expect(file.fullExtension).to.equal('txt');
      expect(file.name).to.equal('file.txt');
    });

    it('should create a file in root, parent is empty string', async () => {
      const file: IFile = await FileService.create(
        { size, bucket }, 'file.txt', USER.id, 'text', '', KEY);
      expect(file).to.exist;
      expect(file).to.have.property('createdAt');
      expect(file.id).to.equal(REVERSE_KEY);
      expect(file.key).to.equal(KEY);
      expect(file.displayName).to.equal('file');
      expect(file.fullExtension).to.equal('txt');
      expect(file.name).to.equal('file.txt');
    });

    it('should create a file without extention', async () => {
      const file: IFile = await FileService.create(
        { size, bucket }, 'file', USER.id, 'text', null, KEY);
      expect(file).to.exist;
      expect(file).to.have.property('createdAt');
      expect(file.id).to.equal(REVERSE_KEY);
      expect(file.key).to.equal(KEY);
      expect(file.displayName).to.equal('file');
      expect(file.fullExtension).to.equal('');
      expect(file.name).to.equal('file');
    });

    it('should create a file in a given folder', async () => {
      const folder: IFile = await FileService.create({ size, bucket }, 'myFolder', USER.id, FolderContentType);
      const file: IFile = await FileService.create({ size, bucket }, 'tmp', USER.id, 'Text', folder.id, KEY);
      expect(file.parent.toString()).to.equal(folder.id);
    });

    it('should create a file at the root folder', async () => {
      const file1 = await FileService.create({ size, bucket }, 'tmp', USER.id, 'text', null, KEY);
      const newKey = FileService.generateKey();
      const file2: IFile = await FileService.create(
        { size, bucket }, 'file.txt', USER.id, 'text', null, newKey);
      const filesInRoot : IFile[] = await FileService.getFilesByFolder(null, USER.id);
      expect(filesInRoot.length).to.equal(2);
      expect(file1.parent).to.be.null;
      expect(file2.parent).to.equal(file1.parent);
    });

    it('should throw an error when KEY already exist', async () => {
      await FileService.create({ size, bucket }, 'tmp1', USER.id, 'text', null, KEY);
      await FileService.create({ size, bucket }, 'tmp2', USER.id, 'text', null, KEY)
      .should.eventually.be.rejectedWith(KeyAlreadyExistsError);
    });

  });

  describe('#getByID', () => {
    it('should get an error when file does not exist', async () => {
      await FileService.getByKey(KEY).should.eventually.be.rejectedWith(FileNotFoundError);
    });
    it('get an existing file', async () => {
      await FileService.create({ size, bucket }, 'file.txt', USER.id, 'text', null, KEY);
      const file = await FileService.getById(REVERSE_KEY);
      expect(file).to.exist;
      expect(file.id).to.equal(REVERSE_KEY);
      expect(file.displayName).to.equal('file');
    });
  });

  describe('#getByKey', () => {
    it('should get an error when file does not exist', async () => {
      await FileService.getByKey(KEY).should.eventually.be.rejectedWith(FileNotFoundError);
    });
    it('get an existing file', async () => {
      await FileService.create({ size, bucket }, 'file.txt', USER.id, 'text', null, KEY);
      const file = await FileService.getByKey(KEY);
      expect(file).to.exist;
      expect(file.id).to.equal(REVERSE_KEY);
      expect(file.key).to.equal(KEY);
      expect(file.displayName).to.equal('file');
    });
  });

  describe('#getFilesByFolder', () => {
    it('should throw an error when not sending ownerID', async () => {
      await FileService.getFilesByFolder(REVERSE_KEY, null).should.eventually.be.rejectedWith(ClientError);
    });
    it('should return an empty array if the folder does not exists', async () => {
      const files = await FileService.getFilesByFolder(REVERSE_KEY, 'fake_id');
      expect(files).to.exist;
      expect(files).to.be.an('array').with.lengthOf(0);
    });
    it('should return an empty array if the folder is empty', async () => {
      const folder = await FileService.create({ size, bucket }, 'myFolder', USER.id, FolderContentType);
      const files = await FileService.getFilesByFolder(folder.id, USER.id);
      expect(files).to.exist;
      expect(files).to.be.an('array').with.lengthOf(0);
    });
    it('should return all the files and folders directly under the given folder', async () => {
      const newKey1 = FileService.generateKey();
      const newKey2 = FileService.generateKey();

      const father = await FileService.create({ size, bucket }, 'father', USER.id, FolderContentType, KEY);

      const file1 = await FileService.create(
        { size, bucket }, 'file1.txt', USER.id, 'text', father.id, KEY2);
      const file2 = await FileService.create(
        { size, bucket }, 'file2.txt', USER.id, 'text', father.id, newKey1);
      const folder1 = await FileService.create(
        { size, bucket }, 'folder1', USER.id, FolderContentType, father.id, KEY3);
      const file11 = await FileService.create(
        { size, bucket }, 'file11.txt', USER.id, 'text', folder1.id, newKey2);

      const files = await FileService.getFilesByFolder(father.id, USER.id);
      const files1 = await FileService.getFilesByFolder(folder1.id, USER.id);

      expect(files).to.exist;
      expect(files1).to.exist;

      files.should.be.an('array').with.lengthOf(3);
      files1.should.be.an('array').with.lengthOf(1);
    });
    describe('Root Folder', () => {
      it('should throw an error if the fileID and the user are null', async () => {
        await FileService.getFilesByFolder(null, null)
          .should.eventually.rejectedWith(ClientError, 'No owner id sent');
      });
      it('should return an empty array if the user has no root folder', async () => {
        const files = await FileService.getFilesByFolder(null, USER.id);

        expect(files).to.exist;
        files.should.be.an('array').with.lengthOf(0);
      });
      it('should return the items of the given user root folder', async () => {
        const filesInRoot : IFile[] = await FileService.getFilesByFolder(null, USER.id);
        expect(filesInRoot.length).to.equal(0);
        const key2 = FileService.generateKey();
        const key3 = FileService.generateKey();

        const file1 = await FileService.create(
          { size, bucket }, 'file1.txt', USER.id, 'text', null, KEY);
        const file2 = await FileService.create(
          { size, bucket }, 'file2.txt', USER.id, 'text', null, key2);
        const folder1 = await FileService.create(
          { size, bucket }, 'folder1', USER.id, FolderContentType, null);
        const file11 = await FileService.create(
          { size, bucket }, 'file11.txt', USER.id, 'text', folder1.id, key3);

        const files = await FileService.getFilesByFolder(null, USER.id);

        expect(files).to.exist;
        files.should.be.an('array').with.lengthOf(3);
      });
    });
  });

  describe('#isOwner', () => {
    it('should throw an error if the file does not exist', async () => {
      await FileService.isOwner(REVERSE_KEY, USER.id).should.eventually.rejectedWith(FileNotFoundError);
    });
    it('should return "false" if the user is not an owner of the file', async () => {
      const file = await FileService.create(
        { size, bucket }, 'file.txt', USER.id, 'text', null, KEY);
      const res = await FileService.isOwner(file.id, USER.id.concat('7'));
      expect(res).to.exist;
      expect(res).to.be.false;

    });
    it('should return "true" if the user is the owner of the file', async () => {
      const file = await FileService.create(
        { size, bucket }, 'file.txt', USER.id, 'text', null, KEY);
      const res = await FileService.isOwner(file.id, USER.id);
      expect(res).to.exist;
      expect(res).to.be.true;
    });
  });

  describe('#delete', () => {
    it('should mark a file as deleted', async () => {
      const file: IFile = await FileService.create(
        { size, bucket }, 'file.txt', USER.id, 'text', null, KEY);
      const DBFile = await FileService.getById(file.id);
      expect(DBFile.deleted).to.be.false;
      await FileService.delete(file.id);
      const deletedFile: IFile = await FileService.getById(file.id);
      expect(deletedFile.deleted).to.be.true;
    });

    it('should delete recursively a folder', async () => {
      const structure: IFile[] = await generateFolderStructure();

      const father: IFile = structure[0];
      for (let i = 0; i < structure.length; i++) {
        const fileOrFolder: IFile = await FileService.getById(structure[i].id);
        expect(fileOrFolder.deleted).to.equal(false);
      }

      await FileService.delete(father.id);

      for (let i = 0; i < structure.length; i++) {
        const fileOrFolder: IFile = await FileService.getById(structure[i].id);
        expect(fileOrFolder.deleted).to.equal(true);
      }
    });
  });

  describe('#getFilesByFolder & #delete integration', () => {
    it('should separate the non-deleted files from the deleted ones', async () => {
      const structure: IFile[] = await generateFolderStructure();

      const father: IFile = structure[0];
      const file1: IFile = structure[1];
      const file2: IFile = structure[2];
      const folder1: IFile = structure[3];
      const file11: IFile = structure[4];

      await FileService.delete(file1.id);
      // get non-deleted files
      const files = await FileService.getFilesByFolder(father.id, USER.id, false);
      expect(files).to.exist;
      files.should.be.an('array').with.lengthOf(2);
      expect(files[0].key).to.equal(file2.key);

      // get deleted files
      const deletedFiles = await FileService.getFilesByFolder(father.id, USER.id, true);
      expect(deletedFiles).to.exist;
      deletedFiles.should.be.an('array').with.lengthOf(1);
      expect(deletedFiles[0].key).to.equal(file1.key);

      // get non-deleted files without the flag
      const folder1FilesBD = await FileService.getFilesByFolder(folder1.id, USER.id);
      expect(folder1FilesBD).to.exist;
      folder1FilesBD.should.be.an('array').with.lengthOf(1);

      // get non-deleted files without the flag after delete
      await FileService.delete(file11.id);
      const folder1FilesAD = await FileService.getFilesByFolder(folder1.id, USER.id);
      expect(folder1FilesAD).to.exist;
      folder1FilesAD.should.be.an('array').with.lengthOf(0);
    });
  });

  describe('#createFile & #delete integration', () => {
    it.skip('create a second file with the same name after first one was deleted', async () => {

      // create a file
      const v1file: IFile = await FileService.create(
        { size, bucket }, 'file.txt', USER.id, 'text', null, KEY);
      expect(v1file).to.exist;
      expect(v1file.deleted).to.be.false;

      // delete the file
      await FileService.delete(v1file.id);
      const deletedFile: IFile = await FileService.getById(v1file.id);
      expect(deletedFile.deleted).to.be.true;

      // create the same file at the same location
      const v2file: IFile = await FileService.create(
        { size, bucket }, 'file.txt', USER.id, 'text', null, KEY2);
      expect(v2file).to.exist;
      expect(v2file.deleted).to.be.false;

      // check both deleted and not-detetad files exist
      const v1DBFile = await FileService.getById(v1file.id);
      expect(v1DBFile).to.exist;
      expect(v1DBFile.deleted).to.be.true;

      const v2DBFile = await FileService.getById(v2file.id);
      expect(v2DBFile).to.exist;
      expect(v2DBFile.deleted).to.be.false;

    });
  });

});

async function generateFolderStructure() : Promise<IFile[]> {
  const key2 = FileService.generateKey();
  const key3 = FileService.generateKey();

  const father = await FileService.create({ size, bucket }, 'father', USER.id, FolderContentType, KEY);

  const file1: IFile = await FileService.create(
    { size, bucket }, 'file1.txt', USER.id, 'text', father.id, KEY2);
  const file2: IFile = await FileService.create(
    { size, bucket }, 'file2.txt', USER.id, 'text', father.id, key2);
  const folder1: IFile = await FileService.create(
    { size, bucket }, 'folder1', USER.id, FolderContentType, father.id, KEY3);
  const file11: IFile = await FileService.create(
    { size, bucket }, 'file11.txt', USER.id, 'text', folder1.id, key3);

  return [father, file1, file2, folder1, file11];
}
