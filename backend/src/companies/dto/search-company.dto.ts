import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsEmail,
  IsBoolean,
} from 'class-validator';

export class SearchCompanyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
