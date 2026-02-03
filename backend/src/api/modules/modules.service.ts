import { Injectable } from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ModulesUser } from './entities/module.entity';
import { IsNull, Repository } from 'typeorm';

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

  async findAll(): Promise<ModulesUser[]> {
    const modules = await this.modulesRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['parent', 'children'],
      order: { name: 'ASC' },
    });

    const parents = modules.filter((m) => !m.parent);

    return parents.map((parent) => ({
      ...parent,
      parentId: null,
      children: modules
        .filter((child) => child.parent && child.parent.id === parent.id)
        .map((child) => ({
          ...child,
          parentId: parent.id,
          children: [],
        })),
    }));
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
    return await this.modulesRepository.softDelete(id);
  }
}
