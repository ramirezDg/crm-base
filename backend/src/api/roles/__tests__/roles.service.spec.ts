import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from '../roles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { Repository } from 'typeorm';

describe('RolesService', () => {
  let service: RolesService;
  let repo: Repository<Role>;

  const roleId = 'r1a2b3c4';
  const company = { id: 'c1a2b3c4' };
  const roleEntity = {
    id: roleId,
    name: 'admin',
    description: 'Administrator role',
    company,
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
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useValue: mockRepo,
        },
      ],
    }).compile();
    service = module.get<RolesService>(RolesService);
    repo = module.get<Repository<Role>>(getRepositoryToken(Role));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a role', async () => {
    mockRepo.create.mockReturnValue({ ...roleEntity });
    mockRepo.save.mockResolvedValue(roleEntity);
    const dto = {
      name: 'admin',
      description: 'Administrator role',
      companyId: company.id,
    };
    const result = await service.create(dto);
    expect(result).toEqual(roleEntity);
    expect(mockRepo.create).toHaveBeenCalledWith(dto);
    expect(mockRepo.save).toHaveBeenCalledWith({ ...roleEntity });
  });

  it('should return all roles', async () => {
    mockRepo.findAndCount.mockResolvedValue([[roleEntity], 1]);
    const pagination = { offset: 0, limit: 10 };
    const result = await service.findAll(pagination as any);
    expect(result).toEqual({
      total: 1,
      limit: 10,
      offset: 0,
      results: [roleEntity],
    });
    expect(mockRepo.findAndCount).toHaveBeenCalledWith({
      where: { deletedAt: expect.any(Object) },
      skip: 0,
      take: 10,
    });
  });

  it('should return one role by id', async () => {
    mockRepo.findOne.mockResolvedValue(roleEntity);
    const result = await service.findOne(roleId);
    expect(result).toEqual(roleEntity);
    expect(mockRepo.findOne).toHaveBeenCalledWith({
      where: { id: roleId, deletedAt: expect.any(Object) },
    });
  });

  it('should update a role', async () => {
    mockRepo.update.mockResolvedValue({ affected: 1 });
    mockRepo.findOne.mockResolvedValue({ ...roleEntity, name: 'user' });
    const dto = { name: 'user' };
    const result = await service.update(roleId, dto);
    expect(result).toEqual({ ...roleEntity, name: 'user' });
    expect(mockRepo.update).toHaveBeenCalledWith(roleId, dto);
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: roleId } });
  });

  it('should delete a role', async () => {
    mockRepo.softDelete.mockResolvedValue({ affected: 1 });
    const result = await service.remove(roleId);
    expect(mockRepo.softDelete).toHaveBeenCalledWith(roleId);
  });
});
