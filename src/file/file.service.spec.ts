import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import mongoose from 'mongoose';
import { IFile } from './file.interface';
import { FileService } from './file.service';
import { ServerError } from '../errors/application.error';
import { FileExistsWithSameName, KeyAlreadyExistsError } from '../errors/client.error';

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
const fileService = new FileService();

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
      await FileService.create({ size }, 'myFolder', USER.id, 'Text')
      .should.eventually.be.rejectedWith(ServerError, 'No key sent');
    });

    it('should not throw an error if key is not sent with a folder', async () => {
      await FileService.create({ size }, 'myFolder', USER.id, 'Folder').should.eventually.exist;
    });

    it('should create a file', async () => {
      const file: IFile = await FileService.create(
        { size },
        'file.txt',
        USER.id,
        'text',
        null,
        KEY,
      );
      expect(file).to.exist;
      expect(file).to.have.property('createdAt');
      expect(file.id).to.equal(REVERSE_KEY);
      expect(file.key).to.equal(KEY);
      expect(file.displayName).to.equal('file');
      expect(file.fullExtension).to.equal('txt');
    });

    it('should create a file in a given folder', async () => {
      const folder: IFile = await FileService.create({ size }, 'myFolder', USER.id, 'Folder');
      const file: IFile = await FileService.create({ size }, 'tmp', USER.id, 'Text', folder.id, KEY);
      expect(file.parent.toString()).to.equal(folder.id);
    });

    it('should create a file at the root folder', async () => {
      const file1 = await FileService.create({ size }, 'tmp', USER.id, 'text', null, KEY);
      const newKey = FileService.generateKey();
      const file2: IFile = await FileService.create(
        { size },
        'file.txt',
        USER.id,
        'text',
        null,
        newKey,
      );
      expect(file1.parent).to.not.be.null;
      expect(file2.parent.toString()).to.equal(file1.parent.toString());

    });

    it('should throw an error when KEY already exist', async () => {
      await FileService.create({ size }, 'tmp', USER.id, 'text', null, KEY);
      await FileService.create({ size }, 'tmp', USER.id, 'text', null, KEY)
      .should.eventually.be.rejectedWith(KeyAlreadyExistsError);
    });

    it('should throw an error when there is a file with the same name in the folder', async () => {
      const file = await FileService.create({ size }, 'tmp', USER.id, 'text', null, KEY);
      const newKey = FileService.generateKey();
      const newFile = await FileService.create(
        { size },
        'tmp',
        USER.id,
        'text',
        file.parent.toString(),
        newKey);
    });
  });

  describe('getByID', () => {
    before(async () => {

      // Remove files from DB
      const removeCollectionPromises = [];
      for (const i in mongoose.connection.collections) {
        removeCollectionPromises.push(mongoose.connection.collections[i].remove({}));
      }
      await Promise.all(removeCollectionPromises);
    });
    it('gen an existing file', async () => {
      await FileService.create(
        { size },
        'file.txt',
        USER.id,
        'text',
        null,
        KEY,
      );
      const file = await FileService.getById(REVERSE_KEY);
      expect(file).to.exist;
      expect(file.id).to.equal(REVERSE_KEY);
      expect(file.displayName).to.equal('file');
    });
  });
});
