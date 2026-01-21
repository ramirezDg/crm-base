import { IsOptional, IsString, IsEmail } from 'class-validator';
import { Company } from '../../companies/entities/company.entity';

export class SearchClientDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  companyId?: Company;
}
