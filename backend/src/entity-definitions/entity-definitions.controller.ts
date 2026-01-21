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
import { EntityDefinitionsService } from './entity-definitions.service';
import { CreateEntityDefinitionDto } from './dto/create-entity-definition.dto';
import { UpdateEntityDefinitionDto } from './dto/update-entity-definition.dto';
import { PaginationParamsDto } from '../common/dto/pagination-params.dto';
import { SearchEntityDefinitionDto } from './dto/search-entity-definition.dto';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { PermissionsDecorator } from '../common/decorators';

@Controller('entity-definitions')
@UseGuards(PermissionsGuard)
export class EntityDefinitionsController {
  constructor(
    private readonly entityDefinitionsService: EntityDefinitionsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @PermissionsDecorator('entitiesDefinitions.create')
  create(@Body() createEntityDefinitionDto: CreateEntityDefinitionDto) {
    return this.entityDefinitionsService.create(createEntityDefinitionDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('entitiesDefinitions.read')
  findAll(@Query() pagination: PaginationParamsDto) {
    return this.entityDefinitionsService.findAll(pagination);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('entitiesDefinitions.read')
  findOne(@Param('id') id: string) {
    return this.entityDefinitionsService.findOne(id);
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('entitiesDefinitions.read')
  search(
    @Query() searchParams: PaginationParamsDto & SearchEntityDefinitionDto,
  ) {
    const { name, description, companyId, status, ...pagination } =
      searchParams;
    const searchData = { name, description, companyId, status };
    return this.entityDefinitionsService.search(searchData, pagination);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('entitiesDefinitions.update')
  update(
    @Param('id') id: string,
    @Body() updateEntityDefinitionDto: UpdateEntityDefinitionDto,
  ) {
    return this.entityDefinitionsService.update(id, updateEntityDefinitionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('entitiesDefinitions.delete')
  remove(@Param('id') id: string) {
    return this.entityDefinitionsService.remove(id);
  }
}
