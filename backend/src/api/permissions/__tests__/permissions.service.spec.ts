import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from '../permissions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Permission } from '../entities/permission.entity';
import { Repository } from 'typeorm';

describe('PermissionsService', () => {
  let service: PermissionsService;
  let repo: Repository<Permission>;

  const permissionId = 'p1a2b3c4';
  const permissionEntity = {
    id: permissionId,
    key: 'users.read',
    status: true,
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
        PermissionsService,
        {
          provide: getRepositoryToken(Permission),
          useValue: mockRepo,
        },
      ],
    }).compile();
    service = module.get<PermissionsService>(PermissionsService);
    repo = module.get<Repository<Permission>>(getRepositoryToken(Permission));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a permission', async () => {
    mockRepo.create.mockReturnValue({ ...permissionEntity });
    mockRepo.save.mockResolvedValue(permissionEntity);
    const dto = { key: 'users.read', status: true };
    const result = await service.create(dto);
    expect(result).toEqual(permissionEntity);
    expect(mockRepo.create).toHaveBeenCalledWith(dto);
    expect(mockRepo.save).toHaveBeenCalledWith({ ...permissionEntity });
  });

  it('should return all permissions', async () => {
    mockRepo.findAndCount.mockResolvedValue([[permissionEntity], 1]);
    const pagination = { offset: 0, limit: 10 };
    const result = await service.findAll(pagination as any);
    expect(result).toEqual({
      total: 1,
      limit: 10,
      offset: 0,
      results: [permissionEntity],
    });
    expect(mockRepo.findAndCount).toHaveBeenCalledWith({
      where: { deletedAt: expect.any(Object) },
      skip: 0,
      take: 10,
    });
  });

  it('should return one permission by id', async () => {
    mockRepo.findOne.mockResolvedValue(permissionEntity);
    const result = await service.findOne(permissionId);
    expect(result).toEqual(permissionEntity);
    expect(mockRepo.findOne).toHaveBeenCalledWith({
      where: { id: permissionId, deletedAt: expect.any(Object) },
    });
  });

  it('should search permissions', async () => {
    const mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[permissionEntity], 1]),
    };
    mockRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);
    const searchData = { key: 'users', status: true };
    const pagination = { offset: 0, limit: 10 };
    const result = await service.search(searchData as any, pagination as any);
    expect(result).toEqual({
      total: 1,
      limit: 10,
      offset: 0,
      results: [permissionEntity],
    });
    expect(mockRepo.createQueryBuilder).toHaveBeenCalledWith('permission');
    expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
  });

  it('should update a permission', async () => {
    mockRepo.update.mockResolvedValue({ affected: 1 });
    mockRepo.findOne.mockResolvedValue({
      ...permissionEntity,
      key: 'users.write',
      status: false,
    });
    const dto = { key: 'users.write', status: false };
    const result = await service.update(permissionId, dto);
    expect(result).toEqual({
      ...permissionEntity,
      key: 'users.write',
      status: false,
    });
    expect(mockRepo.update).toHaveBeenCalledWith(permissionId, dto);
    expect(mockRepo.findOne).toHaveBeenCalledWith({
      where: { id: permissionId, deletedAt: expect.any(Object) },
    });
  });

  it('should delete a permission', async () => {
    mockRepo.softDelete.mockResolvedValue({ affected: 1 });
    const result = await service.remove(permissionId);
    expect(mockRepo.softDelete).toHaveBeenCalledWith(permissionId);
  });
});
