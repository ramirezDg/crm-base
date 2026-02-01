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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationParamsDto } from '../../common/dto/pagination-params.dto';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { PermissionsDecorator } from '../../common/decorators/permissions.decorator';

import { ApiTags } from '@nestjs/swagger';
// ...existing code...
@ApiTags('users')
@Controller('users')
@UseGuards(PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @PermissionsDecorator('users.create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('users.read')
  findAll(@Query() pagination: PaginationParamsDto) {
    return this.usersService.findAll(pagination);
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('users.read')
  search(
    @Query()
    searchParams: PaginationParamsDto & {
      name?: string;
      lastName?: string;
      email?: string;
      company?: string;
      status?: boolean;
      role?: string;
    },
  ) {
    const { name, lastName, email, company, status, role, ...pagination } =
      searchParams;
    const searchData = { name, lastName, email, company, status, role };
    return this.usersService.search(searchData, pagination);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('users.read')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('users.update')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('users.delete')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
