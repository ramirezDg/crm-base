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
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PaginationParamsDto } from '../../common/dto/pagination-params.dto';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { PermissionsDecorator } from '../../common/decorators/permissions.decorator';

import { ApiTags } from '@nestjs/swagger';
// ...existing code...
@ApiTags('permissions')
@Controller('permissions')
@UseGuards(PermissionsGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @PermissionsDecorator('permissions.create')
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('permissions.read')
  findAll(@Query() pagination: PaginationParamsDto) {
    return this.permissionsService.findAll(pagination);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('permissions.read')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('permissions.read')
  search(
    @Query()
    searchParams: PaginationParamsDto & {
      key?: string;
      status?: boolean;
    },
  ) {
    const { key, status, ...pagination } = searchParams;
    const searchData = { key, status };
    return this.permissionsService.search(searchData, pagination);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('permissions.update')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('permissions.delete')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
}
