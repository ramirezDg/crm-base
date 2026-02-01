import { IsOptional, IsString, IsEmail, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchCompanyDto {
  @ApiPropertyOptional({
    example: 'Acme Inc.',
    description: 'Company name to search',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'acme-inc',
    description: 'Company slug to search',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    example: 'info@acme.com',
    description: 'Company email address to search',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: '+1234567890',
    description: 'Company phone number to search',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Company status to search (active/inactive)',
  })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
