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
import { CustomFieldValuesService } from './custom-field-values.service';
import { CreateCustomFieldValueDto } from './dto/create-custom-field-value.dto';
import { UpdateCustomFieldValueDto } from './dto/update-custom-field-value.dto';
import { PaginationParamsDto } from '../../common/dto/pagination-params.dto';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { PermissionsDecorator } from '../../common/decorators/permissions.decorator';

import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
// ...existing code...
@ApiTags('custom-field-values')
@Controller('custom-field-values')
@UseGuards(PermissionsGuard)
export class CustomFieldValuesController {
  constructor(
    private readonly customFieldValuesService: CustomFieldValuesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @PermissionsDecorator('customFieldValues.create')
  @ApiOperation({ summary: 'Create a new custom field value' })
  @ApiResponse({
    status: 201,
    description: 'Custom field value created successfully',
    type: Object,
  })
  @ApiBody({ type: CreateCustomFieldValueDto })
  create(@Body() createCustomFieldValueDto: CreateCustomFieldValueDto) {
    return this.customFieldValuesService.create(createCustomFieldValueDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('customFieldValues.read')
  @ApiOperation({ summary: 'Get all custom field values (paginated)' })
  @ApiResponse({
    status: 200,
    description: 'List of custom field values',
    type: Object,
  })
  findAll(@Query() pagination: PaginationParamsDto) {
    return this.customFieldValuesService.findAll(pagination);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('customFieldValues.read')
  @ApiOperation({ summary: 'Get custom field value by ID' })
  @ApiResponse({
    status: 200,
    description: 'Custom field value found',
    type: Object,
  })
  findOne(@Param('id') id: string) {
    return this.customFieldValuesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('customFieldValues.update')
  @ApiOperation({ summary: 'Update custom field value by ID' })
  @ApiResponse({
    status: 200,
    description: 'Custom field value updated',
    type: Object,
  })
  @ApiBody({ type: UpdateCustomFieldValueDto })
  update(
    @Param('id') id: string,
    @Body() updateCustomFieldValueDto: UpdateCustomFieldValueDto,
  ) {
    return this.customFieldValuesService.update(id, updateCustomFieldValueDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('customFieldValues.delete')
  @ApiOperation({ summary: 'Delete custom field value by ID' })
  @ApiResponse({ status: 200, description: 'Custom field value deleted' })
  remove(@Param('id') id: string) {
    return this.customFieldValuesService.remove(id);
  }
}
