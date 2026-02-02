import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  @MinLength(6)Q
  password: string;
}
