import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PaginationParamsDto } from '../../common/dto/pagination-params.dto';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { PermissionsDecorator } from '../../common/decorators';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
// ...existing code...
@ApiTags('clients')
@Controller('clients')
@UseGuards(PermissionsGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @PermissionsDecorator('clients.create')
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({
    status: 201,
    description: 'Client created successfully',
    type: Object,
  })
  @ApiBody({ type: CreateClientDto })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get('by-email')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('clients.read')
  @ApiOperation({ summary: 'Find client by email' })
  @ApiResponse({ status: 200, description: 'Client found', type: Object })
  @ApiQuery({ name: 'email', required: true, type: String })
  findByEmail(@Query('email') email: string) {
    return this.clientsService.findOneByEmail(email);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('clients.read')
  @ApiOperation({ summary: 'Get all clients (paginated)' })
  @ApiResponse({ status: 200, description: 'List of clients', type: Object })
  findAll(@Query() pagination: PaginationParamsDto) {
    return this.clientsService.findAll(pagination);
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('clients.read')
  @ApiOperation({ summary: 'Search clients by filters' })
  @ApiResponse({
    status: 200,
    description: 'Filtered list of clients',
    type: Object,
  })
  search(
    @Query()
    searchParams: PaginationParamsDto & {
      name?: string;
      email?: string;
      company?: string;
    },
  ) {
    const { name, email, company, ...pagination } = searchParams;
    const searchData = { name, email, company };
    return this.clientsService.search(searchData, pagination);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('clients.read')
  @ApiOperation({ summary: 'Get client by ID' })
  @ApiResponse({ status: 200, description: 'Client found', type: Object })
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('clients.update')
  @ApiOperation({ summary: 'Update client by ID' })
  @ApiResponse({ status: 200, description: 'Client updated', type: Object })
  @ApiBody({ type: UpdateClientDto })
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('clients.delete')
  @ApiOperation({ summary: 'Delete client by ID' })
  @ApiResponse({ status: 200, description: 'Client deleted' })
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}
