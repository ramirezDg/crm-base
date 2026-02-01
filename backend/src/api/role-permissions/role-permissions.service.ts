import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermission } from './entities/role-permission.entity';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { PaginationParamsDto } from '../../common/dto/pagination-params.dto';
import { PaginatedDto } from '../../common/dto/paginated.dto';

@Injectable()
export class RolePermissionsService {
  constructor(
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepo: Repository<RolePermission>,
  ) {}

  findOne(id: string) {
    return this.rolePermissionRepo.findOne({ where: { id } });
  }

  async findAll(
    pagination: PaginationParamsDto,
  ): Promise<PaginatedDto<RolePermission>> {
    const { offset = 0, limit = 10 } = pagination;

    const [results, total] = await this.rolePermissionRepo.findAndCount({
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

  async assignPermissionsToroles(
    createRolePermissionDto: CreateRolePermissionDto,
  ) {
    const role = await this.rolePermissionRepo.manager.findOne(Role, {
      where: { id: createRolePermissionDto.roleId },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    const permission = await this.rolePermissionRepo.manager.findOne(
      Permission,
      {
        where: { id: createRolePermissionDto.permissionId },
      },
    );
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    const rolePermission = this.rolePermissionRepo.create({
      role,
      permission,
    });
    return await this.rolePermissionRepo.save(rolePermission);
  }

  async updateRolePermission(id: string, updateDto: UpdateRolePermissionDto) {
    const rolePermission = await this.rolePermissionRepo.findOne({
      where: { id },
    });
    if (!rolePermission) {
      throw new NotFoundException('RolePermission not found');
    }

    if (updateDto.roleId) {
      const role = await this.rolePermissionRepo.manager.findOne(Role, {
        where: { id: updateDto.roleId },
      });
      if (!role) {
        throw new NotFoundException('Role not found');
      }
      rolePermission.role = role;
    }

    if (updateDto.permissionId) {
      const permission = await this.rolePermissionRepo.manager.findOne(
        Permission,
        {
          where: { id: updateDto.permissionId },
        },
      );
      if (!permission) {
        throw new NotFoundException('Permission not found');
      }
      rolePermission.permission = permission;
    }

    return await this.rolePermissionRepo.save(rolePermission);
  }
}
