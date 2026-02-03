import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { IsNull, Repository } from 'typeorm';
import { PaginationParamsDto } from '../../common/dto/pagination-params.dto';
import { PaginatedDto } from '../../common/dto/paginated.dto';
import { SearchCompanyDto } from './dto/search-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const company = this.companiesRepository.create(createCompanyDto);
    return await this.companiesRepository.save(company);
  }

  async findAll(
    pagination: PaginationParamsDto,
  ): Promise<PaginatedDto<Company>> {
    const { offset = 0, limit = 10 } = pagination;

    const [results, total] = await this.companiesRepository.findAndCount({
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
    return this.companiesRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async search(
    searchData: SearchCompanyDto,
    pagination: PaginationParamsDto,
  ): Promise<PaginatedDto<Company>> {
    const { offset = 0, limit = 10 } = pagination;

    const query = this.companiesRepository
      .createQueryBuilder('company')
      .where('company.deletedAt IS NULL');

    Object.entries(searchData).forEach(([key, value]) => {
      if (value) {
        query.andWhere(`LOWER(company.${key}) LIKE :${key}`, {
          [key]: `%${String(value).toLowerCase()}%`,
        });
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

  async findOneByEmail(email: string) {
    return await this.companiesRepository.findOneBy({
      email,
      deletedAt: IsNull(),
    });
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    return this.companiesRepository.update(id, updateCompanyDto).then(() => {
      return this.companiesRepository.findOne({ where: { id } });
    });
  }

  async remove(id: string) {
    await this.companiesRepository.softDelete(id);
  }
}
