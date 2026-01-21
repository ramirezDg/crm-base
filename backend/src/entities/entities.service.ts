import { Injectable } from '@nestjs/common';
import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseEntity } from './entities/entity.entity';
import { IsNull, Repository } from 'typeorm';
import { PaginationParamsDto } from '../common/dto/pagination-params.dto';
import { PaginatedDto } from '../common/dto/paginated.dto';

@Injectable()
export class EntitiesService {
  constructor(
    @InjectRepository(BaseEntity)
    private readonly entitiesRepository: Repository<BaseEntity>,
  ) {}

  async create(createEntityDto: CreateEntityDto) {
    const entity = this.entitiesRepository.create(createEntityDto);
    return await this.entitiesRepository.save(entity);
  }

  async findAll(
    pagination: PaginationParamsDto,
  ): Promise<PaginatedDto<BaseEntity>> {
    const { offset = 0, limit = 10 } = pagination;

    const [results, total] = await this.entitiesRepository.findAndCount({
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
    return this.entitiesRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async update(id: string, updateEntityDto: UpdateEntityDto) {
    return this.entitiesRepository.update(id, updateEntityDto).then(() => {
      return this.entitiesRepository.findOne({
        where: { id, deletedAt: IsNull() },
      });
    });
  }

  remove(id: string) {
    return this.entitiesRepository.update(id, { deletedAt: new Date() });
  }
}
