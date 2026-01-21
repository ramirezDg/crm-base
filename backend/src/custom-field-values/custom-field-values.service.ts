import { Injectable } from '@nestjs/common';
import { CreateCustomFieldValueDto } from './dto/create-custom-field-value.dto';
import { UpdateCustomFieldValueDto } from './dto/update-custom-field-value.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomFieldValue } from './entities/custom-field-value.entity';
import { IsNull, Repository } from 'typeorm';
import { PaginationParamsDto } from '../common/dto/pagination-params.dto';
import { PaginatedDto } from '../common/dto/paginated.dto';

@Injectable()
export class CustomFieldValuesService {
  constructor(
    @InjectRepository(CustomFieldValue)
    private readonly customFieldValueRepository: Repository<CustomFieldValue>,
  ) {}

  async create(createCustomFieldValueDto: CreateCustomFieldValueDto) {
    const data = this.customFieldValueRepository.create(
      createCustomFieldValueDto,
    );
    return await this.customFieldValueRepository.save(data);
  }

  async findAll(
    pagination: PaginationParamsDto,
  ): Promise<PaginatedDto<CustomFieldValue>> {
    const { offset = 0, limit = 10 } = pagination;

    const [results, total] = await this.customFieldValueRepository.findAndCount(
      {
        skip: offset,
        take: limit,
        where: { deletedAt: IsNull() },
      },
    );

    return {
      total,
      limit,
      offset,
      results,
    };
  }

  findOne(id: string) {
    return this.customFieldValueRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async update(
    id: string,
    updateCustomFieldValueDto: UpdateCustomFieldValueDto,
  ) {
    return this.customFieldValueRepository
      .update(id, updateCustomFieldValueDto)
      .then(() => {
        return this.customFieldValueRepository.findOne({
          where: { id },
        });
      });
  }

  async remove(id: string) {
    return await this.customFieldValueRepository
      .update(id, { deletedAt: new Date() })
      .then(() => {
        return this.customFieldValueRepository.findOne({ where: { id } });
      });
  }
}
