import { IsBoolean, IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Acme Inc.', description: 'Company name' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'acme-inc',
    description: 'Company slug (unique identifier)',
  })
  @IsString()
  slug: string;

  @ApiProperty({
    example: 'info@acme.com',
    description: 'Company email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Company phone number (min 7 characters)',
  })
  @IsString()
  @MinLength(7)
  phone: string;

  @ApiProperty({
    example: true,
    description: 'Company status (active/inactive)',
  })
  @IsBoolean()
  status: boolean;
}
