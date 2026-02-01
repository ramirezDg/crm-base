import { Injectable } from '@nestjs/common';
import { CreateCustomFieldDto } from './dto/create-custom-field.dto';
import { UpdateCustomFieldDto } from './dto/update-custom-field.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomField } from './entities/custom-field.entity';
import { IsNull, Repository } from 'typeorm';
import { PaginationParamsDto } from '../../common/dto/pagination-params.dto';
import { PaginatedDto } from '../../common/dto/paginated.dto';

@Injectable()
export class CustomFieldsService {
  constructor(
    @InjectRepository(CustomField)
    private readonly customFieldRepository: Repository<CustomField>,
  ) {}

  async create(
    createCustomFieldDto: CreateCustomFieldDto,
  ): Promise<CustomField> {
    const customField = this.customFieldRepository.create(createCustomFieldDto);
    return await this.customFieldRepository.save(customField);
  }

  async findAll(
    pagination: PaginationParamsDto,
  ): Promise<PaginatedDto<CustomField>> {
    const { offset = 0, limit = 10 } = pagination;

    const [results, total] = await this.customFieldRepository.findAndCount({
      skip: offset,
      take: limit,
      relations: ['values'],
      where: { deletedAt: IsNull() },
    });

    return {
      total,
      limit,
      offset,
      results,
    };
  }

  async findOne(id: string) {
    return await this.customFieldRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['values'],
    });
  }

  async update(id: string, updateUserDto: UpdateCustomFieldDto) {
    return this.customFieldRepository.update(id, updateUserDto).then(() => {
      return this.customFieldRepository.findOne({
        where: { id },
      });
    });
  }

  async remove(id: string) {
    await this.customFieldRepository.update(id, { deletedAt: new Date() });
    return this.customFieldRepository.findOne({ where: { id } });
  }
}
