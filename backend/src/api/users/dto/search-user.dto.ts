import { IsOptional, IsString, IsEmail, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchUserDto {
  @ApiPropertyOptional({ example: 'John', description: 'User first name' })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'User last name' })
  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @ApiPropertyOptional({
    example: 'user@email.com',
    description: 'User email address',
  })
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiPropertyOptional({ example: 'companyId123', description: 'Company ID' })
  @IsOptional()
  @IsString()
  readonly companyId?: string;

  @ApiPropertyOptional({ example: 'roleId123', description: 'Role ID' })
  @IsOptional()
  @IsString()
  readonly roleId?: string;

  @ApiPropertyOptional({ example: true, description: 'User status' })
  @IsOptional()
  @IsBoolean()
  readonly status?: boolean;
}
