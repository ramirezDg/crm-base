import { PartialType } from '@nestjs/swagger';
import { CreateCustomFieldValueDto } from './create-custom-field-value.dto';

export class UpdateCustomFieldValueDto extends PartialType(
  CreateCustomFieldValueDto,
) {}
