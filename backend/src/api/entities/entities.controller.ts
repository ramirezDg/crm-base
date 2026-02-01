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
import { PaginationParamsDto } from '../../common/dto/pagination-params.dto';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { PermissionsDecorator } from '../../common/decorators/permissions.decorator';

import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
// ...existing code...
@ApiTags('entities')
@Controller('entities')
@UseGuards(PermissionsGuard)
export class EntitiesController {
  constructor(private readonly entitiesService: EntitiesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @PermissionsDecorator('entities.create')
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiResponse({
    status: 201,
    description: 'Entity created successfully',
    type: Object,
  })
  @ApiBody({ type: CreateEntityDto })
  create(@Body() createEntityDto: CreateEntityDto) {
    return this.entitiesService.create(createEntityDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('entities.read')
  @ApiOperation({ summary: 'Get all entities (paginated)' })
  @ApiResponse({ status: 200, description: 'List of entities', type: Object })
  findAll(@Query() pagination: PaginationParamsDto) {
    return this.entitiesService.findAll(pagination);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('entities.read')
  @ApiOperation({ summary: 'Get entity by ID' })
  @ApiResponse({ status: 200, description: 'Entity found', type: Object })
  findOne(@Param('id') id: string) {
    return this.entitiesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('entities.update')
  @ApiOperation({ summary: 'Update entity by ID' })
  @ApiResponse({ status: 200, description: 'Entity updated', type: Object })
  @ApiBody({ type: UpdateEntityDto })
  update(@Param('id') id: string, @Body() updateEntityDto: UpdateEntityDto) {
    return this.entitiesService.update(id, updateEntityDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('entities.delete')
  @ApiOperation({ summary: 'Delete entity by ID' })
  @ApiResponse({ status: 200, description: 'Entity deleted' })
  remove(@Param('id') id: string) {
    return this.entitiesService.remove(id);
  }
}
