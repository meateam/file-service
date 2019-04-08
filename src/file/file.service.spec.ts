import * as chai from 'chai';
import mongoose from 'mongoose';
import { config } from '../config';
import { IFile } from './file.interface';
import { FileService } from './file.service';

const expect: Chai.ExpectStatic = chai.expect;
// chai.use(chaiAsPromised);

const OBJECT_ID = mongoose.Types.ObjectId();
const USER = {
  id: '123456',
  firstName: 'Avi',
  lastName: 'Ron',
  mail: 'aviron@gmail.com'
};
const size = 420;

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

  describe('#generateKey', () => {
    it('should return a string', () => {
      const key = FileService.generateKey();
      expect(key).to.exist;
      expect(key).to.be.a('string');
    });
  });

  describe('#createFile', () => {
    it('should create a file in root folder if not specified', async () => {

    });
    it('should create a file in a folder if specified', async () => {

    });
    it('should create a file', async () => {
      const file: IFile = await FileService.create(
        { size },
        'file.txt',
        USER.id,
        'txt',
        null,
        OBJECT_ID.toHexString(),
      );
      expect(file).to.exist;
      expect(file).to.have.property('createdAt');
    });
  });
});
