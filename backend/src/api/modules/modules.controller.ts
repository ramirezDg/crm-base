import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { PermissionsDecorator } from '../../common/decorators/permissions.decorator';
import { PaginationParamsDto } from '../../common/dto/pagination-params.dto';

import { ApiTags } from '@nestjs/swagger';
// ...existing code...
@ApiTags('modules')
@Controller('modules')
@UseGuards(PermissionsGuard)
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @PermissionsDecorator('modules.create')
  create(@Body() createModuleDto: CreateModuleDto) {
    return this.modulesService.create(createModuleDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('modules.read')
  findAll() {
    return this.modulesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('modules.read')
  findOne(@Param('id') id: string) {
    return this.modulesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('modules.update')
  update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto) {
    return this.modulesService.update(id, updateModuleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @PermissionsDecorator('modules.delete')
  remove(@Param('id') id: string) {
    return this.modulesService.remove(id);
  }
}
