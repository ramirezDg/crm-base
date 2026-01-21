import { IsString, IsOptional, IsUUID, IsBoolean } from 'class-validator';

export class SearchEntityDefinitionDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  companyId: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
