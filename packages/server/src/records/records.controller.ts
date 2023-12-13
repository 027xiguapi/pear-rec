import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { RecordsService } from './records.service';
import { Record } from './entity/record.entity';

@Controller('records')
export class RecordsController {
  constructor(private recordsService: RecordsService) {}

  @Post()
  create(@Body() record: CreateRecordDto): Promise<Record> {
    return this.recordsService.create(record);
  }

  @Get()
  findAll(@Query('pageNumber') page = 1, @Query('pageSize') limit = 20): Promise<Record[]> {
    return this.recordsService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Record> {
    return this.recordsService.findOne(id);
  }

  @Post('/edit/:id')
  update(@Param('id') id: number, @Body() record: CreateRecordDto): Promise<Record> {
    return this.recordsService.update(id, record);
  }

  @Post('/delete/list')
  removeList(@Body('ids') ids: number[]): Promise<string> {
    return this.recordsService.removeList(ids);
  }

  @Post('/delete/:id')
  remove(@Param('id') id: number): Promise<string> {
    return this.recordsService.remove(id);
  }
}
