import { Injectable } from '@nestjs/common';
import { CreateEntityDefinitionDto } from './dto/create-entity-definition.dto';
import { UpdateEntityDefinitionDto } from './dto/update-entity-definition.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityDefinition } from './entities/entity-definition.entity';
import { IsNull, Repository } from 'typeorm';
import { PaginationParamsDto } from '../../common/dto/pagination-params.dto';
import { PaginatedDto } from '../../common/dto/paginated.dto';
import { SearchEntityDefinitionDto } from './dto/search-entity-definition.dto';

@Injectable()
export class EntityDefinitionsService {
  constructor(
    @InjectRepository(EntityDefinition)
    private readonly entityDefinitionRepository: Repository<EntityDefinition>,
  ) {}

  async create(createDto: CreateEntityDefinitionDto) {
    const entityDefinition = this.entityDefinitionRepository.create({
      ...createDto,
      company: { id: createDto.companyId },
    });
    return this.entityDefinitionRepository.save(entityDefinition);
  }

  async findAll(
    pagination: PaginationParamsDto,
  ): Promise<PaginatedDto<EntityDefinition>> {
    const { offset = 0, limit = 10 } = pagination;

    const [results, total] = await this.entityDefinitionRepository.findAndCount(
      {
        where: { deletedAt: IsNull() },
        skip: offset,
        take: limit,
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
    return this.entityDefinitionRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async search(
    searchData: SearchEntityDefinitionDto,
    pagination: PaginationParamsDto,
  ): Promise<PaginatedDto<EntityDefinition>> {
    const { offset = 0, limit = 10 } = pagination;

    const query = this.entityDefinitionRepository
      .createQueryBuilder('entityDefinition')
      .where('entityDefinition.deletedAt IS NULL');

    Object.entries(searchData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'companyId') {
          query.andWhere('entityDefinition.companyId = :companyId', {
            companyId: value,
          });
        } else {
          query.andWhere(`LOWER(entityDefinition.${key}) LIKE :${key}`, {
            [key]: `%${String(value).toLowerCase()}%`,
          });
        }
      }
    });

    const [results, total] = await query
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      total,
      limit,
      offset,
      results,
    };
  }

  async update(
    id: string,
    updateEntityDefinitionDto: UpdateEntityDefinitionDto,
  ) {
    return this.entityDefinitionRepository
      .update(id, updateEntityDefinitionDto)
      .then(() => {
        return this.entityDefinitionRepository.findOne({
          where: { id, deletedAt: IsNull() },
        });
      });
  }

  async remove(id: string) {
    await this.entityDefinitionRepository.update(id, { deletedAt: new Date() });
    return this.entityDefinitionRepository.findOne({ where: { id } });
  }
}
