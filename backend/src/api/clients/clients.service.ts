import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository, IsNull } from 'typeorm';
import { SearchClientDto } from './dto/search-client.dto';
import { PaginationParamsDto } from '../../common/dto/pagination-params.dto';
import { PaginatedDto } from '../../common/dto/paginated.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto) {
    const client = this.clientsRepository.create(createClientDto);
    return await this.clientsRepository.save(client);
  }

  async findOneByEmail(email: string) {
    return await this.clientsRepository.findOneBy({
      email,
      deletedAt: IsNull(),
    });
  }

  async findAll(
    pagination: PaginationParamsDto,
  ): Promise<PaginatedDto<Client>> {
    const { offset = 0, limit = 10 } = pagination;

    const [results, total] = await this.clientsRepository.findAndCount({
      where: { deletedAt: IsNull() },
      skip: offset,
      take: limit,
    });

    return {
      total,
      limit,
      offset,
      results,
    };
  }

  findOne(id: string) {
    return this.clientsRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async search(
    searchData: SearchClientDto,
    pagination: PaginationParamsDto,
  ): Promise<PaginatedDto<Client>> {
    const { offset = 0, limit = 10 } = pagination;

    const query = this.clientsRepository
      .createQueryBuilder('client')
      .where('client.deletedAt IS NULL');

    Object.entries(searchData).forEach(([key, value]) => {
      if (value) {
        if (key === 'companyId') {
          query.andWhere(`client.companyId = :${key}`, { [key]: value });
        } else {
          query.andWhere(`LOWER(client.${key}) LIKE :${key}`, {
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

  async update(id: string, updateClientDto: UpdateClientDto) {
    return this.clientsRepository.update(id, updateClientDto).then(() => {
      return this.clientsRepository.findOne({ where: { id } });
    });
  }

  async remove(id: string) {
    await this.clientsRepository.softDelete(id);
  }
}
