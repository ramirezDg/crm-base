import { IsUUID, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomFieldValueDto {
  @ApiProperty({
    example: 'uuid-of-custom-field',
    description: 'ID of the custom field',
  })
  @IsUUID()
  customFieldId: string;

  @ApiProperty({
    example: 'uuid-of-entity-instance',
    description: 'ID of the entity instance',
  })
  @IsString()
  @IsNotEmpty()
  entityInstanceId: string;

  @ApiProperty({
    example: 'Some value',
    description: 'Value for the custom field',
  })
  @IsString()
  value: string;
}
