import { Test, TestingModule } from '@nestjs/testing';
import { EntityDefinitionsService } from '../entity-definitions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityDefinition } from '../entities/entity-definition.entity';
import { Repository } from 'typeorm';

describe('EntityDefinitionsService', () => {
  let service: EntityDefinitionsService;
  let repo: Repository<EntityDefinition>;

  const defId = 'd1a2b3c4';
  const companyId = 'c1a2b3c4';
  const entityDefinition = {
    id: defId,
    name: 'Definición Test',
    description: 'Descripción de prueba',
    company: { id: companyId },
    status: true,
    fields: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
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
        EntityDefinitionsService,
        {
          provide: getRepositoryToken(EntityDefinition),
          useValue: mockRepo,
        },
      ],
    }).compile();
    service = module.get<EntityDefinitionsService>(EntityDefinitionsService);
    repo = module.get<Repository<EntityDefinition>>(
      getRepositoryToken(EntityDefinition),
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an entity definition', async () => {
    mockRepo.create.mockReturnValue({ ...entityDefinition });
    mockRepo.save.mockResolvedValue(entityDefinition);
    const dto = {
      name: 'Definición Test',
      description: 'Descripción de prueba',
      companyId,
      status: true,
    };
    const result = await service.create(dto);
    expect(result).toEqual(entityDefinition);
    expect(mockRepo.create).toHaveBeenCalledWith({
      ...dto,
      company: { id: companyId },
    });
    expect(mockRepo.save).toHaveBeenCalledWith({ ...entityDefinition });
  });

  it('should return all entity definitions', async () => {
    mockRepo.findAndCount.mockResolvedValue([[entityDefinition], 1]);
    const pagination = { offset: 0, limit: 10 };
    const result = await service.findAll(pagination as any);
    expect(result).toEqual({
      total: 1,
      limit: 10,
      offset: 0,
      results: [entityDefinition],
    });
    expect(mockRepo.findAndCount).toHaveBeenCalledWith({
      where: { deletedAt: expect.any(Object) },
      skip: 0,
      take: 10,
    });
  });

  it('should return one entity definition by id', async () => {
    mockRepo.findOne.mockResolvedValue(entityDefinition);
    const result = await service.findOne(defId);
    expect(result).toEqual(entityDefinition);
    expect(mockRepo.findOne).toHaveBeenCalledWith({
      where: { id: defId, deletedAt: expect.any(Object) },
    });
  });

  it('should search entity definitions', async () => {
    const mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[entityDefinition], 1]),
    };
    mockRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);
    const searchData = { name: 'Definición', companyId };
    const pagination = { offset: 0, limit: 10 };
    const result = await service.search(searchData as any, pagination as any);
    expect(result).toEqual({
      total: 1,
      limit: 10,
      offset: 0,
      results: [entityDefinition],
    });
    expect(mockRepo.createQueryBuilder).toHaveBeenCalledWith(
      'entityDefinition',
    );
    expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
  });

  it('should update an entity definition', async () => {
    mockRepo.update.mockResolvedValue({ affected: 1 });
    mockRepo.findOne.mockResolvedValue({
      ...entityDefinition,
      name: 'Definición Actualizada',
      status: false,
    });
    const dto = { name: 'Definición Actualizada', status: false };
    const result = await service.update(defId, dto);
    expect(result).toEqual({
      ...entityDefinition,
      name: 'Definición Actualizada',
      status: false,
    });
    expect(mockRepo.update).toHaveBeenCalledWith(defId, dto);
    expect(mockRepo.findOne).toHaveBeenCalledWith({
      where: { id: defId, deletedAt: expect.any(Object) },
    });
  });

  it('should delete an entity definition', async () => {
    mockRepo.softDelete.mockResolvedValue({ affected: 1 });
    const result = await service.remove(defId);
    expect(mockRepo.softDelete).toHaveBeenCalledWith(defId);
  });
});
