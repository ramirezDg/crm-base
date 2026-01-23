import { Injectable } from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ModulesUser } from './entities/module.entity';
import { IsNull, Repository } from 'typeorm';
import { PaginationParamsDto } from '../common/dto/pagination-params.dto';
import { PaginatedDto } from '../common/dto/paginated.dto';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(ModulesUser)
    private readonly modulesRepository: Repository<ModulesUser>,
  ) {}

  async create(createModuleDto: CreateModuleDto) {
    const moduleUser = this.modulesRepository.create(createModuleDto);
    return await this.modulesRepository.save(moduleUser);
  }

  async findAll(
    pagination: PaginationParamsDto,
  ): Promise<PaginatedDto<ModulesUser>> {
    const { offset = 0, limit = 10 } = pagination;

    const [results, total] = await this.modulesRepository.findAndCount({
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
    return this.modulesRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  update(id: string, updateModuleDto: UpdateModuleDto) {
    return this.modulesRepository.update(id, updateModuleDto).then(() => {
      return this.findOne(id);
    });
  }

  async remove(id: string) {
    return await this.modulesRepository
      .update(id, { deletedAt: new Date() })
      .then(() => {
        return this.findOne(id);
      });
  }
}
