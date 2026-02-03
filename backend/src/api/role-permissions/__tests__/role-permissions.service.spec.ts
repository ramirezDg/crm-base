import { Test, TestingModule } from '@nestjs/testing';
import { RolePermissionsService } from '../role-permissions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RolePermission } from '../entities/role-permission.entity';
import { Repository } from 'typeorm';

describe('RolePermissionsService', () => {
  let service: RolePermissionsService;
  let repo: Repository<RolePermission>;

  const rolePermissionId = 'rp1a2b3c4';
  const role = { id: 'role1', name: 'Admin' };
  const permission = { id: 'perm1', key: 'users.read' };
  const rolePermissionEntity = {
    id: rolePermissionId,
    role,
    permission,
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
    manager: {
      findOne: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolePermissionsService,
        {
          provide: getRepositoryToken(RolePermission),
          useValue: mockRepo,
        },
      ],
    }).compile();
    service = module.get<RolePermissionsService>(RolePermissionsService);
    repo = module.get<Repository<RolePermission>>(
      getRepositoryToken(RolePermission),
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return one role-permission by id', async () => {
    mockRepo.findOne.mockResolvedValue(rolePermissionEntity);
    const result = await service.findOne(rolePermissionId);
    expect(result).toEqual(rolePermissionEntity);
    expect(mockRepo.findOne).toHaveBeenCalledWith({
      where: { id: rolePermissionId },
    });
  });

  it('should return all role-permissions', async () => {
    mockRepo.findAndCount.mockResolvedValue([[rolePermissionEntity], 1]);
    const pagination = { offset: 0, limit: 10 };
    const result = await service.findAll(pagination as any);
    expect(result).toEqual({
      total: 1,
      limit: 10,
      offset: 0,
      results: [rolePermissionEntity],
    });
    expect(mockRepo.findAndCount).toHaveBeenCalledWith({ skip: 0, take: 10 });
  });

  it('should assign permissions to roles', async () => {
    mockRepo.manager.findOne.mockResolvedValueOnce(role);
    mockRepo.manager.findOne.mockResolvedValueOnce(permission);
    mockRepo.create.mockReturnValue({ ...rolePermissionEntity });
    mockRepo.save.mockResolvedValue(rolePermissionEntity);
    const dto = { roleId: role.id, permissionId: permission.id };
    const result = await service.assignPermissionsToroles(dto);
    expect(result).toEqual(rolePermissionEntity);
    expect(mockRepo.manager.findOne).toHaveBeenCalledWith(
      expect.any(Function),
      { where: { id: role.id } },
    );
    expect(mockRepo.manager.findOne).toHaveBeenCalledWith(
      expect.any(Function),
      { where: { id: permission.id } },
    );
    expect(mockRepo.create).toHaveBeenCalledWith({ role, permission });
    expect(mockRepo.save).toHaveBeenCalledWith({ ...rolePermissionEntity });
  });

  it('should update a role-permission', async () => {
    mockRepo.findOne.mockResolvedValue({ ...rolePermissionEntity });
    mockRepo.manager.findOne.mockResolvedValueOnce({
      id: 'role2',
      name: 'User',
    });
    mockRepo.manager.findOne.mockResolvedValueOnce({
      id: 'perm2',
      key: 'users.write',
    });
    mockRepo.save.mockResolvedValue({
      ...rolePermissionEntity,
      role: { id: 'role2', name: 'User' },
      permission: { id: 'perm2', key: 'users.write' },
    });
    const dto = { roleId: 'role2', permissionId: 'perm2' };
    const result = await service.updateRolePermission(rolePermissionId, dto);
    expect(result).toEqual({
      ...rolePermissionEntity,
      role: { id: 'role2', name: 'User' },
      permission: { id: 'perm2', key: 'users.write' },
    });
    expect(mockRepo.save).toHaveBeenCalled();
  });
});
