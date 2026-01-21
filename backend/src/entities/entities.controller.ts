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
import { EntitiesService } from './entities.service';
import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';
import { PaginationParamsDto } from '../common/dto/pagination-params.dto';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { PermissionsDecorator } from '../common/decorators';

@Controller('entities')
@UseGuards(PermissionsGuard)
export class EntitiesController {
  constructor(private readonly entitiesService: EntitiesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @PermissionsDecorator('entities.create')
  create(@Body() createEntityDto: CreateEntityDto) {
    return this.entitiesService.create(createEntityDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('entities.read')
  findAll(@Query() pagination: PaginationParamsDto) {
    return this.entitiesService.findAll(pagination);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('entities.read')
  findOne(@Param('id') id: string) {
    return this.entitiesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('entities.update')
  update(@Param('id') id: string, @Body() updateEntityDto: UpdateEntityDto) {
    return this.entitiesService.update(id, updateEntityDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('entities.delete')
  remove(@Param('id') id: string) {
    return this.entitiesService.remove(id);
  }
}
