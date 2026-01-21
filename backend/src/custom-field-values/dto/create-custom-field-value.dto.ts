import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

export class CreateCustomFieldValueDto {}
export class CreateCustomFieldValueValidator {
  @IsUUID()
  customFieldId: string;

  @IsString()
  @IsNotEmpty()
  entityInstanceId: string;

  @IsString()
  value: string;
}
