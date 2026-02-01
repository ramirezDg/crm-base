import { IsOptional, IsString } from 'class-validator';

export class SearchPermissionDto {
  @IsOptional()
  @IsString()
  key?: string;

  @IsOptional()
  status?: boolean;
}
