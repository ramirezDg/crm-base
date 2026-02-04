import {
  IsString,
  IsEmail,
  MinLength,
  IsUUID,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../roles/entities/role.entity';
import { Company } from '../../companies/entities/company.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'User first name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'user@email.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password (min 6 characters)',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'uuid-role', description: 'Role ID' })
  @IsUUID()
  role: Role;

  @ApiProperty({ example: 'uuid-company', description: 'Company ID' })
  @IsUUID()
  company?: Company;

  @ApiProperty({ example: true, description: 'User status', required: false })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
