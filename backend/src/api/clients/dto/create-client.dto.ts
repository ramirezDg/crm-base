import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({ example: 'John Doe', description: 'Client full name' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'client@example.com',
    description: 'Client email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'companyId123',
    description: 'Associated company ID',
  })
  @IsString()
  companyId: string;
}
