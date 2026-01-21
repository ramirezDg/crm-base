import { IsBoolean, IsEmail, IsString, MinLength } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(7)
  phone: string;

  @IsBoolean()
  status: boolean;
}
