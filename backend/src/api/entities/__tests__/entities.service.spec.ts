import { Test, TestingModule } from '@nestjs/testing';
import { EntitiesService } from '../entities.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BaseEntity } from '../entities/entity.entity';
import { Repository } from 'typeorm';

describe('EntitiesService', () => {
  let service: EntitiesService;
  let repo: Repository<BaseEntity>;

  const entityId = 'e1a2b3c4';
  const entity = {
    id: entityId,
    name: 'Entidad Test',
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
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntitiesService,
        {
          provide: getRepositoryToken(BaseEntity),
          useValue: mockRepo,
        },
      ],
    }).compile();
    service = module.get<EntitiesService>(EntitiesService);
    repo = module.get<Repository<BaseEntity>>(getRepositoryToken(BaseEntity));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an entity', async () => {
    mockRepo.create.mockReturnValue({ ...entity });
    mockRepo.save.mockResolvedValue(entity);
    const dto = { name: 'Entidad Test' };
    const result = await service.create(dto);
    expect(result).toEqual(entity);
    expect(mockRepo.create).toHaveBeenCalledWith(dto);
    expect(mockRepo.save).toHaveBeenCalledWith({ ...entity });
  });

  it('should return all entities', async () => {
    mockRepo.findAndCount.mockResolvedValue([[entity], 1]);
    const pagination = { offset: 0, limit: 10 };
    const result = await service.findAll(pagination as any);
    expect(result).toEqual({
      total: 1,
      limit: 10,
      offset: 0,
      results: [entity],
    });
    expect(mockRepo.findAndCount).toHaveBeenCalledWith({
      where: { deletedAt: expect.any(Object) },
      skip: 0,
      take: 10,
    });
  });

  it('should return one entity by id', async () => {
    mockRepo.findOne.mockResolvedValue(entity);
    const result = await service.findOne(entityId);
    expect(result).toEqual(entity);
    expect(mockRepo.findOne).toHaveBeenCalledWith({
      where: { id: entityId, deletedAt: expect.any(Object) },
    });
  });

  it('should update an entity', async () => {
    mockRepo.update.mockResolvedValue({ affected: 1 });
    mockRepo.findOne.mockResolvedValue({
      ...entity,
      name: 'Entidad Actualizada',
    });
    const dto = { name: 'Entidad Actualizada' };
    const result = await service.update(entityId, dto);
    expect(result).toEqual({ ...entity, name: 'Entidad Actualizada' });
    expect(mockRepo.update).toHaveBeenCalledWith(entityId, dto);
    expect(mockRepo.findOne).toHaveBeenCalledWith({
      where: { id: entityId, deletedAt: expect.any(Object) },
    });
  });

  it('should delete an entity', async () => {
    mockRepo.softDelete.mockResolvedValue({ affected: 1 });
    const result = await service.remove(entityId);
    expect(mockRepo.softDelete).toHaveBeenCalledWith(entityId);
  });
});
