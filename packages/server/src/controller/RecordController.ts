import { AppDataSource } from '../dataSource';
import { Record } from '../entity/Record';
import { UserController } from '../controller/UserController';

const userController = new UserController();

export class RecordController {
  async getRecords(req, res) {
    const recordRepository = AppDataSource.getRepository(Record);
    const records = await recordRepository.find();
    res.json({ code: 0, data: records });
  }

  async createRecord(req, res) {
    const recordRepository = AppDataSource.getRepository(Record);
    const record = recordRepository.create(req.body);
    recordRepository.save(record);
    res.json({ code: 0, data: record });
  }

  async getRecord(req, res) {
    const recordRepository = AppDataSource.getRepository(Record);
    const record = await recordRepository.findOne(req.params.id);

    if (!record) {
      return res.json({ code: -1, data: 'record not found' });
    }

    res.json({ code: 0, data: record });
  }

  async updateRecord(req, res) {
    const recordRepository = AppDataSource.getRepository(Record);
    const record = await recordRepository.findOne(req.params.id);

    if (!record) {
      return res.json({ code: -1, data: 'record not found' });
    }

    recordRepository.merge(record, req.body);
    await recordRepository.save(record);
    res.json({ code: 0, data: record });
  }

  async deleteRecord(req, res) {
    const recordRepository = AppDataSource.getRepository(Record);
    const record = await recordRepository.findOne(req.params.id);

    if (!record) {
      return res.json({ code: -1, data: 'record not found' });
    }

    await recordRepository.remove(record);
    res.json({ code: 0, data: 'record deleted successfully' });
  }

  async saveFile(req, res) {
    const recordRepository = AppDataSource.getRepository(Record);
    const userId = req.body.userId;
    const user = await userController.getUserById(userId);
    let data = {
      filePath: req.file.path,
      fileType: req.body.type,
      user: user,
    };
    const record = recordRepository.create(data);
    res.json({ code: 0, data: record });
  }
}
