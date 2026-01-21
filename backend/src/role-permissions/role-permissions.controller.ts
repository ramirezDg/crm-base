import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RolePermissionsService } from './role-permissions.service';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { PaginationParamsDto } from '../common/dto/pagination-params.dto';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { PermissionsDecorator } from '../common/decorators';

@Controller('role-permissions')
@UseGuards(PermissionsGuard)
export class RolePermissionsController {
  constructor(
    private readonly rolePermissionsService: RolePermissionsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @PermissionsDecorator('roles.assignPermission')
  assignPermissionsToroles(
    @Body() createRolePermissionDto: CreateRolePermissionDto,
  ) {
    return this.rolePermissionsService.assignPermissionsToroles(
      createRolePermissionDto,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('roles.read')
  findAll(@Query() pagination: PaginationParamsDto) {
    return this.rolePermissionsService.findAll(pagination);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('roles.update')
  updateRolePermission(
    @Param('id') id: string,
    @Body() updateRolePermissionDto: UpdateRolePermissionDto,
  ) {
    return this.rolePermissionsService.updateRolePermission(
      id,
      updateRolePermissionDto,
    );
  }
}
