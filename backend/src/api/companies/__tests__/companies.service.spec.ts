import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from '../companies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Company } from '../entities/company.entity';
import { Repository } from 'typeorm';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let repo: Repository<Company>;

  const companyId = '8c6f00cc-d63f-49e5-919e-56c5ec685e62';
  const companyEntity = {
    id: companyId,
    name: 'Empresa Test',
    slug: 'empresa-test',
    email: 'empresa@test.com',
    phone: '+1234567890',
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    users: [],
    clients: [],
    entityDefinitions: [],
  };

  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    findAndCount: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    softDelete: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: getRepositoryToken(Company),
          useValue: mockRepo,
        },
      ],
    }).compile();
    service = module.get<CompaniesService>(CompaniesService);
    repo = module.get<Repository<Company>>(getRepositoryToken(Company));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a company', async () => {
    mockRepo.create.mockReturnValue({ ...companyEntity });
    mockRepo.save.mockResolvedValue(companyEntity);
    const dto = {
      name: 'Empresa Test',
      slug: 'empresa-test',
      email: 'empresa@test.com',
      phone: '+1234567890',
      status: true,
    };
    const result = await service.create(dto);
    expect(result).toEqual(companyEntity);
    expect(mockRepo.create).toHaveBeenCalledWith(dto);
    expect(mockRepo.save).toHaveBeenCalledWith({ ...companyEntity });
  });

  it('should return all companies', async () => {
    mockRepo.findAndCount.mockResolvedValue([[companyEntity], 1]);
    const pagination = { offset: 0, limit: 10 };
    const result = await service.findAll(pagination as any);
    expect(result).toEqual({
      total: 1,
      limit: 10,
      offset: 0,
      results: [companyEntity],
    });
    expect(mockRepo.findAndCount).toHaveBeenCalledWith({
      where: { deletedAt: expect.any(Object) },
      skip: 0,
      take: 10,
    });
  });

  it('should return one company by id', async () => {
    mockRepo.findOne.mockResolvedValue(companyEntity);
    const result = await service.findOne(companyId);
    expect(result).toEqual(companyEntity);
    expect(mockRepo.findOne).toHaveBeenCalledWith({
      where: { id: companyId, deletedAt: expect.any(Object) },
    });
  });

  it('should search companies', async () => {
    // Simula el query builder
    const mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[companyEntity], 1]),
    };
    mockRepo.createQueryBuilder = jest.fn().mockReturnValue(mockQueryBuilder);
    const searchData = { name: 'Empresa' };
    const pagination = { offset: 0, limit: 10 };
    const result = await service.search(searchData as any, pagination as any);
    expect(result).toEqual({
      total: 1,
      limit: 10,
      offset: 0,
      results: [companyEntity],
    });
    expect(mockRepo.createQueryBuilder).toHaveBeenCalledWith('company');
    expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
  });

  it('should find one company by email', async () => {
    mockRepo.findOneBy.mockResolvedValue(companyEntity);
    const result = await service.findOneByEmail('empresa@test.com');
    expect(result).toEqual(companyEntity);
    expect(mockRepo.findOneBy).toHaveBeenCalledWith({
      email: 'empresa@test.com',
      deletedAt: expect.any(Object),
    });
  });

  it('should update a company', async () => {
    mockRepo.update.mockResolvedValue({ affected: 1 });
    mockRepo.findOne.mockResolvedValue({
      ...companyEntity,
      name: 'Nuevo Nombre',
      phone: '+9876543210',
      status: false,
    });
    const dto = { name: 'Nuevo Nombre', phone: '+9876543210', status: false };
    const result = await service.update(companyId, dto);
    expect(result).toEqual({
      ...companyEntity,
      name: 'Nuevo Nombre',
      phone: '+9876543210',
      status: false,
    });
    expect(mockRepo.update).toHaveBeenCalledWith(companyId, dto);
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: companyId } });
  });

  it('should delete a company', async () => {
    mockRepo.softDelete.mockResolvedValue({ affected: 1 });
    const result = await service.remove(companyId);
    expect(mockRepo.softDelete).toHaveBeenCalledWith(companyId);
  });
});
