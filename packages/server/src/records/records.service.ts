import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Record } from './entity/record.entity';
import { CreateRecordDto } from './dto/create-record.dto';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
  ) {}

  async create(record: CreateRecordDto): Promise<Record> {
    return await this.recordRepository.save(record);
  }

  async findAll(pageNumber: number, pageSize: number): Promise<Record[]> {
    const [records, totalCount] = await this.recordRepository.findAndCount({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    return records;
  }

  async findOne(id: number): Promise<Record> {
    return await this.recordRepository.findOneBy({ id });
  }

  async update(id: number, record: CreateRecordDto): Promise<Record> {
    await this.recordRepository.update(id, record);
    return await this.recordRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<string> {
    await this.recordRepository.delete(id);
    return `${id} is removed`;
  }

  async removeList(ids: number[]): Promise<string> {
    await this.recordRepository.delete(ids);
    return `${ids} is removed`;
  }
}
