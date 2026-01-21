import { IsOptional, IsString, IsEmail, IsBoolean } from 'class-validator';

export class SearchUserDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @IsString()
  readonly companyId?: string;

  @IsOptional()
  @IsString()
  readonly roleId?: string;

  @IsOptional()
  @IsBoolean()
  readonly status?: boolean;
}
