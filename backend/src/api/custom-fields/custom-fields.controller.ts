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
import { CustomFieldsService } from './custom-fields.service';
import { CreateCustomFieldDto } from './dto/create-custom-field.dto';
import { UpdateCustomFieldDto } from './dto/update-custom-field.dto';
import { PaginationParamsDto } from '../../common/dto/pagination-params.dto';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { PermissionsDecorator } from '../../common/decorators/permissions.decorator';

import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
// ...existing code...
@ApiTags('custom-fields')
@Controller('custom-fields')
@UseGuards(PermissionsGuard)
export class CustomFieldsController {
  constructor(private readonly customFieldsService: CustomFieldsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @PermissionsDecorator('customFields.create')
  @ApiOperation({ summary: 'Create a new custom field' })
  @ApiResponse({
    status: 201,
    description: 'Custom field created successfully',
    type: Object,
  })
  @ApiBody({ type: CreateCustomFieldDto })
  create(@Body() createCustomFieldDto: CreateCustomFieldDto) {
    return this.customFieldsService.create(createCustomFieldDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('customFields.read')
  @ApiOperation({ summary: 'Get all custom fields (paginated)' })
  @ApiResponse({
    status: 200,
    description: 'List of custom fields',
    type: Object,
  })
  findAll(@Query() pagination: PaginationParamsDto) {
    return this.customFieldsService.findAll(pagination);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('customFields.read')
  @ApiOperation({ summary: 'Get custom field by ID' })
  @ApiResponse({ status: 200, description: 'Custom field found', type: Object })
  findOne(@Param('id') id: string) {
    return this.customFieldsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('customFields.update')
  @ApiOperation({ summary: 'Update custom field by ID' })
  @ApiResponse({
    status: 200,
    description: 'Custom field updated',
    type: Object,
  })
  @ApiBody({ type: UpdateCustomFieldDto })
  update(
    @Param('id') id: string,
    @Body() updateCustomFieldDto: UpdateCustomFieldDto,
  ) {
    return this.customFieldsService.update(id, updateCustomFieldDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('customFields.delete')
  @ApiOperation({ summary: 'Delete custom field by ID' })
  @ApiResponse({ status: 200, description: 'Custom field deleted' })
  remove(@Param('id') id: string) {
    return this.customFieldsService.remove(id);
  }
}
