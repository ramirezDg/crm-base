import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFileDto {
  @IsString()
  filename: string;

  @IsString()
  originalName: string;

  @IsString()
  mimeType: string;

  @Type(() => Number)
  @IsNumber()
  size: number;

  @IsString()
  path: string;

  @IsOptional()
  @IsString()
  checksum?: string;

  @IsString()
  entityId: string;

  @IsString()
  entityType: string;
}
