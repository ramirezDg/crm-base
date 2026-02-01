import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'admin', description: 'Role name' })
  name: string;

  @ApiPropertyOptional({
    example: 'Administrator role',
    description: 'Role description',
  })
  description?: string;

  @ApiProperty({
    example: 'companyId123',
    description: 'Company ID to which the role belongs',
  })
  companyId: string;
}
