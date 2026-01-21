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
import { PaginationParamsDto } from '../common/dto/pagination-params.dto';
import { PermissionsDecorator } from '../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';

@Controller('clients')
@UseGuards(PermissionsGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @PermissionsDecorator('clients.create')
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get('by-email')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('clients.read')
  findByEmail(email: string) {
    return this.clientsService.findOneByEmail(email);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('clients.read')
  findAll(@Query() pagination: PaginationParamsDto) {
    return this.clientsService.findAll(pagination);
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('clients.read')
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
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('clients.update')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('clients.delete')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}
