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
import { PaginationParamsDto } from '../common/dto/pagination-params.dto';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { PermissionsDecorator } from '../common/decorators/permissions.decorator';

@Controller('custom-field-values')
@UseGuards(PermissionsGuard)
export class CustomFieldValuesController {
  constructor(
    private readonly customFieldValuesService: CustomFieldValuesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @PermissionsDecorator('customFieldValues.create')
  create(@Body() createCustomFieldValueDto: CreateCustomFieldValueDto) {
    return this.customFieldValuesService.create(createCustomFieldValueDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('customFieldValues.read')
  findAll(@Query() pagination: PaginationParamsDto) {
    return this.customFieldValuesService.findAll(pagination);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('customFieldValues.read')
  findOne(@Param('id') id: string) {
    return this.customFieldValuesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('customFieldValues.update')
  update(
    @Param('id') id: string,
    @Body() updateCustomFieldValueDto: UpdateCustomFieldValueDto,
  ) {
    return this.customFieldValuesService.update(id, updateCustomFieldValueDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('customFieldValues.delete')
  remove(@Param('id') id: string) {
    return this.customFieldValuesService.remove(id);
  }
}
