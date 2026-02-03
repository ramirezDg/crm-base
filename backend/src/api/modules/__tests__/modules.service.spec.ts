import { Test, TestingModule } from '@nestjs/testing';
import { ModulesService } from '../modules.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ModulesUser } from '../entities/module.entity';
import { Repository } from 'typeorm';

describe('ModulesService', () => {
  let service: ModulesService;
  let repo: Repository<ModulesUser>;

  const moduleId = 'm1a2b3c4';
  const moduleEntity = {
    id: moduleId,
    name: 'Módulo Test',
    description: 'Descripción',
    path: '/modulo',
    icon: 'icon',
    status: true,
    parent: null,
    children: [],
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
        ModulesService,
        {
          provide: getRepositoryToken(ModulesUser),
          useValue: mockRepo,
        },
      ],
    }).compile();
    service = module.get<ModulesService>(ModulesService);
    repo = module.get<Repository<ModulesUser>>(getRepositoryToken(ModulesUser));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a module', async () => {
    mockRepo.create.mockReturnValue({ ...moduleEntity });
    mockRepo.save.mockResolvedValue(moduleEntity);
    const dto = {
      name: 'Módulo Test',
      description: 'Descripción',
      path: '/modulo',
      icon: 'icon',
      status: true,
      parent: null,
    };
    const result = await service.create(dto);
    expect(result).toEqual(moduleEntity);
    expect(mockRepo.create).toHaveBeenCalledWith(dto);
    expect(mockRepo.save).toHaveBeenCalledWith({ ...moduleEntity });
  });

  it('should return all modules (hierarchy)', async () => {
    const childModule = {
      ...moduleEntity,
      id: 'child1',
      parent: { id: moduleId },
      children: [],
    };
    mockRepo.find.mockResolvedValue([moduleEntity, childModule]);
    const result = await service.findAll();
    expect(result[0].id).toBe(moduleId);
    expect(result[0].children[0].id).toBe('child1');
    expect(mockRepo.find).toHaveBeenCalledWith({
      where: { deletedAt: expect.any(Object) },
      relations: ['parent', 'children'],
      order: { name: 'ASC' },
    });
  });

  it('should return one module by id', async () => {
    mockRepo.findOne.mockResolvedValue(moduleEntity);
    const result = await service.findOne(moduleId);
    expect(result).toEqual(moduleEntity);
    expect(mockRepo.findOne).toHaveBeenCalledWith({
      where: { id: moduleId, deletedAt: expect.any(Object) },
    });
  });

  it('should update a module', async () => {
    mockRepo.update.mockResolvedValue({ affected: 1 });
    mockRepo.findOne.mockResolvedValue({
      ...moduleEntity,
      name: 'Módulo Actualizado',
    });
    const dto = { name: 'Módulo Actualizado' };
    const result = await service.update(moduleId, dto);
    expect(result).toEqual({ ...moduleEntity, name: 'Módulo Actualizado' });
    expect(mockRepo.update).toHaveBeenCalledWith(moduleId, dto);
    expect(mockRepo.findOne).toHaveBeenCalledWith({
      where: { id: moduleId, deletedAt: expect.any(Object) },
    });
  });

  it('should delete a module', async () => {
    mockRepo.softDelete.mockResolvedValue({ affected: 1 });
    const result = await service.remove(moduleId);
    expect(mockRepo.softDelete).toHaveBeenCalledWith(moduleId);
  });
});
