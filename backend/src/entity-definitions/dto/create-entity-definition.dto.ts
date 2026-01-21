import { IsString, IsOptional, IsUUID, IsBoolean } from 'class-validator';

export class CreateEntityDefinitionDto {
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
