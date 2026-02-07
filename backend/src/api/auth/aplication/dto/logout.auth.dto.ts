import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogoutDto {
  @ApiProperty({ example: 'userId123', description: 'User ID' })
  @IsString()
  id: string;
}
