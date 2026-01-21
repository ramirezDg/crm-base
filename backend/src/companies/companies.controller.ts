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
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PaginationParamsDto } from '../common/dto/pagination-params.dto';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { PermissionsDecorator } from '../common/decorators/permissions.decorator';

@Controller('companies')
@UseGuards(PermissionsGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @PermissionsDecorator('companies.create')
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('companies.read')
  findAll(@Query() pagination: PaginationParamsDto) {
    return this.companiesService.findAll(pagination);
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('companies.read')
  search(
    @Query()
    searchParams: PaginationParamsDto & {
      name?: string;
      slug?: string;
      email?: string;
      phone?: string;
      status?: boolean;
    },
  ) {
    const { name, slug, email, phone, status, ...pagination } = searchParams;
    const searchData = { name, slug, email, phone, status };
    return this.companiesService.search(searchData, pagination);
  }

  @Get('by-email')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('companies.read')
  findByEmail(email: string) {
    return this.companiesService.findOneByEmail(email);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('companies.read')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('companies.update')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('companies.delete')
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }
}
