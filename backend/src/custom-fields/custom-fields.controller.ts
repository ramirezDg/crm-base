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
import { PaginationParamsDto } from '../common/dto/pagination-params.dto';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { PermissionsDecorator } from '../common/decorators';

@Controller('custom-fields')
@UseGuards(PermissionsGuard)
export class CustomFieldsController {
  constructor(private readonly customFieldsService: CustomFieldsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @PermissionsDecorator('customFields.create')
  create(@Body() createCustomFieldDto: CreateCustomFieldDto) {
    return this.customFieldsService.create(createCustomFieldDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('customFields.read')
  findAll(@Query() pagination: PaginationParamsDto) {
    return this.customFieldsService.findAll(pagination);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('customFields.read')
  findOne(@Param('id') id: string) {
    return this.customFieldsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('customFields.update')
  update(
    @Param('id') id: string,
    @Body() updateCustomFieldDto: UpdateCustomFieldDto,
  ) {
    return this.customFieldsService.update(id, updateCustomFieldDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('customFields.delete')
  remove(@Param('id') id: string) {
    return this.customFieldsService.remove(id);
  }
}
