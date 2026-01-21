import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { PaginationParamsDto } from '../common/dto/pagination-params.dto';
import { PaginatedDto } from '../common/dto/paginated.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    const role = this.rolesRepository.create(createRoleDto);
    return await this.rolesRepository.save(role);
  }
  async findAll(pagination: PaginationParamsDto): Promise<PaginatedDto<Role>> {
    const { offset = 0, limit = 10 } = pagination;

    const [results, total] = await this.rolesRepository.findAndCount({
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
    return this.rolesRepository.findOne({ where: { id, deletedAt: IsNull() } });
  }

  update(id: string, updateRoleDto: UpdateRoleDto) {
    return this.rolesRepository.update(id, updateRoleDto).then(() => {
      return this.rolesRepository.findOne({ where: { id } });
    });
  }

  remove(id: string) {
    return this.rolesRepository
      .update(id, { deletedAt: new Date() })
      .then(() => {
        return this.rolesRepository.findOne({ where: { id } });
      });
  }
}
