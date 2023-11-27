import { AppDataSource } from '../dataSource';
import { Record } from '../entity/Record';
import { UserController } from '../controller/UserController';

const userController = new UserController();

export class RecordController {
  async getRecords(req, res) {
    const recordRepository = AppDataSource.getRepository(Record);
    let { pageSize = 20, pageNumber = 1 } = req.query;
    const offset = (pageNumber - 1) * pageSize;
    const [records, total] = await recordRepository.findAndCount({
      skip: offset,
      take: pageSize,
    });
    res.json({ code: 0, data: records, total: total });
  }

  async createRecord(req, res) {
    const recordRepository = AppDataSource.getRepository(Record);
    const record = recordRepository.create(req.body);
    recordRepository.save(record);
    res.json({ code: 0, data: record });
  }

  async getRecord(req, res) {
    const recordRepository = AppDataSource.getRepository(Record);
    const record = await recordRepository.findOneBy({ id: req.params.id });

    if (!record) {
      return res.json({ code: -1, data: 'record not found' });
    }

    res.json({ code: 0, data: record });
  }

  async updateRecord(req, res) {
    const recordRepository = AppDataSource.getRepository(Record);
    const record = await recordRepository.findOneBy({ id: req.params.id });

    if (!record) {
      return res.json({ code: -1, data: 'record not found' });
    }

    recordRepository.merge(record, req.body);
    await recordRepository.save(record);
    res.json({ code: 0, data: record });
  }

  async deleteAllRecord(req, res) {
    const recordRepository = AppDataSource.getRepository(Record);
    const userId = req.params.userId;
    const records = await recordRepository
      .createQueryBuilder('record')
      .leftJoinAndSelect('record.user', 'user')
      .where('user.id = :id', { id: userId })
      .getMany();

    if (!records) {
      return res.json({ code: -1, data: 'record not found' });
    }

    await recordRepository.remove(records);
    res.json({ code: 0, data: 'record deleted successfully' });
  }

  async deleteRecord(req, res) {
    const recordRepository = AppDataSource.getRepository(Record);
    const record = await recordRepository.findOneBy({ id: req.params.id });

    if (!record) {
      return res.json({ code: -1, data: 'record not found' });
    }

    await recordRepository.remove(record);
    res.json({ code: 0, data: 'record deleted successfully' });
  }

  async saveFile(req, res) {
    const recordRepository = AppDataSource.getRepository(Record);
    const userId = req.body.userId;
    const user = await userController._getUserById(userId);
    let data = {
      filePath: req.file.path,
      fileType: req.body.type,
      user: user,
    };
    const record = recordRepository.create(data);
    recordRepository.save(record);
    res.json({ code: 0, data: record });
  }
}
