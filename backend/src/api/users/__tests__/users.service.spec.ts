import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../entities/user.entity';
import { MailerService } from '../../../common/mailer/mailer.service';
import * as bcryptjs from 'bcryptjs';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: any;
  let mailerService: any;

  beforeEach(async () => {
    usersRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAndCount: jest.fn(),
      softDelete: jest.fn(),
      createQueryBuilder: jest.fn(),
    };
    mailerService = { sendMail: jest.fn() };

    jest
      .spyOn(bcryptjs, 'hash')
      .mockImplementation(async (pass) => `hashed_${pass}`);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(Users), useValue: usersRepository },
        { provide: MailerService, useValue: mailerService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user with hashed password and send mail', async () => {
    const dto = {
      email: 'test@mail.com',
      password: '123456',
      name: 'Test',
      lastName: 'User',
    };
    const userEntity = { id: '1', ...dto, password: 'hashed_123456' };
    usersRepository.create.mockReturnValue(userEntity);
    usersRepository.save.mockResolvedValue(userEntity);

    const result = await service.create(dto as any);
    expect(result).toEqual(userEntity);
    expect(usersRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: dto.email,
        name: dto.name,
        lastName: dto.lastName,
        password: 'hashed_123456',
      }),
    );
    expect(usersRepository.save).toHaveBeenCalledWith(userEntity);
    expect(mailerService.sendMail).toHaveBeenCalledWith(
      dto.email,
      expect.any(String),
      expect.any(String),
      expect.any(String),
      expect.stringContaining(dto.name),
    );
  });
  describe('search', () => {
    it('should search users with filters and pagination', async () => {
      const mockQueryBuilder: any = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[{ id: '1' }], 1]),
      };
      usersRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      const searchData = { name: 'Test', email: 'test@mail.com' };
      const pagination = { offset: 0, limit: 10 };
      const result = await service.search(searchData as any, pagination as any);
      expect(result.results).toEqual([{ id: '1' }]);
      expect(result.total).toBe(1);
      expect(usersRepository.createQueryBuilder).toHaveBeenCalledWith('users');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user if found', async () => {
      const user = { id: '1', email: 'test@mail.com' };
      usersRepository.findOne.mockResolvedValue(user);
      const result = await service.findOneByEmail('test@mail.com');
      expect(result).toEqual(user);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@mail.com', deletedAt: expect.any(Object) },
        relations: undefined,
      });
    });

    it('should return undefined if not found', async () => {
      usersRepository.findOne.mockResolvedValue(undefined);
      const result = await service.findOneByEmail('notfound@mail.com');
      expect(result).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should return paginated users with relations', async () => {
      const users = [
        {
          id: '1',
          role: { id: 'r1', name: 'admin', rolePermissions: [] },
          company: { id: 'c1', name: 'Empresa' },
        },
      ];
      usersRepository.findAndCount.mockResolvedValue([users, 1]);
      const pagination = { offset: 0, limit: 10 };
      const result = await service.findAll(pagination as any);
      expect(result.results).toEqual(users);
      expect(result.total).toBe(1);
      expect(usersRepository.findAndCount).toHaveBeenCalledWith({
        where: { deletedAt: expect.any(Object) },
        skip: 0,
        take: 10,
        relations: ['role', 'company'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by id with relations', async () => {
      const user = {
        id: '1',
        email: 'test@mail.com',
        role: {
          id: 'r1',
          name: 'admin',
          rolePermissions: [{ permission: { key: 'users.read' } }],
        },
        company: { id: 'c1', name: 'Empresa' },
      };
      usersRepository.findOne.mockResolvedValue(user);
      const result = await service.findOne('1');
      expect(result).toEqual(user);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1', deletedAt: expect.any(Object) },
        relations: [
          'role',
          'role.rolePermissions',
          'role.rolePermissions.permission',
        ],
      });
    });

    it('should return undefined if user not found', async () => {
      usersRepository.findOne.mockResolvedValue(undefined);
      const result = await service.findOne('999');
      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update a user and return updated entity', async () => {
      usersRepository.update.mockResolvedValue({ affected: 1 });
      const updatedUser = { id: '1', name: 'Nuevo', email: 'test@mail.com' };
      usersRepository.findOne.mockResolvedValue(updatedUser);
      const result = await service.update('1', { name: 'Nuevo' } as any);
      expect(result).toEqual(updatedUser);
      expect(usersRepository.update).toHaveBeenCalledWith('1', {
        name: 'Nuevo',
      });
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('remove', () => {
    it('should soft delete a user', async () => {
      usersRepository.softDelete.mockResolvedValue({ affected: 1 });
      await service.remove('1');
      expect(usersRepository.softDelete).toHaveBeenCalledWith('1');
    });
  });
});
