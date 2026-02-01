import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { IsNull, Repository } from 'typeorm';
import { PaginationParamsDto } from '../../common/dto/pagination-params.dto';
import { PaginatedDto } from '../../common/dto/paginated.dto';
import { SearchUserDto } from './dto/search-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async findOneByEmail(email: string, options?: { relations?: string[] }) {
    return await this.usersRepository.findOne({
      where: { email, deletedAt: IsNull() },
      relations: options?.relations,
    });
  }

  async findAll(pagination: PaginationParamsDto): Promise<PaginatedDto<Users>> {
    const { offset = 0, limit = 10 } = pagination;

    const [results, total] = await this.usersRepository.findAndCount({
      where: { deletedAt: IsNull() },
      skip: offset,
      take: limit,
      relations: ['role', 'company'],
    });

    return {
      total,
      limit,
      offset,
      results,
    };
  }

  findOne(id: string) {
    return this.usersRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: [
        'role',
        'role.rolePermissions',
        'role.rolePermissions.permission',
      ],
    });
  }

  async search(
    searchData: SearchUserDto,
    pagination: PaginationParamsDto,
  ): Promise<PaginatedDto<Users>> {
    const { offset = 0, limit = 10 } = pagination;

    const query = this.usersRepository
      .createQueryBuilder('users')
      .where('users.deletedAt IS NULL');

    Object.entries(searchData).forEach(([key, value]) => {
      if (value) {
        if (key === 'companyId' || key === 'roleId') {
          query.andWhere(`users.${key} = :${key}`, { [key]: value });
        } else {
          query.andWhere(`LOWER(users.${key}) LIKE :${key}`, {
            [key]: `%${String(value).toLowerCase()}%`,
          });
        }
      }
    });

    const [results, total] = await query
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      total,
      limit,
      offset,
      results,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto).then(() => {
      return this.usersRepository.findOne({
        where: { id },
      });
    });
  }

  async remove(id: string) {
    await this.usersRepository.update(id, { deletedAt: new Date() });
    return this.usersRepository.findOne({ where: { id } });
  }
}
