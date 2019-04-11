import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import mongoose from 'mongoose';
import { IFile } from './file.interface';
import { FileService } from './file.service';
import { ServerError, ClientError } from '../utils/errors/application.error';
import { FileExistsWithSameName, KeyAlreadyExistsError, FileNotFoundError } from '../utils/errors/client.error';
import { FolderNotFoundError } from '../utils/errors/folder';
import { userInfo } from 'os';

const expect: Chai.ExpectStatic = chai.expect;
const should = chai.should();
chai.use(chaiAsPromised);

const KEY = mongoose.Types.ObjectId().toHexString();
const REVERSE_KEY = KEY.split('').reverse().join('');
const USER = {
  id: '123456',
  firstName: 'Avi',
  lastName: 'Ron',
  mail: 'aviron@gmail.com'
};
const size = 420;
const bucket = 'bucket';

describe('File Logic', () => {

  before(async () => {

    // Remove files from DB
    const removeCollectionPromises = [];
    for (const i in mongoose.connection.collections) {
      removeCollectionPromises.push(mongoose.connection.collections[i].remove({}));
    }
    await Promise.all(removeCollectionPromises);
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
  });

  describe('#hashKey', () => {
    it('should reverse a given string', () => {
      const str = 'abcd1234';
      const result = FileService.hashKey(str);
      expect(result).to.equal('4321dcba');
    });
  });

  describe('#findUserRootFolder', () => {
    const userID = '12345';
    it('should create a root folder when none exists and if specified', async () => {
      const not_specified = await FileService.findUserRootFolder(userID);
      const specified = await FileService.findUserRootFolder(userID, true);
      const check = await FileService.findUserRootFolder(userID);

      expect(not_specified).to.be.null;
      expect(specified).to.not.be.null;
      expect(check).to.not.be.null;
    });
  });

  describe('#generateKey', () => {
    it('should return a string', () => {
      const key = FileService.generateKey();
      expect(key).to.exist;
      expect(key).to.be.a('string');
    });
  });

  describe('#createFile', () => {
    it('should throw an error when key is not sent with file', async () => {
      await FileService.create({ size, bucket }, 'myFolder', USER.id, 'Text')
      .should.eventually.be.rejectedWith(ServerError, 'No key sent');
    });

    it('should not throw an error if key is not sent with a folder', async () => {
      await FileService.create({ size, bucket }, 'myFolder', USER.id, 'Folder').should.eventually.exist;
    });

    it('should create a file', async () => {
      const file: IFile = await FileService.create(
        { size, bucket }, 'file.txt', USER.id, 'text', null, KEY);
      expect(file).to.exist;
      expect(file).to.have.property('createdAt');
      expect(file.id).to.equal(REVERSE_KEY);
      expect(file.key).to.equal(KEY);
      expect(file.displayName).to.equal('file');
      expect(file.fullExtension).to.equal('txt');
    });

    it('should create a file in a given folder', async () => {
      const folder: IFile = await FileService.create({ size, bucket }, 'myFolder', USER.id, 'Folder');
      const file: IFile = await FileService.create({ size, bucket }, 'tmp', USER.id, 'Text', folder.id, KEY);
      expect(file.parent.toString()).to.equal(folder.id);
    });

    it('should create a file at the root folder', async () => {
      const file1 = await FileService.create({ size, bucket }, 'tmp', USER.id, 'text', null, KEY);
      const newKey = FileService.generateKey();
      const file2: IFile = await FileService.create(
        { size, bucket }, 'file.txt', USER.id, 'text', null, newKey);
      expect(file1.parent).to.not.be.null;
      expect(file2.parent.toString()).to.equal(file1.parent.toString());

    });

    it('should throw an error when KEY already exist', async () => {
      await FileService.create({ size, bucket }, 'tmp1', USER.id, 'text', null, KEY);
      await FileService.create({ size, bucket }, 'tmp2', USER.id, 'text', null, KEY)
      .should.eventually.be.rejectedWith(KeyAlreadyExistsError);
    });

    it('should throw an error when there is a file with the same name in the folder', async () => {
      const file = await FileService.create({ size, bucket }, 'tmp.txt', USER.id, 'text', null, KEY);
      const newKey = FileService.generateKey();
      const newFile = await FileService.create(
        { size, bucket },
        'tmp.txt',
        USER.id,
        'text',
        file.parent.toString(),
        newKey).should.eventually.be.rejectedWith(FileExistsWithSameName);
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

  describe('getFilesByFolder', () => {
    it('should return an empty array if the folder do not exists', async () => {
      // await FileService.getFilesByFolder(REVERSE_KEY, USER.id)
      // .should.eventually.rejectedWith(FolderNotFoundError);
      const files = await FileService.getFilesByFolder(REVERSE_KEY, null);
      expect(files).to.exist;
      expect(files).to.be.an('array').with.lengthOf(0);
    });
    it('should return an empty array if the folder is empty', async () => {
      const folder = await FileService.create({ size, bucket }, 'myFolder', USER.id, 'Folder');
      const files = await FileService.getFilesByFolder(folder.id, null);
      expect(files).to.exist;
      expect(files).to.be.an('array').with.lengthOf(0);
    });
    it('should return all the files and folders directly under the given folder', async () => {
      const key2 = FileService.generateKey();
      const key3 = FileService.generateKey();

      const father = await FileService.create({ size, bucket }, 'father', USER.id, 'Folder');

      const file1 = await FileService.create(
        { size, bucket }, 'file1.txt', USER.id, 'text', father.id, KEY);
      const file2 = await FileService.create(
        { size, bucket }, 'file2.txt', USER.id, 'text', father.id, key2);
      const folder1 = await FileService.create(
        { size, bucket }, 'folder1', USER.id, 'Folder', father.id);
      const file11 = await FileService.create(
        { size, bucket }, 'file11.txt', USER.id, 'text', folder1.id, key3);

      const files = await FileService.getFilesByFolder(father.id, null);

      expect(files).to.exist;
      files.should.be.an('array').with.lengthOf(3);
    });
    describe('Root Folder', () => {
      it('should throw an error if the fileID and the user are null', async () => {
        await FileService.getFilesByFolder(null, null)
          .should.eventually.rejectedWith(ClientError, 'No file or owner id sent');
      });
      it('should return an empty array if the user has no root folder', async () => {
        const files = await FileService.getFilesByFolder(null, USER.id);

        expect(files).to.exist;
        files.should.be.an('array').with.lengthOf(0);
      });
      it('should return the items of the given user root folder', async () => {
        const key2 = FileService.generateKey();
        const key3 = FileService.generateKey();

        const file1 = await FileService.create(
          { size, bucket }, 'file1.txt', USER.id, 'text', null, KEY);
        const file2 = await FileService.create(
          { size, bucket }, 'file2.txt', USER.id, 'text', null, key2);
        const folder1 = await FileService.create(
          { size, bucket }, 'folder1', USER.id, 'Folder', null);
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
});
