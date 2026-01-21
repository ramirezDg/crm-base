import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsArray } from 'class-validator';

export class PaginatedDto<TData> {
  @ApiProperty()
  @IsNumber()
  total: number;

  @ApiProperty()
  @IsNumber()
  limit: number;

  @ApiProperty()
  @IsNumber()
  offset: number;

  @ApiProperty({ isArray: true })
  @IsArray()
  results: TData[];
}