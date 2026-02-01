import { IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Company } from '../../companies/entities/company.entity';

export class SearchClientDto {
  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'Client full name to search',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'client@example.com',
    description: 'Client email address to search',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: 'companyId123',
    description: 'Company ID to search',
  })
  @IsOptional()
  @IsString()
  companyId?: string;
}
