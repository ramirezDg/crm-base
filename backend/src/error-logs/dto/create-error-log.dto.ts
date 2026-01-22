import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateErrorLogDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  stack?: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  context?: any;
}
