import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John', description: 'User first name' })
  name?: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'User last name' })
  lastName?: string;

  @ApiPropertyOptional({
    example: 'user@email.com',
    description: 'User email address',
  })
  email?: string;

  @ApiPropertyOptional({
    example: 'password123',
    description: 'User password (min 6 characters)',
  })
  password?: string;

  @ApiPropertyOptional({ example: 'admin', description: 'User role' })
  rol?: string;

  @ApiPropertyOptional({ example: true, description: 'User status' })
  status?: boolean;

  @ApiPropertyOptional({ example: null, description: 'Hashed refresh token' })
  hashedRt?: string | null;
}
