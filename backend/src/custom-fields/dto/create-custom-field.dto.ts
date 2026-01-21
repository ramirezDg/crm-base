import { IsString, IsBoolean, IsOptional, IsArray } from 'class-validator';

export class CreateCustomFieldDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsString()
  entityType: string;

  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;

  @IsArray()
  @IsOptional()
  options?: string[];
}
