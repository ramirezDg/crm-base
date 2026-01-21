import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { PaginatedDto } from '../common/dto/paginated.dto';
import { PaginationParamsDto } from '../common/dto/pagination-params.dto';
import { SearchPermissionDto } from './dto/search-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}
  async create(createPermissionDto: CreatePermissionDto) {
    const permission = this.permissionRepository.create(createPermissionDto);
    return await this.permissionRepository.save(permission);
  }

  async findAll(
    pagination: PaginationParamsDto,
  ): Promise<PaginatedDto<Permission>> {
    const { offset = 0, limit = 10 } = pagination;

    const [results, total] = await this.permissionRepository.findAndCount({
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
    return this.permissionRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async search(
    searchData: SearchPermissionDto,
    pagination: PaginationParamsDto,
  ): Promise<PaginatedDto<Permission>> {
    const { offset = 0, limit = 10 } = pagination;
    const { key, status } = searchData;

    const query = this.permissionRepository
      .createQueryBuilder('permission')
      .where('permission.deletedAt IS NULL');

    if (key) {
      query.andWhere('LOWER(permission.key) LIKE :key', {
        key: `%${key.toLowerCase()}%`,
      });
    }

    if (status) {
      query.andWhere('permission.status = :status', { status });
    }

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

  update(id: string, updatePermissionDto: UpdatePermissionDto) {
    return this.permissionRepository
      .update(id, updatePermissionDto)
      .then(() => {
        return this.permissionRepository.findOne({
          where: { id, deletedAt: IsNull() },
        });
      });
  }

  remove(id: string) {
    return this.permissionRepository
      .update(id, { deletedAt: new Date() })
      .then(() => {
        return this.permissionRepository.findOne({ where: { id } });
      });
  }
}
