import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Files } from './entities/file.entity';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { PaginationParamsDto } from '../../common/dto/pagination-params.dto';
import { PaginatedDto } from '../../common/dto/paginated.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(Files)
    private readonly filesRepository: Repository<Files>,
  ) {}

  async create(createFileDto: CreateFileDto) {
    let checksum = '';
    if (createFileDto.path && fs.existsSync(createFileDto.path)) {
      const fileBuffer = fs.readFileSync(createFileDto.path);
      checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    }
    const file = this.filesRepository.create({ ...createFileDto, checksum });
    return await this.filesRepository.save(file);
  }

  async findAll(pagination: PaginationParamsDto): Promise<PaginatedDto<Files>> {
    const { offset = 0, limit = 10 } = pagination;

    const [results, total] = await this.filesRepository.findAndCount({
      where: { deletedAt: IsNull() },
      skip: offset,
      take: limit,
    });

    return {
      total,
      limit,
      offset,
      results,
    };
  }

  findOne(id: string) {
    return this.filesRepository.findOne({ where: { id, deletedAt: IsNull() } });
  }

  async getFileStream(path: string): Promise<fs.ReadStream> {
    if (!fs.existsSync(path)) {
      throw new NotFoundException('Archivo no encontrado');
    }
    return fs.createReadStream(path);
  }

  remove(id: string) {
    return this.filesRepository.softDelete(id);
  }
}
