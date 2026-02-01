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
import { PaginationParamsDto } from '../../common/dto/pagination-params.dto';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { PermissionsDecorator } from '../../common/decorators/permissions.decorator';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
// ...existing code...
@ApiTags('companies')
@Controller('companies')
@UseGuards(PermissionsGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @PermissionsDecorator('companies.create')
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({
    status: 201,
    description: 'Company created successfully',
    type: Object,
  })
  @ApiBody({ type: CreateCompanyDto })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('companies.read')
  @ApiOperation({ summary: 'Get all companies (paginated)' })
  @ApiResponse({ status: 200, description: 'List of companies', type: Object })
  findAll(@Query() pagination: PaginationParamsDto) {
    return this.companiesService.findAll(pagination);
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('companies.read')
  @ApiOperation({ summary: 'Search companies by filters' })
  @ApiResponse({
    status: 200,
    description: 'Filtered list of companies',
    type: Object,
  })
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
  @ApiOperation({ summary: 'Find company by email' })
  @ApiResponse({ status: 200, description: 'Company found', type: Object })
  @ApiQuery({ name: 'email', required: true, type: String })
  findByEmail(@Query('email') email: string) {
    return this.companiesService.findOneByEmail(email);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('companies.read')
  @ApiOperation({ summary: 'Get company by ID' })
  @ApiResponse({ status: 200, description: 'Company found', type: Object })
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('companies.update')
  @ApiOperation({ summary: 'Update company by ID' })
  @ApiResponse({ status: 200, description: 'Company updated', type: Object })
  @ApiBody({ type: UpdateCompanyDto })
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('companies.delete')
  @ApiOperation({ summary: 'Delete company by ID' })
  @ApiResponse({ status: 200, description: 'Company deleted' })
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }
}
