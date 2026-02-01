import { IsString, IsBoolean, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomFieldDto {
  @ApiProperty({ example: 'Priority', description: 'Name of the custom field' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'string',
    description: 'Type of the custom field (e.g., string, number, boolean)',
  })
  @IsString()
  type: string;

  @ApiProperty({
    example: 'task',
    description: 'Entity type this field belongs to',
  })
  @IsString()
  entityType: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the field is required',
  })
  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;

  @ApiPropertyOptional({
    example: ['High', 'Medium', 'Low'],
    description: 'Options for select-type fields',
  })
  @IsArray()
  @IsOptional()
  options?: string[];
}
