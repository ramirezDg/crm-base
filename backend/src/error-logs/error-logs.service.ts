import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateErrorLogDto } from './dto/create-error-log.dto';
import { UpdateErrorLogDto } from './dto/update-error-log.dto';
import { ErrorLog } from './entities/error-log.entity';

@Injectable()
export class ErrorLogsService {
  constructor(
    @InjectRepository(ErrorLog)
    private readonly errorLogRepository: Repository<ErrorLog>,
  ) {}

  async create(createErrorLogDto: CreateErrorLogDto): Promise<ErrorLog> {
    const errorLog = this.errorLogRepository.create(createErrorLogDto);
    return await this.errorLogRepository.save(errorLog);
  }

  async findAll(): Promise<ErrorLog[]> {
    return await this.errorLogRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<ErrorLog | null> {
    return await this.errorLogRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateErrorLogDto: UpdateErrorLogDto,
  ): Promise<ErrorLog | null> {
    await this.errorLogRepository.update(id, updateErrorLogDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.errorLogRepository.delete(id);
  }
}
